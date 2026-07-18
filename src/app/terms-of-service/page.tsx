import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Tap Rater's website and products.",
  alternates: {
    canonical: "/terms-of-service"
  }
};

export default function TermsOfServicePage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[720px] px-6">
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Legal</p>
        <h1 className="mt-4 text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">Terms of Service</h1>
        <p className="mt-3 text-[13px] text-muted">
          Last updated: [DATE — fill in when published]. This is a starting draft, not legal advice — have it reviewed before
          publishing.
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink">
          <div>
            <h2 className="text-[20px] font-semibold text-ink">1. Agreement to terms</h2>
            <p className="mt-3 text-muted">
              By using taprater.com or purchasing from Tap Rater ("we," "us"), operated by{" "}
              <span className="font-medium text-ink">[LEGAL BUSINESS NAME]</span>, you agree to these terms. If you don't agree,
              please don't use the site.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">2. Products</h2>
            <p className="mt-3 text-muted">
              We sell three kinds of products: direct-link NFC stands (pre-designed, open one destination link), custom printed
              NFC stands (your logo, business name, and headline — design details collected and approved after purchase), and
              hosted Tap Rater pages (a subscription product that opens a hosted landing page with multiple links). Every
              product's page states which of these applies and whether a subscription is required.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">3. Orders and payment</h2>
            <p className="mt-3 text-muted">
              All payments are processed securely through Stripe. Prices are listed in USD and don't include applicable sales
              tax, which is calculated at checkout based on your shipping address. We reserve the right to refuse or cancel any
              order.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">4. Custom products</h2>
            <p className="mt-3 text-muted">
              Custom printed stands require your approval of a design proof before production begins. Once you approve a proof,
              production starts and the order can no longer be changed or canceled. You're responsible for ensuring you have the
              rights to any logo, image, or text you provide us.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">5. Hosted Tap Page subscriptions</h2>
            <p className="mt-3 text-muted">
              Hosted Tap Page products require an active subscription. Subscriptions renew automatically until canceled. If a
              subscription lapses, the associated stand will stop opening the hosted page.
              {/* Fill in exact billing cycle, cancellation process, and any
                  proration/refund rules once subscription billing is live. */}
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">6. Shipping and returns</h2>
            <p className="mt-3 text-muted">
              See our{" "}
              <a href="/shipping-policy" className="text-brand hover:text-brand-dark">
                Shipping Policy
              </a>{" "}
              and{" "}
              <a href="/refund-policy" className="text-brand hover:text-brand-dark">
                Refund Policy
              </a>{" "}
              for details.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">7. Acceptable use</h2>
            <p className="mt-3 text-muted">
              You agree not to use Tap Rater products or this site for unlawful purposes, to mislead customers, or to link to
              illegal, deceptive, or harmful content.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">8. Limitation of liability</h2>
            <p className="mt-3 text-muted">
              Tap Rater products are provided "as is." To the maximum extent permitted by law, we are not liable for indirect,
              incidental, or consequential damages arising from your use of our products or site.
              {/* This section in particular should be reviewed by a lawyer familiar
                  with your state's consumer protection laws. */}
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">9. Governing law</h2>
            <p className="mt-3 text-muted">These terms are governed by the laws of [STATE/JURISDICTION].</p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">10. Changes to these terms</h2>
            <p className="mt-3 text-muted">
              We may update these terms from time to time. Continued use of the site after changes means you accept the updated
              terms.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">11. Contact us</h2>
            <p className="mt-3 text-muted">
              Questions about these terms? Email{" "}
              <a href="mailto:support@taprater.com" className="text-brand hover:text-brand-dark">
                support@taprater.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
