import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminConfigForm } from "@/components/admin/admin-config-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminConfig } from "@/lib/cms-repository";
import { getAdminProducts } from "@/lib/admin-products";
import { getCatalogCategories } from "@/lib/products";

export default async function AdminSeoPage() {
  await requireAdmin();
  const initialConfigValues = await getAdminConfig("seo");
  const products = (await getAdminProducts()).filter((product) => product.isActive);
  const categories = getCatalogCategories();

  const missingSeoTitle = products.filter((product) => !product.seoTitle?.trim());
  const missingSeoDescription = products.filter((product) => !product.seoDescription?.trim());
  const coveragePct = Math.round(((products.length - missingSeoTitle.length) / Math.max(products.length, 1)) * 100);

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Growth</p>
        <div className="mt-3">
          <h1 className="text-4xl font-semibold text-ink">SEO</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Sitemap and robots.txt are generated automatically from the live catalog --{" "}
            <Link href="/sitemap.xml" className="text-brand hover:text-brand-dark">
              /sitemap.xml
            </Link>{" "}
            and{" "}
            <Link href="/robots.txt" className="text-brand hover:text-brand-dark">
              /robots.txt
            </Link>{" "}
            always reflect exactly what's active, with no manual step. This page tracks metadata coverage across the catalog.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <SummaryCard label="Active products" value={String(products.length)} />
          <SummaryCard label="SEO title coverage" value={`${coveragePct}%`} />
          <SummaryCard label="Missing SEO title" value={String(missingSeoTitle.length)} />
          <SummaryCard label="Missing SEO description" value={String(missingSeoDescription.length)} />
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line p-4">
            <h2 className="text-[18px] font-semibold tracking-tightest text-ink">Category SEO</h2>
          </div>
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
                <th className="p-4">Category</th>
                <th className="p-4">SEO title</th>
                <th className="p-4">SEO description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.slug} className="border-b border-line last:border-b-0">
                  <td className="p-4 font-semibold text-ink">{category.title}</td>
                  <td className="p-4 text-muted">{category.seoTitle ?? <MissingBadge />}</td>
                  <td className="p-4 text-muted">{category.seoDescription ? "Set" : <MissingBadge />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {missingSeoTitle.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-white shadow-sm">
            <div className="border-b border-line p-4">
              <h2 className="text-[18px] font-semibold tracking-tightest text-ink">Products missing an SEO title ({missingSeoTitle.length})</h2>
              <p className="mt-1 text-sm text-muted">Falls back to the product title, which is fine, but a dedicated SEO title usually converts better in search results.</p>
            </div>
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {missingSeoTitle.slice(0, 25).map((product) => (
                  <tr key={product.slug} className="border-b border-line last:border-b-0">
                    <td className="p-4 font-semibold text-ink">{product.title}</td>
                    <td className="p-4">
                      <Link href={`/admin/products/${product.slug}`} className="font-semibold text-brand hover:text-brand-dark">
                        Edit &rsaquo;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {missingSeoTitle.length > 25 ? (
              <p className="border-t border-line p-4 text-xs text-muted">+ {missingSeoTitle.length - 25} more</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-[20px] font-semibold tracking-tightest text-ink">Notes</h2>
          <div className="mt-5">
            <AdminConfigForm
              area="seo"
              title="SEO"
              primaryLabel="Primary keyword focus"
              secondaryLabel="Redirect policy"
              notesLabel="SEO notes"
              primaryPlaceholder="Google review NFC stand"
              secondaryPlaceholder="Redirect all old WordPress product URLs"
              notesPlaceholder="Target pages, local SEO ideas, or metadata rules"
              initialValues={initialConfigValues}
            />
          </div>
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

function MissingBadge() {
  return <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase text-ink">Missing</span>;
}
