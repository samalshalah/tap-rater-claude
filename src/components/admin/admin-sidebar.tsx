"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  GalleryHorizontalEnd,
  LayoutDashboard,
  Megaphone,
  Package,
  Percent,
  RadioTower,
  Search,
  Settings,
  ShoppingBag,
  Tags,
  Truck,
  Users,
  WalletCards
} from "lucide-react";
import { adminNavigationGroups } from "@/lib/admin-navigation";

const icons = {
  Dashboard: LayoutDashboard,
  Requests: ClipboardList,
  Stands: RadioTower,
  Orders: ShoppingBag,
  Customers: Users,
  Products: Package,
  Categories: Tags,
  Inventory: Boxes,
  Discounts: Percent,
  Shipping: Truck,
  Taxes: WalletCards,
  Website: FileText,
  Media: GalleryHorizontalEnd,
  SEO: Search,
  Analytics: BarChart3,
  Settings
};

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="border-b border-line bg-ink text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="px-5 py-6">
        <Link href="/admin" className="block">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/50">Tap Rater</p>
          <h2 className="mt-1 text-[19px] font-semibold tracking-tightest">Commerce Admin</h2>
        </Link>
      </div>
      <nav className="flex gap-3 overflow-x-auto px-5 pb-4 lg:block lg:space-y-7 lg:overflow-visible">
        {adminNavigationGroups.map((group) => (
          <div key={group.label} className="min-w-64 lg:min-w-0">
            <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">{group.label}</p>
            <div className="grid gap-0.5">
              {group.items.map((item) => {
                const Icon = icons[item.label as keyof typeof icons] ?? Megaphone;
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-[13px] font-medium text-ink transition"
                        : "flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="hidden px-5 py-6 lg:block">
        <button
          className="w-full rounded-full border border-white/20 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/10"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
