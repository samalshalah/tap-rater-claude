import { Resend } from "resend";

export function hasResendConfig() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ORDER_NOTIFICATION_EMAIL);
}

export function hasResendApiKey() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(apiKey);
}
