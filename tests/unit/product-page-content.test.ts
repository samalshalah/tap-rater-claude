import { describe, expect, it } from "vitest";
import { getProductBySlug } from "@/lib/products";
import {
  getProductActivationCopy,
  getProductComparisonRows,
  getProductPageHighlights,
  getProductPageUseCases,
  getProductServiceBadges,
  getStandSpecifications
} from "@/lib/product-page-content";

describe("product page content", () => {
  it("builds purchase highlights from the product", () => {
    const product = getProductBySlug("google-review-stand");

    expect(product).toBeDefined();
    expect(getProductPageHighlights(product!).map((highlight) => highlight.title)).toEqual([
      "Tap or scan ready",
      "Connects to one destination URL",
      "Countertop physical product",
      "Simple customer prompt"
    ]);
  });

  it("returns business use cases for local customer touchpoints", () => {
    const product = getProductBySlug("google-review-stand");

    expect(getProductPageUseCases(product!)).toHaveLength(4);
    expect(getProductPageUseCases(product!)[0].title).toBe("Restaurants and cafes");
  });

  it("marks the active product type in comparison rows", () => {
    const stand = getProductBySlug("google-review-stand");

    expect(getProductComparisonRows(stand!).find((row) => row.label === "Stand")?.active).toBe(true);
    expect(getProductComparisonRows(stand!).find((row) => row.label === "Plate")).toBeUndefined();
  });

  it("provides brand-adapted stand specifications with inch and cm dimensions", () => {
    const stand = getProductBySlug("google-review-stand");
    const specs = getStandSpecifications(stand!);

    expect(specs.find((row) => row.label === "Dimensions")?.value).toContain("165 × 108 × 50 mm");
    expect(specs.find((row) => row.label === "Dimensions")?.value).toContain("in");
    expect(JSON.stringify(specs)).not.toMatch(/sichuan|china|oem|odm|gs-stand/i);
  });

  it("builds customer-facing service badges from product strategy metadata", () => {
    const stand = getProductBySlug("google-review-stand");
    const feedback = getProductBySlug("rate-your-experience-stand");

    expect(getProductServiceBadges(stand!)).toEqual(["No monthly fee required", "Free basic activation"]);
    expect(getProductServiceBadges(feedback!)).toEqual(["No monthly fee required", "Free basic activation"]);
  });

  it("explains physical redirect activation", () => {
    const stand = getProductBySlug("google-review-stand");
    const feedback = getProductBySlug("rate-your-experience-stand");

    expect(getProductActivationCopy(stand!).body).toContain("redirects directly");
    expect(getProductActivationCopy(stand!).body).toContain("optional");
    expect(getProductActivationCopy(feedback!).body).toContain("redirects directly");
    expect(getProductActivationCopy(feedback!).body).toContain("No monthly fee");
  });
});
