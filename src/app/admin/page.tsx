import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-ink">Tap Rater backend</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link className="rounded-md border border-line bg-white p-5 font-bold text-ink shadow-sm" href="/admin/products">Products</Link>
        <Link className="rounded-md border border-line bg-white p-5 font-bold text-ink shadow-sm" href="/admin/requests">Requests</Link>
        <Link className="rounded-md border border-line bg-white p-5 font-bold text-ink shadow-sm" href="/admin/orders">Orders later</Link>
      </div>
    </section>
  );
}
