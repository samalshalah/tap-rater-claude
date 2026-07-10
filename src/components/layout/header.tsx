"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleUserRound, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/#platform-preview", label: "How it works" },
  { href: "/setup-new-taprater", label: "Setup" },
  { href: "/contact-us", label: "Contact" }
];

export function Header() {
  const cart = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/uploads/brand/tap-rater-logo.png"
            alt="Tap Rater"
            width={120}
            height={72}
            priority
            className="h-7 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-medium text-ink/80 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-ink/80">
          <Link href="/admin" aria-label="Account" className="hidden transition hover:text-ink sm:inline-flex">
            <CircleUserRound size={18} strokeWidth={1.5} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative inline-flex transition hover:text-ink">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cart.count > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {cart.count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <nav className="flex gap-6 overflow-x-auto border-t border-line/70 px-5 py-2.5 text-[13px] font-medium text-ink/70 lg:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 hover:text-ink">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
