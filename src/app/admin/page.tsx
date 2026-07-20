import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { adminNavigationGroups } from "@/lib/admin-navigation";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Admin</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Tap Rater backend</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          Control the storefront, catalog, request queue, ecommerce operations, SEO, and launch settings from one dashboard.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {[
            ["Products", "7", "Current migrated catalog items"],
            ["Requests", "3 queues", "Contact, setup, and link changes"],
            ["Checkout", "Final stage", "Stripe intentionally deferred"],
            ["CMS", "Active", "Homepage and content editors"]
          ].map(([label, value, copy]) => (
            <article key={label} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-muted">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {adminNavigationGroups.flatMap((group) => group.items).map((item) => (
            <Link key={item.href} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg" href={item.href}>
              <h2 className="font-semibold text-ink">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
