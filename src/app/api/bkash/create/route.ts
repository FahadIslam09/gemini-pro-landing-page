import { NextRequest, NextResponse } from "next/server";
import { createBKashPayment } from "@/lib/bkash";
import { prisma } from "@/lib/prisma";

const PLAN_PRICES: Record<string, { name: string; price: number }> = {
  "1m": { name: "1 Month Trial Pack", price: 149 },
  "12m": { name: "12 Months Annual Plan", price: 399 },
  "18m": { name: "18 Months Mega Offer", price: 499 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId = "18m", fullName = "Customer", email = "customer@gmail.com", phone = "01700000000" } = body;

    // Check if dynamic plan exists in DB
    const dbPlan = await prisma.planPricing.findUnique({
      where: { planKey: planId },
    });

    const amount = dbPlan ? dbPlan.price : (PLAN_PRICES[planId] || PLAN_PRICES["18m"]).price;
    const planName = dbPlan ? dbPlan.name : (PLAN_PRICES[planId] || PLAN_PRICES["18m"]).name;

    // Generate unique order number & invoice
    const timestamp = Date.now();
    const invoiceNumber = `GAI-${planId.toUpperCase()}-${timestamp}`;
    const orderNumber = `#GAI-${Math.floor(10000 + Math.random() * 90000)}`;

    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      req.headers.get("origin") ||
      req.headers.get("referer") ||
      "http://localhost:3000";

    const callbackURL = `${origin.replace(/\/$/, "")}/api/bkash/callback`;

    const paymentResponse = await createBKashPayment({
      amount,
      invoiceNumber,
      payerReference: phone || "01700000000",
      callbackURL,
    });

    // Record initial pending order in database
    await prisma.order.create({
      data: {
        orderNumber,
        planKey: planId,
        planName,
        amount,
        paymentMethod: "bkash_gateway",
        paymentStatus: "pending",
        orderStatus: "pending_activation",
        targetEmail: email.trim().toLowerCase(),
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        notes: `bKash PaymentID: ${paymentResponse.paymentID || ""}, Invoice: ${invoiceNumber}`,
        metadata: JSON.stringify({
          paymentID: paymentResponse.paymentID,
          invoiceNumber,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      bkashURL: paymentResponse.bkashURL,
      paymentID: paymentResponse.paymentID,
      invoiceNumber,
      orderNumber,
      amount,
    });
  } catch (error: any) {
    console.error("Error creating bKash payment:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to initialize bKash payment",
      },
      { status: 500 }
    );
  }
}
