import Link from "next/link";
import type { Metadata } from "next";
import { useCases } from "@/data/use-cases";

export const metadata: Metadata = {
  title: "Shop by Use Case",
  description: "Browse Tap Rater NFC stands by business type -- restaurants, dealerships, hotels, healthcare, salons, home services, and more.",
  alternates: {
    canonical: "/shop/use"
  }
};

export default function ShopUseCasesPage() {
  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Shop by use</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">
            Find your business type.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-6 text-muted">
            Fifteen business types, each with its own recommended stands in the order that works best for that business.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <Link
                key={useCase.slug}
                href={`/use/${useCase.slug}`}
                className="rounded-2xl bg-white p-6 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <p className="text-[15px] font-medium text-ink">{useCase.name}</p>
                <p className="mt-2 text-[13px] leading-5 text-muted">{useCase.description}</p>
                <p className="mt-4 text-[13px] font-medium text-brand">{useCase.recommendedProductSlugs.length} recommended products &rsaquo;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
