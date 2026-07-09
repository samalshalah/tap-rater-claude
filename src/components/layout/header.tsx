"use client";

import Link from "next/link";
import { CircleUserRound, DollarSign, Globe2, Search, ShoppingBag } from "lucide-react";
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
    <header className="sticky top-0 z-30 bg-white/95 shadow-[0_10px_40px_rgba(17,24,39,0.06)] backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid min-h-20 grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[220px_1fr_420px]">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-sm bg-ink text-lg text-white">T</span>
            <span>Tap Rater<span className="text-brand">.</span></span>
          </Link>
          <nav className="hidden justify-center gap-10 text-sm font-black uppercase text-ink lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-4 text-sm font-black uppercase text-ink">
            <button aria-label="Search" className="hidden rounded-sm p-2 hover:text-brand sm:inline-flex">
              <Search size={20} />
            </button>
            <span className="hidden items-center gap-1 md:inline-flex">
              <Globe2 size={18} />
              Eng
            </span>
            <span className="hidden items-center gap-1 md:inline-flex">
              <DollarSign size={16} />
              USD
            </span>
            <Link href="/admin" className="hidden items-center gap-1 hover:text-brand md:inline-flex">
              <CircleUserRound size={18} />
              Account
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative rounded-sm p-2 hover:text-brand">
              <ShoppingBag size={24} />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-xs font-bold text-white">
                {cart.count}
              </span>
            </Link>
          </div>
        </div>
        <nav className="flex gap-6 overflow-x-auto border-t border-line py-3 text-sm font-black uppercase text-muted lg:hidden">
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
