import { describe, expect, it } from "vitest";
import {
  getActiveProducts,
  getCatalogCategories,
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory
} from "@/lib/products";
import { standCategories } from "@/data/stand-categories";
import { useCases } from "@/data/use-cases";
import { getProductsForUseCase } from "@/data/catalog";

describe("catalog categories", () => {
  it("exposes SEO category groups for the shop, including the 3 new catalog-v2 buckets", () => {
    const categories = getCatalogCategories();

    expect(categories.map((category) => category.title)).toEqual([
      "Review Products",
      "Social Media Products",
      "Appointment Products",
      "Menu Products",
      "Feedback Products",
      "Business Bundles",
      "Website & Link Products",
      "Payment, Tip & Donation Products",
      "Loyalty & Rewards Products"
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
      displayText: "Review us on Google",
      standCategorySlug: "review-stands",
      destinationType: "review",
      platformSlug: "google"
    });
  });

  it("makes standard, logo, and custom design available on every direct_link_stand (physical_redirect) product", () => {
    const products = getActiveProducts().filter((product) => product.productType === "physical_redirect");

    expect(products.length).toBeGreaterThan(150);
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

  it("groups the catalog by customer use case category, now spanning far more than the original Phase 1 SKUs", () => {
    const reviewProducts = getProductsByCategory("reviews");
    const socialProducts = getProductsByCategory("social-media");
    const appointmentProducts = getProductsByCategory("appointments");
    const menuProducts = getProductsByCategory("menu");
    const feedbackProducts = getProductsByCategory("feedback");

    expect(reviewProducts.length).toBe(59);
    expect(socialProducts.length).toBe(14);
    expect(appointmentProducts.length).toBe(19);
    expect(menuProducts.length).toBe(24);
    expect(feedbackProducts.length).toBe(15);
    expect(reviewProducts.every((product) => product.format === "stand")).toBe(true);
  });

  it("includes the full catalog-v2 stand/use-case restructure as active storefront products (plates discontinued)", () => {
    const products = getActiveProducts();
    const titles = products.map((product) => product.title);

    expect(products.length).toBe(181);
    expect(titles).toEqual(
      expect.arrayContaining([
        "Google Review Stand",
        "Facebook Review Stand",
        "Yelp Review Stand",
        "TripAdvisor Review Stand",
        "Rate Your Experience Stand",
        "Follow Us on Social Media Stand",
        "Book Your Next Visit Stand",
        "View Our Menu Stand",
        "Custom NFC Stand",
        "Hosted Landing Page Subscription",
        "Trustpilot Review Stand",
        "DealerRater Review Stand",
        "Healthgrades Review Stand",
        "Zillow Review Stand",
        "Instagram Stand",
        "Book Appointment Stand",
        "Share Your Feedback Stand",
        "View Menu Stand",
        "Visit Our Website Stand",
        "Donate Now Stand",
        "Join Rewards Stand",
        "Custom Review Stand",
        "Hosted Tap Page Stand"
      ])
    );
    expect(titles).not.toContain("Google Review Plate");
    expect(titles).not.toContain("Google Review NFC Card");
    expect(titles).not.toContain("Employee Review Name Tag");
    expect(titles).not.toContain("Staff Review Tracking Page");
    expect(titles).not.toContain("Business Review Starter Kit");
    expect(titles).not.toContain("SureCritic Review Stand");
  });

  it("models Custom NFC Stand as a managed, request-quote physical product that can point to a direct link or a hosted landing page", () => {
    const product = getActiveProducts().find((item) => item.slug === "custom-nfc-stand");

    expect(product).toBeDefined();
    expect(product?.productType).toBe("physical_managed");
    expect(product?.checkoutMode).toBe("request_quote");
    expect(product?.format).toBe("stand");
    expect(product?.requiresSubscription).toBe(false);
    expect(product?.standCategorySlug).toBe("custom-stands");
  });

  it("models Hosted Landing Page Subscription as a contact-sales platform product requiring an account and subscription", () => {
    const product = getActiveProducts().find((item) => item.slug === "hosted-landing-page-subscription");

    expect(product).toBeDefined();
    expect(product?.productType).toBe("platform_landing_page");
    expect(product?.checkoutMode).toBe("contact_sales");
    expect(product?.requiresAccount).toBe(true);
    expect(product?.requiresSubscription).toBe(true);
    expect(product?.requiresLandingPage).toBe(true);
  });

  it("keeps menu products menu-only (across the whole menu-info-stands category, not just Phase 1)", () => {
    const menuProducts = getActiveProducts().filter((product) => product.standCategorySlug === "menu-info-stands" || product.slug === "view-our-menu-stand");

    expect(menuProducts.length).toBe(24);
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

  it("gives every active product a unique slug", () => {
    const products = getActiveProducts();
    const slugs = products.map((product) => product.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every active product a standCategorySlug", () => {
    const products = getActiveProducts();
    const missing = products.filter((product) => !product.standCategorySlug);

    expect(missing.map((product) => product.slug)).toEqual([]);
  });

  it("gives every active product a useCaseSlugs array (may be empty, but must exist)", () => {
    const products = getActiveProducts();

    expect(products.every((product) => Array.isArray(product.useCaseSlugs))).toBe(true);
  });

  it("resolves every standCategory's products to real, active product slugs", () => {
    const products = getActiveProducts();
    const slugSet = new Set(products.map((product) => product.slug));

    for (const category of standCategories) {
      const productsInCategory = products.filter((product) => product.standCategorySlug === category.slug);
      expect(productsInCategory.length).toBeGreaterThan(0);
      for (const product of productsInCategory) {
        expect(slugSet.has(product.slug)).toBe(true);
      }
    }
  });

  it("resolves every useCase.recommendedProductSlugs and featuredProductSlugs to a real, active product", () => {
    const products = getActiveProducts();
    const slugSet = new Set(products.map((product) => product.slug));

    for (const useCase of useCases) {
      for (const slug of useCase.recommendedProductSlugs) {
        expect(slugSet.has(slug)).toBe(true);
      }
      for (const slug of useCase.featuredProductSlugs) {
        expect(slugSet.has(slug)).toBe(true);
      }
    }
  });

  it("has no plate, card, badge, or name tag product active", () => {
    const products = getActiveProducts();
    const bannedPattern = /\bplate\b|\bcard\b|\bbadge\b|name tag/i;

    const offenders = products.filter((product) => bannedPattern.test(product.title));
    expect(offenders.map((p) => p.title)).toEqual([]);
  });

  it("requires a subscription for every hosted_tap_page_stand (platform_landing_page) product", () => {
    const hostedProducts = getActiveProducts().filter((product) => product.standCategorySlug === "hosted-tap-page-stands");

    expect(hostedProducts.length).toBe(8);
    expect(hostedProducts.every((product) => product.requiresSubscription === true)).toBe(true);
    expect(hostedProducts.every((product) => product.productType === "platform_landing_page")).toBe(true);
  });

  it("never requires a subscription for direct_link_stand (physical_redirect) products", () => {
    const directLinkProducts = getActiveProducts().filter((product) => product.productType === "physical_redirect");

    expect(directLinkProducts.every((product) => product.requiresSubscription === false)).toBe(true);
  });

  it("/use/auto-dealer-repair includes Google, DealerRater, Cars.com, Social/Follow, Custom, and Hosted Tap Page, in the specified order", () => {
    const useCase = useCases.find((item) => item.slug === "auto-dealer-repair");

    expect(useCase).toBeDefined();
    expect(useCase?.recommendedProductSlugs).toEqual([
      "google-review-stand",
      "yelp-review-stand",
      "facebook-review-stand",
      "dealerrater-review-stand",
      "cars-com-review-stand",
      "cargurus-review-stand",
      "edmunds-review-stand",
      "autotrader-review-stand",
      "carfax-review-stand",
      "schedule-service-stand",
      "book-appointment-stand",
      "rate-your-experience-stand",
      "social-media-stand",
      "follow-us-stand",
      "request-a-quote-stand",
      "auto-service-menu-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]);
    const slugs = useCase!.recommendedProductSlugs;
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("all 15 use cases exist with non-empty recommendedProductSlugs", () => {
    expect(useCases.length).toBe(15);
    expect(useCases.every((useCase) => useCase.recommendedProductSlugs.length > 0)).toBe(true);
  });

  it("determines Shop by Use membership via product.tags, not via slugs or duplicated products", () => {
    const google = getProductBySlug("google-review-stand");

    expect(google?.tags).toContain("auto-dealer-repair");
    expect(google?.tags).toContain("restaurants-cafes");
    // Same product, many use cases -- no duplicate "google-review-stand-for-dealerships" SKU exists.
    expect(getActiveProducts().filter((p) => p.title === "Google Review Stand")).toHaveLength(1);
  });

  it("getProductsForUseCase queries by tag membership and matches the authored use-case list exactly", () => {
    const useCase = useCases.find((u) => u.slug === "auto-dealer-repair")!;
    const byTag = getProductsForUseCase(useCase.slug, useCase.recommendedProductSlugs);

    expect(byTag.map((p) => p.slug)).toEqual(useCase.recommendedProductSlugs);
    expect(byTag.every((p) => p.tags?.includes("auto-dealer-repair"))).toBe(true);
  });

  it("never uses a tag as a product or category URL", () => {
    const products = getActiveProducts();
    for (const product of products) {
      for (const tag of product.tags ?? []) {
        expect(product.slug).not.toBe(tag);
      }
    }
  });
});
