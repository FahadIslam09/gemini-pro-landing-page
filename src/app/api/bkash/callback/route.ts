import { NextRequest, NextResponse } from "next/server";
import { executeBKashPayment } from "@/lib/bkash";
import { prisma } from "@/lib/prisma";
import { sendServerMetaEvent } from "@/lib/meta-pixel";

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

      // Find matching order in DB
      const existingOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { notes: { contains: paymentID } },
            { notes: { contains: invoice } },
          ],
        },
      });

      if (existingOrder) {
        // Upsert Buyer
        const buyer = await prisma.buyer.upsert({
          where: { email: existingOrder.targetEmail },
          create: {
            name: existingOrder.customerName,
            email: existingOrder.targetEmail,
            phone: existingOrder.customerPhone || payer,
            totalOrders: 1,
            totalSpent: Number(amount) || existingOrder.amount,
            currentPlan: existingOrder.planName,
            status: "active",
          },
          update: {
            name: existingOrder.customerName,
            phone: existingOrder.customerPhone || payer,
            totalOrders: { increment: 1 },
            totalSpent: { increment: Number(amount) || existingOrder.amount },
            currentPlan: existingOrder.planName,
            status: "active",
          },
        });

        // Update Order record
        await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            trxId: trxID,
            payerPhone: payer,
            paymentStatus: "paid",
            orderStatus: "pending_activation",
            amount: Number(amount) || existingOrder.amount,
            buyerId: buyer.id,
          },
        });

        // Server-side Meta Conversions API (CAPI) Purchase Event
        const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
        const clientUserAgent = req.headers.get("user-agent") || undefined;

        sendServerMetaEvent({
          eventName: "Purchase",
          eventId: `pur_bkash_${existingOrder.id}_${trxID}`,
          userData: {
            email: existingOrder.targetEmail,
            phone: existingOrder.customerPhone || payer,
            firstName: existingOrder.customerName.split(" ")[0],
            clientIpAddress: clientIp,
            clientUserAgent: clientUserAgent,
          },
          customData: {
            currency: "BDT",
            value: Number(amount) || existingOrder.amount,
            content_name: existingOrder.planName,
            content_category: "AI Subscription",
            content_ids: [existingOrder.planKey],
            content_type: "product",
            order_id: existingOrder.orderNumber,
          },
        }).catch((err) => console.error("Meta CAPI bKash error:", err));
      }

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
