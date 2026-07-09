import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/devices", label: "Devices" },
  { href: "/account/business", label: "Business" }
];

export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-soft">
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:py-12">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-brand">Tap Rater account</p>
            <h1 className="mt-2 text-4xl font-black text-ink">Customer portal</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md border border-line bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </section>
    </main>
  );
}
