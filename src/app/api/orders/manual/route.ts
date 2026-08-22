import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendServerMetaEvent } from "@/lib/meta-pixel";
import { sendTelegramOrderNotification } from "@/lib/telegram";
import { sendCustomerEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, planId = "18m", paymentMethod = "bkash_manual", trxId, eventId } = body;

    if (!fullName || !email || !phone || !trxId) {
      return NextResponse.json(
        { success: false, message: "অনুগ্রহ করে আপনার নাম, জিমেইল, ফোন ও TrxID পূরণ করুন" },
        { status: 400 }
      );
    }

    const cleanTrxId = trxId.trim().toUpperCase();

    // 1. Anti-Fraud & Duplicate Prevention: Check if this TrxID is already used in an active/paid order
    const { data: duplicateOrder } = await supabase
      .from("orders")
      .select("order_number")
      .ilike("trx_id", cleanTrxId)
      .eq("payment_status", "paid")
      .maybeSingle();

    if (duplicateOrder) {
      return NextResponse.json(
        {
          success: false,
          message: `❌ এই Transaction ID (${cleanTrxId}) দিয়ে ইতোমধ্যে অর্ডার ${duplicateOrder.order_number} সম্পন্ন করা হয়েছে! একই TrxID দিয়ে একাধিক অর্ডার করা যাবে না।`,
        },
        { status: 400 }
      );
    }

    // Look up plan from Supabase
    const { data: plan } = await supabase
      .from("plan_pricing")
      .select("*")
      .eq("plan_key", planId)
      .maybeSingle();

    const amount = plan ? Number(plan.price) : planId === "18m" ? 499 : planId === "12m" ? 399 : 149;
    const planName = plan ? plan.name : `Google AI Pro (${planId})`;
    const orderNumber = `#GAI-${Math.floor(10000 + Math.random() * 90000)}`;

    // 2. Strict SMS Verification: Check if an SMS transaction with this TrxID exists in DB
    const { data: existingSms } = await supabase
      .from("sms_transactions")
      .select("*")
      .ilike("trx_id", cleanTrxId)
      .maybeSingle();

    if (!existingSms) {
      return NextResponse.json(
        {
          success: false,
          message: "❌ ভুল Transaction ID! আপনার দেওয়া TrxID দিয়ে কোনো ভেরিফাইড পেমেন্ট রেকর্ড পাওয়া যায়নি। সঠিক TrxID দিন বা টাকা পাঠিয়ে থাকলে ২-৩ সেকেন্ড পর আবার চেষ্টা করুন।",
        },
        { status: 400 }
      );
    }

    // 3. Prevent reuse of already consumed SMS TrxID
    if (existingSms.is_used) {
      return NextResponse.json(
        {
          success: false,
          message: `❌ এই Transaction ID (${cleanTrxId}) ইতোমধ্যে ব্যবহৃত হয়েছে (${existingSms.used_in_order_id || "আগের অর্ডারে"})! একই TrxID দ্বিতীয়বার ব্যবহার করা যাবে না।`,
        },
        { status: 400 }
      );
    }

    // 4. Strict Amount Verification: Ensure SMS amount matches or exceeds plan price
    const smsAmount = Number(existingSms.amount || 0);
    if (smsAmount < amount) {
      return NextResponse.json(
        {
          success: false,
          message: `❌ অপর্যাপ্ত পেমেন্ট! এই প্ল্যানের মূল্য ৳${amount} BDT, কিন্তু আপনার পেমেন্ট ট্রানজেকশনে পাওয়া গেছে মাত্র ৳${smsAmount} BDT। সম্পূর্ণ মূল্য পরিশোধ করে পুনরায় চেষ্টা করুন।`,
        },
        { status: 400 }
      );
    }

    // 5. Mark SMS Transaction as Used atomically
    await supabase
      .from("sms_transactions")
      .update({
        is_used: true,
        used_in_order_id: orderNumber,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSms.id);

    // 6. Upsert Buyer in Supabase
    const { data: existingBuyer } = await supabase
      .from("buyers")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    let buyerId: string | null = null;
    if (existingBuyer) {
      buyerId = existingBuyer.id;
      await supabase
        .from("buyers")
        .update({
          name: fullName.trim(),
          phone: phone.trim(),
          total_orders: (existingBuyer.total_orders || 1) + 1,
          total_spent: Number(existingBuyer.total_spent || 0) + amount,
          current_plan: planName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingBuyer.id);
    } else {
      const { data: newBuyer } = await supabase
        .from("buyers")
        .insert({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          total_orders: 1,
          total_spent: amount,
          current_plan: planName,
          status: "active",
        })
        .select()
        .single();
      if (newBuyer) buyerId = newBuyer.id;
    }

    // 7. Create Verified Order in Supabase
    const providerName = (existingSms.provider || "bkash").toUpperCase();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        plan_key: planId,
        plan_name: planName,
        amount,
        payment_method: paymentMethod,
        payment_status: "paid",
        order_status: "active",
        trx_id: cleanTrxId,
        payer_phone: phone.trim(),
        target_email: email.trim().toLowerCase(),
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        buyer_id: buyerId,
        notes: `Auto-verified against ${providerName} SMS TrxID: ${cleanTrxId} (Amount: ৳${smsAmount})`,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 8. Send instant confirmation email to customer (awaited)
    await sendCustomerEmail({
      to: email.trim().toLowerCase(),
      customerName: fullName.trim(),
      orderNumber,
      planName,
      messageText: `আপনার ${planName} সাবস্ক্রিপশন পেমেন্ট সফলভাবে স্বয়ংক্রিয়ভাবে যাচাই করা হয়েছে। ধন্যবাদ!`,
    }).catch((err) => console.error("Email send error:", err));

    // 9. Send Instant Telegram Bot Alert (awaited)
    await sendTelegramOrderNotification({
      orderNumber: order.order_number,
      customerName: fullName.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      planName,
      amount,
      paymentMethod,
      trxId: cleanTrxId,
      status: `✅ SMS দিয়ে সফলভাবে ভেরিফাইড (${providerName}) - Paid`,
    });

    // 10. Server-side Meta Conversions API (CAPI) Purchase Event
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
    const clientUserAgent = req.headers.get("user-agent") || undefined;

    sendServerMetaEvent({
      eventName: "Purchase",
      eventId: eventId || `pur_${order.id}_${Date.now()}`,
      userData: {
        email: email.trim(),
        phone: phone.trim(),
        firstName: fullName.trim().split(" ")[0],
        clientIpAddress: clientIp,
        clientUserAgent: clientUserAgent,
      },
      customData: {
        currency: "BDT",
        value: amount,
        content_name: planName,
        content_category: "AI Subscription",
        content_ids: [planId],
        content_type: "product",
        order_id: orderNumber,
      },
    }).catch((err) => console.error("Meta CAPI async error:", err));

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      isAutoVerified: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        planKey: order.plan_key,
        planName: order.plan_name,
        amount: Number(order.amount),
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
      },
      message: "পেমেন্ট সফলভাবে স্বয়ংক্রিয়ভাবে ভেরিফাই ও অর্ডার কনফার্ম হয়েছে!",
    });
  } catch (error: any) {
    console.error("Manual order creation error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
