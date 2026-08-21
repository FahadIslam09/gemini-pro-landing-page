import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendServerMetaEvent } from "@/lib/meta-pixel";

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

    // Look up plan from MongoDB
    const plan = await prisma.planPricing.findUnique({
      where: { planKey: planId },
    });

    const amount = plan ? plan.price : planId === "18m" ? 499 : planId === "12m" ? 399 : 149;
    const planName = plan ? plan.name : `Google AI Pro (${planId})`;

    const orderNumber = `#GAI-${Math.floor(10000 + Math.random() * 90000)}`;

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
        status: "active",
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
        paymentStatus: "paid",
        orderStatus: "pending_activation",
        trxId: trxId.trim(),
        payerPhone: phone.trim(),
        targetEmail: email.trim().toLowerCase(),
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        buyerId: buyer.id,
        notes: `Manual Send Money via ${paymentMethod}. TrxID: ${trxId.trim()}`,
      },
    });

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

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      order,
      message: "অর্ডারটি সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে",
    });
  } catch (error: any) {
    console.error("Manual order creation error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
