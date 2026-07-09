import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminMediaPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Growth"
        title="Media library"
        description="Manage product photos, homepage hero assets, brand files, SEO images, and future uploaded media."
        primaryItems={["Media asset list", "Image alt text", "Product image assignment", "Homepage/banner image assignment", "Open Graph image assignment"]}
        nextItems={["Choose storage provider: Supabase Storage or Cloudflare R2.", "Add upload endpoint with file validation.", "Connect images to product and page editors."]}
      />
    </AdminShell>
  );
}
