import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminInventoryPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Commerce"
        title="Inventory"
        description="Track stock by SKU, variant, and bundle. This becomes important before enabling checkout so orders cannot sell unavailable products."
        primaryItems={["SKU inventory levels", "Low-stock thresholds", "Variant-level stock", "Bundle stock rules", "Inventory activity log"]}
        nextItems={["Add inventory columns or inventory table.", "Validate cart quantities against stock.", "Add admin inventory adjustment form with notes."]}
      />
    </AdminShell>
  );
}
