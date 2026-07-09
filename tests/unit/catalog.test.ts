import { describe, expect, it } from "vitest";
import {
  getCatalogCategories,
  getCategoryBySlug,
  getProductsByCategory
} from "@/lib/products";

describe("catalog categories", () => {
  it("exposes SEO category groups for the shop", () => {
    const categories = getCatalogCategories();

    expect(categories.map((category) => category.slug)).toEqual([
      "google-review-stands",
      "google-review-plates",
      "review-platform-stands",
      "business-bundles",
      "feedback-stands"
    ]);
  });

  it("resolves a category by slug", () => {
    const category = getCategoryBySlug("business-bundles");

    expect(category?.title).toBe("Business Review Bundles");
    expect(category?.seoTitle).toContain("Business Review Bundles");
  });

  it("filters active products by category", () => {
    const products = getProductsByCategory("google-review-stands");

    expect(products.map((product) => product.slug)).toContain("google-review-white-stand");
    expect(products.every((product) => product.categorySlug === "google-review-stands")).toBe(true);
  });
});
