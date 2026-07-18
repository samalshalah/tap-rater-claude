import { getActiveProducts, formatPrice } from "@/lib/products";

// Inlined rather than imported from src/lib/seo.tsx -- that file also exports
// JSX components (JsonLd), and importing anything from it pulls its JSX
// through vitest's transform pipeline, which chokes on it in a way Next's own
// build does not. Simplest fix: don't cross that boundary from a plain
// data-layer module.
function absoluteUrl(path: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taprater.com";
  return new URL(path, siteUrl).toString();
}

const FEED_COLUMNS = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "brand",
  "google_product_category",
  "custom_label_0"
] as const;

function csvEscape(value: string): string {
  const needsQuoting = value.includes(",") || value.includes("\"") || value.includes("\n");
  if (!needsQuoting) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function formatMetaPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} USD`;
}

// Meta's own docs recommend a small, deliberately-scoped catalog over dumping
// the entire SKU list -- so this only includes products that are (a) active,
// (b) directly purchasable (buy_now -- Custom/Hosted products don't have a
// single fixed price and don't belong in a shopping feed), and (c) have real
// photography rather than the "photo coming soon" placeholder, since Meta's
// commerce quality bar expects real product images.
export function getMetaFeedProducts() {
  return getActiveProducts().filter(
    (product) => product.checkoutMode === "buy_now" && product.images[0] && !product.images[0].src.includes("no-photo-available")
  );
}

export function buildMetaProductFeedCsv(): string {
  const products = getMetaFeedProducts();
  const rows = [FEED_COLUMNS.join(",")];

  for (const product of products) {
    const row = [
      product.slug,
      product.title,
      product.description,
      product.stockStatus === "instock" ? "in stock" : "out of stock",
      "new",
      formatMetaPrice(product.salePriceCents ?? product.basePriceCents),
      absoluteUrl(`/product/${product.slug}`),
      absoluteUrl(product.images[0].src),
      "Tap Rater",
      "Business & Industrial > Retail Displays & Fixtures > Display Stands",
      product.standCategorySlug ?? ""
    ].map((value) => csvEscape(String(value)));

    rows.push(row.join(","));
  }

  return rows.join("\n");
}

// Exported for the admin dashboard / tests -- a quick way to show "N products
// in the feed, last updated now" without re-parsing the CSV.
export function getMetaFeedSummary() {
  const products = getMetaFeedProducts();
  return {
    productCount: products.length,
    totalActiveProducts: getActiveProducts().length,
    sampleTitles: products.slice(0, 5).map((p) => p.title),
    examplePriceFormatted: products[0] ? formatPrice(products[0].basePriceCents) : null
  };
}
