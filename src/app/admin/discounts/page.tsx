import { AdminShell } from "@/components/admin/admin-shell";
import { DiscountCodeForm } from "@/components/admin/discount-code-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDiscountCodes } from "@/lib/discounts";

export default async function AdminDiscountsPage() {
  await requireAdmin();
  const { configured, discounts } = await getAdminDiscountCodes();

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Commerce</p>
        <div className="mt-3">
          <h1 className="text-4xl font-semibold text-ink">Discount Codes</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Create and manage discount codes. Codes are stored and tracked here now; actually applying one to a checkout total is
            wired up alongside going live with Stripe.
          </p>
        </div>

        {!configured ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
            Database persistence is not configured yet. Discount codes can't be saved until a database is connected.
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <DiscountCodeForm />

          <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Used</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Expires</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <tr key={discount.id} className="border-b border-line last:border-b-0">
                    <td className="p-4 font-mono font-semibold text-ink">{discount.code}</td>
                    <td className="p-4 text-ink">
                      {discount.discountType === "percent" ? `${discount.value}% off` : `$${(discount.value / 100).toFixed(2)} off`}
                    </td>
                    <td className="p-4 text-muted">
                      {discount.timesUsed}
                      {discount.usageLimit ? ` / ${discount.usageLimit}` : ""}
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          discount.isActive
                            ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase text-brand"
                            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-muted"
                        }
                      >
                        {discount.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-muted">{discount.expiresAt ? new Date(discount.expiresAt).toLocaleDateString() : "Never"}</td>
                  </tr>
                ))}
                {discounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted">
                      No discount codes yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
