import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/admin-products";
import { hasSupabaseAdminConfig } from "@/lib/db";
import { formatPrice, getCategoryBySlug } from "@/lib/products";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAdminProducts();
  const canSave = hasSupabaseAdminConfig();

  return (
    <AdminShell>
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-ink">Products</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Create and manage product records, pricing, inventory status, visibility, and SEO.</p>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand">
          Create product
        </Link>
      </div>
      {!canSave ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
          Database persistence is not configured yet. Product edits cannot be saved.
        </div>
      ) : null}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total products" value={String(products.length)} />
        <SummaryCard label="Active" value={String(products.filter((product) => product.isActive).length)} />
        <SummaryCard label="Drafts" value={String(products.filter((product) => !product.isActive).length)} />
        <SummaryCard label="Out of stock" value={String(products.filter((product) => product.stockStatus === "outofstock").length)} />
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Base price</th>
              <th className="p-4">Sale price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Visibility</th>
              <th className="p-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-b border-line last:border-b-0" key={product.slug}>
                <td className="p-4 font-bold text-ink">{product.title}</td>
                <td className="p-4 text-muted">{product.sku}</td>
                <td className="p-4 text-muted">{getCategoryBySlug(product.categorySlug)?.title ?? product.categorySlug}</td>
                <td className="p-4 text-muted">{formatPrice(product.basePriceCents)}</td>
                <td className="p-4 text-muted">{product.salePriceCents ? formatPrice(product.salePriceCents) : "-"}</td>
                <td className="p-4">
                  <span className={product.stockStatus === "instock" ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase text-brand" : "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-muted"}>
                    {product.stockStatus === "instock" ? "In stock" : "Out of stock"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={product.isActive ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase text-brand" : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase text-ink"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  <Link className="font-bold text-brand" href={`/admin/products/${product.slug}`}>Edit</Link>
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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
