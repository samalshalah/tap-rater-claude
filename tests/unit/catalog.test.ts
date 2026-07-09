import { describe, expect, it } from "vitest";
import {
  getActiveProducts,
  getCatalogCategories,
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory
} from "@/lib/products";

describe("catalog categories", () => {
  it("exposes SEO category groups for the shop", () => {
    const categories = getCatalogCategories();

    expect(categories.map((category) => category.title)).toEqual([
      "Google Review Stands",
      "Review Plates",
      "Business Bundles",
      "Social & Booking Stands",
      "Feedback & Referral Stands",
      "Custom UV Printed Stands"
    ]);
  });

  it("resolves a category by slug", () => {
    const category = getCategoryBySlug("business-bundles");

    expect(category?.title).toBe("Business Bundles");
    expect(category?.seoTitle).toContain("Business Bundles");
  });

  it("filters active products by category", () => {
    const products = getProductsByCategory("google-review-stands");

    expect(products.map((product) => product.slug)).toContain("google-review-white-stand");
    expect(products.every((product) => product.categorySlug === "google-review-stands")).toBe(true);
  });

  it("keeps old category slugs working as aliases", () => {
    const category = getCategoryBySlug("google-review-plates");
    const products = getProductsByCategory("google-review-plates");

    expect(category?.slug).toBe("review-plates");
    expect(products.map((product) => product.slug)).toContain("google-review-white-plate");
  });

  it("adds product strategy metadata to every active product", () => {
    const products = getActiveProducts();

    expect(products.length).toBeGreaterThan(0);
    expect(
      products.every((product) => {
        return (
          ["physical_redirect", "physical_managed", "platform_landing_page", "bundle"].includes(product.productType) &&
          ["basic_redirect", "managed_redirect", "hosted_landing_page", "multi_location_platform"].includes(product.serviceMode) &&
          ["buy_now", "request_quote", "subscription", "contact_sales"].includes(product.checkoutMode) &&
          typeof product.requiresAccount === "boolean" &&
          typeof product.requiresSubscription === "boolean" &&
          typeof product.requiresLandingPage === "boolean" &&
          product.activationType.length > 0 &&
          product.includedServiceLabel.length > 0
        );
      })
    ).toBe(true);

    expect(getProductBySlug("google-review-white-stand")).toMatchObject({
      productType: "physical_redirect",
      serviceMode: "basic_redirect",
      checkoutMode: "buy_now",
      requiresAccount: false,
      requiresSubscription: false,
      requiresLandingPage: false,
      includedServiceLabel: "Free basic activation"
    });
    expect(getProductBySlug("tap-rater-business-white-bundle")).toMatchObject({
      productType: "bundle",
      serviceMode: "managed_redirect",
      checkoutMode: "buy_now",
      requiresAccount: false,
      requiresSubscription: false,
      requiresLandingPage: false
    });
    expect(getProductBySlug("tap-rater-white-stand-rate-your-experience")).toMatchObject({
      productType: "platform_landing_page",
      serviceMode: "hosted_landing_page",
      checkoutMode: "subscription",
      requiresAccount: true,
      requiresSubscription: true,
      requiresLandingPage: true
    });
  });

  it("keeps product and category copy compliant with review platform rules", () => {
    const copy = JSON.stringify({
      categories: getCatalogCategories(),
      products: getActiveProducts()
    });

    expect(copy).not.toMatch(/get 5-star reviews/i);
    expect(copy).not.toMatch(/only ask happy customers/i);
    expect(copy).not.toMatch(/reward customers for reviews/i);
    expect(copy).not.toMatch(/happy customers/i);
    expect(copy).not.toMatch(/satisfied customers/i);
  });
});
