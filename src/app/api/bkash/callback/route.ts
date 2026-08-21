import { NextRequest, NextResponse } from "next/server";
import { executeBKashPayment } from "@/lib/bkash";
import { prisma } from "@/lib/prisma";
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
        const duplicateOrder = await prisma.order.findFirst({
          where: {
            trxId: trxID,
            paymentStatus: "paid",
          },
        });

        if (duplicateOrder) {
          console.warn("Duplicate bKash payment execution blocked:", { trxID, duplicateOrder: duplicateOrder.orderNumber });
          return NextResponse.redirect(
            `${origin}/?payment=failed&reason=${encodeURIComponent(
              "Duplicate transaction ID. This bKash payment has already been applied."
            )}`
          );
        }
      }

      // 4. Find matching initial pending order in MongoDB
      const existingOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { notes: { contains: paymentID } },
            { notes: { contains: invoice } },
          ],
        },
      });

      if (!existingOrder) {
        console.error("No pending order found matching bKash payment:", { paymentID, invoice });
        return NextResponse.redirect(
          `${origin}/?payment=failed&reason=${encodeURIComponent("Matching order record not found")}`
        );
      }

      // 5. Strict Amount Verification
      if (paidAmount < existingOrder.amount && paidAmount > 0) {
        console.error("bKash paid amount is less than order amount:", { paidAmount, expected: existingOrder.amount });
        return NextResponse.redirect(
          `${origin}/?payment=failed&reason=${encodeURIComponent(
            `Paid amount (৳${paidAmount}) does not match order amount (৳${existingOrder.amount})`
          )}`
        );
      }

      // 6. Upsert Buyer CRM Record
      const buyer = await prisma.buyer.upsert({
        where: { email: existingOrder.targetEmail },
        create: {
          name: existingOrder.customerName,
          email: existingOrder.targetEmail,
          phone: existingOrder.customerPhone || payer,
          totalOrders: 1,
          totalSpent: paidAmount || existingOrder.amount,
          currentPlan: existingOrder.planName,
          status: "active",
        },
        update: {
          name: existingOrder.customerName,
          phone: existingOrder.customerPhone || payer,
          totalOrders: { increment: 1 },
          totalSpent: { increment: paidAmount || existingOrder.amount },
          currentPlan: existingOrder.planName,
          status: "active",
        },
      });

      // 7. Update Order to Paid & Active
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          trxId: trxID,
          payerPhone: payer,
          paymentStatus: "paid",
          orderStatus: "active",
          amount: paidAmount || existingOrder.amount,
          buyerId: buyer.id,
          notes: `Official bKash Gateway Payment Completed. TrxID: ${trxID}, PaymentID: ${paymentID}`,
        },
      });

      // 8. Send instant customer confirmation email (awaited)
      await sendCustomerEmail({
        to: existingOrder.targetEmail,
        customerName: existingOrder.customerName,
        orderNumber: existingOrder.orderNumber,
        planName: existingOrder.planName,
        messageText: `আপনার ${existingOrder.planName} সাবস্ক্রিপশন bKash অফিসিয়াল গেটওয়ের মাধ্যমে সফলভাবে সম্পন্ন হয়েছে। আমাদের সাথে থাকার জন্য ধন্যবাদ!`,
      }).catch((err) => console.error("Email delivery error:", err));

      // 9. Send Instant Telegram Bot Alert (awaited)
      await sendTelegramOrderNotification({
        orderNumber: existingOrder.orderNumber,
        customerName: existingOrder.customerName,
        customerEmail: existingOrder.targetEmail,
        customerPhone: existingOrder.customerPhone || payer,
        planName: existingOrder.planName,
        amount: paidAmount || existingOrder.amount,
        paymentMethod: "bKash (অফিসিয়াল গেটওয়ে)",
        trxId: trxID,
        status: "✅ পেমেন্ট সফল ও ভেরিফাইড (Gateway Paid)",
      }).catch((err) => console.error("Telegram error:", err));

      // 10. Server-side Meta Conversions API (CAPI) Purchase Event
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
          value: paidAmount || existingOrder.amount,
          content_name: existingOrder.planName,
          content_category: "AI Subscription",
          content_ids: [existingOrder.planKey],
          content_type: "product",
          order_id: existingOrder.orderNumber,
        },
      }).catch((err) => console.error("Meta CAPI bKash error:", err));

      // 11. Redirect to success page with query params
      return NextResponse.redirect(
        `${origin}/payment-success?trxID=${encodeURIComponent(
          trxID
        )}&paymentID=${encodeURIComponent(
          paymentID
        )}&amount=${encodeURIComponent(paidAmount || existingOrder.amount)}&invoice=${encodeURIComponent(
          invoice
        )}&payer=${encodeURIComponent(payer)}&orderNumber=${encodeURIComponent(existingOrder.orderNumber)}`
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
