import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminCustomersPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Operations"
        title="Customers"
        description="View customer profiles, purchase history, setup requests, link-change requests, and support notes."
        primaryItems={["Customer list", "Contact details", "Order history", "Setup/link request history", "Internal admin notes"]}
        nextItems={["Add customers table and link requests/orders by email.", "Create customer detail page.", "Add GDPR/export/delete controls before production."]}
      />
    </AdminShell>
  );
}
