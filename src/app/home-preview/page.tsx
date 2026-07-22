import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BarChart3, FileText, LayoutDashboard, Link2, MapPin, Smartphone } from "lucide-react";
import { getStorefrontProducts } from "@/lib/product-repository";
import { formatPrice, getProductPriceCents } from "@/lib/products";
import { standSpotlights } from "@/data/stand-spotlights";
import { industries } from "@/data/industries";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "NFC Review Stands and Smart Reputation Pages",
  description:
    "Tap Rater sells NFC stands for reviews, social links, menus, booking pages, feedback forms, and future hosted reputation platform features.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Tap. Scan. Review. | Tap Rater",
    description:
      "NFC stands that help local businesses collect reviews, share menus, book visits, get feedback, and grow social followers.",
    url: "/"
  }
};

const homeStandSlugs = ["google-review-stand", "follow-us-social-media-stand", "book-your-next-visit-stand", "view-our-menu-stand"];

const howItWorks = [
  { title: "Choose a use case", body: "Reviews, social, appointments, menu, feedback, or a hosted page." },
  { title: "Pick your stand", body: "Whatever fits the counter, table, or reception desk." },
  { title: "Choose a design", body: "Standard template, your logo, or a fully custom layout." },
  { title: "Activate your link", body: "Connect the permanent Tap Rater URL to your destination." },
  { title: "Customers tap or scan", body: "No app, no searching — just a single tap." },
  { title: "Track activity", body: "Tap data expands as platform features roll out." }
];

const platformFeatures = [
  { title: "Device activation", copy: "A permanent Tap Rater link for every NFC or QR device.", icon: Smartphone },
  { title: "Destination management", copy: "Point each device to a review, social, menu, or booking link.", icon: Link2 },
  { title: "Tap tracking", copy: "See activity across every active device.", icon: BarChart3 },
  { title: "Hosted pages", copy: "One page for more than one destination.", icon: LayoutDashboard },
  { title: "Feedback forms", copy: "Private feedback, collected without gating reviews.", icon: FileText },
  { title: "Multi-location ready", copy: "Built for businesses with several locations.", icon: MapPin }
];

export default async function HomePage() {
  const products = await getStorefrontProducts();
  const homeStands = homeStandSlugs.flatMap((slug) => {
    const product = products.find((item) => item.slug === slug);
    return product && standSpotlights[slug] ? [{ product, spotlight: standSpotlights[slug] }] : [];
  });
  const heroProduct = products.find((product) => product.slug === "google-review-stand") ?? products[0];

  return (
    <main className="bg-white text-ink">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white pt-16 sm:pt-24">
        <div className="mx-auto max-w-[860px] px-6 text-center">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Tap Rater for local businesses</p>
          <h1 className="mt-4 text-[42px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[64px] md:text-[76px]">
            Tap. Scan. Review.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-7 text-muted sm:text-[19px]">
            NFC stands that help customers open your reviews, socials, menu, or booking page — with a single tap.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-white transition hover:bg-brand">
              Shop NFC products
            </Link>
            <Link href="/how-it-works" className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[15px] font-medium text-brand transition hover:text-brand-dark">
              How it works &rsaquo;
            </Link>
          </div>
        </div>

        {/* Hero product visual with signature tap-ripple moment */}
        <div className="relative mx-auto mt-14 flex max-w-[520px] items-center justify-center px-6 sm:mt-20">
          <div className="relative aspect-square w-full">
            {heroProduct ? (
              <Image
                src={heroProduct.images[0].src}
                alt={heroProduct.images[0].alt}
                fill
                priority
                className="object-contain"
              />
            ) : null}
            <span className="absolute bottom-[18%] right-[20%] h-3 w-3 rounded-full bg-brand" aria-hidden="true" />
            <span className="tap-ripple absolute bottom-[18%] right-[20%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand" aria-hidden="true" />
            <span className="tap-ripple tap-ripple-delay absolute bottom-[18%] right-[20%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Shop by stand — card design matching /shop/by-stand */}
      <section className="border-t border-line bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-brand">Shop by stand</p>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tightest text-ink sm:text-[34px]">Every stand, by name.</h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeStands.map(({ product, spotlight }) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="group flex flex-col rounded-2xl bg-surface p-6 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-brand">{spotlight.eyebrow}</p>
                <h3 className="mt-2 text-[17px] font-semibold leading-tight tracking-tightest text-ink">{spotlight.headline}</h3>
                <p className="mt-2 text-[13px] leading-5 text-muted">{spotlight.subhead}</p>
                <div className="relative mt-5 aspect-square">
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    fill
                    className="object-contain transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-[14px] font-medium text-ink">{formatPrice(getProductPriceCents(product))}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/shop/by-stand" className="text-[14px] font-medium text-brand hover:text-brand-dark">
              Shop by stand &rsaquo;
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by use — card design matching /shop's industry section */}
      <section className="border-t border-line bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-brand">Shop by use</p>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tightest text-ink sm:text-[34px]">Find your industry.</h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {industries.slice(0, 4).map((industry) => (
              <Link
                key={industry.slug}
                href={`/use/${industry.useCaseSlug}`}
                className="group overflow-hidden rounded-2xl bg-white transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              >
                <div className="p-6">
                  <h3 className="text-[18px] font-semibold tracking-tightest text-ink">{industry.title}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-muted">{industry.subhead}</p>
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={industry.image}
                    alt={industry.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/shop" className="text-[14px] font-medium text-brand hover:text-brand-dark">
              Shop by use &rsaquo;
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="text-center">
            <h2 className="text-[28px] font-semibold tracking-tightest text-ink sm:text-[34px]">From product to tap point.</h2>
            <p className="mt-3 text-[15px] text-muted">Six simple steps, start to finish.</p>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-[13px] font-semibold text-ink">
                  {index + 1}
                </span>
                <div>
                  <p className="text-[15px] font-medium text-ink">{step.title}</p>
                  <p className="mt-1 text-[13px] leading-5 text-muted">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform preview — dark section */}
      <section id="platform-preview" className="border-t border-line bg-ink py-20 text-white sm:py-28">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/50">Platform preview</p>
            <h2 className="mt-4 text-[28px] font-semibold tracking-tightest sm:text-[34px]">More than a sign. A reputation platform.</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-white/60">Platform features are being activated in phases.</p>
          </div>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <Icon className="h-5 w-5 text-white/70" strokeWidth={1.5} />
                  <p className="mt-4 text-[15px] font-medium">{feature.title}</p>
                  <p className="mt-1.5 text-[13px] leading-5 text-white/60">{feature.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-line bg-white py-24 text-center sm:py-28">
        <div className="mx-auto max-w-[640px] px-6">
          <h2 className="text-[30px] font-semibold tracking-tightest text-ink sm:text-[40px]">Launch your first tap point.</h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-6 text-muted">
            Start with a standard stand. Add your logo or a custom design when you're ready.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-white transition hover:bg-brand">
              Shop NFC products
            </Link>
            <Link href="/contact-us?design=custom" className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3 text-[15px] font-medium text-ink transition hover:border-ink">
              Request custom design
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
