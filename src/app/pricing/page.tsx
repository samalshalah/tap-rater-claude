import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { getStorefrontProducts } from "@/lib/product-repository";
import { formatPrice, getProductPriceCents } from "@/lib/products";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Tap Rater pricing for individual NFC stands, custom printed stands, and hosted Tap Rater page subscriptions.",
  alternates: {
    canonical: "/pricing"
  }
};

export default async function PricingPage() {
  const products = await getStorefrontProducts();
  const stands = products.filter((product) => product.productType === "physical_redirect");
  const standFrom = stands.length
    ? formatPrice(Math.min(...stands.map((product) => getProductPriceCents(product))))
    : null;

  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[860px] px-6 text-center">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Pricing</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">
            Simple for stands. Custom for everything else.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-6 text-muted">
            Individual NFC stands have one listed price. Custom printed stands and hosted Tap Rater pages are quoted for your business.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1000px] gap-4 px-6 sm:grid-cols-3">
          <div className="flex flex-col rounded-2xl bg-white p-7">
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-brand">NFC Stands</p>
            <p className="mt-3 text-[32px] font-semibold tracking-tightest text-ink">{standFrom ?? "$49.00"}</p>
            <p className="text-[13px] text-muted">per stand, one time</p>
            <div className="mt-5 grid gap-2.5 text-[13px] text-muted">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> No monthly fee</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> Connects to one destination</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> Tap or scan ready</p>
            </div>
            <Link href="/shop/by-stand" className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-brand">
              Shop stands
            </Link>
          </div>

          <div className="flex flex-col rounded-2xl bg-white p-7">
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-brand">Custom Printed Stands</p>
            <p className="mt-3 text-[32px] font-semibold tracking-tightest text-ink">Custom quote</p>
            <p className="text-[13px] text-muted">based on design and volume</p>
            <div className="mt-5 grid gap-2.5 text-[13px] text-muted">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> Your logo and business name</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> Custom headline and layout</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> Points to a direct link or hosted page</p>
            </div>
            <Link href="/shop/custom" className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-brand">
              Request a quote
            </Link>
          </div>

          <div className="flex flex-col rounded-2xl bg-white p-7">
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-brand">Hosted Tap Rater Pages</p>
            <p className="mt-3 text-[32px] font-semibold tracking-tightest text-ink">Contact sales</p>
            <p className="text-[13px] text-muted">account and subscription required</p>
            <div className="mt-5 grid gap-2.5 text-[13px] text-muted">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> Multiple links on one page</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> Reviews, menu, booking, social, feedback</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} /> Pricing confirmed before setup</p>
            </div>
            <Link href="/shop/hosted-pages" className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-brand">
              Talk to sales
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-[640px] px-6 text-center text-[12px] leading-5 text-muted">
          Stand checkout runs in Stripe test mode while live payments are being finalized. Custom stand and hosted page pricing is confirmed with you directly before any order is placed.
        </p>
      </section>
    </>
  );
}
