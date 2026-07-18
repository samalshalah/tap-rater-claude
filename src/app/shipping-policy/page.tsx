import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Tap Rater's shipping timelines, costs, and carrier information.",
  alternates: {
    canonical: "/shipping-policy"
  }
};

export default function ShippingPolicyPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[720px] px-6">
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Legal</p>
        <h1 className="mt-4 text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">Shipping Policy</h1>
        <p className="mt-3 text-[13px] text-muted">
          Last updated: [DATE — fill in when published]. Fill in the bracketed specifics to match your actual fulfillment setup
          before publishing.
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink">
          <div>
            <h2 className="text-[20px] font-semibold text-ink">Processing time</h2>
            <p className="mt-3 text-muted">
              Direct-link stands (pre-designed) typically ship within{" "}
              <span className="font-medium text-ink">[1–2 business days — confirm]</span> of your order. Custom printed stands
              ship within <span className="font-medium text-ink">[X business days — confirm]</span> after you approve your
              design proof, since production only starts once you approve it.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">Shipping methods and cost</h2>
            <p className="mt-3 text-muted">
              [List your carrier(s) — e.g., USPS, UPS — and whether shipping is flat-rate, free over a threshold, or calculated
              at checkout. Example: "Standard shipping is $X, or free on orders over $Y. Estimated delivery is 3–7 business days
              within the continental US."]
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">Order tracking</h2>
            <p className="mt-3 text-muted">
              Once your order ships, you'll receive a confirmation email with tracking information.
              {/* This depends on your fulfillment process -- update once that's built. */}
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">International shipping</h2>
            <p className="mt-3 text-muted">
              [State whether you currently ship internationally. If not: "We currently ship within the United States only."]
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">Lost or delayed packages</h2>
            <p className="mt-3 text-muted">
              If your order hasn't arrived within the estimated delivery window, contact{" "}
              <a href="mailto:support@taprater.com" className="text-brand hover:text-brand-dark">
                support@taprater.com
              </a>{" "}
              and we'll help track it down.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
