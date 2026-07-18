import { describe, expect, it } from "vitest";
import { createBlankAdminProduct, getAdminProducts } from "@/lib/admin-products";

describe("admin products", () => {
  it("reads the full catalog-v2 product list (168 active), not the stale 18-product Phase 1 array", async () => {
    // Regression test: getAdminProducts() used to import migratedProducts
    // directly, bypassing src/data/catalog.ts's merge of the extended
    // catalog-v2 products. That meant the admin dashboard showed 18 products
    // (with plates!) while the storefront showed 168.
    const products = await getAdminProducts();
    const active = products.filter((product) => product.isActive);

    expect(active.length).toBe(168);
    expect(products.map((p) => p.title)).toContain("Trustpilot Review Stand");
    expect(products.map((p) => p.title)).toContain("Instagram Stand");
    // The 8 plates are still visible to admin as drafts (isActive: false) --
    // that's correct, not a bug. What matters is none of them are active.
    expect(active.map((p) => p.title)).not.toContain("Google Review Plate");
  });

  it("creates a blank product draft for the admin create form", () => {
    const product = createBlankAdminProduct();

    expect(product).toMatchObject({
      slug: "",
      title: "",
      sku: "",
      categorySlug: "reviews",
      format: "stand",
      basePriceCents: 0,
      stockStatus: "instock",
      shortDescription: "",
      description: "",
      productType: "physical_redirect",
      serviceMode: "basic_redirect",
      checkoutMode: "buy_now",
      requiresAccount: false,
      requiresSubscription: false,
      requiresLandingPage: false,
      activationType: "free_basic_activation",
      includedServiceLabel: "Free basic activation",
      customizationOptions: ["standard_design", "add_logo", "custom_design"],
      allowsLogoUpload: true,
      allowsCustomDesign: true,
      designMode: "standard",
      images: [],
      variants: [],
      isActive: false
    });
  });
});
