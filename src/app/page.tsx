import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product/product-card";
import { formatPrice, getActiveProducts, getProductPriceCents } from "@/lib/products";

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
  "No app required for customers",
  "Works on modern NFC-enabled phones",
  "Reusable hardware with changeable links",
  "Good fit for counters, checkout desks, salons, clinics, and restaurants"
];

const faqs = [
  {
    question: "Can Tap Rater open my Google review link?",
    answer: "Yes. During setup, you provide the review link you want customers to open."
  },
  {
    question: "Can I change the link later?",
    answer: "Yes. Use the Change TapRater Link request page when your destination needs to be updated."
  },
  {
    question: "Do customers need to install anything?",
    answer: "No. Customers tap with their phone and open the link in the browser."
  }
];

export default function HomePage() {
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
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1fr_520px] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-brand">Tap Rater NFC Products</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink md:text-6xl">Get more customer reviews with one tap.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
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
        <div className="relative overflow-hidden rounded-md bg-gray-50 p-5 md:p-8">
          <div className="absolute right-4 top-4 rounded-md bg-accent px-3 py-2 text-xs font-bold text-ink">
            Best seller
          </div>
          <div className="relative aspect-square">
            <Image src={featured.images[0].src} alt={featured.images[0].alt} fill priority className="object-contain p-8" />
          </div>
          <div className="rounded-md bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-brand">Featured Tap Rater</p>
            <h2 className="mt-1 text-xl font-bold text-ink">{featured.title}</h2>
            <p className="mt-2 text-sm text-muted">{featured.shortDescription}</p>
            <p className="mt-3 text-2xl font-bold text-ink">{formatPrice(getProductPriceCents(featured))}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.title} href={category.href} className="grid grid-cols-[96px_1fr] items-center gap-4 rounded-md border border-line p-4 transition hover:border-brand hover:shadow-md">
              <div className="relative aspect-square rounded-md bg-gray-50">
                <Image src={category.image} alt={category.alt} fill className="object-contain p-2" />
              </div>
              <div>
                <h2 className="font-bold text-ink">{category.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{category.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[360px_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-brand">How Tap Rater works</p>
          <h2 className="mt-3 text-3xl font-bold text-ink">A simpler review request at the exact right moment.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1", "Choose the product", "Pick the stand, plate, or bundle that fits your customer flow."],
            ["2", "Send your review link", "Use setup to connect your Google, Facebook, Yelp, or custom destination."],
            ["3", "Customers tap and review", "Place Tap Rater where customers already check out or interact with staff."]
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
          <p className="text-sm font-semibold uppercase text-accent">Bundle highlight</p>
          <h2 className="mt-3 text-3xl font-bold">{bundle.title}</h2>
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
