import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminShippingPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Commerce"
        title="Shipping"
        description="Configure shipping zones, rates, package rules, free-shipping thresholds, and fulfillment settings."
        primaryItems={["Shipping zones", "Flat-rate rules", "Free-shipping threshold", "Package dimensions", "Fulfillment status options"]}
        nextItems={["Confirm US/international shipping scope.", "Add shipping settings table.", "Include shipping rates in checkout validation."]}
      />
    </AdminShell>
  );
}
