import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const { configured, orders } = await getAdminOrders();

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Commerce</p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tightest text-ink sm:text-[38px]">Orders</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Stripe test checkout creates pending orders, and the Stripe webhook marks them paid after checkout completes.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink">
            {orders.length} orders
          </div>
        </div>

        {!configured ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
            Database persistence is not configured yet. Stripe checkout stays disabled until orders can be persisted.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <SummaryCard label="Total orders" value={String(orders.length)} />
          <SummaryCard label="Paid" value={String(orders.filter((order) => order.status === "paid").length)} />
          <SummaryCard label="Pending" value={String(orders.filter((order) => order.status === "pending_payment").length)} />
          <SummaryCard label="Revenue" value={formatPrice(orders.filter((order) => order.status === "paid").reduce((sum, order) => sum + order.total_cents, 0))} />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
                <th className="p-4">Stripe session</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.stripe_checkout_session_id} className="border-b border-line last:border-b-0">
                  <td className="p-4 font-mono text-xs text-ink">{order.stripe_checkout_session_id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-ink">{order.customer_name ?? "Customer"}</p>
                    <p className="text-muted">{order.email ?? "-"}</p>
                  </td>
                  <td className="p-4 text-muted">
                    {order.line_items_json.length > 0
                      ? order.line_items_json.map((item) => `${item.quantity} x ${item.title}`).join(", ")
                      : "-"}
                  </td>
                  <td className="p-4 font-semibold text-ink">{formatPrice(order.total_cents)}</td>
                  <td className="p-4">
                    <span className={order.status === "paid" ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase text-brand" : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase text-ink"}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{order.created_at ? new Date(order.created_at).toLocaleString() : "-"}</td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No Stripe test orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-2 text-[26px] font-semibold tracking-tightest text-ink">{value}</p>
    </div>
  );
}
