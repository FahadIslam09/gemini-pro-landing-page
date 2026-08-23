import { NextRequest, NextResponse } from "next/server";
import { executeBKashPayment } from "@/lib/bkash";
import { supabase } from "@/lib/supabase";
import { sendServerMetaEvent } from "@/lib/meta-pixel";
import { sendTelegramOrderNotification } from "@/lib/telegram";
import { sendCustomerEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (host ? `${proto}://${host}` : "https://googleai.neonweb.xyz");

  // 1. Handle user cancellation or non-success callback statuses
  if (!paymentID || status !== "success") {
    if (status === "cancel") {
      return NextResponse.redirect(`${origin}/?payment=cancelled`);
    }
    return NextResponse.redirect(
      `${origin}/?payment=failed&reason=${encodeURIComponent(
        status || "Payment was not successful or was cancelled by user"
      )}`
    );
  }

  try {
    // 2. Execute Payment via bKash Tokenized API
    const executeResponse = await executeBKashPayment({ paymentID });

    if (
      executeResponse.statusCode === "0000" &&
      (executeResponse.transactionStatus === "Completed" || executeResponse.transactionStatus === "Initiated")
    ) {
      const trxID = executeResponse.trxID || "";
      const paidAmount = Number(executeResponse.amount) || 0;
      const invoice = executeResponse.merchantInvoiceNumber || "";
      const payer = executeResponse.customerMsisdn || "";

      // 3. Anti-Fraud & Duplicate Prevention: Check if TrxID was already consumed
      if (trxID) {
        const { data: duplicateOrder } = await supabase
          .from("orders")
          .select("order_number")
          .ilike("trx_id", trxID)
          .eq("payment_status", "paid")
          .maybeSingle();

        if (duplicateOrder) {
          console.warn("Duplicate bKash payment execution blocked:", { trxID, duplicateOrder: duplicateOrder.order_number });
          return NextResponse.redirect(
            `${origin}/?payment=failed&reason=${encodeURIComponent(
              "Duplicate transaction ID. This bKash payment has already been applied."
            )}`
          );
        }
      }

      // 4. Find matching initial pending order in Supabase
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("*")
        .or(`notes.ilike.%${paymentID}%,notes.ilike.%${invoice}%`)
        .maybeSingle();

      if (!existingOrder) {
        console.error("No pending order found matching bKash payment:", { paymentID, invoice });
        return NextResponse.redirect(
          `${origin}/?payment=failed&reason=${encodeURIComponent("Matching order record not found")}`
        );
      }

      const expectedAmount = Number(existingOrder.amount || 0);

      // 5. Strict Amount Verification
      if (paidAmount < expectedAmount && paidAmount > 0) {
        console.error("bKash paid amount is less than order amount:", { paidAmount, expected: expectedAmount });
        return NextResponse.redirect(
          `${origin}/?payment=failed&reason=${encodeURIComponent(
            `Paid amount (৳${paidAmount}) does not match order amount (৳${expectedAmount})`
          )}`
        );
      }

      // 6. Upsert Buyer CRM Record in Supabase
      const { data: existingBuyer } = await supabase
        .from("buyers")
        .select("*")
        .eq("email", existingOrder.target_email.trim().toLowerCase())
        .maybeSingle();

      let buyerId = existingOrder.buyer_id;
      if (existingBuyer) {
        buyerId = existingBuyer.id;
        await supabase
          .from("buyers")
          .update({
            name: existingOrder.customer_name,
            phone: existingOrder.customer_phone || payer,
            total_orders: (existingBuyer.total_orders || 1) + 1,
            total_spent: Number(existingBuyer.total_spent || 0) + (paidAmount || expectedAmount),
            current_plan: existingOrder.plan_name,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingBuyer.id);
      } else {
        const { data: newBuyer } = await supabase
          .from("buyers")
          .insert({
            name: existingOrder.customer_name,
            email: existingOrder.target_email.trim().toLowerCase(),
            phone: existingOrder.customer_phone || payer,
            total_orders: 1,
            total_spent: paidAmount || expectedAmount,
            current_plan: existingOrder.plan_name,
            status: "active",
          })
          .select()
          .single();
        if (newBuyer) buyerId = newBuyer.id;
      }

      // 7. Update Order to Paid & Active
      await supabase
        .from("orders")
        .update({
          trx_id: trxID,
          payer_phone: payer,
          payment_status: "paid",
          order_status: "active",
          amount: paidAmount || expectedAmount,
          buyer_id: buyerId,
          notes: `Official bKash Gateway Payment Completed. TrxID: ${trxID}, PaymentID: ${paymentID}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingOrder.id);

      // 8. Send instant customer confirmation email (awaited)
      await sendCustomerEmail({
        to: existingOrder.target_email,
        customerName: existingOrder.customer_name,
        orderNumber: existingOrder.order_number,
        planName: existingOrder.plan_name,
        messageText: `আপনার ${existingOrder.plan_name} সাবস্ক্রিপশন bKash অফিসিয়াল গেটওয়ের মাধ্যমে সফলভাবে সম্পন্ন হয়েছে। আমাদের সাথে থাকার জন্য ধন্যবাদ!`,
      }).catch((err) => console.error("Email delivery error:", err));

      // 9. Send Instant Telegram Bot Alert (awaited)
      await sendTelegramOrderNotification({
        orderNumber: existingOrder.order_number,
        customerName: existingOrder.customer_name,
        customerEmail: existingOrder.target_email,
        customerPhone: existingOrder.customer_phone || payer,
        planName: existingOrder.plan_name,
        amount: paidAmount || expectedAmount,
        paymentMethod: "bKash (অফিসিয়াল গেটওয়ে)",
        trxId: trxID,
        status: "✅ পেমেন্ট সফল ও ভেরিফাইড (Gateway Paid)",
      }).catch((err) => console.error("Telegram error:", err));

      // 10. Server-side Meta Conversions API (CAPI) Purchase Event
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
      const clientUserAgent = req.headers.get("user-agent") || undefined;

      sendServerMetaEvent({
        eventName: "Purchase",
        eventId: `pur_bkash_${trxID}`,
        userData: {
          email: existingOrder.target_email,
          phone: existingOrder.customer_phone || payer,
          firstName: existingOrder.customer_name.split(" ")[0],
          clientIpAddress: clientIp,
          clientUserAgent: clientUserAgent,
        },
        customData: {
          currency: "BDT",
          value: paidAmount || expectedAmount,
          content_name: existingOrder.plan_name,
          content_category: "AI Subscription",
          content_ids: [existingOrder.plan_key],
          content_type: "product",
          order_id: existingOrder.order_number,
        },
      }).catch((err) => console.error("Meta CAPI bKash error:", err));

      // 11. Redirect to success page with query params
      return NextResponse.redirect(
        `${origin}/payment-success?trxID=${encodeURIComponent(
          trxID
        )}&paymentID=${encodeURIComponent(
          paymentID
        )}&amount=${encodeURIComponent(paidAmount || expectedAmount)}&invoice=${encodeURIComponent(
          invoice
        )}&payer=${encodeURIComponent(payer)}&orderNumber=${encodeURIComponent(existingOrder.order_number)}`
      );
    } else {
      console.error("bKash execute failed:", executeResponse);
      return NextResponse.redirect(
        `${origin}/?payment=failed&reason=${encodeURIComponent(
          executeResponse.statusMessage || "bKash transaction verification failed"
        )}`
      );
    }
  } catch (error: any) {
    console.error("Error executing bKash payment in callback:", error);
    return NextResponse.redirect(
      `${origin}/?payment=failed&reason=${encodeURIComponent(
        error.message || "Internal server error during verification"
      )}`
    );
  }
}
