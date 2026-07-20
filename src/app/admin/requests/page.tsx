import { AdminShell } from "@/components/admin/admin-shell";
import { RequestInbox } from "@/components/admin/request-inbox";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { getAdminRequestsFromClient, type RequestReadClient } from "@/lib/request-repository";

export default async function AdminRequestsPage() {
  await requireAdmin();
  const isConfigured = hasSupabaseAdminConfig();
  const requests = isConfigured
    ? await getAdminRequestsFromClient(getSupabaseAdmin() as RequestReadClient)
    : { contacts: [], setups: [], linkChanges: [] };

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Admin</p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tightest text-ink sm:text-[38px]">Requests</h1>
            <p className="mt-3 max-w-3xl leading-7 text-muted">
              Manage customer questions, setup submissions, and Tap Rater link change requests before checkout is live.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4 text-sm shadow-sm">
            <p className="font-semibold text-ink">{requests.contacts.length + requests.setups.length + requests.linkChanges.length}</p>
            <p className="mt-1 text-muted">total requests</p>
          </div>
        </div>

        {!isConfigured ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
            Database persistence is not configured yet. Add DATABASE_URL for Neon, or Supabase server credentials, to view saved requests.
          </div>
        ) : null}

        <div className="mt-8">
          <RequestInbox requests={requests} />
        </div>
      </section>
    </AdminShell>
  );
}
