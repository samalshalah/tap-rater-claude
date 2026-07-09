import { describe, expect, it } from "vitest";
import { changeLinkFormSchema, contactFormSchema, setupFormSchema } from "@/lib/validators";

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
});
