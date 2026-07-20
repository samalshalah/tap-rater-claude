import Link from "next/link";

export const metadata = {
  title: "Checkout Canceled | Tap Rater",
  description: "Your Tap Rater Stripe test checkout was canceled."
};

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-surface px-4 py-16">
      <section className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase text-brand">Stripe test checkout</p>
        <h1 className="mt-3 text-[32px] font-semibold tracking-tightest sm:text-[38px] text-ink">Checkout canceled</h1>
        <p className="mt-4 leading-7 text-muted">
          No payment was completed. Your cart stays in the browser so you can adjust quantities or try Stripe test checkout again.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/cart" className="rounded-full bg-brand px-5 py-3 text-sm font-medium text-white">
            Return to cart
          </Link>
          <Link href="/shop" className="rounded-xl border border-line px-5 py-3 text-sm font-medium text-ink">
            Shop products
          </Link>
        </div>
      </section>
    </main>
  );
}
