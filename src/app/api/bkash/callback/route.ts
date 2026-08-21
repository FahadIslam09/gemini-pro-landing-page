import { NextRequest, NextResponse } from "next/server";
import { executeBKashPayment } from "@/lib/bkash";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");

  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ||
    req.headers.get("host")?.includes("localhost")
      ? "http://localhost:3000"
      : `https://${req.headers.get("host")}`;

  if (!paymentID || status !== "success") {
    if (status === "cancel") {
      return NextResponse.redirect(`${origin}/?payment=cancelled`);
    }
    return NextResponse.redirect(
      `${origin}/?payment=failed&reason=${encodeURIComponent(
        status || "Payment was not successful"
      )}`
    );
  }

  try {
    const executeResponse = await executeBKashPayment({ paymentID });

    if (executeResponse.statusCode === "0000") {
      const trxID = executeResponse.trxID || "";
      const amount = executeResponse.amount || "";
      const invoice = executeResponse.merchantInvoiceNumber || "";
      const payer = executeResponse.customerMsisdn || "";

      return NextResponse.redirect(
        `${origin}/payment-success?trxID=${encodeURIComponent(
          trxID
        )}&paymentID=${encodeURIComponent(
          paymentID
        )}&amount=${encodeURIComponent(amount)}&invoice=${encodeURIComponent(
          invoice
        )}&payer=${encodeURIComponent(payer)}`
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
