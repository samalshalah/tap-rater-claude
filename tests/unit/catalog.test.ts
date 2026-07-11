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
      "Review Products",
      "Social Media Products",
      "Appointment Products",
      "Menu Products",
      "Feedback Products",
      "Business Bundles",
    ]);
  });

  it("resolves a category by slug", () => {
    const category = getCategoryBySlug("business-bundles");

    expect(category?.title).toBe("Business Bundles");
    expect(category?.seoTitle).toContain("Business Bundles");
  });

  it("filters active products by category", () => {
    const products = getProductsByCategory("reviews");

    expect(products.map((product) => product.title)).toContain("Google Review Stand");
    expect(products.every((product) => product.categorySlug === "reviews")).toBe(true);
  });

  it("keeps old category slugs working as aliases", () => {
    const category = getCategoryBySlug("google-review-stands");
    const products = getProductsByCategory("google-review-stands");

    expect(category?.slug).toBe("reviews");
    expect(products.map((product) => product.title)).toContain("Google Review Stand");
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
          product.includedServiceLabel.length > 0 &&
          ["stand", "plate", "bundle", "platform"].includes(product.format) &&
          Array.isArray(product.customizationOptions) &&
          product.customizationOptions.length > 0 &&
          typeof product.allowsLogoUpload === "boolean" &&
          typeof product.allowsCustomDesign === "boolean" &&
          ["standard", "logo", "custom"].includes(product.designMode)
        );
      })
    ).toBe(true);

    expect(getProductBySlug("google-review-stand")).toMatchObject({
      title: "Google Review Stand",
      productType: "physical_redirect",
      serviceMode: "basic_redirect",
      checkoutMode: "buy_now",
      requiresAccount: false,
      requiresSubscription: false,
      requiresLandingPage: false,
      supportedDestinations: ["google"],
      includedServiceLabel: "Free basic activation",
      format: "stand",
      customizationOptions: ["standard_design", "add_logo", "custom_design"],
      allowsLogoUpload: true,
      allowsCustomDesign: true,
      designMode: "standard",
      displayText: "Review us on Google"
    });
  });

  it("makes standard, logo, and custom design available on every Phase 1 physical product", () => {
    const products = getActiveProducts();

    expect(
      products.every((product) => {
        return (
          product.customizationOptions.includes("standard_design") &&
          product.customizationOptions.includes("add_logo") &&
          product.customizationOptions.includes("custom_design") &&
          product.allowsLogoUpload &&
          product.allowsCustomDesign &&
          product.designMode === "standard"
        );
      })
    ).toBe(true);
  });

  it("groups Phase 1 products by customer use case (stands only, plates discontinued)", () => {
    const reviewProducts = getProductsByCategory("reviews");
    const socialProducts = getProductsByCategory("social-media");
    const appointmentProducts = getProductsByCategory("appointments");
    const menuProducts = getProductsByCategory("menu");
    const feedbackProducts = getProductsByCategory("feedback");

    expect(reviewProducts).toHaveLength(4);
    expect(socialProducts).toHaveLength(1);
    expect(appointmentProducts).toHaveLength(1);
    expect(menuProducts).toHaveLength(1);
    expect(feedbackProducts).toHaveLength(1);
    expect(reviewProducts.every((product) => product.format === "stand")).toBe(true);
  });

  it("includes only the Phase 1 stand catalog as active storefront products (plates discontinued)", () => {
    const products = getActiveProducts();
    const titles = products.map((product) => product.title);

    expect(products).toHaveLength(8);
    expect(titles).toEqual(
      expect.arrayContaining([
        "Google Review Stand",
        "Facebook Review Stand",
        "Yelp Review Stand",
        "TripAdvisor Review Stand",
        "Rate Your Experience Stand",
        "Follow Us on Social Media Stand",
        "Book Your Next Visit Stand",
        "View Our Menu Stand"
      ])
    );
    expect(titles).not.toContain("Google Review Plate");
    expect(titles).not.toContain("Google Review NFC Card");
    expect(titles).not.toContain("Employee Review Name Tag");
    expect(titles).not.toContain("Staff Review Tracking Page");
    expect(titles).not.toContain("Business Review Starter Kit");
  });

  it("keeps menu products menu-only", () => {
    const menuProducts = getActiveProducts().filter((product) => product.slug.includes("menu"));

    expect(menuProducts).toHaveLength(1);
    expect(JSON.stringify(menuProducts)).not.toMatch(/wifi/i);
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
