import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminConfig } from "@/lib/cms-repository";

export default async function AdminShippingPage() {
  await requireAdmin();
  const initialConfigValues = await getAdminConfig("shipping");

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Commerce"
        title="Shipping"
        description="Configure shipping zones, rates, package rules, free-shipping thresholds, and fulfillment settings."
        primaryItems={["Shipping zones", "Flat-rate rules", "Free-shipping threshold", "Package dimensions", "Fulfillment status options"]}
        nextItems={["Confirm US/international shipping scope.", "Add shipping settings table.", "Include shipping rates in checkout validation."]}
        config={{
          area: "shipping",
          primaryLabel: "Shipping rate",
          secondaryLabel: "Free-shipping rule",
          notesLabel: "Fulfillment notes",
          primaryPlaceholder: "US flat rate $7.95",
          secondaryPlaceholder: "Free shipping over $150",
          notesPlaceholder: "Packaging, handling time, or carrier details"
        }}
        initialConfigValues={initialConfigValues}
      />
    </AdminShell>
  );
}
