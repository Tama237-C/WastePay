import assert from "node:assert/strict";
import test from "node:test";

import { submitPayout } from "../src/lib/integrations/payouts.ts";
import { sendOperationalNotification } from "../src/lib/integrations/notifications.ts";

test("mock payout accepts a request without sending money", { concurrency: false }, async () => {
  process.env.WASTEPAY_INTEGRATION_MODE = "mock";
  const result = await submitPayout({
    transactionId: "12345678-1234-1234-1234-123456789012",
    amountCfa: 1200,
    phoneNumber: "+237612345678",
    provider: "MTN_MOMO",
  });
  assert.equal(result.status, "accepted");
  assert.match(result.providerReference ?? "", /^MOCK-MTN_MOMO-/);
});

test("live payout is refused when provider credentials are absent", { concurrency: false }, async () => {
  process.env.WASTEPAY_INTEGRATION_MODE = "live";
  delete process.env.ORANGE_MONEY_CLIENT_ID;
  delete process.env.ORANGE_MONEY_CLIENT_SECRET;
  delete process.env.ORANGE_MONEY_MERCHANT_ID;
  const result = await submitPayout({ transactionId: "12345678", amountCfa: 500, phoneNumber: "+237612345678", provider: "ORANGE_MONEY" });
  assert.equal(result.status, "unavailable");
});

test("mock notifications never contact a provider", { concurrency: false }, async () => {
  process.env.WASTEPAY_INTEGRATION_MODE = "mock";
  const result = await sendOperationalNotification({ to: "+237612345678", body: "Pickup confirmed" });
  assert.equal(result.delivered, false);
  assert.equal(result.mode, "mock");
});
