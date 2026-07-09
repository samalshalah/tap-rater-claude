import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-editor";
import { createBlankAdminProduct, getAdminProductBySlug } from "@/lib/admin-products";
import { requireAdmin } from "@/lib/admin-auth";
import { hasSupabaseAdminConfig } from "@/lib/db";
import { getCatalogCategories } from "@/lib/products";

type AdminProductEditorPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProductEditorPage({ params }: AdminProductEditorPageProps) {
  await requireAdmin();
  const { slug } = await params;
  const isCreate = slug === "new";
  const product = isCreate ? createBlankAdminProduct() : await getAdminProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categories = getCatalogCategories();
  const canSave = hasSupabaseAdminConfig();

  return (
    <AdminShell>
    <section className="mx-auto max-w-5xl px-4 py-8 md:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-ink">{isCreate ? "Create product" : "Edit product"}</h1>
      <p className="mt-4 leading-7 text-muted">
        Product records save to Supabase through a protected server-side API. The public storefront uses saved products when Supabase is configured and static products as fallback.
      </p>
      {!canSave ? (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
          Supabase is not configured yet. Product edits cannot be saved.
        </div>
      ) : null}
      <div className="mt-8 rounded-md border border-line bg-white p-5 shadow-sm md:p-7">
        <ProductEditor product={product} categories={categories} mode={isCreate ? "create" : "edit"} />
      </div>
    </section>
    </AdminShell>
  );
}
