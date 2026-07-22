"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LayoutDashboard, LogOut, RadioTower } from "lucide-react";
import type { ReactNode } from "react";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/stands", label: "Stands", icon: RadioTower },
  { href: "/dashboard/business", label: "Business", icon: Building2 }
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.endsWith("/preview")) return <>{children}</>;

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" });
    router.push("/account/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-[#d2d2d7] bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6 lg:py-7">
          <Link href="/dashboard" className="block">
            <span className="text-xl font-semibold text-ink">Tap Rater</span>
            <span className="mt-1 hidden text-xs text-muted lg:block">Customer portal</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            title="Log out"
            aria-label="Log out"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:text-ink lg:hidden"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:grid lg:gap-1 lg:overflow-visible lg:px-4">
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "flex shrink-0 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white"
                    : "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-[#f5f5f7] hover:text-ink"
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden px-4 py-6 lg:block">
          <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted hover:bg-[#f5f5f7] hover:text-ink">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
