import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice, getActiveProducts, getCategoryBySlug, getProductPriceCents } from "@/lib/products";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = getActiveProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-ink">Products</h1>
      <div className="mt-8 overflow-x-auto rounded-md border border-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-gray-50 text-xs uppercase text-muted">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
