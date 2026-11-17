export type NotificationMessage = { to: string; body: string };

export async function sendOperationalNotification(message: NotificationMessage) {
  if ((process.env.WASTEPAY_INTEGRATION_MODE ?? "mock") !== "live") {
    return { delivered: false, mode: "mock" as const, message: `Notification queued locally for ${message.to}.` };
  }
  if (!process.env.SMS_API_KEY || !process.env.SMS_API_SECRET || !process.env.SMS_SENDER_ID) {
    return { delivered: false, mode: "unconfigured" as const, message: "SMS provider is not configured." };
  }
  return { delivered: false, mode: "pending-provider" as const, message: "SMS provider adapter awaits account-specific implementation." };
}
