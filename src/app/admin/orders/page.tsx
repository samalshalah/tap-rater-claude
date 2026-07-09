import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminOrdersPage() {
  await requireAdmin();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-ink">Orders</h1>
      <p className="mt-4 leading-7 text-muted">
        Orders will be connected when Stripe checkout is added in the final launch stage.
      </p>
    </section>
  );
}
