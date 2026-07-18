import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Tap Rater collects, uses, and protects your information.",
  alternates: {
    canonical: "/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[720px] px-6">
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Legal</p>
        <h1 className="mt-4 text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">Privacy Policy</h1>
        <p className="mt-3 text-[13px] text-muted">
          Last updated: [DATE — fill in when published]. This is a starting draft, not legal advice — have it reviewed before
          publishing.
        </p>

        <div className="prose-legal mt-10 space-y-8 text-[15px] leading-7 text-ink">
          <div>
            <h2 className="text-[20px] font-semibold text-ink">1. Who we are</h2>
            <p className="mt-3 text-muted">
              Tap Rater ("we," "us," "our") sells NFC tap stands and hosted landing pages for local businesses at{" "}
              <span className="font-medium text-ink">[LEGAL BUSINESS NAME]</span>, [BUSINESS ADDRESS — required for many privacy
              laws]. You can reach us at{" "}
              <a href="mailto:support@taprater.com" className="text-brand hover:text-brand-dark">
                support@taprater.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">2. Information we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
              <li>
                <span className="font-medium text-ink">Order information</span> — name, email, shipping address, and payment
                details you provide at checkout. Payment card details are handled directly by Stripe; we never see or store your
                full card number.
              </li>
              <li>
                <span className="font-medium text-ink">Account information</span> — email address, for customer login and order
                history.
              </li>
              <li>
                <span className="font-medium text-ink">Device and destination data</span> — the destination link(s) you connect
                to your Tap Rater stand, and basic tap/scan analytics (timestamp, coarse location, referrer) so you can see how
                your stand is performing.
              </li>
              <li>
                <span className="font-medium text-ink">Contact form submissions</span> — anything you send us through our contact,
                setup, or change-link request forms.
              </li>
              <li>
                <span className="font-medium text-ink">Usage data</span> — standard web analytics (pages visited, browser type)
                collected automatically when you use our site.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">3. How we use your information</h2>
            <p className="mt-3 text-muted">We use the information above to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
              <li>Process and fulfill your orders, including custom-printed stands</li>
              <li>Activate and operate your Tap Rater device or hosted landing page</li>
              <li>Send order confirmations, shipping updates, and respond to support requests</li>
              <li>Improve our products and this website</li>
              <li>Comply with legal and tax obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">4. Sharing your information</h2>
            <p className="mt-3 text-muted">
              We share information with service providers who help us run the business — payment processing (Stripe), email
              delivery (Resend), and hosting/infrastructure (Cloudflare). We do not sell your personal information to third
              parties.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">5. Data retention</h2>
            <p className="mt-3 text-muted">
              We retain order and account information for as long as needed to provide our services and comply with legal
              obligations (typically tax and accounting requirements of [X] years — confirm with an accountant for your
              jurisdiction).
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">6. Your rights</h2>
            <p className="mt-3 text-muted">
              Depending on where you live, you may have the right to access, correct, delete, or export your personal
              information. Contact{" "}
              <a href="mailto:support@taprater.com" className="text-brand hover:text-brand-dark">
                support@taprater.com
              </a>{" "}
              to make a request.
              {/* If you have customers in the EU/UK or California, add GDPR/CCPA-specific
                  language here (right to opt out of sale, data protection officer contact, etc.) */}
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">7. Cookies</h2>
            <p className="mt-3 text-muted">
              We use cookies and similar technologies for essential site function and basic analytics. See our cookie banner for
              choices available to you.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">8. Changes to this policy</h2>
            <p className="mt-3 text-muted">
              We may update this policy from time to time. We'll update the "Last updated" date above when we do.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-ink">9. Contact us</h2>
            <p className="mt-3 text-muted">
              Questions about this policy? Email{" "}
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
