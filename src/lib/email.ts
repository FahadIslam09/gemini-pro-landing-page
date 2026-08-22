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
  const emailSubject = subject || `Google AI Pro Order Confirmation (${orderNumber})`;

  const credentialsHtml = credentials
    ? `
    <div style="background: #0f172a; border-radius: 12px; padding: 18px; margin: 20px 0; color: #f8fafc; font-family: monospace;">
      <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Access Details:</p>
      ${credentials.email ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> <span style="color: #60a5fa;">${credentials.email}</span></p>` : ""}
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
                <td style="background: linear-gradient(135deg, #3157D5 0%, #5B55D8 50%, #8A4EDB 100%); padding: 30px 30px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Google AI Pro Bangladesh</h1>
                  <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Gemini Advanced • 2TB Storage • Workspace AI</p>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 35px 30px;">
                  <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #0f172a;">Hello ${customerName},</h2>
                  
                  <div style="font-size: 14px; color: #334155; margin-bottom: 20px;">
                    ${messageText.replace(/\n/g, "<br />")}
                  </div>

                  ${credentialsHtml}

                  <!-- Order Summary Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0; padding: 15px;">
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 6px 10px;"><strong>Order ID:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #3157D5; padding: 6px 10px;">${orderNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 6px 10px;"><strong>Plan:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #0f172a; padding: 6px 10px;">${planName}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 6px 10px;"><strong>Status:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #d97706; padding: 6px 10px;">Processing</td>
                    </tr>
                  </table>

                  <!-- Helpful Steps -->
                  <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 0 10px 10px 0; padding: 14px; margin: 20px 0; font-size: 13px; color: #166534;">
                    <strong>Next Step:</strong>
                    <p style="margin: 4px 0 0 0;">Your payment is verified. Our admin is generating your private activation link. You will receive an email shortly once activation is ready.</p>
                  </div>

                  <!-- WhatsApp Support -->
                  <div style="text-align: center; margin-top: 25px;">
                    <a href="https://wa.me/8801516556465" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 13px; font-weight: bold; padding: 10px 24px; border-radius: 10px; text-decoration: none;">WhatsApp Support (01516556465)</a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 30px; text-align: center; font-size: 12px; color: #94a3b8;">
                  <p style="margin: 0;">© 2026 Google AI Pro Bangladesh. All rights reserved.</p>
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

export interface SendOrderActivationEmailOptions {
  to: string;
  customerName?: string;
  orderNumber: string;
  planName: string;
  activationLink: string;
}

export async function sendOrderActivationEmail({
  to,
  customerName = "Valued Customer",
  orderNumber,
  planName,
  activationLink,
}: SendOrderActivationEmailOptions) {
  const emailSubject = `Your Google AI Pro Subscription is Ready! (${orderNumber})`;

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
                <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 32px 30px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Google AI Pro Subscription Completed</h1>
                  <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Your activation link is ready</p>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 35px 30px;">
                  <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a;">Hello ${customerName},</h2>
                  
                  <p style="font-size: 14px; color: #334155; margin: 0 0 20px 0;">
                    Your subscription order <strong>${orderNumber}</strong> for <strong>${planName}</strong> has been successfully processed and completed.
                  </p>

                  <!-- Activation Action Card -->
                  <div style="background: #f8fafc; border: 2px dashed #10b981; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
                    <p style="margin: 0 0 14px 0; font-size: 14px; font-weight: bold; color: #065f46;">
                      Click the button below to activate your Google AI Pro subscription:
                    </p>
                    
                    <a href="${activationLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #ffffff; font-size: 15px; font-weight: bold; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                      Activate Subscription Now &rarr;
                    </a>

                    <p style="margin: 16px 0 0 0; font-size: 11px; color: #64748b; word-break: break-all;">
                      Or copy and paste this link in your browser:<br />
                      <a href="${activationLink}" style="color: #2563eb;">${activationLink}</a>
                    </p>
                  </div>

                  <!-- Activation Instructions -->
                  <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 10px 10px 0; padding: 16px; margin: 20px 0; font-size: 13px; color: #1e40af;">
                    <strong style="font-size: 13px;">Activation Steps:</strong>
                    <ol style="margin: 8px 0 0 0; padding-left: 20px; line-height: 1.6;">
                      <li>Make sure you are logged into your target Google account (<strong>${to}</strong>).</li>
                      <li>Click the activation link above and accept the invitation.</li>
                      <li>Visit <a href="https://gemini.google.com" target="_blank" style="color: #2563eb; font-weight: bold;">gemini.google.com</a> and start using Gemini Advanced!</li>
                    </ol>
                  </div>

                  <!-- Order Summary Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0; padding: 14px;">
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 5px 10px;"><strong>Order Number:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #3157D5; padding: 5px 10px;">${orderNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 5px 10px;"><strong>Plan:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #0f172a; padding: 5px 10px;">${planName}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 5px 10px;"><strong>Target Email:</strong></td>
                      <td align="right" style="font-size: 13px; font-mono; color: #0f172a; padding: 5px 10px;">${to}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 13px; color: #64748b; padding: 5px 10px;"><strong>Status:</strong></td>
                      <td align="right" style="font-size: 13px; font-weight: bold; color: #16a34a; padding: 5px 10px;">Completed</td>
                    </tr>
                  </table>

                  <!-- WhatsApp Support -->
                  <div style="text-align: center; margin-top: 25px;">
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Need assistance? Contact our team directly:</p>
                    <a href="https://wa.me/8801516556465" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 13px; font-weight: bold; padding: 10px 24px; border-radius: 10px; text-decoration: none;">WhatsApp Support (01516556465)</a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 30px; text-align: center; font-size: 12px; color: #94a3b8;">
                  <p style="margin: 0;">© 2026 Google AI Pro Bangladesh. All rights reserved.</p>
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
