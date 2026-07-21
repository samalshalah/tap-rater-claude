"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { filterAndSortProducts, type ShopSortOption } from "@/lib/shop-browser";
import type { CatalogCategory, MigratedProduct } from "@/data/migrated-products";

export function ShopProductBrowser({ products, categories }: { products: MigratedProduct[]; categories: CatalogCategory[] }) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState<string>("all");
  const [sort, setSort] = useState<ShopSortOption>("relevance");

  const filtered = useMemo(
    () => filterAndSortProducts(products, { query, categorySlug, sort }),
    [products, query, categorySlug, sort]
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products (e.g. Google, Instagram, menu)"
            aria-label="Search products"
            className="w-full rounded-full border border-line bg-white px-5 py-3 text-[14px] text-ink outline-none transition focus:border-ink"
          />
        </div>
        <select
          value={categorySlug}
          onChange={(event) => setCategorySlug(event.target.value)}
          aria-label="Filter by category"
          className="rounded-full border border-line bg-white px-4 py-3 text-[13px] font-medium text-ink outline-none transition focus:border-ink"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.title}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as ShopSortOption)}
          aria-label="Sort products"
          className="rounded-full border border-line bg-white px-4 py-3 text-[13px] font-medium text-ink outline-none transition focus:border-ink"
        >
          <option value="relevance">Sort: Featured</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      <p className="mt-4 text-[13px] text-muted">
        {filtered.length} of {products.length} products
        {query || categorySlug !== "all" ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategorySlug("all");
            }}
            className="ml-3 font-medium text-brand hover:text-brand-dark"
          >
            Clear filters
          </button>
        ) : null}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-line bg-surface p-10 text-center">
          <p className="text-[15px] font-medium text-ink">No products match your search.</p>
          <p className="mt-1 text-[13px] text-muted">Try a different term, or clear your filters to see everything.</p>
        </div>
      )}
    </div>
  );
}
