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

  // 1. Extract TrxID / TxnID (e.g. TrxID DHL6NZNSUM, TxnID: 71ABCDEF, TxnId 123456)
  const trxMatch =
    text.match(/TrxID\s*[:\s]?\s*([A-Z0-9]{6,16})/i) ||
    text.match(/TxnID\s*[:\s]?\s*([A-Z0-9]{6,16})/i) ||
    text.match(/TxnId\s*[:\s]?\s*([A-Z0-9]{6,16})/i) ||
    text.match(/Transaction ID\s*[:\s]?\s*([A-Z0-9]{6,16})/i) ||
    text.match(/Trx\s*[:\s]?\s*([A-Z0-9]{6,16})/i);

  if (trxMatch) {
    trxId = trxMatch[1].replace(/[^A-Z0-9]/gi, "").toUpperCase().trim();
  }

  // 2. Extract Amount (e.g. Tk 499.00, Tk. 499, Tk 1.00, Amount: Tk 499)
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

// GET method for easy health checking from mobile browser
export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "🚀 Gemini Pro SMS Webhook Gateway is LIVE & Ready to receive bKash/Nagad SMS!",
    instructions: "Send POST request with JSON body { secret, sender, message }",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const secret = body.secret || body.Secret || "";
    const rawMessage = body.message || body.Message || body.sms_body || body.text || "";
    const rawSender = body.sender || body.Sender || body.sms_number || body.from || "";

    const expectedSecret = process.env.SMS_WEBHOOK_SECRET || "gai_sms_secret_2026_secure";

    // Validate webhook secret token
    if (!secret || secret.trim() !== expectedSecret.trim()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing SMS webhook secret" },
        { status: 401 }
      );
    }

    if (!rawMessage || typeof rawMessage !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid payload: 'message' string is required" },
        { status: 400 }
      );
    }

    // Parse SMS Details
    const { provider, trxId, amount, senderPhone } = parseMfsSms(rawMessage, rawSender);

    if (!trxId) {
      console.warn("SMS received but could not extract TrxID:", { rawMessage, rawSender });
      return NextResponse.json({
        success: false,
        message: "SMS received, but no valid TrxID found in text",
        rawMessage,
      });
    }

    // Save or update SMS transaction in Database
    const smsRecord = await (prisma as any).smsTransaction.upsert({
      where: { trxId },
      create: {
        provider,
        trxId,
        amount: amount || 0,
        senderPhone,
        rawMessage,
        isUsed: false,
      },
      update: {
        rawMessage,
        amount: amount || 0,
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
      // Validate that amount matches or exceeds plan price (or if test payment of Tk 1+)
      if ((amount || 0) >= matchingOrder.amount || amount === 1) {
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
        await (prisma as any).smsTransaction.update({
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

        // 1. Send instant Telegram Notification to Merchant (awaited)
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

        // 2. Send instant delivery confirmation email to customer (awaited)
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
