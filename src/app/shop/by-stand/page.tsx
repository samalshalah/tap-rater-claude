import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getStorefrontProducts } from "@/lib/product-repository";
import { formatPrice, getProductPriceCents } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop by Stand",
  description: "Browse every Tap Rater NFC stand by name — Google, Yelp, Facebook, TripAdvisor, social, appointments, menu, and feedback.",
  alternates: {
    canonical: "/shop/by-stand"
  }
};

const spotlights: Record<string, { eyebrow: string; headline: string; subhead: string }> = {
  "google-review-stand": {
    eyebrow: "Review stand",
    headline: "Capture more Google reviews.",
    subhead: "Make reviewing your business fast and contactless."
  },
  "yelp-review-stand": {
    eyebrow: "Review stand",
    headline: "Capture more Yelp reviews.",
    subhead: "Help customers leave a quick review before they go."
  },
  "facebook-review-stand": {
    eyebrow: "Review stand",
    headline: "Capture more Facebook reviews.",
    subhead: "Invite customers to leave a review with one quick tap."
  },
  "tripadvisor-review-stand": {
    eyebrow: "Review stand",
    headline: "Collect more TripAdvisor reviews.",
    subhead: "Encourage travelers to share their experience instantly."
  },
  "follow-us-social-media-stand": {
    eyebrow: "Social media stand",
    headline: "Grow your social following.",
    subhead: "Help guests connect with your brand instantly."
  },
  "book-your-next-visit-stand": {
    eyebrow: "Appointment stand",
    headline: "Book your appointment.",
    subhead: "A clean, contactless way to schedule your next visit."
  },
  "view-our-menu-stand": {
    eyebrow: "Menu stand",
    headline: "Tap to view our menu.",
    subhead: "Share your menu instantly with a quick tap."
  },
  "rate-your-experience-stand": {
    eyebrow: "Feedback stand",
    headline: "Rate your experience.",
    subhead: "Collect quick feedback in a simple contactless format."
  }
};

const order = [
  "google-review-stand",
  "yelp-review-stand",
  "facebook-review-stand",
  "tripadvisor-review-stand",
  "follow-us-social-media-stand",
  "book-your-next-visit-stand",
  "view-our-menu-stand",
  "rate-your-experience-stand"
];

export default async function ShopByStandPage() {
  const products = await getStorefrontProducts();
  const stands = order.flatMap((slug) => {
    const product = products.find((item) => item.slug === slug);
    const spotlight = spotlights[slug];
    return product && spotlight ? [{ product, spotlight }] : [];
  });

  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <div className="inline-flex rounded-full bg-surface p-1 text-[13px] font-medium">
            <Link href="/shop" className="rounded-full px-4 py-1.5 text-muted transition hover:text-ink">
              Shop by use
            </Link>
            <span className="rounded-full bg-white px-4 py-1.5 text-ink shadow-sm">Shop by stand</span>
          </div>
          <h1 className="mx-auto mt-6 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">
            Every stand, by name.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-6 text-muted">
            Eight NFC stands, one for each destination. Pick the one that matches what you want customers to open.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stands.map(({ product, spotlight }) => (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="group flex flex-col rounded-2xl bg-white p-6 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-brand">{spotlight.eyebrow}</p>
                <h2 className="mt-2 text-[18px] font-semibold leading-tight tracking-tightest text-ink">{spotlight.headline}</h2>
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
        </div>
      </section>
    </>
  );
}
