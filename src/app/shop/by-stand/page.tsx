import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getStorefrontProducts } from "@/lib/product-repository";
import { formatPrice, getProductPriceCents } from "@/lib/products";
import { standSpotlights as spotlights, standSpotlightOrder as order } from "@/data/stand-spotlights";

export const metadata: Metadata = {
  title: "Shop by Stand",
  description: "Browse every Tap Rater NFC stand by name — Google, Yelp, Facebook, TripAdvisor, social, appointments, menu, and feedback.",
  alternates: {
    canonical: "/shop/by-stand"
  }
};

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
          <div className="relative mx-auto mt-8 aspect-[16/7] w-full max-w-[1100px] overflow-hidden rounded-2xl">
            <Image
              src="/uploads/heroes/shop-by-stand-hero.jpg"
              alt="Waiter smiling at a restaurant cash register"
              fill
              priority
              className="object-cover"
            />
          </div>
          <h1 className="mx-auto mt-8 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">
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
