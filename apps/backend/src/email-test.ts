import { sendBackendEmail } from "./email.js";

const to = process.env.EMAIL_TEST_TO || process.env.ADMIN_NOTIFICATION_EMAIL;

if (!to) {
  console.log("SKIP backend email test: EMAIL_TEST_TO or ADMIN_NOTIFICATION_EMAIL is not configured");
  process.exit(0);
}

const result = await sendBackendEmail({
  to,
  subject: "Tap Rater backend email test",
  html: "<p>Tap Rater backend email delivery is configured.</p>"
});

if (result.sent) {
  console.log("PASS backend email test");
  process.exit(0);
}

if (result.reason === "missing_api_key") {
  console.log("SKIP backend email test: RESEND_API_KEY is not configured");
  process.exit(0);
}

console.error(`FAIL backend email test: ${result.reason}`);
process.exit(1);
