"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CircleUserRound, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { solutions } from "@/data/solutions";

const shopLinks = [
  { href: "/shop#all-products", label: "Shop All" },
  { href: "/shop/by-stand", label: "Shop by Stand" },
  { href: "/shop", label: "Shop by Use" },
  { href: "/category/business-bundles", label: "Bundles" }
];

const solutionLinks = solutions.map((solution) => ({
  href: `/category/${solution.categorySlug}`,
  label: solution.title
}));

const plainNavItems = [
  { href: "/shop/custom", label: "Custom Stands" },
  { href: "/shop/hosted-pages", label: "Hosted Pages" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const cart = useCart();
  const [openMenu, setOpenMenu] = useState<"shop" | "solutions" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"shop" | "solutions" | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-5 sm:px-8">
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

        <nav ref={navRef} className="hidden items-center gap-6 text-[13px] font-medium text-ink/80 lg:flex">
          <NavDropdown
            label="Shop"
            links={shopLinks}
            isOpen={openMenu === "shop"}
            onToggle={() => setOpenMenu(openMenu === "shop" ? null : "shop")}
            onClose={() => setOpenMenu(null)}
          />
          <NavDropdown
            label="Solutions"
            links={solutionLinks}
            isOpen={openMenu === "solutions"}
            onToggle={() => setOpenMenu(openMenu === "solutions" ? null : "solutions")}
            onClose={() => setOpenMenu(null)}
          />
          {plainNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <div className="flex items-center gap-4 text-ink/80">
            <Link href="/admin" aria-label="Account" className="transition hover:text-ink">
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
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:bg-brand"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/cart" aria-label="Cart" className="relative inline-flex text-ink/80">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cart.count > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {cart.count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="inline-flex text-ink"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="max-h-[calc(100vh-56px)] overflow-y-auto border-t border-line/70 bg-white px-5 py-4 lg:hidden">
          <MobileSection
            label="Shop"
            links={shopLinks}
            isOpen={mobileSection === "shop"}
            onToggle={() => setMobileSection(mobileSection === "shop" ? null : "shop")}
            onNavigate={() => setMobileOpen(false)}
          />
          <MobileSection
            label="Solutions"
            links={solutionLinks}
            isOpen={mobileSection === "solutions"}
            onToggle={() => setMobileSection(mobileSection === "solutions" ? null : "solutions")}
            onNavigate={() => setMobileOpen(false)}
          />
          <div className="mt-1 grid gap-1 border-t border-line py-2">
            {plainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2.5 text-[14px] font-medium text-ink transition hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-ink/80"
            >
              <CircleUserRound size={16} strokeWidth={1.5} /> Account
            </Link>
          </div>
          <Link
            href="/shop"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex items-center justify-center rounded-full bg-ink px-4 py-3 text-[14px] font-medium text-white transition hover:bg-brand"
          >
            Get Started
          </Link>
        </div>
      ) : null}
    </header>
  );
}

type NavLinkItem = { href: string; label: string };

function NavDropdown({
  label,
  links,
  isOpen,
  onToggle,
  onClose
}: {
  label: string;
  links: NavLinkItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="inline-flex items-center gap-1 transition hover:text-ink"
      >
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen ? (
        <div
          role="menu"
          aria-label={label}
          className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-2xl border border-line bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.1)]"
        >
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              role="menuitem"
              onClick={onClose}
              className="block rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink/80 transition hover:bg-surface hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileSection({
  label,
  links,
  isOpen,
  onToggle,
  onNavigate
}: {
  label: string;
  links: NavLinkItem[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="border-t border-line py-1 first:border-t-0">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-[14px] font-medium text-ink transition hover:bg-surface"
      >
        {label}
        <svg
          width="11"
          height="11"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen ? (
        <div className="grid gap-0.5 py-1 pl-3">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={onNavigate}
              className="rounded-lg px-2 py-2 text-[13px] text-muted transition hover:bg-surface hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
