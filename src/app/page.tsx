import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { getHomepageContent } from "@/lib/cms-repository";
import { formatPrice, getActiveProducts, getProductPriceCents } from "@/lib/products";
import { faqJsonLd, JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Google Review NFC Stands, Plates and Tap Cards",
  description:
    "Shop Tap Rater NFC review stands and plates for Google reviews, Facebook reviews, Yelp reviews, customer feedback, and local business reputation growth.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Google Review NFC Stands and Plates | Tap Rater",
    description:
      "Help customers tap their phone to open your review link. Built for restaurants, salons, clinics, retail stores, and local service businesses.",
    url: "/"
  }
};

const platformBlocks = [
  {
    name: "Google",
    copy: "Send customers directly to your Google review flow from the counter, front desk, or table.",
    color: "border-t-blue-500"
  },
  {
    name: "Facebook",
    copy: "Use a Tap Rater stand for your Facebook recommendation or review destination.",
    color: "border-t-indigo-500"
  },
  {
    name: "Yelp",
    copy: "Create a simple tap path for service businesses that rely on Yelp discovery.",
    color: "border-t-red-500"
  }
];

const benefits = [
  "Reduce friction when asking customers for a Google review",
  "No app required for customers on modern NFC-enabled phones",
  "Reusable hardware with changeable review links",
  "Good fit for counters, checkout desks, salons, clinics, restaurants, cafes, and repair shops"
];

const faqs = [
  {
    question: "What is an NFC review stand?",
    answer:
      "An NFC review stand is a countertop display with an NFC chip inside. Customers tap their phone on the stand and it opens your Google review, Facebook review, Yelp review, survey, or feedback link."
  },
  {
    question: "Can Tap Rater open my Google review link?",
    answer:
      "Yes. Tap Rater can be configured to open your Google review link so customers can leave a review from the counter, reception desk, table, checkout area, or service desk."
  },
  {
    question: "Can I change the review link later?",
    answer:
      "Yes. Tap Rater products are designed for reusable review links. If your Google, Facebook, Yelp, or custom feedback destination changes, you can request a link update."
  },
  {
    question: "Do customers need to install an app?",
    answer:
      "No. Customers do not need a special app. Modern NFC-enabled phones can open the review link in the browser after a tap."
  }
];

const useCases = [
  {
    title: "Restaurants and cafes",
    copy: "Place a Google review NFC stand at checkout, the host stand, or the pickup counter so guests can review while the experience is fresh."
  },
  {
    title: "Salons, spas, and clinics",
    copy: "Use a review stand at reception to help satisfied clients quickly open your review link after an appointment."
  },
  {
    title: "Retail and repair shops",
    copy: "Make it easy for customers to leave a review after a purchase, repair pickup, consultation, or support visit."
  },
  {
    title: "Local service businesses",
    copy: "Use Tap Rater as a portable review request tool for offices, service desks, counters, events, and customer-facing teams."
  }
];

export default async function HomePage() {
  const homepage = await getHomepageContent();
  const products = getActiveProducts();
  const featured = products[0];
  const plate = products.find((product) => product.slug.includes("plate")) ?? products[1];
  const bundle = products.find((product) => product.slug.includes("bundle")) ?? products[4];
  const categories = [
    {
      title: "Review Stands",
      copy: "Countertop NFC stands for high-traffic customer touchpoints.",
      href: "/shop",
      image: featured.images[0].src,
      alt: featured.images[0].alt
    },
    {
      title: "Review Plates",
      copy: "Low-profile plates for desks, tables, and compact spaces.",
      href: `/product/${plate.slug}`,
      image: plate.images[0].src,
      alt: plate.images[0].alt
    },
    {
      title: "Business Bundles",
      copy: "Discounted multi-piece sets for teams and multiple locations.",
      href: `/product/${bundle.slug}`,
      image: bundle.images[0].src,
      alt: bundle.images[0].alt
    }
  ];

  return (
    <div>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={faqJsonLd(faqs)} />
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1440px] gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[minmax(0,610px)_1fr] lg:items-center lg:px-10">
        <div className="relative z-10">
          <div className="absolute -left-16 top-44 hidden h-64 flex-col items-center gap-3 2xl:flex">
            <span className="h-20 w-px bg-ink" />
            <span className="rotate-180 text-xs font-black uppercase text-ink [writing-mode:vertical-rl]">Scroll to explore</span>
            <span className="h-20 w-px bg-ink" />
          </div>
          <p className="text-sm font-black uppercase text-brand">{homepage.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[1.06] text-ink md:text-7xl">{homepage.heroTitle}</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted md:text-xl">
            {homepage.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={homepage.primaryButtonHref} className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
              {homepage.primaryButtonLabel}
            </Link>
            <Link href={homepage.secondaryButtonHref} className="rounded-md border border-line px-5 py-3 text-sm font-bold text-ink">
              {homepage.secondaryButtonLabel}
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-md border border-line px-3 py-4">
              <p className="text-xl font-bold text-ink">7</p>
              <p className="mt-1 text-muted">Products</p>
            </div>
            <div className="rounded-md border border-line px-3 py-4">
              <p className="text-xl font-bold text-ink">NFC</p>
              <p className="mt-1 text-muted">Tap ready</p>
            </div>
            <div className="rounded-md border border-line px-3 py-4">
              <p className="text-xl font-bold text-ink">3+</p>
              <p className="mt-1 text-muted">Platforms</p>
            </div>
          </div>
        </div>
        <div className="relative min-h-[480px] lg:min-h-[700px]">
          <div className="absolute right-4 top-4 z-10 rounded-sm bg-accent px-4 py-3 text-xs font-black uppercase text-ink">
            {homepage.featuredBadge}
          </div>
          <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-4 lg:flex">
            <span className="text-sm font-black text-ink">02</span>
            <span className="h-28 w-px bg-ink" />
            <span className="text-sm font-black text-muted">04</span>
          </div>
          <div className="absolute left-0 top-8 h-[80%] w-[62%]">
            <Image src={featured.images[0].src} alt={featured.images[0].alt} fill priority className="object-contain object-left" />
          </div>
          <div className="absolute right-14 top-8 h-[30%] w-[42%] opacity-90">
            <Image src={plate.images[0].src} alt={plate.images[0].alt} fill className="object-contain" />
          </div>
          <div className="absolute bottom-12 right-8 h-[28%] w-[42%] opacity-90">
            <Image src={plate.images[0].src} alt={plate.images[0].alt} fill className="object-contain" />
          </div>
          <div className="absolute bottom-0 left-8 right-8 z-10 border-l border-line bg-white/90 p-5 shadow-sm backdrop-blur sm:left-24 sm:right-20">
            <p className="text-sm font-black uppercase text-brand">{homepage.featuredLabel}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-ink">{featured.title}</h2>
                <p className="mt-1 text-sm text-muted">{featured.shortDescription}</p>
              </div>
              <p className="text-2xl font-black text-ink">{formatPrice(getProductPriceCents(featured))}</p>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase text-brand">Product Categories</p>
            <h2 className="mt-3 text-3xl font-black text-ink">Shop by Tap Rater type</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">Choose the Google review stand, NFC review plate, or business bundle that matches where your customers are most likely to leave a review.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.title} href={category.href} className="group block border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] bg-gray-50">
                <Image src={category.image} alt={category.alt} fill className="object-contain p-5 transition group-hover:scale-105" />
              </div>
              <div className="mt-5">
                <h2 className="font-bold text-ink">{category.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{category.copy}</p>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[360px_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-brand">How Tap Rater works</p>
          <h2 className="mt-3 text-3xl font-bold text-ink">A simpler Google review request at the exact right moment.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1", "Choose the NFC review product", "Pick the stand, plate, or bundle that fits your customer flow."],
            ["2", "Send your review link", "Use setup to connect your Google review link, Facebook review link, Yelp link, or custom feedback page."],
            ["3", "Customers tap and review", "Place Tap Rater where customers already check out, finish service, or interact with staff."]
          ].map(([step, title, copy]) => (
            <article key={step} className="rounded-md border border-line p-5">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-sm font-bold text-white">{step}</span>
              <h3 className="mt-4 font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-brand">Business benefits</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Built for daily use, not a one-time campaign.</h2>
            <div className="mt-6 grid gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex gap-3 rounded-md bg-white p-4">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                  <p className="text-sm leading-6 text-muted">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {platformBlocks.map((platform) => (
              <article key={platform.name} className={`rounded-md border border-line border-t-4 ${platform.color} bg-white p-5`}>
                <h3 className="text-xl font-bold text-ink">{platform.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{platform.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-brand">Who uses Tap Rater?</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">NFC review stands for local businesses that depend on trust.</h2>
            <p className="mt-4 text-muted">
              Customers searching for your business often compare Google reviews, Yelp reviews, and social proof before they call, book, or visit. Tap Rater helps make review collection part of the customer experience instead of a follow-up chore.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="border border-line p-5">
                <h3 className="font-bold text-ink">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{useCase.copy}</p>
              </article>
            ))}
          </div>
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

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="rounded-md bg-ink p-8 text-white">
          <p className="text-sm font-semibold uppercase text-accent">Google review bundle</p>
          <h2 className="mt-3 text-3xl font-bold">Google Review NFC Bundle for More Customer Touchpoints</h2>
          <p className="mt-4 leading-7 text-gray-300">{bundle.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <p className="text-3xl font-bold">{formatPrice(getProductPriceCents(bundle))}</p>
            {bundle.salePriceCents ? <p className="text-sm text-gray-300 line-through">{formatPrice(bundle.basePriceCents)}</p> : null}
          </div>
          <Link href={`/product/${bundle.slug}`} className="mt-7 inline-block rounded-md bg-accent px-5 py-3 text-sm font-bold text-ink">
            View bundle
          </Link>
        </div>
        <div className="relative aspect-square rounded-md bg-gray-50">
          <Image src={bundle.images[0].src} alt={bundle.images[0].alt} fill className="object-contain p-8" />
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-brand">Questions</p>
              <h2 className="mt-3 text-3xl font-bold text-ink">Tap Rater basics</h2>
            </div>
            <Link href="/faqs" className="text-sm font-bold text-brand">
              View all FAQs
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-md border border-line p-5">
                <h3 className="font-bold text-ink">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
