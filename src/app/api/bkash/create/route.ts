import { NextRequest, NextResponse } from "next/server";
import { createBKashPayment } from "@/lib/bkash";

const PLAN_PRICES: Record<string, { name: string; price: number }> = {
  "1m": { name: "1 Month Trial Pack", price: 149 },
  "12m": { name: "12 Months Annual Plan", price: 399 },
  "18m": { name: "18 Months Mega Offer", price: 499 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId = "18m", fullName, email, phone } = body;

    const selectedPlan = PLAN_PRICES[planId] || PLAN_PRICES["18m"];
    const amount = selectedPlan.price;

    // Generate clean invoice number
    const timestamp = Date.now();
    const invoiceNumber = `GAI-${planId.toUpperCase()}-${timestamp}`;

    // Get origin host for callback URL
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

    return NextResponse.json({
      success: true,
      bkashURL: paymentResponse.bkashURL,
      paymentID: paymentResponse.paymentID,
      invoiceNumber,
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
