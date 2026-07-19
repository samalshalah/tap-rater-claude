"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

// Admin (/admin) and the customer account portal (/account) each have their
// own dedicated shell (AdminShell / AccountShell) -- they should never also
// carry the marketing site's Header/Footer on top of that. Everything else
// (the storefront) gets the normal site chrome.
const NO_CHROME_PREFIXES = ["/admin", "/account"];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = NO_CHROME_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (hideChrome) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
