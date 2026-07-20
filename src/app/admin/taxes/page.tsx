import { AdminShell } from "@/components/admin/admin-shell";
import { TaxConfigForm } from "@/components/admin/tax-config-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getTaxConfig } from "@/lib/cms-repository";
import { hasSupabaseAdminConfig } from "@/lib/db";

export default async function AdminTaxesPage() {
  await requireAdmin();
  const initialValues = await getTaxConfig();
  const canSave = hasSupabaseAdminConfig();

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Commerce</p>
        <div className="mt-3">
          <h1 className="text-[32px] font-semibold tracking-tightest text-ink sm:text-[38px]">Taxes</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Configure your tax approach. This is a real legal question, not just a technical setting -- confirm nexus states with
            an accountant.
          </p>
        </div>

        {!canSave ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
            Database persistence is not configured yet. Tax settings can't be saved.
          </div>
        ) : null}

        <div className="mt-6">
          <TaxConfigForm initialValues={initialValues} />
        </div>
      </section>
    </AdminShell>
  );
}
