import { migratedProducts, type MigratedProduct } from "@/data/migrated-products";
import { extendedCatalogProducts } from "@/data/extended-catalog";
import { useCases } from "@/data/use-cases";
import { productImageOverrides } from "@/data/product-image-overrides";

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
// extension. This is the ONLY array that should be treated as the canonical
// product list -- everything else (products.ts, product-repository.ts, cart,
// checkout) should read from here.
//
// Data model (2026-07-17 correction):
// - CATEGORY (standCategorySlug) = what kind of stand this is (review, social,
//   appointment, etc.) -- one category per product.
// - SLUG = the permanent URL for a product or a category. Never used for use-case
//   membership.
// - TAGS = which business/use-case(s) a product belongs to. A product's tags
//   include every UseCase.slug that recommends it, so /use/[slug] pages query
//   products by tag (product.tags.includes(useCaseSlug)), not by a hardcoded
//   per-use-case product list. This is what actually lets one product appear on
//   many Shop by Use pages without ever being duplicated as a separate product.
export const allProducts: MigratedProduct[] = [...migratedProducts, ...extendedCatalogProducts].map((product) => {
  const overrideSrc = productImageOverrides[product.slug];
  const useCaseTags = useCaseSlugsByProduct.get(product.slug) ?? [];
  const mergedTags = Array.from(new Set([...(product.tags ?? []), ...useCaseTags]));

  return {
    ...product,
    tags: mergedTags,
    useCaseSlugs: useCaseTags.length > 0 ? useCaseTags : (product.useCaseSlugs ?? []),
    images: overrideSrc ? [{ src: overrideSrc, alt: `Tap Rater ${product.title}` }] : product.images
  };
});

// The actual query mechanism behind every Shop by Use / /use/[slug] page: which
// products belong to a use case is determined by product.tags, full stop --
// never by a product's slug. Order is a display nicety only (it follows the
// curation order originally authored on the UseCase, purely for presentation;
// it plays no part in *whether* a product is included).
export function getProductsForUseCase(useCaseSlug: string, orderHint: string[] = []): MigratedProduct[] {
  const tagged = allProducts.filter((product) => product.isActive && product.tags?.includes(useCaseSlug));
  const orderIndex = new Map(orderHint.map((slug, index) => [slug, index]));
  return [...tagged].sort((a, b) => {
    const aIndex = orderIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = orderIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}
