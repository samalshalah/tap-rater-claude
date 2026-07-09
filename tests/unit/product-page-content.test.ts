import { describe, expect, it } from "vitest";
import { getProductBySlug } from "@/lib/products";
import {
  getProductComparisonRows,
  getProductPageHighlights,
  getProductPageUseCases
} from "@/lib/product-page-content";

describe("product page content", () => {
  it("builds purchase highlights from the product", () => {
    const product = getProductBySlug("google-review-white-stand");

    expect(product).toBeDefined();
    expect(getProductPageHighlights(product!).map((highlight) => highlight.title)).toEqual([
      "Tap-to-review flow",
      "Configured for your link",
      "Counter-ready display",
      "Simple customer prompt"
    ]);
  });

  it("returns business use cases for local customer touchpoints", () => {
    const product = getProductBySlug("google-review-white-stand");

    expect(getProductPageUseCases(product!)).toHaveLength(4);
    expect(getProductPageUseCases(product!)[0].title).toBe("Restaurants and cafes");
  });

  it("marks the active product type in comparison rows", () => {
    const stand = getProductBySlug("google-review-white-stand");
    const bundle = getProductBySlug("tap-rater-business-white-bundle");

    expect(getProductComparisonRows(stand!).find((row) => row.label === "Stand")?.active).toBe(true);
    expect(getProductComparisonRows(bundle!).find((row) => row.label === "Bundle")?.active).toBe(true);
  });
});
