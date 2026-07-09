import { ProductCard } from "@/components/product/product-card";
import { getActiveProducts, getCatalogCategories, getProductsByCategory } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop NFC Review Stands and Google Review Plates",
  description:
    "Shop Tap Rater NFC review stands, Google review plates, Facebook review stands, Yelp review stands, feedback stands, and business bundles.",
  alternates: {
    canonical: "/shop"
  }
};

export default function ShopPage() {
  const products = getActiveProducts();
  const categories = getCatalogCategories();

  return (
    <>
      <section className="border-b border-line bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-brand">Tap Rater shop</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-ink md:text-5xl">
              Shop NFC review stands, plates, and business bundles
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              Choose a Tap Rater product for the review destination your customers use most. Every stand and plate is built for a clear tap-to-review moment at checkout, reception, table service, pickup, or the service counter.
            </p>
          </div>
          <div className="grid gap-3 rounded-md border border-line bg-white p-5">
            <p className="text-sm font-bold uppercase text-ink">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {["Google review stand", "NFC review plate", "Facebook review stand", "Yelp review stand", "business bundle"].map((term) => (
                <span key={term} className="rounded-full border border-line px-3 py-2 text-sm text-muted">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-brand">Shop by category</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Find the right review product faster</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted">
            Categories are organized around buying intent: Google reviews, compact plates, platform-specific stands, bundles, and flexible feedback links.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="rounded-md border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-bold uppercase text-brand">{category.eyebrow}</p>
              <h3 className="mt-2 text-lg font-black text-ink">{category.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{category.buyerIntent}</p>
              <p className="mt-4 text-sm font-bold text-ink">{getProductsByCategory(category.slug).length} products</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-brand">All products</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Tap Rater catalog</h2>
            </div>
            <p className="text-sm font-semibold text-muted">{products.length} products available</p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
