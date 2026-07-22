import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  description:
    "Tap Rater is preparing a new storefront for NFC review stands, smart tap links, and local business reputation tools.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Tap Rater is coming soon",
    description:
      "A new storefront for NFC review stands, smart tap links, and local business reputation tools is on the way.",
    url: "/"
  }
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <section className="relative flex min-h-screen overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 hidden w-[44vw] bg-surface lg:block" aria-hidden="true" />

        <div className="relative mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-12 px-6 py-10 sm:px-8 lg:grid-cols-[1fr_440px] lg:px-10">
          <div className="max-w-[680px]">
            <Image
              src="/uploads/brand/tap-rater-logo.png"
              alt="Tap Rater"
              width={170}
              height={54}
              priority
              className="h-auto w-[150px] sm:w-[170px]"
            />
            <p className="mt-14 text-[13px] font-medium uppercase tracking-[0.08em] text-brand">
              New storefront launching soon
            </p>
            <h1 className="mt-5 max-w-[660px] text-[42px] font-semibold leading-[1.04] tracking-tightest text-ink sm:text-[62px] lg:text-[72px]">
              Tap Rater is getting ready.
            </h1>
            <p className="mt-6 max-w-[540px] text-[17px] leading-7 text-muted sm:text-[19px]">
              We are preparing the public storefront for NFC review stands, smart tap links, and local business reputation tools.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact-us"
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-7 text-[15px] font-medium text-white transition hover:bg-brand"
              >
                Contact Tap Rater
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-line px-7 text-[15px] font-medium text-ink transition hover:border-ink"
              >
                Admin login
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px] lg:max-w-none">
            <div className="absolute inset-x-8 bottom-6 h-16 rounded-[50%] bg-black/10 blur-2xl" aria-hidden="true" />
            <div className="relative flex h-full items-center justify-center rounded-[8px] border border-line bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
              <div className="relative aspect-square w-full max-w-[280px]">
                <Image
                  src="/uploads/products/v5/google-review-stand.png"
                  alt="Google review NFC stand"
                  fill
                  priority
                  sizes="(min-width: 1024px) 320px, 80vw"
                  className="object-contain"
                />
                <span className="absolute bottom-[18%] right-[21%] h-3 w-3 rounded-full bg-brand" aria-hidden="true" />
                <span className="tap-ripple absolute bottom-[18%] right-[21%] h-3 w-3 rounded-full border border-brand" aria-hidden="true" />
                <span className="tap-ripple tap-ripple-delay absolute bottom-[18%] right-[21%] h-3 w-3 rounded-full border border-brand" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
