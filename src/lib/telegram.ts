export const TELEGRAM_BOT_TOKEN = "8940650734:AAFiMSebkWXlJO_tUkfB7ZAVPsRyPgmhD20";
export const TELEGRAM_CHAT_ID = "1433144613";

interface TelegramOrderPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  amount: number | string;
  paymentMethod: string;
  trxId: string;
  status?: string;
}

export async function sendTelegramOrderNotification(payload: TelegramOrderPayload) {
  const token = (process.env.TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN).trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID).trim();

  if (!token || !chatId) {
    console.warn("Telegram Bot Token or Chat ID not configured. Skipping Telegram notification.");
    return { success: false, reason: "Missing Telegram credentials" };
  }

  const nowFormatted = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const cleanPhone = payload.customerPhone.replace(/[^0-9]/g, "");
  const waPhone = cleanPhone.startsWith("88") ? cleanPhone : `88${cleanPhone}`;

  // Clean, professional, plain text formatting without excessive emojis
  const messageHtml = `
<b>NEW ORDER RECEIVED (Processing)</b>
━━━━━━━━━━━━━━━━━━
Order Number: <code>${payload.orderNumber}</code>
Customer: <code>${payload.customerName}</code>
Email: <code>${payload.customerEmail}</code>
Phone: <code>${payload.customerPhone}</code>

Plan: ${payload.planName}
Amount: ৳${payload.amount} BDT
Payment Method: ${payload.paymentMethod}
TrxID: <code>${payload.trxId}</code>

Status: ${payload.status || "Processing (Payment Verified)"}
Time: ${nowFormatted}
━━━━━━━━━━━━━━━━━━
Tap any field above to copy.
  `.trim();

  // Telegram Inline Keyboard Buttons
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "WhatsApp Customer",
          url: `https://wa.me/${waPhone}?text=${encodeURIComponent(
            `Hello ${payload.customerName}, your Google AI Pro order (${payload.orderNumber}) has been received and verified. We are preparing your activation.`
          )}`,
        },
        {
          text: "Open in Gmail",
          url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
            payload.customerEmail
          )}&su=${encodeURIComponent(
            `Google AI Pro Subscription (${payload.orderNumber})`
          )}`,
        },
      ],
    ],
  };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: "HTML",
        reply_markup: inlineKeyboard,
      }),
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (err: any) {
    console.error("Telegram notification error:", err.message);
    return { success: false, error: err.message };
  }
}
