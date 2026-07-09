import { describe, expect, it } from "vitest";

describe("smoke test script", () => {
  it("checks the critical public launch routes without requiring Stripe", async () => {
    const { createSmokeChecks } = await import("../../scripts/smoke.mjs");
    const checks = createSmokeChecks("http://127.0.0.1:3000");

    expect(checks.map((check) => check.path)).toEqual([
      "/",
      "/product/google-review-nfc-stand",
      "/admin/login",
      "/activate",
      "/r/TR-DEMO-GOOGLE"
    ]);
    expect(checks.find((check) => check.path === "/r/TR-DEMO-GOOGLE")?.acceptableStatuses).toEqual([200, 302, 303, 307, 308]);
  });

  it("classifies status codes for strict and redirect-tolerant checks", async () => {
    const { isAcceptableStatus } = await import("../../scripts/smoke.mjs");

    expect(isAcceptableStatus(200, [200])).toBe(true);
    expect(isAcceptableStatus(307, [200])).toBe(false);
    expect(isAcceptableStatus(307, [200, 302, 303, 307, 308])).toBe(true);
  });
});
