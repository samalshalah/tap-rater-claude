import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminContentPage() {
  await requireAdmin();

  return (
    <AdminShell>
    <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-ink">Website content</h1>
      <p className="mt-4 max-w-3xl leading-7 text-muted">
        Edit homepage copy, create CMS pages, and prepare SEO/content changes. Saved content uses Supabase when configured.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/admin/content/homepage" className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="font-black text-ink">Homepage</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Hero text, buttons, featured labels.</p>
        </Link>
        <Link href="/admin/content/pages" className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="font-black text-ink">Pages</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Draft and publish editable page content.</p>
        </Link>
        <Link href="/admin/products" className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="font-black text-ink">Products</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Edit product data, pricing, stock, and SEO.</p>
        </Link>
      </div>
    </section>
    </AdminShell>
  );
}
