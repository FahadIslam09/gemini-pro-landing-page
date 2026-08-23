import { supabase } from "./supabase";
import { sendOrderActivationEmail } from "./email";
import { sendTelegramOrderNotification } from "./telegram";

export interface OrderForActivation {
  id?: string;
  order_number: string;
  plan_key: string;
  plan_name: string;
  customer_name: string;
  target_email: string;
  customer_phone?: string;
  amount?: number;
}

export interface ActivationAssignmentResult {
  success: boolean;
  linkAssigned?: boolean;
  emailSent?: boolean;
  linkId?: string;
  activationLink?: string;
  error?: string;
  outOfStock?: boolean;
}

/**
 * Concurrency-Safe Automatic Activation Link Assignment Engine.
 * STRICT RULE: ONLY assigns activation links for the 18-Month plan ('18m').
 * Any other plan (e.g. '1m', '12m') is immediately bypassed.
 */
export async function assignAndSendActivationLink(
  order: OrderForActivation
): Promise<ActivationAssignmentResult> {
  // 1. Strict Plan Guard: Only 18-Month plan is eligible
  if (order.plan_key !== "18m") {
    return {
      success: true,
      linkAssigned: false,
      emailSent: false,
      error: "Bypassed: Activation links are strictly reserved for 18-month plan orders.",
    };
  }

  const targetEmail = order.target_email.trim().toLowerCase();
  const customerName = order.customer_name.trim() || "Customer";
  const orderNumber = order.order_number;

  // 2. Check if an activation link was already assigned to this order
  const { data: alreadyAssigned } = await supabase
    .from("activation_links")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (alreadyAssigned) {
    // If already assigned and email not sent, retry sending email
    if (alreadyAssigned.email_status !== "sent") {
      const emailResult = await sendOrderActivationEmail({
        to: targetEmail,
        customerName,
        orderNumber,
        planName: order.plan_name || "18 Months Mega Offer",
        activationLink: alreadyAssigned.link,
      });

      if (emailResult.success) {
        await supabase
          .from("activation_links")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            email_status: "sent",
            email_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", alreadyAssigned.id);
      }
    }

    return {
      success: true,
      linkAssigned: true,
      emailSent: alreadyAssigned.email_status === "sent",
      linkId: alreadyAssigned.id,
      activationLink: alreadyAssigned.link,
    };
  }

  // 3. Concurrency-Safe Compare-and-Swap (CAS) Loop (up to 3 retries)
  let claimedLink: any = null;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Fetch the oldest available link
    const { data: candidate } = await supabase
      .from("activation_links")
      .select("id, link")
      .eq("status", "available")
      .eq("plan_key", "18m")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!candidate) {
      // Out of Stock!
      break;
    }

    // Atomic CAS update: Only succeed if status is still 'available'
    const { data: updated, error } = await supabase
      .from("activation_links")
      .update({
        status: "assigned",
        order_id: order.id || null,
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: targetEmail,
        customer_phone: order.customer_phone || null,
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_status: "pending",
      })
      .eq("id", candidate.id)
      .eq("status", "available") // Atomic CAS Guard
      .select()
      .maybeSingle();

    if (updated && !error) {
      claimedLink = updated;
      break;
    }

    // Small exponential jitter backoff on collision
    await new Promise((resolve) => setTimeout(resolve, attempt * 60 + Math.random() * 40));
  }

  // 4. Handle Out of Stock Scenario
  if (!claimedLink) {
    console.error(`[Activation Service]: Out of stock for 18m order ${orderNumber}!`);

    // Send urgent Telegram alert to admin
    await sendTelegramOrderNotification({
      orderNumber,
      customerName,
      customerEmail: targetEmail,
      customerPhone: order.customer_phone || "N/A",
      planName: order.plan_name,
      amount: order.amount || 299,
      paymentMethod: "bKash",
      trxId: "N/A",
      status: "⚠️ স্টক আউট: ১৮ মাসের অ্যাক্টিভেশন লিংক শেষ! অবিলম্বে ভল্টে নতুন লিংক যুক্ত করুন।",
    }).catch(() => {});

    // Log admin alert in Supabase
    try {
      await supabase.from("admin_logs").insert({
        action: "STOCK_OUT_ALERT",
        entity: "activation_links",
        entity_id: orderNumber,
        details: `18-month activation link inventory empty for customer ${targetEmail}`,
      });
    } catch {}

    return {
      success: false,
      linkAssigned: false,
      outOfStock: true,
      error: "No available activation links in inventory. Admin alerted.",
    };
  }

  // 5. Send Email with the Assigned Activation Link
  const emailRes = await sendOrderActivationEmail({
    to: targetEmail,
    customerName,
    orderNumber,
    planName: order.plan_name || "18 Months Mega Offer",
    activationLink: claimedLink.link,
  });

  if (emailRes.success) {
    // Update link status to 'sent'
    await supabase
      .from("activation_links")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        email_status: "sent",
        email_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimedLink.id);

    return {
      success: true,
      linkAssigned: true,
      emailSent: true,
      linkId: claimedLink.id,
      activationLink: claimedLink.link,
    };
  } else {
    // Record email failure for admin to retry
    await supabase
      .from("activation_links")
      .update({
        email_status: "failed",
        email_error: emailRes.error || "Email delivery failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimedLink.id);

    return {
      success: true,
      linkAssigned: true,
      emailSent: false,
      linkId: claimedLink.id,
      activationLink: claimedLink.link,
      error: `Link assigned, but email failed: ${emailRes.error}`,
    };
  }
}

/**
 * Resend activation link email for a specific link ID.
 */
export async function resendActivationLinkEmail(linkId: string): Promise<{ success: boolean; error?: string }> {
  const { data: link, error } = await supabase
    .from("activation_links")
    .select("*")
    .eq("id", linkId)
    .single();

  if (error || !link) {
    return { success: false, error: "Activation link not found" };
  }

  if (!link.customer_email || !link.order_number) {
    return { success: false, error: "Link has no assigned customer or order" };
  }

  const emailRes = await sendOrderActivationEmail({
    to: link.customer_email,
    customerName: link.customer_name || "Customer",
    orderNumber: link.order_number,
    planName: "18 Months Mega Offer",
    activationLink: link.link,
  });

  if (emailRes.success) {
    await supabase
      .from("activation_links")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        email_status: "sent",
        email_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", link.id);
    return { success: true };
  } else {
    await supabase
      .from("activation_links")
      .update({
        email_status: "failed",
        email_error: emailRes.error || "Resend failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", link.id);
    return { success: false, error: emailRes.error };
  }
}
