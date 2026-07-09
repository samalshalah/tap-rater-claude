import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/product-editor";
import { requireAdmin } from "@/lib/admin-auth";
import { getProductBySlug } from "@/lib/products";

type AdminProductEditorPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProductEditorPage({ params }: AdminProductEditorPageProps) {
  await requireAdmin();
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-ink">Edit product</h1>
      <p className="mt-4 leading-7 text-muted">
        Product edits save to Supabase when configured. The storefront still uses local product data as fallback until the database is seeded and product reads are switched fully to Supabase.
      </p>
      <div className="mt-8 rounded-md border border-line bg-white p-5 shadow-sm md:p-7">
        <ProductEditor product={product} />
      </div>
    </section>
  );
}
