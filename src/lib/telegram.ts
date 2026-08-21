export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

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
  const token = process.env.TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram Bot Token or Chat ID not configured in .env. Skipping Telegram notification.");
    return { success: false, reason: "Missing Telegram credentials" };
  }

  const methodBadge =
    payload.paymentMethod.toLowerCase().includes("bkash")
      ? "🔴 bKash"
      : payload.paymentMethod.toLowerCase().includes("nagad")
      ? "🟠 Nagad"
      : payload.paymentMethod.toLowerCase().includes("rocket")
      ? "🟣 Rocket"
      : `💳 ${payload.paymentMethod.toUpperCase()}`;

  const nowFormatted = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const messageHtml = `
🚀 <b>নতুন সাবস্ক্রিপশন অর্ডার রিসিভড!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>অর্ডার নং:</b> <code>${payload.orderNumber}</code>
👤 <b>গ্রাহক:</b> ${payload.customerName}
📧 <b>জিমেইল:</b> <code>${payload.customerEmail}</code>
📱 <b>ফোন:</b> <code>${payload.customerPhone}</code>

📦 <b>প্ল্যান:</b> ${payload.planName}
💰 <b>টাকার পরিমাণ:</b> <b>৳${payload.amount} BDT</b>
💳 <b>পেমেন্ট মাধ্যম:</b> ${methodBadge}
🔢 <b>TrxID:</b> <code>${payload.trxId}</code>

⏰ <b>সময়:</b> ${nowFormatted}
⚡ <b>স্ট্যাটাস:</b> ${payload.status || "পেমেন্ট সম্পন্ন / সক্রিয় অপেক্ষমাণ"}
━━━━━━━━━━━━━━━━━━
👉 <i>অ্যাডমিন প্যানেল থেকে দ্রুত অ্যাক্সেস চালু করে দিন।</i>
  `.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: "HTML",
      }),
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (err: any) {
    console.error("Telegram notification error:", err.message);
    return { success: false, error: err.message };
  }
}
