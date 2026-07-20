import { describe, expect, it, beforeAll } from "vitest";
import { hashPassword, isPasswordStrongEnough, verifyPassword } from "@/lib/customer-password";
import { createPasswordSetupToken, parsePasswordSetupToken } from "@/lib/customer-auth";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-session-secret-for-signing";
});

describe("customer password hashing", () => {
  it("hashes a password and verifies the correct password against it", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(await verifyPassword("wrong password", hash)).toBe(false);
  });

  it("never stores the password in plain text -- the hash never contains the raw password", async () => {
    const password = "correct horse battery staple";
    const hash = await hashPassword(password);

    expect(hash).not.toContain(password);
  });

  it("produces a different hash each time for the same password (random salt, not a lookup-table risk)", async () => {
    const hash1 = await hashPassword("same password");
    const hash2 = await hashPassword("same password");

    expect(hash1).not.toBe(hash2);
    expect(await verifyPassword("same password", hash1)).toBe(true);
    expect(await verifyPassword("same password", hash2)).toBe(true);
  });

  it("rejects a malformed stored hash rather than throwing", async () => {
    expect(await verifyPassword("anything", "not-a-real-hash")).toBe(false);
    expect(await verifyPassword("anything", "")).toBe(false);
  });

  it("enforces a minimum password length", () => {
    expect(isPasswordStrongEnough("short")).toBe(false);
    expect(isPasswordStrongEnough("longenough1")).toBe(true);
  });
});

describe("password setup tokens", () => {
  it("creates a token that resolves back to the same email", () => {
    const token = createPasswordSetupToken("Customer@Example.com");
    const parsed = parsePasswordSetupToken(token);

    expect(parsed?.email).toBe("customer@example.com");
  });

  it("rejects an expired token (older than the 1-hour window)", () => {
    const issuedAt = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
    const token = createPasswordSetupToken("customer@example.com", issuedAt);

    expect(parsePasswordSetupToken(token)).toBeNull();
  });

  it("rejects a tampered token", () => {
    const token = createPasswordSetupToken("customer@example.com");
    const tampered = token.replace("customer", "attacker");

    expect(parsePasswordSetupToken(tampered)).toBeNull();
  });

  it("rejects a garbage/missing token", () => {
    expect(parsePasswordSetupToken(undefined)).toBeNull();
    expect(parsePasswordSetupToken("not-a-real-token")).toBeNull();
  });
});
