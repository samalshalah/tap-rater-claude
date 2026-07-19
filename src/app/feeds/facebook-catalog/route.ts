import { getStorefrontProducts } from "@/lib/product-repository";
import { buildFacebookCatalogCsv } from "@/lib/product-feeds";

// Meta Commerce Manager product feed (CSV). Point Commerce Manager's
// scheduled fetch at this URL -- it's always generated live from the current
// active catalog, so it never goes stale the way a manually-exported file
// would. Scoped to products with real photography only; see
// src/lib/product-feeds.ts for why.
export async function GET() {
  const products = await getStorefrontProducts();
  const csv = buildFacebookCatalogCsv(products);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="facebook-catalog.csv"',
      "Cache-Control": "public, max-age=3600"
    }
  });
}
