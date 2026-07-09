import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminSeoPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Growth"
        title="SEO"
        description="Control metadata, redirects, sitemap inclusion, Open Graph images, canonical URLs, and migrated WordPress URL mapping."
        primaryItems={["Page metadata", "Product/category metadata", "301 redirects", "Sitemap controls", "Open Graph image controls"]}
        nextItems={["Add redirects table and Next.js redirect generation.", "Create sitemap/robots routes.", "Add SEO fields to page/category/product editors."]}
        config={{
          area: "seo",
          primaryLabel: "Primary keyword focus",
          secondaryLabel: "Redirect policy",
          notesLabel: "SEO notes",
          primaryPlaceholder: "Google review NFC stand",
          secondaryPlaceholder: "Redirect all old WordPress product URLs",
          notesPlaceholder: "Target pages, local SEO ideas, or metadata rules"
        }}
      />
    </AdminShell>
  );
}
