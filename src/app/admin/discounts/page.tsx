import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminDiscountsPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Commerce"
        title="Discounts"
        description="Create coupon codes, bundle promotions, launch discounts, and automatic savings rules before checkout goes live."
        primaryItems={["Coupon code list", "Percent/fixed discounts", "Bundle rules", "Start/end dates", "Usage limits"]}
        nextItems={["Add discounts table.", "Validate discounts server-side in cart.", "Pass approved discounts to Stripe Checkout at final stage."]}
        config={{
          area: "discounts",
          primaryLabel: "Default promotion",
          secondaryLabel: "Usage rule",
          notesLabel: "Discount notes",
          primaryPlaceholder: "20% business bundle savings",
          secondaryPlaceholder: "One coupon per order",
          notesPlaceholder: "Launch offers, excluded SKUs, or bundle rules"
        }}
      />
    </AdminShell>
  );
}
