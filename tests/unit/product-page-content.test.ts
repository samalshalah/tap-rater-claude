import { describe, expect, it } from "vitest";
import { getProductBySlug } from "@/lib/products";
import {
  getProductActivationCopy,
  getProductComparisonRows,
  getProductPageHighlights,
  getProductPageUseCases,
  getProductServiceBadges
} from "@/lib/product-page-content";

describe("product page content", () => {
  it("builds purchase highlights from the product", () => {
    const product = getProductBySlug("google-review-nfc-stand");

    expect(product).toBeDefined();
    expect(getProductPageHighlights(product!).map((highlight) => highlight.title)).toEqual([
      "Tap-to-review flow",
      "Configured for your link",
      "Counter-ready display",
      "Simple customer prompt"
    ]);
  });

  it("returns business use cases for local customer touchpoints", () => {
    const product = getProductBySlug("google-review-nfc-stand");

    expect(getProductPageUseCases(product!)).toHaveLength(4);
    expect(getProductPageUseCases(product!)[0].title).toBe("Restaurants and cafes");
  });

  it("marks the active product type in comparison rows", () => {
    const stand = getProductBySlug("google-review-nfc-stand");
    const bundle = getProductBySlug("business-review-starter-kit");

    expect(getProductComparisonRows(stand!).find((row) => row.label === "Stand")?.active).toBe(true);
    expect(getProductComparisonRows(bundle!).find((row) => row.label === "Bundle")?.active).toBe(true);
  });

  it("builds customer-facing service badges from product strategy metadata", () => {
    const stand = getProductBySlug("google-review-nfc-stand");
    const bundle = getProductBySlug("business-review-starter-kit");
    const feedback = getProductBySlug("rate-your-experience-page");

    expect(getProductServiceBadges(stand!)).toEqual(["No monthly fee required", "Free basic activation"]);
    expect(getProductServiceBadges(bundle!)).toContain("Managed setup included");
    expect(getProductServiceBadges(feedback!)).toEqual([
      "Account required",
      "Hosted landing page required",
      "Subscription required"
    ]);
  });

  it("explains whether a product redirects directly or uses a hosted landing page", () => {
    const stand = getProductBySlug("google-review-nfc-stand");
    const feedback = getProductBySlug("rate-your-experience-page");

    expect(getProductActivationCopy(stand!).body).toContain("redirects directly");
    expect(getProductActivationCopy(stand!).body).toContain("optional");
    expect(getProductActivationCopy(feedback!).body).toContain("hosted Tap Rater landing page");
    expect(getProductActivationCopy(feedback!).body).toContain("Subscription");
  });
});
