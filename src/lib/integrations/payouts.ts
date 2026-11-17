export type PayoutProvider = "MTN_MOMO" | "ORANGE_MONEY";

export type PayoutRequest = {
  transactionId: string;
  amountCfa: number;
  phoneNumber: string;
  provider: PayoutProvider;
};

export type PayoutResult = {
  status: "accepted" | "unavailable";
  providerReference: string | null;
  message: string;
};

function integrationMode() {
  return process.env.WASTEPAY_INTEGRATION_MODE ?? "mock";
}

/**
 * A safe boundary for telecom implementations. In mock mode it deliberately
 * never sends money; workers can exercise the same state transitions locally.
 */
export async function submitPayout(request: PayoutRequest): Promise<PayoutResult> {
  if (integrationMode() !== "live") {
    return {
      status: "accepted",
      providerReference: `MOCK-${request.provider}-${request.transactionId.slice(0, 8)}`,
      message: "Mock payout accepted. No money was sent.",
    };
  }

  const configured = request.provider === "MTN_MOMO"
    ? Boolean(process.env.MTN_MOMO_SUBSCRIPTION_KEY && process.env.MTN_MOMO_API_USER_ID && process.env.MTN_MOMO_API_KEY)
    : Boolean(process.env.ORANGE_MONEY_CLIENT_ID && process.env.ORANGE_MONEY_CLIENT_SECRET && process.env.ORANGE_MONEY_MERCHANT_ID);

  if (!configured) {
    return { status: "unavailable", providerReference: null, message: `${request.provider} is not configured.` };
  }

  // Live calls are intentionally not implemented until provider onboarding,
  // callback verification, and production webhook URLs are supplied.
  return { status: "unavailable", providerReference: null, message: "Live payout submission awaits provider onboarding." };
}
