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
      <div className="px-4 py-5">
        <Link href="/admin" className="block">
          <p className="text-xs font-black uppercase text-accent">Tap Rater</p>
          <h2 className="mt-1 text-xl font-black">Commerce Admin</h2>
        </Link>
      </div>
      <nav className="flex gap-3 overflow-x-auto px-4 pb-4 lg:block lg:space-y-6 lg:overflow-visible">
        {adminNavigationGroups.map((group) => (
          <div key={group.label} className="min-w-64 lg:min-w-0">
            <p className="mb-2 px-2 text-xs font-black uppercase text-gray-400">{group.label}</p>
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = icons[item.label as keyof typeof icons] ?? Megaphone;
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active ? "flex items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-bold text-ink" : "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white"}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="hidden px-4 py-5 lg:block">
        <button className="w-full rounded-md border border-white/20 px-3 py-2 text-sm font-bold text-white hover:bg-white/10" onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
