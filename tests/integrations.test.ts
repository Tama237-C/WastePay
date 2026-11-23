import assert from "node:assert/strict";
import test from "node:test";

import { submitPayout } from "../src/lib/integrations/payouts.ts";
import { sendOperationalNotification } from "../src/lib/integrations/notifications.ts";
import {
  describeCustomerProfileSaveError,
  describeCustomerSignupError,
} from "../src/actions/auth/customer-signup-errors.ts";
import { getVerifiedBookingUserId } from "../src/lib/supabase/booking-user.ts";
import {
  getBuybackBarcodeError,
  isValidBuybackBarcode,
  normalizeCameroonPhoneNumber,
} from "../src/lib/buyback-validation.ts";
import { getStaffPasswordValidationError } from "../src/lib/auth/staff-password-validation.ts";

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

test("guest pickup booking does not require an authenticated user lookup", async () => {
  let userLookups = 0;
  const result = await getVerifiedBookingUserId({
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      async getUser() {
        userLookups += 1;
        return { data: { user: null }, error: null };
      },
    },
  });

  assert.deepEqual(result, { userId: null, error: null });
  assert.equal(userLookups, 0);
});

test("signed-in pickup booking verifies the user before linking the profile", async () => {
  const result = await getVerifiedBookingUserId({
    auth: {
      async getSession() {
        return {
          data: { session: { user: { id: "resident-profile-id" } } },
          error: null,
        };
      },
      async getUser() {
        return {
          data: { user: { id: "resident-profile-id" } },
          error: null,
        };
      },
    },
  });

  assert.deepEqual(result, {
    userId: "resident-profile-id",
    error: null,
  });
});

test("buyback intake normalizes valid Cameroon phone numbers and rejects invalid ones", () => {
  assert.equal(
    normalizeCameroonPhoneNumber(" 6 12 34 56 78 "),
    "+237612345678",
  );
  assert.equal(
    normalizeCameroonPhoneNumber("+237612345678"),
    "+237612345678",
  );
  assert.equal(normalizeCameroonPhoneNumber("+33123456789"), null);
});

test("buyback intake rejects malformed codes and mismatched or archived barcodes", () => {
  assert.equal(isValidBuybackBarcode("1234567890123"), true);
  assert.equal(isValidBuybackBarcode("123 456"), false);
  assert.equal(isValidBuybackBarcode("x".repeat(129)), false);
  assert.equal(
    getBuybackBarcodeError(
      { material_type: "PET_CLEAR", verification_status: "VERIFIED" },
      "PET_COLORED",
    ),
    "material-mismatch",
  );
  assert.equal(
    getBuybackBarcodeError(
      { material_type: "PET_CLEAR", verification_status: "ARCHIVED" },
      "PET_CLEAR",
    ),
    "archived",
  );
});

test("staff password recovery requires a strong matching password", () => {
  assert.equal(
    getStaffPasswordValidationError("WastePay-Secure-2030", "WastePay-Secure-2030"),
    null,
  );
  assert.match(
    getStaffPasswordValidationError("short", "short") ?? "",
    /at least 12 characters/i,
  );
  assert.match(
    getStaffPasswordValidationError("WastePay-Secure-2030", "DifferentPass-2030") ?? "",
    /do not match/i,
  );
});
