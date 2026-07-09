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
      "Google Review Products",
      "Review Platform Products",
      "Social & Booking Products",
      "Feedback & Referral Products",
      "Hosted Landing Page Products",
      "Business Bundles",
    ]);
  });

  it("resolves a category by slug", () => {
    const category = getCategoryBySlug("business-bundles");

    expect(category?.title).toBe("Business Bundles");
    expect(category?.seoTitle).toContain("Business Bundles");
  });

  it("filters active products by category", () => {
    const products = getProductsByCategory("google-review-products");

    expect(products.map((product) => product.title)).toContain("Google Review NFC Stand");
    expect(products.every((product) => product.categorySlug === "google-review-products")).toBe(true);
  });

  it("keeps old category slugs working as aliases", () => {
    const category = getCategoryBySlug("google-review-stands");
    const products = getProductsByCategory("google-review-stands");

    expect(category?.slug).toBe("google-review-products");
    expect(products.map((product) => product.title)).toContain("Google Review NFC Plate");
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
          Array.isArray(product.supportedDestinations) &&
          product.supportedDestinations.length > 0 &&
          product.activationType.length > 0 &&
          product.includedServiceLabel.length > 0
        );
      })
    ).toBe(true);

    expect(getProductBySlug("google-review-nfc-stand")).toMatchObject({
      title: "Google Review NFC Stand",
      productType: "physical_redirect",
      serviceMode: "basic_redirect",
      checkoutMode: "buy_now",
      requiresAccount: false,
      requiresSubscription: false,
      requiresLandingPage: false,
      supportedDestinations: ["google"],
      includedServiceLabel: "Free basic activation"
    });
    expect(getProductBySlug("business-review-starter-kit")).toMatchObject({
      title: "Business Review Starter Kit",
      productType: "bundle",
      serviceMode: "managed_redirect",
      checkoutMode: "request_quote",
      requiresAccount: false,
      requiresSubscription: false,
      requiresLandingPage: false
    });
    expect(getProductBySlug("multi-location-dashboard")).toMatchObject({
      title: "Multi-Location Dashboard",
      productType: "platform_landing_page",
      serviceMode: "multi_location_platform",
      checkoutMode: "contact_sales",
      requiresAccount: true,
      requiresSubscription: true,
      requiresLandingPage: true
    });
  });

  it("includes the complete Tap Rater platform catalog", () => {
    const products = getActiveProducts();
    const titles = products.map((product) => product.title);

    expect(products.length).toBeGreaterThanOrEqual(20);
    expect(titles).toEqual(
      expect.arrayContaining([
        "Google Review NFC Stand",
        "Google Review NFC Plate",
        "Google Review NFC Card",
        "Employee Review Name Tag",
        "Facebook Review Stand",
        "Yelp Review Stand",
        "TripAdvisor Review Stand",
        "Appointment Booking Stand",
        "Social Follow NFC Stand",
        "Menu / WiFi / Direct Link Stand",
        "Multi-Platform Review Page",
        "Reputation Hub Page",
        "Rate Your Experience Page",
        "Private Feedback Page",
        "Referral Request Page",
        "Social Media Hub Page",
        "Review + Feedback Combo Page",
        "Staff Review Tracking Page",
        "Multi-Location Dashboard",
        "Business Review Starter Kit"
      ])
    );
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
