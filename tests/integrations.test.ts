import assert from "node:assert/strict";
import test from "node:test";

import { submitPayout } from "../src/lib/integrations/payouts.ts";
import { sendOperationalNotification } from "../src/lib/integrations/notifications.ts";
import {
  describeCustomerProfileSaveError,
  describeCustomerSignupError,
} from "../src/actions/auth/customer-signup-errors.ts";

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

test("customer sign-up explains duplicate emails and confirmation email limits", () => {
  assert.match(
    describeCustomerSignupError({
      code: "email_exists",
      message: "User already registered",
    }),
    /already exists.*Sign in/i,
  );
  assert.match(
    describeCustomerSignupError({
      code: "over_email_send_rate_limit",
      message: "Rate limit exceeded",
    }),
    /confirmation emails.*Wait/i,
  );
});

test("customer profile setup errors identify migration and permissions problems", () => {
  assert.match(
    describeCustomerProfileSaveError({
      code: "22P02",
      message: "invalid input value for enum",
    }),
    /customer role.*migration/i,
  );
  assert.match(
    describeCustomerProfileSaveError({
      code: "42501",
      message: "permission denied",
    }),
    /permissions problem/i,
  );
});
