import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-xl font-bold">Tap Rater</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-300">
            NFC review stands and plates that make it easier for customers to leave feedback before they walk away.
          </p>
          <p className="mt-5 text-sm font-semibold text-accent">Built for Google, Facebook, Yelp, and custom review links.</p>
        </div>
        <div className="grid content-start gap-2 text-sm text-gray-300">
          <p className="mb-2 font-bold text-white">Shop</p>
          <Link href="/shop">All products</Link>
          <Link href="/product/google-review-white-stand">Google stands</Link>
          <Link href="/product/google-review-white-plate">Review plates</Link>
        </div>
        <div className="grid content-start gap-2 text-sm text-gray-300">
          <p className="mb-2 font-bold text-white">Support</p>
          <Link href="/review-links-generator">Review Links Generator</Link>
          <Link href="/setup-new-taprater">Setup New TapRater</Link>
          <Link href="/change-taprater-link">Change TapRater Link</Link>
        </div>
        <div className="grid content-start gap-2 text-sm text-gray-300">
          <p className="mb-2 font-bold text-white">Company</p>
          <Link href="/about-us">About Us</Link>
          <Link href="/faqs">FAQs</Link>
          <Link href="/contact-us">Contact</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-gray-400">
        © 2026 Tap Rater. All rights reserved.
      </div>
    </footer>
  );
}
