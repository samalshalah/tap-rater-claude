import { AdminShell } from "@/components/admin/admin-shell";
import { ShippingConfigForm } from "@/components/admin/shipping-config-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getShippingConfig } from "@/lib/cms-repository";
import { hasSupabaseAdminConfig } from "@/lib/db";

export default async function AdminShippingPage() {
  await requireAdmin();
  const initialValues = await getShippingConfig();
  const canSave = hasSupabaseAdminConfig();

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-black uppercase text-brand">Commerce</p>
        <div className="mt-3">
          <h1 className="text-4xl font-black text-ink">Shipping</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Configure the shipping rate, free-shipping threshold, and delivery estimate. This also directly drives the{" "}
            <code>/shipping-policy</code> page's bracketed placeholders once you fill it in here.
          </p>
          <p className="mt-3 max-w-3xl rounded-md bg-amber-50 p-3 text-sm font-semibold text-ink">
            Deferred for now: connecting real FedEx/USPS carrier accounts for live rate quotes and label printing. The flat-rate
            fields below can still be used as a simple stopgap in the meantime if you want one.
          </p>
        </div>

        {!canSave ? (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
            Database persistence is not configured yet. Shipping settings can't be saved.
          </div>
        ) : null}

        <div className="mt-6">
          <ShippingConfigForm initialValues={initialValues} />
        </div>
      </section>
    </AdminShell>
  );
}
