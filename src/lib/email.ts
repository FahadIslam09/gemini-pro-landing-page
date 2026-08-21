import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER || "fahadislam.fir@gmail.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "czvojassurzubgyt";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD.replace(/\s+/g, ""),
  },
});

export interface SendCustomerEmailOptions {
  to: string;
  customerName?: string;
  orderNumber?: string;
  planName?: string;
  subject?: string;
  messageText: string;
  credentials?: {
    email?: string;
    password?: string;
    inviteLink?: string;
  };
}

export async function sendCustomerEmail({
  to,
  customerName = "Valued Customer",
  orderNumber = "#GAI-ORDER",
  planName = "Google AI Pro Subscription",
  subject,
  messageText,
  credentials,
}: SendCustomerEmailOptions) {
  const emailSubject = subject || `🎉 Google AI Pro সাবস্ক্রিপশন এক্সেস কনফার্মেশন (${orderNumber})`;

  const credentialsHtml = credentials
    ? `
    <div style="background: #0f172a; border-radius: 12px; padding: 18px; margin: 20px 0; color: #f8fafc; font-family: monospace;">
      <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">🔐 আপনার অ্যাকাউন্ট এক্সেস তথ্য:</p>
      ${credentials.email ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Email / User:</strong> <span style="color: #60a5fa;">${credentials.email}</span></p>` : ""}
      ${credentials.password ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Password:</strong> <span style="color: #4ade80;">${credentials.password}</span></p>` : ""}
      ${credentials.inviteLink ? `<p style="margin: 8px 0 0 0;"><a href="${credentials.inviteLink}" style="display: inline-block; background: #6366f1; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: bold; font-family: sans-serif;">Join Family Group Now &rarr;</a></p>` : ""}
    </div>
  `
    : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailSubject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
              
              <!-- Gradient Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #3157D5 0%, #5B55D8 50%, #7B4FD8 100%); padding: 35px 30px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Google AI Pro Bangladesh</h1>
                  <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Gemini Advanced • 2TB Storage • Imagen 3 • Veo 2</p>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 35px 30px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #0f172a;">হ্যালো ${customerName},</h2>
                  
                  <div style="font-size: 15px; color: #334155; margin-bottom: 20px;">
                    ${messageText.replace(/\n/g, "<br />")}
                  </div>

                  ${credentialsHtml}

                  <!-- Order Summary Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin: 25px 0; padding: 15px;">
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 6px 10px;"><strong>অর্ডার নং:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #3157D5; padding: 6px 10px;">${orderNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 6px 10px;"><strong>সাবস্ক্রিপশন প্ল্যান:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #0f172a; padding: 6px 10px;">${planName}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 6px 10px;"><strong>স্ট্যাটাস:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #16a34a; padding: 6px 10px;">✓ সক্রিয় / সফল</td>
                    </tr>
                  </table>

                  <!-- Helpful Steps -->
                  <div style="background-color: #eef2ff; border-left: 4px solid #6366f1; border-radius: 0 10px 10px 0; padding: 15px; margin: 20px 0; font-size: 13px; color: #3730a3;">
                    <strong>📌 গুরুত্বপূর্ণ ব্যবহার নির্দেশিকা:</strong>
                    <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                      <li><a href="https://gemini.google.com" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">gemini.google.com</a>-এ গিয়ে জিমেইল দিয়ে লগইন করে Gemini Advanced ও Pro ফিচারগুলো উপভোগ করুন।</li>
                      <li>যেকোনো প্রয়োজনে সরাসরি আমাদের হোয়াটসঅ্যাপে যোগাযোগ করতে পারেন।</li>
                    </ul>
                  </div>

                  <!-- WhatsApp CTA -->
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://wa.me/8801516556465" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 14px; font-weight: bold; padding: 12px 28px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">💬 হোয়াটসঅ্যাপ সাপোর্ট (01516556465)</a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8;">
                  <p style="margin: 0;">© 2026 Google AI Pro Bangladesh. সর্বস্বত্ব সংরক্ষিত।</p>
                  <p style="margin: 5px 0 0 0;">ঢাকা, বাংলাদেশ • WhatsApp: +880 1516-556465</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Google AI Pro Bangladesh" <${GMAIL_USER}>`,
      to,
      subject: emailSubject,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Nodemailer send error:", error);
    return { success: false, error: error.message };
  }
}
