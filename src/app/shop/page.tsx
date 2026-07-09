import { ProductCard } from "@/components/product/product-card";
import { getActiveProducts } from "@/lib/products";

export default function ShopPage() {
  const products = getActiveProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Shop Tap Rater</h1>
      <p className="mt-3 text-muted">NFC stands, plates, and bundles for customer reviews.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
