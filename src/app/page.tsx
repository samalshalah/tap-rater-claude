import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BarChart3, CheckCircle2, FileText, LayoutDashboard, Link2, MapPin, MousePointerClick, Smartphone } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { getStorefrontProducts } from "@/lib/product-repository";
import { getCatalogCategories } from "@/lib/products";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "NFC Review Stands and Smart Reputation Pages",
  description:
    "Tap Rater sells NFC stands and plates for reviews, social links, menus, booking pages, feedback forms, and future hosted reputation platform features.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "NFC Review Stands and Smart Reputation Pages | Tap Rater",
    description:
      "Premium NFC stands and plates for local business actions, with optional logo, custom design, setup, tracking, and hosted page features.",
    url: "/"
  }
};

const featuredProductSlugs = [
  "google-review-stand",
  "google-review-plate",
  "yelp-review-stand",
  "tripadvisor-review-stand",
  "follow-us-social-media-stand",
  "book-your-next-visit-stand",
  "view-our-menu-stand",
  "rate-your-experience-stand"
];

const buyerPaths = [
  {
    title: "Ready-Made Stands & Plates",
    copy: "Use standard Tap Rater designs for reviews, social media, appointments, menus, and feedback.",
    href: "/shop",
    label: "Shop products"
  },
  {
    title: "Add Logo or Custom Design",
    copy: "Add your business logo or request a custom layout for branded counters and reception areas.",
    href: "/contact-us?design=custom",
    label: "Request design"
  },
  {
    title: "Hosted Pages & Tracking",
    copy: "Use Tap Rater hosted pages, device tracking, feedback forms, and business dashboards when you need more than one direct link.",
    href: "#platform-preview",
    label: "Explore platform"
  }
];

const useCaseCards = [
  {
    title: "Reviews",
    copy: "Google, Yelp, Facebook, TripAdvisor",
    slug: "reviews"
  },
  {
    title: "Social Media",
    copy: "Facebook, X, Instagram, YouTube",
    slug: "social-media"
  },
  {
    title: "Appointments",
    copy: "Booking pages, calendars, scheduling links",
    slug: "appointments"
  },
  {
    title: "Menu",
    copy: "Restaurant, cafe, or service menu",
    slug: "menu"
  },
  {
    title: "Feedback",
    copy: "Rate your experience and customer feedback forms",
    slug: "feedback"
  }
];

const howItWorks = [
  "Choose a use case",
  "Pick stand or plate",
  "Select standard, logo, or custom design",
  "Activate your Tap Rater link",
  "Customers tap or scan",
  "Track activity as platform features are enabled"
];

const platformFeatures = [
  {
    title: "Device activation",
    copy: "Permanent Tap Rater links can be assigned to each NFC or QR device.",
    icon: Smartphone
  },
  {
    title: "Destination management",
    copy: "Connect each device to a review, social, menu, booking, feedback, or hosted page destination.",
    icon: Link2
  },
  {
    title: "Tap tracking",
    copy: "Track activity as platform analytics are enabled across active devices.",
    icon: BarChart3
  },
  {
    title: "Hosted pages",
    copy: "Use Tap Rater pages when one direct link is not enough for the business flow.",
    icon: LayoutDashboard
  },
  {
    title: "Feedback forms",
    copy: "Collect private feedback through hosted forms without review-gating language.",
    icon: FileText
  },
  {
    title: "Multi-location ready",
    copy: "The platform model is designed for businesses with several locations and tap points.",
    icon: MapPin
  }
];

export default async function HomePage() {
  const products = await getStorefrontProducts();
  const catalogCategories = getCatalogCategories();
  const featuredProducts = featuredProductSlugs.flatMap((slug) => {
    const product = products.find((item) => item.slug === slug);
    return product ? [product] : [];
  });
  const heroProduct = products.find((product) => product.slug === "google-review-stand") ?? products[0];
  const heroPlate = products.find((product) => product.slug === "google-review-plate") ?? products.find((product) => product.format === "plate") ?? heroProduct;

  const categoryCards = useCaseCards.flatMap((card) => {
    const category = catalogCategories.find((item) => item.slug === card.slug);
    const product = products.find((item) => item.categorySlug === card.slug);

    if (!category || !product) {
      return [];
    }

    return [
      {
        ...card,
        href: `/category/${category.slug}`,
        image: product.images[0]
      }
    ];
  });

  return (
    <main className="bg-white text-ink">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand">Tap Rater for local businesses</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-ink sm:text-6xl lg:text-7xl">
              NFC review stands and smart reputation pages for local businesses.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Help customers tap or scan to open reviews, social links, menus, booking pages, feedback forms, or hosted Tap Rater pages - with setup and tracking options built in.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="inline-flex items-center justify-center rounded-md bg-ink px-6 py-4 text-sm font-black text-white transition hover:bg-brand">
                Shop NFC Products
              </Link>
              <Link href="#platform-preview" className="inline-flex items-center justify-center rounded-md border border-line bg-white px-6 py-4 text-sm font-black text-ink transition hover:border-ink">
                Explore Platform Options
              </Link>
            </div>
            <div className="mt-10 grid gap-4 text-sm text-muted sm:grid-cols-3">
              {["Stands and plates", "Logo or custom design", "Hosted pages later"].map((item) => (
                <p key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="relative min-h-[520px] lg:min-h-[650px]">
            <div className="absolute inset-x-12 bottom-0 h-12 rounded-full bg-gray-200/70 blur-2xl" />
            <div className="absolute left-0 top-0 h-[78%] w-[58%]">
              {heroProduct ? (
                <Image src={heroProduct.images[0].src} alt={heroProduct.images[0].alt} fill priority className="object-contain object-left" />
              ) : null}
            </div>
            <div className="absolute right-0 top-12 w-[48%] rounded-[2rem] border border-line bg-white p-5 shadow-xl">
              <div className="rounded-[1.5rem] border border-line bg-gray-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-muted">Dashboard preview</p>
                    <h2 className="mt-1 text-xl font-black text-ink">Tap Rater</h2>
                  </div>
                  <MousePointerClick className="h-6 w-6 text-brand" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ["Devices", "16"],
                    ["Taps", "1.2k"],
                    ["Destinations", "8"],
                    ["Feedback", "42"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md bg-white p-4">
                      <p className="text-2xl font-black text-ink">{value}</p>
                      <p className="mt-1 text-xs font-bold uppercase text-muted">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-3">
                  {["Review stand", "Social media stand", "Feedback plate"].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-md bg-white px-4 py-3">
                      <span className="text-sm font-bold text-ink">{item}</span>
                      <span className="text-xs font-black uppercase text-brand">{index === 0 ? "Active" : "Ready"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute bottom-12 right-6 h-[28%] w-[36%] rounded-md bg-white/80 p-3 shadow-sm">
              {heroPlate ? <Image src={heroPlate.images[0].src} alt={heroPlate.images[0].alt} fill className="object-contain p-4" /> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand">Buyer paths</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-ink md:text-5xl">Start simple. Grow into the platform.</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {buyerPaths.map((path) => (
              <Link key={path.title} href={path.href} className="group rounded-md bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-2xl font-black text-ink">{path.title}</h3>
                <p className="mt-4 min-h-24 text-base leading-7 text-muted">{path.copy}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-brand">
                  {path.label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand">Use cases</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-ink md:text-5xl">What do you want customers to open?</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {categoryCards.map((category) => (
              <Link key={category.slug} href={category.href} className="group rounded-md bg-gray-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
                <div className="relative aspect-square">
                  <Image src={category.image.src} alt={category.image.alt} fill className="object-contain p-3 transition group-hover:scale-105" />
                </div>
                <h3 className="mt-4 text-xl font-black text-ink">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{category.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-brand">How it works</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-ink md:text-5xl">From product to tap point in a simple flow.</h2>
            </div>
            <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
              {howItWorks.map((step, index) => (
                <article key={step} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-black text-white">{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-black text-ink">{step}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{getStepCopy(index)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-brand">Featured products</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-ink md:text-5xl">Stands and plates for the most common customer actions.</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-black text-brand">
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="platform-preview" className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-accent">Platform preview</p>
              <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">More than a sign. A reputation platform.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-300">Platform features are being activated in phases.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {platformFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article key={feature.title} className="rounded-md bg-white/10 p-6 ring-1 ring-white/10">
                    <Icon className="h-6 w-6 text-accent" />
                    <h3 className="mt-5 text-xl font-black">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-300">{feature.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black leading-tight text-ink md:text-6xl">Launch your first tap point.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Start with a standard stand or plate. Add your logo, custom design, or hosted pages when your business is ready.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="inline-flex items-center justify-center rounded-md bg-ink px-6 py-4 text-sm font-black text-white transition hover:bg-brand">
              Shop NFC Products
            </Link>
            <Link href="/contact-us?design=custom" className="inline-flex items-center justify-center rounded-md border border-line bg-white px-6 py-4 text-sm font-black text-ink transition hover:border-ink">
              Request Custom Design
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function getStepCopy(index: number) {
  const copy = [
    "Choose reviews, social media, appointments, menu, feedback, or a hosted page flow.",
    "Use the format that fits the counter, reception desk, table, or service area.",
    "Start with the Tap Rater template, add a logo, or request a custom layout.",
    "Connect the permanent Tap Rater URL to the selected business destination.",
    "Customers use the physical prompt at the point of service.",
    "Tap data and hosted features can expand as the platform is enabled."
  ];

  return copy[index] ?? "";
}
