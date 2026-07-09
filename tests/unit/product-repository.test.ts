import { describe, expect, it } from "vitest";
import {
  getStorefrontProductsFromClient,
  normalizeStorefrontProductRow,
  staticStorefrontProducts
} from "@/lib/product-repository";

describe("product repository", () => {
  it("normalizes Supabase products into storefront product shape", () => {
    const product = normalizeStorefrontProductRow({
      slug: "google-review-white-stand",
      title: "Supabase Google Stand",
      sku: "SUP-1",
      category_slug: "google-review-stands",
      base_price_cents: 5900,
      sale_price_cents: null,
      stock_status: "instock",
      short_description: "Supabase short description",
      description: "Supabase full description",
      product_type: "physical_managed",
      service_mode: "managed_redirect",
      checkout_mode: "buy_now",
      requires_account: false,
      requires_subscription: false,
      requires_landing_page: false,
      activation_type: "managed_setup",
      included_service_label: "Managed setup included",
      seo_title: "Supabase SEO",
      seo_description: "Supabase description",
      search_keywords: ["supabase", "google"],
      variants: [{ id: "white", label: "White", sku: "SUP-1-W", stock_status: "instock" }],
      is_active: true
    });

    expect(product).toMatchObject({
      slug: "google-review-white-stand",
      title: "Supabase Google Stand",
      sku: "SUP-1",
      categorySlug: "google-review-stands",
      basePriceCents: 5900,
      salePriceCents: undefined,
      stockStatus: "instock",
      shortDescription: "Supabase short description",
      description: "Supabase full description",
      productType: "physical_managed",
      serviceMode: "managed_redirect",
      checkoutMode: "buy_now",
      requiresAccount: false,
      requiresSubscription: false,
      requiresLandingPage: false,
      activationType: "managed_setup",
      includedServiceLabel: "Managed setup included",
      seoTitle: "Supabase SEO",
      seoDescription: "Supabase description",
      searchKeywords: ["supabase", "google"],
      isActive: true
    });
    expect(product.images.length).toBeGreaterThan(0);
    expect(product.variants[0]).toEqual({ id: "white", label: "White", sku: "SUP-1-W", stockStatus: "instock" });
  });

  it("prefers Supabase rows when the products query succeeds", async () => {
    const products = await getStorefrontProductsFromClient(mockProductsClient([
      {
        slug: "google-review-white-stand",
        title: "Supabase Google Stand",
        sku: "SUP-1",
        category_slug: "google-review-stands",
        base_price_cents: 5900,
        sale_price_cents: 4900,
        stock_status: "instock",
        short_description: "Supabase short description",
        description: "Supabase full description",
        product_type: "physical_redirect",
        service_mode: "basic_redirect",
        checkout_mode: "buy_now",
        requires_account: false,
        requires_subscription: false,
        requires_landing_page: false,
        activation_type: "free_basic_activation",
        included_service_label: "Free basic activation",
        is_active: true
      }
    ]));

    expect(products).toHaveLength(1);
    expect(products[0].title).toBe("Supabase Google Stand");
    expect(products[0].salePriceCents).toBe(4900);
  });

  it("falls back to static products when the Supabase query fails", async () => {
    const products = await getStorefrontProductsFromClient(mockProductsClient(null, { message: "query failed" }));

    expect(products).toEqual(staticStorefrontProducts());
  });
});

function mockProductsClient(data: unknown[] | null, error: null | { message: string } = null) {
  return {
    from(table: string) {
      expect(table).toBe("products");

      return {
        select() {
          return {
            eq(column: string, value: boolean) {
              expect(column).toBe("is_active");
              expect(value).toBe(true);

              return Promise.resolve({ data, error });
            }
          };
        }
      };
    }
  };
}
