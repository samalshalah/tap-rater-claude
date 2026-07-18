import Link from "next/link";
import type { Metadata } from "next";
import { standCategories } from "@/data/stand-categories";
import { getActiveProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop by Stand Category",
  description: "Browse every Tap Rater NFC stand grouped by stand category -- review, social, appointment, feedback, menu, website, payment, loyalty, custom, and hosted tap page stands.",
  alternates: {
    canonical: "/shop/stands"
  }
};

export default async function ShopStandsPage() {
  const products = getActiveProducts();

  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Shop by stand</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">
            Every stand category.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-6 text-muted">
            Ten stand categories, from review stands to hosted Tap Rater pages. Pick a category to see every stand inside it.
          </p>
          <div className="mt-6">
            <Link href="/shop/by-stand" className="text-[13px] font-medium text-brand hover:text-brand-dark">
              Prefer a flat list? Browse every stand by name &rsaquo;
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {standCategories
              .map((category) => ({
                category,
                count: products.filter((product) => product.standCategorySlug === category.slug).length
              }))
              .filter(({ count }) => count > 0)
              .map(({ category, count }) => (
                <Link
                  key={category.slug}
                  href={`/shop/stands/${category.slug}`}
                  className="rounded-2xl bg-white p-6 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <p className="text-[15px] font-medium text-ink">{category.name}</p>
                  <p className="mt-2 text-[13px] leading-5 text-muted">{category.description}</p>
                  <p className="mt-4 text-[13px] font-medium text-brand">{count} products &rsaquo;</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
