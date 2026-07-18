import { describe, expect, it } from "vitest";
import { createBlankAdminProduct, getAdminProducts, getAdminProductsFromClient } from "@/lib/admin-products";
import { allProducts } from "@/data/catalog";

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

  it("merges a saved product OVER the full catalog by slug, rather than replacing it with just the DB rows (critical safety fix, 2026-07-18)", async () => {
    const products = await getAdminProductsFromClient({
      from(table: string) {
        expect(table).toBe("products");
        return {
          select() {
            return Promise.resolve({
              data: [
                {
                  slug: "google-review-stand",
                  title: "Edited via Admin",
                  sku: "SUP-1",
                  category_slug: "reviews",
                  format: "stand",
                  base_price_cents: 4900,
                  stock_status: "instock",
                  short_description: "short",
                  description: "long",
                  product_type: "physical_redirect",
                  service_mode: "basic_redirect",
                  checkout_mode: "buy_now",
                  requires_account: false,
                  requires_subscription: false,
                  requires_landing_page: false,
                  supported_destinations: ["google"],
                  activation_type: "free_basic_activation",
                  included_service_label: "Free basic activation",
                  is_active: true
                }
              ],
              error: null
            });
          }
        };
      }
    });

    // Every product must still be present -- this is the exact bug that would
    // otherwise shrink the admin dashboard down to just 1 product the moment
    // anyone saved a single edit.
    expect(products.length).toBe(allProducts.length);
    expect(products.find((p) => p.slug === "google-review-stand")?.title).toBe("Edited via Admin");
    expect(products.find((p) => p.slug === "trustpilot-review-stand")?.title).toBe("Trustpilot Review Stand");
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
