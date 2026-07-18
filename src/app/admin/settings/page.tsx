import { AdminShell } from "@/components/admin/admin-shell";
import { AdminConfigForm } from "@/components/admin/admin-config-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminConfig } from "@/lib/cms-repository";
import { getLaunchReadinessChecks } from "@/lib/launch-readiness";

const statusStyles: Record<string, string> = {
  ready: "bg-teal-50 text-brand",
  test_mode: "bg-amber-50 text-ink",
  not_configured: "bg-gray-100 text-muted",
  not_ready: "bg-red-50 text-red-700"
};

const statusLabels: Record<string, string> = {
  ready: "Ready",
  test_mode: "Test mode",
  not_configured: "Not configured",
  not_ready: "Check this"
};

export default async function AdminSettingsPage() {
  await requireAdmin();
  const initialConfigValues = await getAdminConfig("settings");
  const checks = getLaunchReadinessChecks();

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-black uppercase text-brand">System</p>
        <div className="mt-3">
          <h1 className="text-4xl font-black text-ink">Settings & Launch Readiness</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            A live check of what's actually configured on this environment right now, plus store-level notes.
          </p>
        </div>

        <div className="mt-6 rounded-md border border-line bg-white shadow-sm">
          <div className="border-b border-line p-4">
            <h2 className="text-lg font-black text-ink">Launch readiness</h2>
          </div>
          <table className="w-full border-collapse text-left text-sm">
            <tbody>
              {checks.map((check) => (
                <tr key={check.id} className="border-b border-line last:border-b-0">
                  <td className="w-56 p-4 font-bold text-ink">{check.label}</td>
                  <td className="w-40 p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusStyles[check.status]}`}>
                      {statusLabels[check.status]}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{check.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">Store notes</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Notification email and any operational notes for the team. Saved to the database when connected.
          </p>
          <div className="mt-5">
            <AdminConfigForm
              area="settings"
              title="Settings"
              primaryLabel="Store notification email"
              secondaryLabel="Launch mode"
              notesLabel="Settings notes"
              primaryPlaceholder="orders@taprater.com"
              secondaryPlaceholder="Preview until Stripe is connected"
              notesPlaceholder="Admin policy, integration status, or launch checklist notes"
              initialValues={initialConfigValues}
            />
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
