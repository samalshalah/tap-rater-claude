import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getCatalogCategories } from "@/lib/products";
import { standCategories } from "@/data/stand-categories";
import { useCases } from "@/data/use-cases";
import { getAdminProducts } from "@/lib/admin-products";

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const products = await getAdminProducts();
  const activeProducts = products.filter((product) => product.isActive);
  const catalogCategories = getCatalogCategories();

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Commerce</p>
        <div className="mt-3">
          <h1 className="text-4xl font-semibold text-ink">Categories & Use Cases</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Stand categories are what kind of stand a product is (Shop by Stand). Use cases are which business types recommend a
            product, via tags (Shop by Use). Both are defined in code (<code>src/data/stand-categories.ts</code> and{" "}
            <code>src/data/use-cases.ts</code>) rather than the database, so this page is a live operational view rather than an
            editor -- change the underlying files and redeploy to add or rename one.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white shadow-sm">
            <div className="border-b border-line p-4">
              <h2 className="text-lg font-semibold text-ink">Stand categories</h2>
              <p className="mt-1 text-sm text-muted">{standCategories.length} categories -- Shop by Stand</p>
            </div>
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
                  <th className="p-3">Category</th>
                  <th className="p-3">Active products</th>
                </tr>
              </thead>
              <tbody>
                {standCategories.map((category) => {
                  const count = activeProducts.filter((product) => product.standCategorySlug === category.slug).length;
                  return (
                    <tr key={category.slug} className="border-b border-line last:border-b-0">
                      <td className="p-3">
                        <p className="font-bold text-ink">{category.name}</p>
                        <p className="text-xs text-muted">{category.slug}</p>
                      </td>
                      <td className="p-3">
                        {count === 0 ? (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase text-ink">
                            0 -- hidden from nav
                          </span>
                        ) : (
                          <Link href={`/shop/stands/${category.slug}`} className="font-bold text-brand hover:text-brand-dark">
                            {count} products &rsaquo;
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-line bg-white shadow-sm">
            <div className="border-b border-line p-4">
              <h2 className="text-lg font-semibold text-ink">Use cases</h2>
              <p className="mt-1 text-sm text-muted">{useCases.length} use cases -- Shop by Use, membership via tags</p>
            </div>
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
                  <th className="p-3">Use case</th>
                  <th className="p-3">Tagged products</th>
                </tr>
              </thead>
              <tbody>
                {useCases.map((useCase) => {
                  const count = activeProducts.filter((product) => product.tags?.includes(useCase.slug)).length;
                  return (
                    <tr key={useCase.slug} className="border-b border-line last:border-b-0">
                      <td className="p-3">
                        <p className="font-bold text-ink">{useCase.name}</p>
                        <p className="text-xs text-muted">{useCase.slug}</p>
                      </td>
                      <td className="p-3">
                        <Link href={`/use/${useCase.slug}`} className="font-bold text-brand hover:text-brand-dark">
                          {count} products &rsaquo;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line p-4">
            <h2 className="text-lg font-semibold text-ink">Shop by Use category groups (legacy)</h2>
            <p className="mt-1 text-sm text-muted">
              {catalogCategories.length} groups -- these are the older category buckets behind /category/[slug] and the /shop
              grid, kept alongside the newer stand-category/use-case system above.
            </p>
          </div>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
                <th className="p-3">Category</th>
                <th className="p-3">Active products</th>
              </tr>
            </thead>
            <tbody>
              {catalogCategories.map((category) => {
                const count = activeProducts.filter((product) => product.categorySlug === category.slug).length;
                return (
                  <tr key={category.slug} className="border-b border-line last:border-b-0">
                    <td className="p-3">
                      <p className="font-bold text-ink">{category.title}</p>
                      <p className="text-xs text-muted">{category.slug}</p>
                    </td>
                    <td className="p-3">
                      {count === 0 ? (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase text-ink">
                          0 -- hidden from nav
                        </span>
                      ) : (
                        <Link href={`/category/${category.slug}`} className="font-bold text-brand hover:text-brand-dark">
                          {count} products &rsaquo;
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
