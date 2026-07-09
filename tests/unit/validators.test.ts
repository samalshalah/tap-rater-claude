import { describe, expect, it } from "vitest";
import { activationFormSchema, changeLinkFormSchema, contactFormSchema, setupFormSchema } from "@/lib/validators";

describe("backend validators", () => {
  it("accepts a contact request", () => {
    const form = contactFormSchema.parse({
      name: "Tap Rater Customer",
      email: "customer@example.com",
      message: "I need help choosing a review stand."
    });

    expect(form.email).toBe("customer@example.com");
  });

  it("rejects an invalid setup URL", () => {
    expect(() =>
      setupFormSchema.parse({
        name: "Customer",
        email: "customer@example.com",
        businessName: "Local Shop",
        reviewUrl: "not-a-url",
        notes: ""
      })
    ).toThrow();
  });

  it("accepts a change-link request with a TapRater ID", () => {
    const form = changeLinkFormSchema.parse({
      name: "Customer",
      email: "customer@example.com",
      tapraterId: "TRATER01-W",
      newReviewUrl: "https://example.com/review",
      notes: ""
    });

    expect(form.tapraterId).toBe("TRATER01-W");
  });

  it("accepts a device activation request with a safe destination URL", () => {
    const form = activationFormSchema.parse({
      deviceCode: "tr123",
      activationCode: "private-code",
      email: "customer@example.com",
      name: "Customer",
      businessName: "Local Shop",
      destinationType: "google_review_url",
      destinationUrl: "https://g.page/r/local-shop"
    });

    expect(form.destinationType).toBe("google_review_url");
  });

  it("rejects unsafe activation destination URLs", () => {
    expect(() =>
      activationFormSchema.parse({
        deviceCode: "TR123",
        activationCode: "private-code",
        email: "customer@example.com",
        name: "Customer",
        businessName: "Local Shop",
        destinationType: "direct_url",
        destinationUrl: "javascript:alert(1)"
      })
    ).toThrow();
  });
});
