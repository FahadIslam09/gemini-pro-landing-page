interface BKashCreatePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID?: string;
  bkashURL?: string;
  callbackURL?: string;
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

const BKASH_BRIDGE_URL = (process.env.BKASH_BRIDGE_URL || "https://www.vucampus.xyz/api/bkash/gateway").trim();
const BKASH_BRIDGE_SECRET = (process.env.BKASH_BRIDGE_SECRET || "gai_bkash_bridge_secret_2026").trim();

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
  const response = await fetch(BKASH_BRIDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "create",
      secret: BKASH_BRIDGE_SECRET,
      amount,
      invoiceNumber,
      payerReference: payerReference || "Customer",
      callbackURL,
    }),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.bkashURL) {
    console.error("[bKash Bridge Create Error]:", data);
    throw new Error(data.message || "Failed to create bKash payment via gateway bridge");
  }

  return {
    statusCode: "0000",
    statusMessage: "Success",
    bkashURL: data.bkashURL,
    paymentID: data.paymentID,
    merchantInvoiceNumber: invoiceNumber,
  };
}

export async function executeBKashPayment({
  paymentID,
}: {
  paymentID: string;
}): Promise<BKashExecutePaymentResponse> {
  const response = await fetch(BKASH_BRIDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "execute",
      secret: BKASH_BRIDGE_SECRET,
      paymentID,
    }),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.data) {
    console.error("[bKash Bridge Execute Error]:", data);
    throw new Error(data.message || "Failed to execute bKash payment via gateway bridge");
  }

  return data.data;
}

export async function queryBKashPayment({
  paymentID,
}: {
  paymentID: string;
}): Promise<any> {
  const response = await fetch(BKASH_BRIDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "query",
      secret: BKASH_BRIDGE_SECRET,
      paymentID,
    }),
    cache: "no-store",
  });

  return await response.json();
}

