import { AdminShell } from "@/components/admin/admin-shell";
import { StockToggle } from "@/components/admin/stock-toggle";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/admin-products";
import { hasSupabaseAdminConfig } from "@/lib/db";
import { getCategoryBySlug } from "@/lib/products";

export default async function AdminInventoryPage() {
  await requireAdmin();
  const products = await getAdminProducts();
  const canSave = hasSupabaseAdminConfig();
  const activeProducts = products.filter((product) => product.isActive);
  const outOfStock = activeProducts.filter((product) => product.stockStatus === "outofstock");

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Commerce</p>
        <div className="mt-3">
          <h1 className="text-4xl font-semibold text-ink">Inventory</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Since every stand is printed on demand, "inventory" here means whether a product can currently be ordered, not a unit
            count. Checkout already respects this -- an out-of-stock product cannot be added to cart or checked out. Click a
            status to toggle it instantly.
          </p>
        </div>

        {!canSave ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
            Database persistence is not configured yet. Stock status changes cannot be saved.
          </div>
        ) : null}

        {outOfStock.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-white shadow-sm">
            <div className="border-b border-line p-4">
              <h2 className="text-lg font-semibold text-ink">Currently out of stock ({outOfStock.length})</h2>
            </div>
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {outOfStock.map((product) => (
                  <tr key={product.slug} className="border-b border-line last:border-b-0">
                    <td className="p-4 font-bold text-ink">{product.title}</td>
                    <td className="p-4 text-muted">{getCategoryBySlug(product.categorySlug)?.title ?? product.categorySlug}</td>
                    <td className="p-4">
                      <StockToggle slug={product.slug} initialStatus={product.stockStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm font-semibold text-brand">
            Nothing is out of stock right now.
          </div>
        )}

        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line p-4">
            <h2 className="text-lg font-semibold text-ink">All active products ({activeProducts.length})</h2>
          </div>
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeProducts.map((product) => (
                <tr key={product.slug} className="border-b border-line last:border-b-0">
                  <td className="p-4 font-bold text-ink">{product.title}</td>
                  <td className="p-4 text-muted">{getCategoryBySlug(product.categorySlug)?.title ?? product.categorySlug}</td>
                  <td className="p-4">
                    <StockToggle slug={product.slug} initialStatus={product.stockStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
