import { AdminShell } from "@/components/admin/admin-shell";
import { PageEditor } from "@/components/admin/page-editor";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminPagesEditorPage() {
  await requireAdmin();

  return (
    <AdminShell>
    <section className="mx-auto max-w-4xl px-4 py-8 md:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-semibold text-ink">Page editor</h1>
      <p className="mt-4 leading-7 text-muted">
        Create editable content records for future pages such as About, Shipping, Returns, Privacy, and custom SEO landing pages.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-sm md:p-7">
        <PageEditor />
      </div>
    </section>
    </AdminShell>
  );
}
