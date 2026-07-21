import type { MigratedProduct } from "@/data/migrated-products";

export type ShopSortOption = "relevance" | "price_low" | "price_high" | "name";

export function filterAndSortProducts(
  products: MigratedProduct[],
  options: { query: string; categorySlug: string; sort: ShopSortOption }
): MigratedProduct[] {
  const normalizedQuery = options.query.trim().toLowerCase();

  let result = products.filter((product) => {
    const matchesCategory = options.categorySlug === "all" || product.categorySlug === options.categorySlug;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    const haystack = [product.title, product.shortDescription, ...(product.searchKeywords ?? [])].join(" ").toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  if (options.sort === "price_low") {
    result = [...result].sort((a, b) => a.basePriceCents - b.basePriceCents);
  } else if (options.sort === "price_high") {
    result = [...result].sort((a, b) => b.basePriceCents - a.basePriceCents);
  } else if (options.sort === "name") {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
}
