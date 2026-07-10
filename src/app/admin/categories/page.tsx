import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminCategoriesPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Commerce"
        title="Categories"
        description="Manage shop categories, category landing pages, SEO descriptions, product assignments, and category visibility."
        primaryItems={["Category list and sort order", "Category SEO title and description", "Hero copy and buyer-intent copy", "Product assignment", "Published/draft status"]}
        nextItems={["Create categories table in Supabase.", "Add category editor form.", "Switch storefront category pages to database content with local fallback."]}
        config={{
          area: "categories",
          primaryLabel: "Default category strategy",
          secondaryLabel: "Featured category",
          notesLabel: "Category notes",
          primaryPlaceholder: "Google review stands first, then plates and bundles",
          secondaryPlaceholder: "Review Products",
          notesPlaceholder: "Category ordering, SEO ideas, or launch notes"
        }}
      />
    </AdminShell>
  );
}
