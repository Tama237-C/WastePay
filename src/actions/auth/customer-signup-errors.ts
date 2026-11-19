type CustomerSignupError = {
  code?: string;
  message?: string;
};

function normalizeErrorMessage(message: string | undefined): string {
  return message?.replace(/[\r\n\t]+/g, " ").trim().slice(0, 200) ?? "";
}

export function describeCustomerSignupError(
  error: CustomerSignupError,
): string {
  const code = error.code?.toLowerCase();
  const message = normalizeErrorMessage(error.message);

  switch (code) {
    case "email_exists":
    case "user_already_exists":
    case "identity_already_exists":
      return "An account with this email already exists. Choose Sign in, or use a different email address.";
    case "weak_password":
      return "This password does not meet the security requirements. Use at least 8 characters and try a stronger password.";
    case "email_address_invalid":
      return "Enter a valid email address that can receive WastePay confirmation messages.";
    case "email_address_not_authorized":
      return "This email address is not allowed to create an account. Contact WastePay support.";
    case "signup_disabled":
    case "email_provider_disabled":
    case "provider_disabled":
      return "New customer registrations are currently disabled. Contact WastePay support.";
    case "over_email_send_rate_limit":
      return "Too many confirmation emails were requested. Wait a few minutes before trying again.";
    case "over_request_rate_limit":
      return "Too many sign-up attempts were made. Wait a few minutes before trying again.";
    case "captcha_failed":
      return "The sign-up verification did not pass. Refresh the page and try again.";
    case "request_timeout":
      return "The sign-up service did not respond in time. Check your connection and try again.";
    case "unexpected_failure":
      if (/email|smtp/i.test(message) && /send|deliver|mail/i.test(message)) {
        return "WastePay could not send the confirmation email. Try again later or contact WastePay support.";
      }
      break;
  }

  if (message) {
    return `WastePay sign-up failed: ${message}`;
  }

  return code
    ? `WastePay sign-up failed with error code ${code}. Contact WastePay support and share this code.`
    : "WastePay sign-up failed without a reason from the account service. Please try again or contact WastePay support.";
}

export function describeCustomerProfileSaveError(
  error: CustomerSignupError,
): string {
  const code = error.code?.toUpperCase();

  switch (code) {
    case "22P02":
    case "42704":
      return "The database does not recognize the customer role yet. Ask the administrator to verify that the customer-account migration was applied in Supabase.";
    case "42P01":
    case "42703":
    case "PGRST204":
    case "PGRST205":
      return "The customer-account database setup is incomplete. Ask the administrator to verify that the customer-account migration was applied in Supabase.";
    case "42501":
      return "The database blocked saving your customer profile because of a permissions problem. Contact WastePay support.";
    case "23505":
      return "A customer profile already exists for this account. Try signing in instead.";
    case "23503":
      return "The database could not link your customer profile to the new sign-in. Please try again; if it repeats, contact WastePay support.";
    default:
      return code
        ? `WastePay could not save your customer profile (database error ${code}). Contact WastePay support and share this code.`
        : "WastePay could not save your customer profile because of a database error. Contact WastePay support.";
  }
}
