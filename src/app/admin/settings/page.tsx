import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="System"
        title="Settings"
        description="Manage store identity, admin credentials, integrations, launch checklist, notification emails, and operational defaults."
        primaryItems={["Store profile", "Notification email", "Admin access", "Supabase status", "Resend status", "Stripe launch checklist"]}
        nextItems={["Add store_settings table.", "Add settings editor with secret-safe display.", "Add launch readiness checks for Supabase, Resend, Stripe, SEO, and redirects."]}
      />
    </AdminShell>
  );
}
