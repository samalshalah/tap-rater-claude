import { getResend, hasResendConfig } from "@/lib/resend";

type NotificationPayload = {
  subject: string;
  rows: Record<string, string>;
};

export async function sendRequestNotification(payload: NotificationPayload) {
  if (!hasResendConfig()) {
    return;
  }

  const resend = getResend();
  const to = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!to) {
    return;
  }

  const html = Object.entries(payload.rows)
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");

  await resend.emails.send({
    from: "Tap Rater <notifications@taprater.com>",
    to,
    subject: payload.subject,
    html
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
