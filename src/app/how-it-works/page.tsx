import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How Tap Rater NFC stands, custom printed stands, and hosted Tap Rater pages work, from choosing a product to tracking activity.",
  alternates: {
    canonical: "/how-it-works"
  }
};

const steps = [
  {
    title: "Choose a use case",
    body: "Reviews, social, appointments, menu, feedback, or a hosted Tap Rater page with multiple links."
  },
  {
    title: "Pick your stand",
    body: "An individual NFC stand, or a custom printed stand with your logo, business name, and headline."
  },
  {
    title: "Choose a design",
    body: "Standard template, your logo, or a fully custom layout — collected after request and approved before production."
  },
  {
    title: "Activate your link",
    body: "Connect the permanent Tap Rater URL to your destination — a direct link, or a hosted Tap Rater page."
  },
  {
    title: "Customers tap or scan",
    body: "No app, no searching — just a single tap or a quick QR scan."
  },
  {
    title: "Track activity",
    body: "Tap data expands as platform features roll out."
  }
];

const tiers = [
  {
    title: "NFC Stands",
    body: "Direct-link stands open one destination — a review page, booking link, menu, or social profile — the moment someone taps. No account or subscription required."
  },
  {
    title: "Custom Printed Stands",
    body: "The same stand, fully custom-printed with your logo, business name, and a custom headline. Points to either a direct link or a hosted Tap Rater page."
  },
  {
    title: "Hosted Tap Rater Pages",
    body: "One tap opens a hosted Tap Rater page with several links, logos, and buttons — reviews, menu, booking, social, and feedback all in one place. Requires a Tap Rater account and a subscription."
  }
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[860px] px-6 text-center">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">How it works</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">
            From product to tap point.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-6 text-muted">
            Six simple steps, start to finish — whether it's an individual stand, a custom printed stand, or a hosted Tap Rater page.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-[13px] font-semibold text-ink">
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

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="text-center">
            <h2 className="text-[26px] font-semibold tracking-tightest text-ink sm:text-[32px]">Three ways to tap.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.title} className="rounded-2xl bg-surface p-6">
                <p className="text-[15px] font-semibold text-ink">{tier.title}</p>
                <p className="mt-2 text-[13px] leading-5 text-muted">{tier.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-20 text-center sm:py-24">
        <div className="mx-auto max-w-[560px] px-6">
          <h2 className="text-[26px] font-semibold tracking-tightest text-ink sm:text-[32px]">Ready to start?</h2>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-white transition hover:bg-brand">
              Shop NFC products
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3 text-[15px] font-medium text-ink transition hover:border-ink">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
