import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-bold text-ink">Tap Rater</p>
          <p className="mt-2 text-sm text-muted">NFC review stands and plates for local businesses.</p>
        </div>
        <div className="grid gap-2 text-sm text-muted">
          <Link href="/shop">Shop</Link>
          <Link href="/about-us">About Us</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
        <div className="grid gap-2 text-sm text-muted">
          <Link href="/review-links-generator">Review Links Generator</Link>
          <Link href="/setup-new-taprater">Setup New TapRater</Link>
          <Link href="/change-taprater-link">Change TapRater Link</Link>
        </div>
      </div>
    </footer>
  );
}
