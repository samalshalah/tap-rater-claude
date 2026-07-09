import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getActiveProducts } from "@/lib/products";

export default function HomePage() {
  const products = getActiveProducts();

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-brand">Tap Rater NFC Products</p>
          <h1 className="mt-3 text-4xl font-bold text-ink md:text-6xl">Get more customer reviews with one tap.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Tap Rater stands and plates help customers open your Google, Facebook, Yelp, or feedback link instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
              Shop products
            </Link>
            <Link href="/setup-new-taprater" className="rounded-md border border-line px-5 py-3 text-sm font-bold text-ink">
              Setup TapRater
            </Link>
          </div>
        </div>
        <div className="rounded-md bg-gray-50 p-6">
          <ProductCard product={products[0]} />
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-2xl font-bold text-ink">Popular products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
