"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/setup-new-taprater", label: "Setup" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact-us", label: "Contact" }
];

export function Header() {
  const cart = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold text-ink">
            Tap Rater
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/cart" aria-label="Cart" className="relative rounded-md border border-line p-2 hover:border-brand">
            <ShoppingCart size={20} />
            {cart.count > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-ink">
                {cart.count}
              </span>
            ) : null}
          </Link>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-line py-3 text-sm font-medium text-muted md:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
