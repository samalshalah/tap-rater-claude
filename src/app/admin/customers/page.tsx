import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCustomers } from "@/lib/customers";
import { formatPrice } from "@/lib/products";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const { configured, customers } = await getAdminCustomers();

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpentCents, 0);
  const repeatCustomers = customers.filter((c) => c.orderCount > 1).length;
  const openRequests = customers.reduce((sum, c) => sum + c.openRequestCount, 0);

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-black uppercase text-brand">Operations</p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-ink">Customers</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Every customer who has a saved account, a paid order, or a contact/setup/link-change request. Order totals and open
              requests are pulled directly from the database.
            </p>
          </div>
          <div className="rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink">
            {customers.length} customers
          </div>
        </div>

        {!configured ? (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
            Database persistence is not configured yet. Connect a database to see real customers here.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <SummaryCard label="Total customers" value={String(customers.length)} />
          <SummaryCard label="Repeat customers" value={String(repeatCustomers)} />
          <SummaryCard label="Open requests" value={String(openRequests)} />
          <SummaryCard label="Lifetime revenue" value={formatPrice(totalRevenue)} />
        </div>

        <div className="mt-6 overflow-x-auto rounded-md border border-line bg-white shadow-sm">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-gray-50 text-xs uppercase text-muted">
                <th className="p-4">Customer</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Lifetime spend</th>
                <th className="p-4">Open requests</th>
                <th className="p-4">Customer since</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-line last:border-b-0">
                  <td className="p-4">
                    <p className="font-bold text-ink">{customer.name ?? customer.email}</p>
                    <p className="text-muted">{customer.email}</p>
                  </td>
                  <td className="p-4 text-ink">{customer.orderCount}</td>
                  <td className="p-4 font-black text-ink">{formatPrice(customer.totalSpentCents)}</td>
                  <td className="p-4">
                    {customer.openRequestCount > 0 ? (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase text-ink">
                        {customer.openRequestCount} open
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="p-4 text-muted">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted">
                    No customers yet.
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
    <div className="rounded-md border border-line bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase text-muted">{label}</p>
      <p className="mt-2 text-2xl font-black text-ink">{value}</p>
    </div>
  );
}
