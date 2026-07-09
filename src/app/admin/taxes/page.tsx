import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminTaxesPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Commerce"
        title="Taxes"
        description="Prepare tax configuration for checkout. Exact tax calculation should be finalized with Stripe Tax or a chosen tax provider before launch."
        primaryItems={["Tax provider setting", "Nexus/state configuration", "Tax-inclusive/exclusive pricing", "Exemption notes", "Checkout tax status"]}
        nextItems={["Decide Stripe Tax versus manual tax settings.", "Add tax settings table.", "Verify tax behavior in Stripe test mode."]}
        config={{
          area: "taxes",
          primaryLabel: "Tax provider",
          secondaryLabel: "Pricing display",
          notesLabel: "Tax notes",
          primaryPlaceholder: "Stripe Tax",
          secondaryPlaceholder: "Show prices before tax",
          notesPlaceholder: "Nexus states, exemptions, or accounting notes"
        }}
      />
    </AdminShell>
  );
}
