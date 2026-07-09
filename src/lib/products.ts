import {
  catalogCategories,
  migratedProducts,
  type CatalogCategory,
  type CatalogCategorySlug,
  type MigratedProduct
} from "@/data/migrated-products";

export function getActiveProducts(): MigratedProduct[] {
  return migratedProducts.filter((product) => product.isActive);
}

export function getProductBySlug(slug: string): MigratedProduct | undefined {
  return migratedProducts.find((product) => product.slug === slug && product.isActive);
}

export function getCatalogCategories(): CatalogCategory[] {
  return catalogCategories;
}

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  return catalogCategories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: CatalogCategorySlug | string): MigratedProduct[] {
  return getActiveProducts().filter((product) => product.categorySlug === slug);
}

export function getRelatedProducts(product: MigratedProduct, limit = 3): MigratedProduct[] {
  const sameCategory = getProductsByCategory(product.categorySlug).filter((item) => item.slug !== product.slug);
  const fallback = getActiveProducts().filter((item) => item.slug !== product.slug && item.categorySlug !== product.categorySlug);

  return [...sameCategory, ...fallback].slice(0, limit);
}

export function getProductPriceCents(product: MigratedProduct): number {
  return product.salePriceCents ?? product.basePriceCents;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}
