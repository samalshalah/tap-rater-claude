import { describe, expect, it } from "vitest";
import { healthPayload, isCronAuthorized } from "../../apps/backend/src/http";

describe("backend http helpers", () => {
  it("returns the expected health payload", () => {
    expect(healthPayload()).toEqual({ ok: true, service: "tap-rater-backend" });
  });

  it("requires a configured cron secret for protected job routes", () => {
    expect(isCronAuthorized("Bearer test-secret", undefined)).toBe(false);
    expect(isCronAuthorized(undefined, "test-secret")).toBe(false);
    expect(isCronAuthorized("Bearer wrong", "test-secret")).toBe(false);
    expect(isCronAuthorized("Bearer test-secret", "test-secret")).toBe(true);
  });
});
