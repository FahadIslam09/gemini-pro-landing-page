import crypto from "crypto";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";

// SHA-256 hash helper for User Data according to Meta CAPI specification
export function hashData(val?: string): string | undefined {
  if (!val) return undefined;
  const clean = val.trim().toLowerCase();
  return crypto.createHash("sha256").update(clean).digest("hex");
}

// Server-side Meta Conversions API (CAPI) Event Dispatcher
export async function sendServerMetaEvent({
  eventName,
  eventId,
  eventSourceUrl,
  userData,
  customData,
}: {
  eventName: "PageView" | "ViewContent" | "InitiateCheckout" | "Purchase" | "Lead" | "Contact";
  eventId: string;
  eventSourceUrl?: string;
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
  };
  customData?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    order_id?: string;
  };
}) {
  const pixelId = (process.env.NEXT_PUBLIC_META_PIXEL_ID || "").trim();
  const accessToken = (process.env.META_ACCESS_TOKEN || "").trim();

  if (!pixelId || !accessToken) {
    console.warn("Meta Pixel ID or Access Token is missing. Skipping CAPI event dispatch.");
    return { success: false, reason: "Missing credentials" };
  }

  try {
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://googleai.neonweb.xyz",
          action_source: "website",
          user_data: {
            em: userData.email ? [hashData(userData.email)] : undefined,
            ph: userData.phone ? [hashData(userData.phone.replace(/[^0-9]/g, ""))] : undefined,
            fn: userData.firstName ? [hashData(userData.firstName)] : undefined,
            client_ip_address: userData.clientIpAddress,
            client_user_agent: userData.clientUserAgent,
            fbp: userData.fbp,
            fbc: userData.fbc,
          },
          custom_data: customData,
        },
      ],
    };

    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (err: any) {
    console.error("Meta Conversions API Error:", err.message);
    return { success: false, error: err.message };
  }
}
