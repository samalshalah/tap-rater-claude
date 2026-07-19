import type { MigratedProduct } from "@/data/migrated-products";
import { getCategoryBySlug } from "@/lib/products";

// Deliberately not importing absoluteUrl from @/lib/seo here: that file also
// exports a JSX component (JsonLd), and pulling it into this otherwise-plain
// module breaks Vitest's parser for anything that imports this file in tests.
// This is the same "https://taprater.com" fallback used everywhere else.
function absoluteUrl(path: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taprater.com";
  return new URL(path, siteUrl).toString();
}

// The generic "photo coming soon" placeholder -- products still on this
// shouldn't go into a real commerce feed. See docs/catalog-structure.md for
// how many products this currently excludes.
export const FEED_PLACEHOLDER_IMAGE_SUFFIX = "/uploads/products/no-photo-available.png";

const FEED_COLUMNS = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "sale_price",
  "link",
  "image_link",
  "brand",
  "product_type",
  "google_product_category"
] as const;

export function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function formatPriceUsd(cents: number): string {
  return `${(cents / 100).toFixed(2)} USD`;
}

export function hasRealPhoto(product: MigratedProduct): boolean {
  const image = product.images?.[0];
  return Boolean(image && !image.src.endsWith(FEED_PLACEHOLDER_IMAGE_SUFFIX));
}

export function buildFacebookCatalogRow(product: MigratedProduct): Record<string, string> {
  const category = getCategoryBySlug(product.categorySlug);

  return {
    id: product.slug,
    title: product.title,
    description: product.description || product.shortDescription,
    availability: product.stockStatus === "instock" ? "in stock" : "out of stock",
    condition: "new",
    price: formatPriceUsd(product.basePriceCents),
    sale_price: product.salePriceCents ? formatPriceUsd(product.salePriceCents) : "",
    link: absoluteUrl(`/product/${product.slug}`),
    image_link: absoluteUrl(product.images[0].src),
    brand: "Tap Rater",
    product_type: category?.title ?? product.categorySlug,
    // Meta doesn't have a dedicated "NFC tap stand" Google product category,
    // so this is intentionally left blank rather than guessing a misleading
    // one. Fill in once you've reviewed Meta's category taxonomy.
    google_product_category: ""
  };
}

export function buildFacebookCatalogCsv(allProducts: MigratedProduct[]): string {
  const eligible = allProducts.filter((product) => product.isActive && hasRealPhoto(product));
  const rows = eligible.map((product) => {
    const row = buildFacebookCatalogRow(product);
    return FEED_COLUMNS.map((column) => csvEscape(row[column] ?? "")).join(",");
  });

  return [FEED_COLUMNS.join(","), ...rows].join("\n");
}
