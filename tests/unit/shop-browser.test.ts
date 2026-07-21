import { describe, expect, it } from "vitest";
import { filterAndSortProducts } from "@/lib/shop-browser";
import { allProducts } from "@/data/catalog";

const activeProducts = allProducts.filter((p) => p.isActive);

describe("shop product search/filter/sort", () => {
  it("returns all active products when query is empty and category is 'all'", () => {
    const result = filterAndSortProducts(activeProducts, { query: "", categorySlug: "all", sort: "relevance" });
    expect(result.length).toBe(activeProducts.length);
  });

  it("matches by product title, case-insensitively", () => {
    const result = filterAndSortProducts(activeProducts, { query: "google", categorySlug: "all", sort: "relevance" });
    expect(result.some((p) => p.slug === "google-review-stand")).toBe(true);
    expect(result.every((p) => p.title.toLowerCase().includes("google") || p.searchKeywords?.some((k) => k.includes("google")))).toBe(true);
  });

  it("matches by searchKeywords even when the query doesn't appear in the title", () => {
    // "review us on google" is a search keyword on google-review-stand but not
    // literally in its title "Google Review Stand" -- confirms keyword search works.
    const result = filterAndSortProducts(activeProducts, { query: "review us on google", categorySlug: "all", sort: "relevance" });
    expect(result.some((p) => p.slug === "google-review-stand")).toBe(true);
  });

  it("filters by category", () => {
    const result = filterAndSortProducts(activeProducts, { query: "", categorySlug: "reviews", sort: "relevance" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.categorySlug === "reviews")).toBe(true);
  });

  it("combines a text query with a category filter (both conditions, not either)", () => {
    const result = filterAndSortProducts(activeProducts, { query: "google", categorySlug: "reviews", sort: "relevance" });
    expect(result.every((p) => p.categorySlug === "reviews")).toBe(true);
    // Should exclude a same-keyword product from a different category if one existed
    expect(result.length).toBeGreaterThan(0);
  });

  it("sorts by price ascending and descending", () => {
    const low = filterAndSortProducts(activeProducts, { query: "", categorySlug: "all", sort: "price_low" });
    const high = filterAndSortProducts(activeProducts, { query: "", categorySlug: "all", sort: "price_high" });

    for (let i = 1; i < low.length; i++) {
      expect(low[i].basePriceCents).toBeGreaterThanOrEqual(low[i - 1].basePriceCents);
    }
    for (let i = 1; i < high.length; i++) {
      expect(high[i].basePriceCents).toBeLessThanOrEqual(high[i - 1].basePriceCents);
    }
  });

  it("sorts alphabetically by name", () => {
    const result = filterAndSortProducts(activeProducts, { query: "", categorySlug: "all", sort: "name" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].title.localeCompare(result[i - 1].title)).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns an empty array for a query that matches nothing", () => {
    const result = filterAndSortProducts(activeProducts, { query: "zzz-nonexistent-product-zzz", categorySlug: "all", sort: "relevance" });
    expect(result).toEqual([]);
  });

  it("does not mutate the original products array (sorting must not have side effects)", () => {
    const originalOrder = activeProducts.map((p) => p.slug);
    filterAndSortProducts(activeProducts, { query: "", categorySlug: "all", sort: "price_low" });
    expect(activeProducts.map((p) => p.slug)).toEqual(originalOrder);
  });
});
