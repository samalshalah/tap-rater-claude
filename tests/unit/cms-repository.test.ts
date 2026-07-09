import { describe, expect, it, vi } from "vitest";
import {
  getDefaultHomepageContent,
  saveHomepageContent,
  savePageContent,
  saveProductContent,
  type CmsDbClient
} from "@/lib/cms-repository";

function createDbClient() {
  const upsert = vi.fn().mockResolvedValue({ error: null });
  const from = vi.fn(() => ({ upsert }));
  return { client: { from } as unknown as CmsDbClient, from, upsert };
}

describe("cms repository", () => {
  it("provides default homepage content", () => {
    const content = getDefaultHomepageContent();

    expect(content.heroTitle).toContain("Google reviews");
    expect(content.primaryButtonHref).toBe("/shop");
  });

  it("stores homepage content in site_content", async () => {
    const db = createDbClient();
    const content = getDefaultHomepageContent();

    await saveHomepageContent(db.client, content);

    expect(db.from).toHaveBeenCalledWith("site_content");
    expect(db.upsert).toHaveBeenCalledWith({
      key: "homepage",
      type: "homepage",
      status: "published",
      payload: content
    });
  });

  it("stores editable page content by slug", async () => {
    const db = createDbClient();

    await savePageContent(db.client, {
      slug: "about-us",
      title: "About Tap Rater",
      seoTitle: "About Tap Rater",
      seoDescription: "About Tap Rater NFC review products.",
      body: "Tap Rater helps businesses collect reviews.",
      status: "draft"
    });

    expect(db.upsert).toHaveBeenCalledWith({
      key: "page:about-us",
      type: "page",
      status: "draft",
      payload: {
        slug: "about-us",
        title: "About Tap Rater",
        seoTitle: "About Tap Rater",
        seoDescription: "About Tap Rater NFC review products.",
        body: "Tap Rater helps businesses collect reviews.",
        status: "draft"
      }
    });
  });

  it("maps product content to product database columns", async () => {
    const db = createDbClient();

    await saveProductContent(db.client, {
      slug: "google-review-white-stand",
      title: "White Stand - Google Review",
      sku: "TRATER01",
      categorySlug: "google-review-stands",
      basePriceCents: 4900,
      salePriceCents: undefined,
      stockStatus: "instock",
      shortDescription: "Short product text",
      description: "Long product text",
      seoTitle: "SEO title",
      seoDescription: "SEO description",
      isActive: true
    });

    expect(db.from).toHaveBeenCalledWith("products");
    expect(db.upsert).toHaveBeenCalledWith({
      slug: "google-review-white-stand",
      title: "White Stand - Google Review",
      sku: "TRATER01",
      category_slug: "google-review-stands",
      base_price_cents: 4900,
      sale_price_cents: null,
      stock_status: "instock",
      short_description: "Short product text",
      description: "Long product text",
      seo_title: "SEO title",
      seo_description: "SEO description",
      is_active: true
    });
  });
});
