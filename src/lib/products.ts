import { migratedProducts, type MigratedProduct } from "@/data/migrated-products";

export function getActiveProducts(): MigratedProduct[] {
  return migratedProducts.filter((product) => product.isActive);
}

export function getProductBySlug(slug: string): MigratedProduct | undefined {
  return migratedProducts.find((product) => product.slug === slug && product.isActive);
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
