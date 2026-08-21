import { NextRequest, NextResponse } from "next/server";
import { sendCustomerEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// In-memory or fallback session state for pending custom email drafting
const pendingEmailSessions: Record<string, { email: string; orderNumber: string; customerName?: string }> = {};

async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: any) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
    });
  } catch (err) {
    console.error("Telegram send error:", err);
  }
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || "Processing...",
        show_alert: false,
      }),
    });
  } catch (err) {
    console.error("Telegram answerCallbackQuery error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // 1. Handle Inline Button Clicks (Callback Queries)
    if (update.callback_query) {
      const cb = update.callback_query;
      const data = cb.data || "";
      const chatId = cb.message?.chat?.id || TELEGRAM_CHAT_ID;
      const cbId = cb.id;

      await answerCallbackQuery(cbId);

      // User clicked "[ ✉️ Send Gmail to Customer ]"
      if (data.startsWith("mail:")) {
        const parts = data.split(":");
        const orderNumber = parts[1] || "";
        const email = parts[2] || "";

        // Find customer name from order if available
        let customerName = "Customer";
        try {
          const order = await prisma.order.findFirst({
            where: { orderNumber },
          });
          if (order) customerName = order.customerName;
        } catch {}

        pendingEmailSessions[String(chatId)] = { email, orderNumber, customerName };

        const promptText = `
✉️ <b>গ্রাহককে ইমেইল পাঠানোর অপশন:</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>অর্ডার নং:</b> <code>${orderNumber}</code>
👤 <b>গ্রাহক:</b> ${customerName}
📧 <b>জিমেইল:</b> <code>${email}</code>

গ্রাহককে কী ধরনের ইমেইল পাঠাতে চান? নিচের যেকোনো অ্যাক্টিভেশন টেমপ্লেট বেছে নিন অথবা মেসেজ লিখে পাঠান:
        `.trim();

        const templateButtons = {
          inline_keyboard: [
            [
              {
                text: "⚡ ১-ক্লিক: প্রাইভেট অ্যাকাউন্ট সক্রিয় ইমেইল",
                callback_data: `act_priv:${orderNumber}:${email}`,
              },
            ],
            [
              {
                text: "👨‍👩‍👧‍👦 ১-ক্লিক: ফ্যামিলি গ্রুপ ইনভাইটেশন ইমেইল",
                callback_data: `act_fam:${orderNumber}:${email}`,
              },
            ],
            [
              {
                text: "✍️ কাস্টম মেসেজ পাঠাতে এখানে ক্লিক করুন",
                callback_data: `act_custom:${orderNumber}:${email}`,
              },
            ],
          ],
        };

        await sendTelegramMessage(chatId, promptText, templateButtons);
        return NextResponse.json({ ok: true });
      }

      // Template 1: Private Account Activated
      if (data.startsWith("act_priv:")) {
        const [, orderNumber, email] = data.split(":");
        let customerName = "Customer";
        let planName = "Google AI Pro (১৮ মাস প্রাইভেট)";

        try {
          const order = await prisma.order.findFirst({ where: { orderNumber } });
          if (order) {
            customerName = order.customerName;
            planName = order.planName;
          }
        } catch {}

        const res = await sendCustomerEmail({
          to: email,
          customerName,
          orderNumber,
          planName,
          subject: `🎉 আপনার Google AI Pro সাবস্ক্রিপশন সক্রিয় হয়েছে! (${orderNumber})`,
          messageText: `অভিনন্দন! আপনার <strong>${planName}</strong> সাবস্ক্রিপশনটি সফলভাবে সক্রিয় করা হয়েছে। এখন আপনার জিমেইল অ্যাকাউন্টে Gemini Advanced, 2TB Google One স্টোরেজ, Imagen 3 ও অন্যান্য সমস্ত প্রো এআই ফিচার চালু রয়েছে।`,
        });

        if (res.success) {
          await sendTelegramMessage(
            chatId,
            `✅ <b>ইমেইল সফলভাবে পৌঁছেছে!</b>\n\n📧 প্রাপক: <code>${email}</code>\n🆔 অর্ডার: <code>${orderNumber}</code>\n⚡ বিষয়: <i>Google AI Pro অ্যাক্টিভেশন কনফার্মেশন</i>`
          );
        } else {
          await sendTelegramMessage(
            chatId,
            `❌ <b>ইমেইল পাঠাতে ব্যর্থ:</b> ${res.error || "Unknown error"}`
          );
        }
        return NextResponse.json({ ok: true });
      }

      // Template 2: Family Invitation Accepted
      if (data.startsWith("act_fam:")) {
        const [, orderNumber, email] = data.split(":");
        let customerName = "Customer";
        let planName = "Google AI Pro (ফ্যামিলি প্ল্যান)";

        try {
          const order = await prisma.order.findFirst({ where: { orderNumber } });
          if (order) {
            customerName = order.customerName;
            planName = order.planName;
          }
        } catch {}

        const res = await sendCustomerEmail({
          to: email,
          customerName,
          orderNumber,
          planName,
          subject: `🎉 Google AI Pro ফ্যামিলি গ্রুপ ইনভাইটেশন পাঠানো হয়েছে (${orderNumber})`,
          messageText: `হ্যালো ${customerName}, আপনার জিমেইল (<strong>${email}</strong>)-এ Google Family গ্রুপ ইনভাইটেশন পাঠানো হয়েছে। দয়া করে আপনার জিমেইল ইনবক্স চেক করে <strong>Accept Invitation</strong>-এ ক্লিক করুন। সাথে সাথে আপনার Gemini Advanced সুবিধা চালু হয়ে যাবে।`,
        });

        if (res.success) {
          await sendTelegramMessage(
            chatId,
            `✅ <b>ফ্যামিলি ইনভাইটেশন ইমেইল সফলভাবে পাঠানো হয়েছে!</b>\n\n📧 প্রাপক: <code>${email}</code>\n🆔 অর্ডার: <code>${orderNumber}</code>`
          );
        } else {
          await sendTelegramMessage(
            chatId,
            `❌ <b>ইমেইল পাঠাতে ব্যর্থ:</b> ${res.error || "Unknown error"}`
          );
        }
        return NextResponse.json({ ok: true });
      }

      // Custom message instructions
      if (data.startsWith("act_custom:")) {
        const [, orderNumber, email] = data.split(":");
        pendingEmailSessions[String(chatId)] = { email, orderNumber };

        await sendTelegramMessage(
          chatId,
          `✍️ <b>কাস্টম ইমেইল প্রস্তুতকারক:</b>\n━━━━━━━━━━━━━━━━━━\n📧 প্রাপক: <code>${email}</code>\n🆔 অর্ডার: <code>${orderNumber}</code>\n\nআপনি যে মেসেজ বা অ্যাকাউন্ট লগইন তথ্য পাঠাতে চান, তা নিচের ফরম্যাটে লিখে পাঠান:\n<code>/send ${email} আপনার মেসেজ লিখুন...</code>\n\nঅথবা যেকোনো টেক্সট লিখে সরাসরি এই চ্যাটে সেন্ড করুন।`
        );
        return NextResponse.json({ ok: true });
      }
    }

    // 2. Handle Direct Text Messages from Admin
    if (update.message && update.message.text) {
      const msg = update.message;
      const text = msg.text.trim();
      const chatId = String(msg.chat.id);

      // Check if text is a /send command: /send <email> <custom message>
      if (text.startsWith("/send ") || text.startsWith("/email ")) {
        const parts = text.split(" ");
        const targetEmail = parts[1]?.trim();
        const customMessage = parts.slice(2).join(" ").trim();

        if (!targetEmail || !targetEmail.includes("@") || !customMessage) {
          await sendTelegramMessage(
            chatId,
            "⚠️ অনুগ্রহ করে সঠিক ফরম্যাটে লিখুন:\n<code>/send example@gmail.com আপনার মেসেজ...</code>"
          );
          return NextResponse.json({ ok: true });
        }

        const res = await sendCustomerEmail({
          to: targetEmail,
          messageText: customMessage,
          subject: "Google AI Pro সাবস্ক্রিপশন আপডেট",
        });

        if (res.success) {
          await sendTelegramMessage(
            chatId,
            `✅ <b>কাস্টম ইমেইল সফলভাবে পাঠানো হয়েছে!</b>\n📧 প্রাপক: <code>${targetEmail}</code>\n📝 মেসেজ: <i>${customMessage}</i>`
          );
        } else {
          await sendTelegramMessage(
            chatId,
            `❌ <b>ইমেইল পাঠাতে ব্যর্থ:</b> ${res.error || "Unknown error"}`
          );
        }
        return NextResponse.json({ ok: true });
      }

      // Check if admin has a pending session
      const session = pendingEmailSessions[chatId];
      if (session && session.email && !text.startsWith("/")) {
        const res = await sendCustomerEmail({
          to: session.email,
          customerName: session.customerName || "Customer",
          orderNumber: session.orderNumber || "#GAI-ORDER",
          messageText: text,
          subject: `Google AI Pro সাবস্ক্রিপশন এক্সেস (${session.orderNumber})`,
        });

        delete pendingEmailSessions[chatId];

        if (res.success) {
          await sendTelegramMessage(
            chatId,
            `✅ <b>আপনার কাস্টম মেসেজ সফলভাবে ${session.email}-এ পৌঁছেছে!</b>\n\n📝 মেসেজ: <i>${text}</i>`
          );
        } else {
          await sendTelegramMessage(
            chatId,
            `❌ <b>ইমেইল পাঠাতে ব্যর্থ:</b> ${res.error || "Unknown error"}`
          );
        }
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
