import { afterEach, describe, expect, it } from "vitest";
import { createAdminSessionValue, isValidAdminSession } from "@/lib/admin-auth";

describe("admin auth", () => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET;

  afterEach(() => {
    process.env.ADMIN_SESSION_SECRET = originalSecret;
  });

  it("validates a signed admin session value", () => {
    process.env.ADMIN_SESSION_SECRET = "test-secret";

    const value = createAdminSessionValue("admin@taprater.com");

    expect(isValidAdminSession(value)).toBe(true);
  });

  it("rejects a tampered admin session value", () => {
    process.env.ADMIN_SESSION_SECRET = "test-secret";

    const value = createAdminSessionValue("admin@taprater.com");

    expect(isValidAdminSession(value.replace("admin", "owner"))).toBe(false);
  });
});
