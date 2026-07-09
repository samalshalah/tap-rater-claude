import { Resend } from "resend";

type SendBackendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendBackendEmail(input: SendBackendEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "missing_api_key" } as const;
  }

  const from = process.env.RESEND_FROM_EMAIL || "Tap Rater <notifications@taprater.com>";
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html
  });

  if (result.error) {
    return { sent: false, reason: result.error.message || "email_send_failed" } as const;
  }

  return { sent: true } as const;
}
