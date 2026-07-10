import { ProductCard } from "@/components/product/product-card";
import { getStorefrontProducts } from "@/lib/product-repository";
import { getCatalogCategories } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop NFC Review, Social, Appointment, Menu, and Feedback Products",
  description:
    "Shop Tap Rater Phase 1 tabletop NFC stands and flat NFC plates for reviews, social, booking, menu, and experience flows.",
  alternates: {
    canonical: "/shop"
  }
};

export default async function ShopPage() {
  const products = await getStorefrontProducts();
  const categories = getCatalogCategories();

  return (
    <>
      <section className="border-b border-line bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-brand">Tap Rater shop</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-ink md:text-5xl">
              Shop NFC products by customer use case
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              Phase 1 products are physical tabletop stands and low-profile plates, grouped by purpose: reviews, social media, appointments, menu, and feedback. Each product supports free basic activation, connects to one destination URL, and is tap or scan ready.
            </p>
          </div>
          <div className="grid gap-3 rounded-md border border-line bg-white p-5">
            <p className="text-sm font-bold uppercase text-ink">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {["Google Review Stand", "Yelp Review Plate", "Book Your Next Visit Stand", "View Our Menu Plate", "Rate Your Experience Stand"].map((term) => (
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
            Categories are organized around what customers are trying to do. Inside each category, choose the physical format that fits the space: stand or plate.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="rounded-md border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-bold uppercase text-brand">{category.eyebrow}</p>
              <h3 className="mt-2 text-lg font-black text-ink">{category.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{category.buyerIntent}</p>
              <p className="mt-4 text-sm font-bold text-ink">
                {products.filter((product) => product.categorySlug === category.slug).length} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 md:grid-cols-3">
          <article className="rounded-md border border-line bg-white p-5">
            <p className="text-xs font-black uppercase text-brand">Amazon-ready</p>
            <h2 className="mt-2 text-xl font-black text-ink">No monthly fee required for basic activation</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Basic redirect products can open a permanent Tap Rater URL and forward directly to your selected review, booking, social, or custom link.
            </p>
          </article>
          <article className="rounded-md border border-line bg-white p-5">
            <p className="text-xs font-black uppercase text-brand">Platform optional</p>
            <h2 className="mt-2 text-xl font-black text-ink">Optional premium dashboard available</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Hosted landing pages, analytics, and dashboard features are optional for products that need platform-powered flows.
            </p>
          </article>
          <article className="rounded-md border border-line bg-white p-5">
            <p className="text-xs font-black uppercase text-brand">Compliant prompts</p>
            <h2 className="mt-2 text-xl font-black text-ink">Tap or scan to share your experience</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Tap Rater copy focuses on making links easier to open without making rating guarantees or filtering who can respond.
            </p>
          </article>
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
