import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice, getActiveProducts, getCategoryBySlug, getProductPriceCents } from "@/lib/products";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = getActiveProducts();

  return (
    <AdminShell>
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h1 className="text-4xl font-black text-ink">Products</h1>
        <p className="text-sm leading-6 text-muted">Edit buttons save product records to Supabase when configured.</p>
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-gray-50 text-xs uppercase text-muted">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-b border-line last:border-b-0" key={product.slug}>
                <td className="p-4 font-bold text-ink">{product.title}</td>
                <td className="p-4 text-muted">{product.sku}</td>
                <td className="p-4 text-muted">{getCategoryBySlug(product.categorySlug)?.title ?? product.categorySlug}</td>
                <td className="p-4 text-muted">{formatPrice(getProductPriceCents(product))}</td>
                <td className="p-4 text-muted">{product.stockStatus}</td>
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
