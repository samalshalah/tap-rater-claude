import { AdminShell } from "@/components/admin/admin-shell";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { requireAdmin } from "@/lib/admin-auth";
import { getHomepageContent } from "@/lib/cms-repository";

export default async function AdminHomepageEditorPage() {
  await requireAdmin();
  const content = await getHomepageContent();

  return (
    <AdminShell>
    <section className="mx-auto max-w-4xl px-4 py-8 md:px-8 lg:py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-ink">Homepage editor</h1>
      <p className="mt-4 leading-7 text-muted">
        These fields control the homepage hero when database persistence is configured. Without database credentials, the form will show the fallback content and saving returns a configuration message.
      </p>
      <div className="mt-8 rounded-md border border-line bg-white p-5 shadow-sm md:p-7">
        <HomepageEditor content={content} />
      </div>
    </section>
    </AdminShell>
  );
}
