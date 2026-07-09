import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildEmailHtml,
  getDefaultFromEmail,
  sendEmail,
  sendLinkChangeRequestEmail,
  sendQuoteRequestConfirmationEmail
} from "@/lib/email";

describe("email utility", () => {
  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    vi.restoreAllMocks();
  });

  it("escapes user-provided email row content", () => {
    const html = buildEmailHtml({
      intro: "New request",
      rows: {
        Name: "<script>alert('x')</script>",
        Message: "Fish & chips"
      }
    });

    expect(html).toContain("&lt;script&gt;alert(&#039;x&#039;)&lt;/script&gt;");
    expect(html).toContain("Fish &amp; chips");
    expect(html).not.toContain("<script>");
  });

  it("uses configured sender with a safe default fallback", () => {
    expect(getDefaultFromEmail({})).toBe("Tap Rater <notifications@taprater.com>");
    expect(getDefaultFromEmail({ RESEND_FROM_EMAIL: "Tap Rater <hello@mail.taprater.com>" })).toBe("Tap Rater <hello@mail.taprater.com>");
  });

  it("does not send when the Resend API key is missing", async () => {
    const result = await sendEmail({
      to: "owner@example.com",
      subject: "Tap Rater test",
      html: "<p>Hello</p>",
      resendClient: { emails: { send: vi.fn() } }
    });

    expect(result).toEqual({ sent: false, reason: "missing_api_key" });
  });

  it("sends through an injected Resend-compatible client when configured", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM_EMAIL = "Tap Rater <hello@mail.taprater.com>";
    const send = vi.fn().mockResolvedValue({ data: { id: "email-1" }, error: null });

    const result = await sendEmail({
      to: "owner@example.com",
      subject: "Tap Rater test",
      html: "<p>Hello</p>",
      resendClient: { emails: { send } }
    });

    expect(result).toEqual({ sent: true });
    expect(send).toHaveBeenCalledWith({
      from: "Tap Rater <hello@mail.taprater.com>",
      to: "owner@example.com",
      subject: "Tap Rater test",
      html: "<p>Hello</p>"
    });
  });

  it("builds supported email types", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const send = vi.fn().mockResolvedValue({ data: { id: "email-1" }, error: null });
    const resendClient = { emails: { send } };

    await sendQuoteRequestConfirmationEmail({
      to: "owner@example.com",
      businessName: "Main Street Dental",
      resendClient
    });
    await sendLinkChangeRequestEmail({
      to: "admin@example.com",
      name: "Owner <One>",
      email: "owner@example.com",
      tapraterId: "TR-123",
      newReviewUrl: "https://example.com",
      resendClient
    });

    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][0].html).toContain("Owner &lt;One&gt;");
  });
});
