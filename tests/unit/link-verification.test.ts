import { describe, expect, it, vi } from "vitest";
import { isSafeExternalUrl, verifyDestinationLink } from "@/lib/link-verification";

describe("isSafeExternalUrl", () => {
  it("allows public http/https URLs", () => {
    expect(isSafeExternalUrl("https://search.google.com/local/writereview?placeid=abc")).toBe(true);
    expect(isSafeExternalUrl("http://example.com/menu")).toBe(true);
  });

  it("blocks non-http protocols", () => {
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("data:text/html,hi")).toBe(false);
    expect(isSafeExternalUrl("file:///etc/passwd")).toBe(false);
  });

  it("blocks loopback and private hosts (SSRF protection)", () => {
    expect(isSafeExternalUrl("http://localhost/admin")).toBe(false);
    expect(isSafeExternalUrl("http://127.0.0.1:3000")).toBe(false);
    expect(isSafeExternalUrl("http://10.0.0.5/internal")).toBe(false);
    expect(isSafeExternalUrl("http://192.168.1.1/router")).toBe(false);
    expect(isSafeExternalUrl("http://169.254.169.254/latest/meta-data")).toBe(false);
    expect(isSafeExternalUrl("http://172.16.0.1")).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(isSafeExternalUrl("not a url")).toBe(false);
    expect(isSafeExternalUrl("")).toBe(false);
  });
});

describe("verifyDestinationLink", () => {
  it("passes a URL that responds successfully", async () => {
    const fakeFetch = vi.fn().mockResolvedValue({ status: 200, ok: true });
    const result = await verifyDestinationLink("https://example.com/menu", fakeFetch as unknown as typeof fetch);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.status).toBe(200);
    }
  });

  it("fails a 404", async () => {
    const fakeFetch = vi.fn().mockResolvedValue({ status: 404, ok: false });
    const result = await verifyDestinationLink("https://example.com/gone", fakeFetch as unknown as typeof fetch);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("not_found");
    }
  });

  it("retries with GET when HEAD is rejected, and still passes", async () => {
    const fakeFetch = vi
      .fn()
      .mockResolvedValueOnce({ status: 405, ok: false })
      .mockResolvedValueOnce({ status: 200, ok: true });
    const result = await verifyDestinationLink("https://example.com/head-blocked", fakeFetch as unknown as typeof fetch);

    expect(fakeFetch).toHaveBeenCalledTimes(2);
    expect(result.ok).toBe(true);
  });

  it("is lenient on bot-blocked responses (403) rather than failing outright", async () => {
    const fakeFetch = vi.fn().mockResolvedValue({ status: 403, ok: false });
    const result = await verifyDestinationLink("https://example.com/bot-blocked", fakeFetch as unknown as typeof fetch);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.note).toBeDefined();
    }
  });

  it("fails on network error", async () => {
    const fakeFetch = vi.fn().mockRejectedValue(new Error("network down"));
    const result = await verifyDestinationLink("https://example.com/down", fakeFetch as unknown as typeof fetch);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("unreachable");
    }
  });

  it("rejects private/internal hosts before ever calling fetch (SSRF protection)", async () => {
    const fakeFetch = vi.fn();
    const result = await verifyDestinationLink("http://169.254.169.254/latest/meta-data", fakeFetch as unknown as typeof fetch);

    expect(result.ok).toBe(false);
    expect(fakeFetch).not.toHaveBeenCalled();
    if (!result.ok) {
      expect(result.reason).toBe("blocked_host");
    }
  });

  it("rejects malformed URLs before calling fetch", async () => {
    const fakeFetch = vi.fn();
    const result = await verifyDestinationLink("not-a-url", fakeFetch as unknown as typeof fetch);

    expect(result.ok).toBe(false);
    expect(fakeFetch).not.toHaveBeenCalled();
  });
});
