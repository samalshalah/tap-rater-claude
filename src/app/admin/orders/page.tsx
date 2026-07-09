import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminOrdersPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Commerce"
        title="Orders"
        description="Manage paid orders, fulfillment, order notes, customer communication, and refund status after Stripe is connected in the final launch stage."
        primaryItems={["Order list and filters", "Order detail timeline", "Fulfillment status", "Customer notes", "Refund/payment state"]}
        nextItems={["Add Stripe checkout and webhook order creation.", "Store shipping address and order items.", "Add admin order status transitions and email notifications."]}
        config={{
          area: "orders",
          primaryLabel: "Default order status",
          secondaryLabel: "Fulfillment policy",
          notesLabel: "Order notes",
          primaryPlaceholder: "Pending payment until Stripe webhook confirms",
          secondaryPlaceholder: "Fulfill after paid status",
          notesPlaceholder: "Order workflow, notifications, or refund rules"
        }}
      />
    </AdminShell>
  );
}
