import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
        { success: false, message: "সমস্ত তথ্য পূরণ আবশ্যক" },
        { status: 400 }
      );
    }

    const cleanTrxId = trxId.trim().toUpperCase();

    // Look up plan from MongoDB
    const plan = await prisma.planPricing.findUnique({
      where: { planKey: planId },
    });

    const amount = plan ? plan.price : planId === "18m" ? 499 : planId === "12m" ? 399 : 149;
    const planName = plan ? plan.name : `Google AI Pro (${planId})`;
    const orderNumber = `#GAI-${Math.floor(10000 + Math.random() * 90000)}`;

    // Check if an SMS transaction with this TrxID already exists in DB
    const existingSms = await prisma.smsTransaction.findFirst({
      where: {
        trxId: {
          equals: cleanTrxId,
          mode: "insensitive",
        },
        isUsed: false,
      },
    });

    const isAutoVerified = !!existingSms && existingSms.amount >= amount;
    const initialPaymentStatus = isAutoVerified ? "paid" : "pending";
    const initialOrderStatus = isAutoVerified ? "active" : "pending_activation";

    // Upsert Buyer in MongoDB
    const buyer = await prisma.buyer.upsert({
      where: { email: email.trim().toLowerCase() },
      create: {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        totalOrders: 1,
        totalSpent: amount,
        currentPlan: planName,
        status: isAutoVerified ? "active" : "pending",
      },
      update: {
        name: fullName.trim(),
        phone: phone.trim(),
        totalOrders: { increment: 1 },
        totalSpent: { increment: amount },
        currentPlan: planName,
      },
    });

    // Create Order in MongoDB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        planKey: planId,
        planName,
        amount,
        paymentMethod,
        paymentStatus: initialPaymentStatus,
        orderStatus: initialOrderStatus,
        trxId: cleanTrxId,
        payerPhone: phone.trim(),
        targetEmail: email.trim().toLowerCase(),
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        buyerId: buyer.id,
        notes: isAutoVerified
          ? `Auto-verified instantly against bKash/Nagad SMS (${existingSms?.provider.toUpperCase()}) on order creation`
          : `Send Money via ${paymentMethod}. TrxID: ${cleanTrxId} (Pending SMS webhook match)`,
      },
    });

    // If auto-verified by existing SMS, mark the SMS record as used
    if (isAutoVerified && existingSms) {
      await prisma.smsTransaction.update({
        where: { id: existingSms.id },
        data: {
          isUsed: true,
          usedInOrderId: orderNumber,
        },
      });

      // Send instant confirmation email to customer
      sendCustomerEmail({
        to: email.trim().toLowerCase(),
        customerName: fullName.trim(),
        orderNumber,
        planName,
        messageText: `আপনার ${planName} সাবস্ক্রিপশন পেমেন্ট সফলভাবে স্বয়ংক্রিয়ভাবে যাচাই করা হয়েছে। ধন্যবাদ!`,
      }).catch((err) => console.error("Email send error:", err));
    }

    // Server-side Meta Conversions API (CAPI) Purchase Event
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

    // Send Instant Telegram Bot Alert
    sendTelegramOrderNotification({
      orderNumber: order.orderNumber,
      customerName: fullName.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      planName,
      amount,
      paymentMethod,
      trxId: cleanTrxId,
      status: isAutoVerified
        ? "✅ এসএমএস দিয়ে অটো-ভেরিফাইড ও পেইড (Auto Paid)"
        : "⏳ এসএমএস ভেরিফিকেশন অপেক্ষমাণ (Pending SMS)",
    }).catch((err) => console.error("Telegram async error:", err));

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      isAutoVerified,
      order,
      message: isAutoVerified
        ? "পেমেন্ট সফলভাবে স্বয়ংক্রিয়ভাবে ভেরিফাই ও অর্ডার কনফার্ম হয়েছে!"
        : "অর্ডারটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে",
    });
  } catch (error: any) {
    console.error("Manual order creation error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
