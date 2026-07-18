import { describe, expect, it, afterEach } from "vitest";
import { getLaunchReadinessChecks } from "@/lib/launch-readiness";

const originalEnv = { ...process.env };

describe("launch readiness", () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("reports not_configured for everything when nothing is set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "";
    process.env.DATABASE_URL = "";
    process.env.RESEND_API_KEY = "";
    process.env.ADMIN_EMAIL = "";
    process.env.ADMIN_PASSWORD = "";
    process.env.ADMIN_SESSION_SECRET = "";
    process.env.STRIPE_SECRET_KEY = "";
    process.env.NEXT_PUBLIC_SITE_URL = "";

    const checks = getLaunchReadinessChecks();
    const byId = Object.fromEntries(checks.map((c) => [c.id, c]));

    expect(byId.database.status).toBe("not_configured");
    expect(byId.admin_auth.status).toBe("not_configured");
    expect(byId.email.status).toBe("not_configured");
    expect(byId.payments.status).toBe("not_configured");
  });

  it("reports test_mode for Stripe when a sk_test_ key is set, never claiming it's fully ready", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_abc123";

    const checks = getLaunchReadinessChecks();
    const payments = checks.find((c) => c.id === "payments")!;

    expect(payments.status).toBe("test_mode");
    expect(payments.detail).toContain("No real charges");
  });

  it("flags a live Stripe key as something to double check, not silently 'ready'", () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_abc123";

    const checks = getLaunchReadinessChecks();
    const payments = checks.find((c) => c.id === "payments")!;

    expect(payments.status).toBe("not_ready");
  });

  it("reports admin login ready only when all 3 required vars are set", () => {
    process.env.ADMIN_EMAIL = "admin@taprater.com";
    process.env.ADMIN_PASSWORD = "";
    process.env.ADMIN_SESSION_SECRET = "some-secret";

    let checks = getLaunchReadinessChecks();
    expect(checks.find((c) => c.id === "admin_auth")!.status).toBe("not_configured");

    process.env.ADMIN_PASSWORD = "some-password";
    checks = getLaunchReadinessChecks();
    expect(checks.find((c) => c.id === "admin_auth")!.status).toBe("ready");
  });
});
