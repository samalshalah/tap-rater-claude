import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Tap Rater's return and refund policy for stands, custom stands, and hosted pages.",
  alternates: {
    canonical: "/refund-policy"
  }
};

export default function RefundPolicyPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[720px] px-6">
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Legal</p>
        <h1 className="mt-4 text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">Refund Policy</h1>
        <p className="mt-3 text-[13px] text-muted">
          Last updated: [DATE — fill in when published]. This is a starting draft — confirm the exact windows and conditions
          match how you actually want to run the business before publishing.
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-ink">
          <div>
            <h2 className="text-[20px] font-semibold text-ink">Direct-link stands (pre-designed)</h2>
            <p className="mt-3 text-muted">
              Unused, unopened direct-link stands can be returned within{" "}
              <span className="font-medium text-ink">[30 days — confirm]</span> of delivery for a full refund, minus original
              shipping costs. Contact{" "}
              <a href="mailto:support@taprater.com" className="text-brand hover:text-brand-dark">
                support@taprater.com
              </a>{" "}
              to start a return.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">Custom printed stands</h2>
            <p className="mt-3 text-muted">
              Because custom stands are made to order with your logo, business name, and headline, they{" "}
              <span className="font-medium text-ink">cannot be returned or refunded once you've approved the design proof and
              production has started</span>
              , except in the case of a manufacturing defect or an error on our part. Before approving your proof, review it
              carefully — that approval is the point of no return.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">Hosted Tap Page subscriptions</h2>
            <p className="mt-3 text-muted">
              You can cancel your hosted page subscription at any time; cancellation takes effect at the end of the current
              billing period. [Confirm: refunds for partial billing periods — typically none, but state it explicitly.]
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">Damaged or defective items</h2>
            <p className="mt-3 text-muted">
              If your stand arrives damaged or isn't working correctly, contact us within{" "}
              <span className="font-medium text-ink">[14 days — confirm]</span> of delivery with a photo of the issue, and we'll
              send a replacement or issue a full refund at no cost to you.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">How refunds are processed</h2>
            <p className="mt-3 text-muted">
              Approved refunds are issued to your original payment method through Stripe, typically within 5–10 business days
              depending on your bank.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">Questions</h2>
            <p className="mt-3 text-muted">
              Email{" "}
              <a href="mailto:support@taprater.com" className="text-brand hover:text-brand-dark">
                support@taprater.com
              </a>{" "}
              and we'll help.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
