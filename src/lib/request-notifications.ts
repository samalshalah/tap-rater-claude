import { buildEmailHtml, sendEmail } from "@/lib/email";

type NotificationPayload = {
  subject: string;
  rows: Record<string, string>;
};

export async function sendRequestNotification(payload: NotificationPayload) {
  const to = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!to) {
    return;
  }

  await sendEmail({
    to,
    subject: payload.subject,
    html: buildEmailHtml({
      rows: payload.rows
    })
  });
}
