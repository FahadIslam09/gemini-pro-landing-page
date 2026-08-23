import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendTelegramOrderNotification } from "@/lib/telegram";
import { sendCustomerEmail } from "@/lib/email";
import { assignAndSendActivationLink } from "@/lib/activation-service";

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
    console.log("📥 Raw SMS Webhook payload received:", JSON.stringify(body));

    const secret = body.secret || body.Secret || "";
    const rawMessage =
      body.message ||
      body.Message ||
      body.sms_message ||
      body.sms_body ||
      body.sms_content ||
      body.content ||
      body.text ||
      body.body ||
      "";
    const rawSender =
      body.sender ||
      body.Sender ||
      body.sms_number ||
      body.from ||
      body.number ||
      "";

    const expectedSecret = process.env.SMS_WEBHOOK_SECRET || "gai_sms_secret_2026_secure";

    // Validate webhook secret token
    if (!secret || secret.trim() !== expectedSecret.trim()) {
      console.warn("SMS Webhook secret mismatch:", { received: secret, expected: expectedSecret });
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing SMS webhook secret" },
        { status: 401 }
      );
    }

    if (!rawMessage || typeof rawMessage !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid payload: 'message' or 'sms_message' string is required" },
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

    // Save or update SMS transaction in Supabase
    const { data: smsRecord, error: smsError } = await supabase
      .from("sms_transactions")
      .upsert(
        {
          provider,
          trx_id: trxId,
          amount: amount || 0,
          sender_phone: senderPhone || "",
          raw_message: rawMessage,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "trx_id" }
      )
      .select()
      .single();

    if (smsError) {
      console.error("SMS upsert error in Supabase:", smsError);
    }

    // Check if there is an existing pending Order waiting for this TrxID
    const { data: matchingOrder } = await supabase
      .from("orders")
      .select("*")
      .ilike("trx_id", trxId)
      .eq("payment_status", "pending")
      .maybeSingle();

    let autoMatched = false;
    let matchedOrderNumber: string | null = null;

    if (matchingOrder) {
      // Strict Validation: Amount must strictly equal or exceed required order amount
      if ((amount || 0) >= Number(matchingOrder.amount || 0)) {
        // Update Order to PAID in Supabase
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "processing",
            notes: `Auto-verified via SMS Webhook (${provider.toUpperCase()}) on ${new Date().toISOString()}`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", matchingOrder.id);

        // Mark SMS Transaction as Used in Supabase
        if (smsRecord?.id) {
          await supabase
            .from("sms_transactions")
            .update({
              is_used: true,
              used_in_order_id: matchingOrder.order_number,
              updated_at: new Date().toISOString(),
            })
            .eq("id", smsRecord.id);
        }

        // Update Buyer CRM
        await supabase
          .from("buyers")
          .update({
            status: "active",
            current_plan: matchingOrder.plan_name,
            updated_at: new Date().toISOString(),
          })
          .eq("email", matchingOrder.target_email);

        autoMatched = true;
        matchedOrderNumber = matchingOrder.order_number;

        // 1. Send instant Telegram Notification to Merchant (awaited)
        await sendTelegramOrderNotification({
          orderNumber: matchingOrder.order_number,
          customerName: matchingOrder.customer_name,
          customerEmail: matchingOrder.target_email,
          customerPhone: matchingOrder.customer_phone,
          planName: matchingOrder.plan_name,
          amount: Number(matchingOrder.amount),
          paymentMethod: `${provider.toUpperCase()} (অটো SMS ভেরিফাইড)`,
          trxId: trxId,
          status: "✅ পেমেন্ট সফলভাবে ম্যাচ ও ভেরিফাই হয়েছে (Paid)",
        });

        // 2. Automated Delivery: If 18-month plan, assign unique activation link; otherwise standard email
        if (matchingOrder.plan_key === "18m") {
          await assignAndSendActivationLink({
            id: matchingOrder.id,
            order_number: matchingOrder.order_number,
            plan_key: matchingOrder.plan_key,
            plan_name: matchingOrder.plan_name,
            customer_name: matchingOrder.customer_name,
            target_email: matchingOrder.target_email,
            customer_phone: matchingOrder.customer_phone,
            amount: Number(matchingOrder.amount),
          }).catch((err) => console.error("Auto activation link assignment error:", err));
        } else {
          await sendCustomerEmail({
            to: matchingOrder.target_email,
            customerName: matchingOrder.customer_name,
            orderNumber: matchingOrder.order_number,
            planName: matchingOrder.plan_name,
            messageText: `আপনার ${matchingOrder.plan_name} সাবস্ক্রিপশন পেমেন্ট সফলভাবে যাচাই করা হয়েছে। আমাদের সাথে থাকার জন্য ধন্যবাদ!`,
          }).catch((err) => console.error("Auto email delivery error:", err));
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `SMS received and saved successfully! Extracted TrxID: ${trxId} (${provider.toUpperCase()})`,
      parsed: {
        provider,
        trxId,
        amount,
        senderPhone,
      },
      autoMatched,
      matchedOrderNumber,
    });
  } catch (error: any) {
    console.error("SMS Webhook error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process SMS webhook" },
      { status: 500 }
    );
  }
}
