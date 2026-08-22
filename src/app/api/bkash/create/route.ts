import { NextRequest, NextResponse } from "next/server";
import { createBKashPayment } from "@/lib/bkash";
import { supabase } from "@/lib/supabase";

const PLAN_PRICES: Record<string, { name: string; price: number }> = {
  "1m": { name: "1 Month Trial Pack", price: 149 },
  "12m": { name: "12 Months Annual Plan", price: 399 },
  "18m": { name: "18 Months Mega Offer", price: 499 },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId = "18m", fullName = "Customer", email = "customer@gmail.com", phone = "01700000000" } = body;

    // Check if dynamic plan exists in Supabase
    const { data: dbPlan } = await supabase
      .from("plan_pricing")
      .select("*")
      .eq("plan_key", planId)
      .maybeSingle();

    const amount = dbPlan ? Number(dbPlan.price) : (PLAN_PRICES[planId] || PLAN_PRICES["18m"]).price;
    const planName = dbPlan ? dbPlan.name : (PLAN_PRICES[planId] || PLAN_PRICES["18m"]).name;

    // Generate unique order number & invoice
    const timestamp = Date.now();
    const invoiceNumber = `GAI-${planId.toUpperCase()}-${timestamp}`;
    const orderNumber = `#GAI-${Math.floor(10000 + Math.random() * 90000)}`;

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (host ? `${proto}://${host}` : "https://googleai.neonweb.xyz");

    const callbackURL = `${origin.replace(/\/$/, "")}/api/bkash/callback`;

    const paymentResponse = await createBKashPayment({
      amount,
      invoiceNumber,
      payerReference: phone || "01700000000",
      callbackURL,
    });

    // Record initial pending order in Supabase
    await supabase.from("orders").insert({
      order_number: orderNumber,
      plan_key: planId,
      plan_name: planName,
      amount,
      payment_method: "bkash_gateway",
      payment_status: "pending",
      order_status: "pending_activation",
      target_email: email.trim().toLowerCase(),
      customer_name: fullName.trim(),
      customer_phone: phone.trim(),
      notes: `bKash PaymentID: ${paymentResponse.paymentID || ""}, Invoice: ${invoiceNumber}`,
      metadata: JSON.stringify({
        paymentID: paymentResponse.paymentID,
        invoiceNumber,
      }),
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
