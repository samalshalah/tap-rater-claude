import { migratedProducts, type MigratedProduct } from "@/data/migrated-products";
import { extendedCatalogProducts } from "@/data/extended-catalog";
import { useCases } from "@/data/use-cases";

// Single source of truth for "which use cases recommend this product" --
// derived from src/data/use-cases.ts (UseCase.featuredProductSlugs /
// recommendedProductSlugs), not duplicated by hand on each product.
const useCaseSlugsByProduct = new Map<string, string[]>();
for (const useCase of useCases) {
  const allSlugs = new Set([...useCase.featuredProductSlugs, ...useCase.recommendedProductSlugs]);
  for (const slug of allSlugs) {
    const existing = useCaseSlugsByProduct.get(slug) ?? [];
    existing.push(useCase.slug);
    useCaseSlugsByProduct.set(slug, existing);
  }
}

// The full catalog: original 16 Phase 1 entries + the ~171-product catalog-v2
// extension (review/social/appointment/feedback/menu-info/website/payment/
// loyalty/custom/hosted-tap-page stands). This is the ONLY array that should be
// treated as the canonical product list -- everything else (products.ts,
// product-repository.ts, cart, checkout) should read from here.
export const allProducts: MigratedProduct[] = [...migratedProducts, ...extendedCatalogProducts].map((product) => ({
  ...product,
  useCaseSlugs: useCaseSlugsByProduct.get(product.slug) ?? product.useCaseSlugs ?? []
}));
