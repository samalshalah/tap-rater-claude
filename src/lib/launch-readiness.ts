import { hasSupabaseAdminConfig } from "@/lib/db";
import { hasResendApiKey } from "@/lib/email";
import { isStripeTestSecretKey } from "@/lib/checkout";

export type ReadinessCheck = {
  id: string;
  label: string;
  status: "ready" | "not_configured" | "test_mode" | "not_ready";
  detail: string;
};

export function getLaunchReadinessChecks(): ReadinessCheck[] {
  const dbReady = hasSupabaseAdminConfig();
  const resendReady = hasResendApiKey();
  const adminAuthReady = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const stripeTestMode = isStripeTestSecretKey(stripeKey);
  const stripeLive = Boolean(stripeKey) && !stripeTestMode;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return [
    {
      id: "database",
      label: "Database (Neon/Supabase)",
      status: dbReady ? "ready" : "not_configured",
      detail: dbReady
        ? "Connected. Orders, requests, devices, customers, and admin edits can persist."
        : "Not connected. Product edits, orders, and requests can't be saved yet."
    },
    {
      id: "admin_auth",
      label: "Admin login",
      status: adminAuthReady ? "ready" : "not_configured",
      detail: adminAuthReady ? "ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET are all set." : "Missing one or more of ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET."
    },
    {
      id: "email",
      label: "Transactional email (Resend)",
      status: resendReady ? "ready" : "not_configured",
      detail: resendReady
        ? "RESEND_API_KEY is set. Confirm the sending domain is DNS-verified in Resend before relying on deliverability."
        : "RESEND_API_KEY isn't set. Order confirmations and form-submission emails can't send."
    },
    {
      id: "payments",
      label: "Payments (Stripe)",
      status: stripeLive ? "not_ready" : stripeTestMode ? "test_mode" : "not_configured",
      detail: stripeLive
        ? "A live secret key is set -- double check this is intentional."
        : stripeTestMode
          ? "Test mode only (sk_test_...). No real charges can occur. This is the last step before launch by design."
          : "No Stripe key set. Checkout is disabled."
    },
    {
      id: "site_url",
      label: "Site URL",
      status: siteUrl === "https://taprater.com" ? "ready" : "not_configured",
      detail: siteUrl ? `Currently set to ${siteUrl}.` : "NEXT_PUBLIC_SITE_URL isn't set -- falls back to https://taprater.com in code."
    }
  ];
}
