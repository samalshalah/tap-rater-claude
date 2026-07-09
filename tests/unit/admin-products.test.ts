import { describe, expect, it } from "vitest";
import { createBlankAdminProduct } from "@/lib/admin-products";

describe("admin products", () => {
  it("creates a blank product draft for the admin create form", () => {
    const product = createBlankAdminProduct();

    expect(product).toMatchObject({
      slug: "",
      title: "",
      sku: "",
      categorySlug: "google-review-stands",
      basePriceCents: 0,
      stockStatus: "instock",
      shortDescription: "",
      description: "",
      serviceMode: "basic_redirect",
      requiresSubscription: false,
      requiresLandingPage: false,
      activationType: "free_basic_activation",
      includedServiceLabel: "Free basic activation",
      images: [],
      variants: [],
      isActive: false
    });
  });
});
