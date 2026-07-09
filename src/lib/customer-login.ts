import { createCustomerLoginToken } from "@/lib/customer-auth";
import { getResend, hasResendApiKey } from "@/lib/resend";

export function createCustomerLoginUrl(token: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${siteUrl.replace(/\/$/, "")}/account/login?token=${encodeURIComponent(token)}`;
}

export function isDevelopmentAdminLoginAllowed(email: string, nodeEnv = process.env.NODE_ENV) {
  return nodeEnv !== "production" && Boolean(process.env.ADMIN_EMAIL) && email.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase();
}

export async function sendCustomerLoginEmail(email: string) {
  const token = createCustomerLoginToken(email);
  const loginUrl = createCustomerLoginUrl(token);

  if (!hasResendApiKey()) {
    return { sent: false, loginUrl: isDevelopmentAdminLoginAllowed(email) ? loginUrl : undefined };
  }

  await getResend().emails.send({
    from: "Tap Rater <notifications@taprater.com>",
    to: email,
    subject: "Your Tap Rater account login link",
    html: `<p>Use this secure link to access your Tap Rater account:</p><p><a href="${escapeHtml(loginUrl)}">Log in to Tap Rater</a></p><p>This link expires in 20 minutes.</p>`
  });

  return { sent: true };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
