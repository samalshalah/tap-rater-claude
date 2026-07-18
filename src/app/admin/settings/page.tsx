import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminConfig } from "@/lib/cms-repository";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const initialConfigValues = await getAdminConfig("settings");

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="System"
        title="Settings"
        description="Manage store identity, admin credentials, integrations, launch checklist, notification emails, and operational defaults."
        primaryItems={["Store profile", "Notification email", "Admin access", "Supabase status", "Resend status", "Stripe launch checklist"]}
        nextItems={["Add store_settings table.", "Add settings editor with secret-safe display.", "Add launch readiness checks for Supabase, Resend, Stripe, SEO, and redirects."]}
        config={{
          area: "settings",
          primaryLabel: "Store notification email",
          secondaryLabel: "Launch mode",
          notesLabel: "Settings notes",
          primaryPlaceholder: "orders@taprater.com",
          secondaryPlaceholder: "Preview until Stripe is connected",
          notesPlaceholder: "Admin policy, integration status, or launch checklist notes"
        }}
        initialConfigValues={initialConfigValues}
      />
    </AdminShell>
  );
}
