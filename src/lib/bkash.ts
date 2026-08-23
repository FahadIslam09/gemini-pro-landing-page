interface BKashTokenResponse {
  statusCode: string;
  statusMessage: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
}

interface BKashCreatePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID?: string;
  bkashURL?: string;
  callbackURL?: string;
  successCallbackURL?: string;
  failureCallbackURL?: string;
  cancelledCallbackURL?: string;
  amount?: string;
  intent?: string;
  currency?: string;
  paymentCreateTime?: string;
  transactionStatus?: string;
  merchantInvoiceNumber?: string;
}

interface BKashExecutePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID?: string;
  trxID?: string;
  amount?: string;
  transactionStatus?: string;
  paymentExecuteTime?: string;
  currency?: string;
  intent?: string;
  merchantInvoiceNumber?: string;
  payerReference?: string;
  customerMsisdn?: string;
}

// In-memory token cache
let cachedToken: {
  token: string;
  expiresAt: number;
} | null = null;

function getBKashConfig() {
  const baseUrl = (process.env.BKASH_BASE_URL || "https://tokenized.pay.bka.sh/v1.2.0-beta").trim();
  const appKey = (process.env.BKASH_APP_KEY || "IwYsld4WmiCEsngyeKnAl6z2tc").trim();
  const appSecret = (process.env.BKASH_APP_SECRET || "DNbC0lhh58Te1dR3Xhw20404hjfh6Z7x3xXwfjWlmBrFGG83N2rk").trim();
  const username = (process.env.BKASH_USERNAME || "01516556465").trim();
  const password = (process.env.BKASH_PASSWORD || "=q:lrY9y^UI").trim();

  return { baseUrl, appKey, appSecret, username, password };
}

export async function getBKashToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  const { baseUrl, appKey, appSecret, username, password } = getBKashConfig();

  // Diagnostic: Check server outbound IP
  let serverIp = "unknown";
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    const ipData = await ipRes.json();
    serverIp = ipData.ip;
  } catch {}

  console.log(`[bKash Token Grant] Calling: ${baseUrl}`);
  console.log(`[bKash Token Grant] Server Outbound IP: ${serverIp}`);
  console.log(`[bKash Token Grant] Username: ${username}`);
  console.log(`[bKash Token Grant] AppKey (len ${appKey.length}): ${appKey.substring(0, 4)}...${appKey.substring(appKey.length - 3)}`);
  console.log(`[bKash Token Grant] AppSecret (len ${appSecret.length}): ${appSecret.substring(0, 4)}...${appSecret.substring(appSecret.length - 3)}`);
  console.log(`[bKash Token Grant] Password (len ${password.length}): ${password.substring(0, 2)}***${password.substring(password.length - 2)}`);

  const response = await fetch(`${baseUrl}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: username,
      password: password,
    },
    body: JSON.stringify({
      app_key: appKey,
      app_secret: appSecret,
    }),
    cache: "no-store",
  });

  const data: BKashTokenResponse = await response.json();

  if (!response.ok || !data.id_token || data.statusCode !== "0000") {
    console.error(`[bKash Token Grant Error] From Server IP (${serverIp}):`, data);
    throw new Error(data.statusMessage || "Failed to grant bKash token");
  }

  const expiresIn = (data.expires_in || 3600) * 1000;
  cachedToken = {
    token: data.id_token,
    expiresAt: now + expiresIn,
  };

  return data.id_token;
}

export async function createBKashPayment({
  amount,
  invoiceNumber,
  payerReference,
  callbackURL,
}: {
  amount: number | string;
  invoiceNumber: string;
  payerReference?: string;
  callbackURL: string;
}): Promise<BKashCreatePaymentResponse> {
  const token = await getBKashToken();
  const { baseUrl, appKey } = getBKashConfig();

  const payload = {
    mode: "0011",
    payerReference: payerReference || "01",
    callbackURL: callbackURL,
    amount: String(amount),
    currency: "BDT",
    intent: "sale",
    merchantInvoiceNumber: invoiceNumber,
  };

  const response = await fetch(`${baseUrl}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      "X-APP-Key": appKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data: BKashCreatePaymentResponse = await response.json();

  if (!response.ok || data.statusCode !== "0000") {
    console.error("bKash create payment error:", data);
    throw new Error(data.statusMessage || "Failed to create bKash payment");
  }

  return data;
}

export async function executeBKashPayment({
  paymentID,
}: {
  paymentID: string;
}): Promise<BKashExecutePaymentResponse> {
  const token = await getBKashToken();
  const { baseUrl, appKey } = getBKashConfig();

  const response = await fetch(`${baseUrl}/tokenized/checkout/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      "X-APP-Key": appKey,
    },
    body: JSON.stringify({ paymentID }),
    cache: "no-store",
  });

  const data: BKashExecutePaymentResponse = await response.json();

  if (!response.ok || data.statusCode !== "0000") {
    console.error("bKash execute payment error:", data);
    throw new Error(data.statusMessage || "Failed to execute bKash payment");
  }

  return data;
}

export async function queryBKashPayment({
  paymentID,
}: {
  paymentID: string;
}): Promise<any> {
  const token = await getBKashToken();
  const { baseUrl, appKey } = getBKashConfig();

  const response = await fetch(`${baseUrl}/tokenized/checkout/payment/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      "X-APP-Key": appKey,
    },
    body: JSON.stringify({ paymentID }),
    cache: "no-store",
  });

  return await response.json();
}
