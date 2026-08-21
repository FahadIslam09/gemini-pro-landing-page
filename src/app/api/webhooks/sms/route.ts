import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramOrderNotification } from "@/lib/telegram";
import { sendCustomerEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

interface ParsedSms {
  provider: "bkash" | "nagad" | "rocket" | "manual";
  trxId: string | null;
  amount: number | null;
  senderPhone: string | null;
}

function parseMfsSms(message: string, rawSender: string = ""): ParsedSms {
  const text = message || "";
  const senderLower = rawSender.toLowerCase();

  let provider: "bkash" | "nagad" | "rocket" | "manual" = "manual";
  if (text.includes("bKash") || senderLower.includes("bkash") || senderLower.includes("16247")) {
    provider = "bkash";
  } else if (text.includes("Nagad") || senderLower.includes("nagad") || senderLower.includes("16167")) {
    provider = "nagad";
  } else if (text.includes("Rocket") || senderLower.includes("rocket") || senderLower.includes("16216")) {
    provider = "rocket";
  }

  let trxId: string | null = null;
  let amount: number | null = null;
  let senderPhone: string | null = null;

  // 1. Extract TrxID / TxnID (e.g. TrxID 9K8L7M6N, TxnID: 71ABCDEF, TxnId 123456)
  const trxMatch =
    text.match(/TrxID\s*[:\s]?\s*([A-Z0-9]{6,16})/i) ||
    text.match(/TxnID\s*[:\s]?\s*([A-Z0-9]{6,16})/i) ||
    text.match(/TxnId\s*[:\s]?\s*([A-Z0-9]{6,16})/i) ||
    text.match(/Transaction ID\s*[:\s]?\s*([A-Z0-9]{6,16})/i);

  if (trxMatch) {
    trxId = trxMatch[1].toUpperCase().trim();
  }

  // 2. Extract Amount (e.g. Tk 499.00, Tk. 499, Amount: Tk 499)
  const amountMatch =
    text.match(/Tk\.?\s*([\d,]+(?:\.\d{1,2})?)/i) ||
    text.match(/Amount\s*[:\s]?\s*Tk\.?\s*([\d,]+(?:\.\d{1,2})?)/i) ||
    text.match(/BDT\s*([\d,]+(?:\.\d{1,2})?)/i);

  if (amountMatch) {
    const cleanAmountStr = amountMatch[1].replace(/,/g, "");
    amount = Math.round(parseFloat(cleanAmountStr));
  }

  // 3. Extract Customer Phone (e.g. from 017XXXXXXXX, Sender: 017XXXXXXXX)
  const phoneMatch =
    text.match(/from\s*(01[3-9]\d{8})/i) ||
    text.match(/Sender\s*[:\s]?\s*(01[3-9]\d{8})/i);

  if (phoneMatch) {
    senderPhone = phoneMatch[1].trim();
  }

  return { provider, trxId, amount, senderPhone };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { secret, message, sender } = body;

    const expectedSecret = process.env.SMS_WEBHOOK_SECRET || "gai_sms_secret_2026_secure";

    // Validate webhook secret token
    if (!secret || secret.trim() !== expectedSecret.trim()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing SMS webhook secret" },
        { status: 401 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid payload: 'message' string is required" },
        { status: 400 }
      );
    }

    // Parse SMS Details
    const { provider, trxId, amount, senderPhone } = parseMfsSms(message, sender);

    if (!trxId || !amount) {
      console.warn("SMS received but could not extract TrxID or Amount:", { message, parsed: { trxId, amount } });
      return NextResponse.json({
        success: false,
        message: "SMS received, but no valid TrxID or Amount found in text",
        rawMessage: message,
      });
    }

    // Save or update SMS transaction in Database
    const smsRecord = await prisma.smsTransaction.upsert({
      where: { trxId },
      create: {
        provider,
        trxId,
        amount,
        senderPhone,
        rawMessage: message,
        isUsed: false,
      },
      update: {
        rawMessage: message,
        amount,
        senderPhone,
      },
    });

    // Check if there is an existing pending Order waiting for this TrxID
    const matchingOrder = await prisma.order.findFirst({
      where: {
        trxId: {
          equals: trxId,
          mode: "insensitive",
        },
        paymentStatus: "pending",
      },
    });

    let autoMatched = false;
    let matchedOrderNumber: string | null = null;

    if (matchingOrder) {
      // Validate that amount matches or exceeds plan price
      if (amount >= matchingOrder.amount) {
        // Update Order to PAID
        await prisma.order.update({
          where: { id: matchingOrder.id },
          data: {
            paymentStatus: "paid",
            orderStatus: "active",
            notes: `Auto-verified via SMS Webhook (${provider.toUpperCase()}) on ${new Date().toISOString()}`,
          },
        });

        // Mark SMS Transaction as Used
        await prisma.smsTransaction.update({
          where: { id: smsRecord.id },
          data: {
            isUsed: true,
            usedInOrderId: matchingOrder.orderNumber,
          },
        });

        // Update Buyer CRM
        await prisma.buyer.updateMany({
          where: { email: matchingOrder.targetEmail },
          data: {
            status: "active",
            currentPlan: matchingOrder.planName,
          },
        });

        autoMatched = true;
        matchedOrderNumber = matchingOrder.orderNumber;

        // 1. Send instant Telegram Notification to Merchant
        await sendTelegramOrderNotification({
          orderNumber: matchingOrder.orderNumber,
          customerName: matchingOrder.customerName,
          customerEmail: matchingOrder.targetEmail,
          customerPhone: matchingOrder.customerPhone,
          planName: matchingOrder.planName,
          amount: matchingOrder.amount,
          paymentMethod: `${provider.toUpperCase()} (অটো SMS ভেরিফাইড)`,
          trxId: trxId,
          status: "✅ পেমেন্ট সফলভাবে ম্যাচ ও ভেরিফাই হয়েছে (Paid)",
        });

        // 2. Send instant delivery confirmation email to customer
        await sendCustomerEmail({
          to: matchingOrder.targetEmail,
          customerName: matchingOrder.customerName,
          orderNumber: matchingOrder.orderNumber,
          planName: matchingOrder.planName,
          messageText: `আপনার ${matchingOrder.planName} সাবস্ক্রিপশন সফলভাবে সক্রিয় করা হয়েছে। আমাদের সাথে থাকার জন্য ধন্যবাদ!`,
        }).catch((err) => console.error("Auto email delivery error:", err));
      }
    }

    return NextResponse.json({
      success: true,
      message: autoMatched
        ? `SMS successfully matched and verified with order ${matchedOrderNumber}!`
        : "SMS received and stored in database. Ready for customer match.",
      transaction: {
        provider,
        trxId,
        amount,
        senderPhone,
        autoMatched,
        matchedOrderNumber,
      },
    });
  } catch (error: any) {
    console.error("SMS Webhook error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
