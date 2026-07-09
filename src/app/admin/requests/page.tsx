import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";

type RequestRow = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  status?: string;
  message?: string;
  business_name?: string;
  review_url?: string;
  taprater_id?: string;
  new_review_url?: string;
};

export default async function AdminRequestsPage() {
  await requireAdmin();

  if (!hasSupabaseAdminConfig()) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-sm font-semibold uppercase text-brand">Admin</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Requests</h1>
        <p className="mt-4 leading-7 text-muted">
          Supabase is not configured in this environment. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to view saved requests.
        </p>
      </section>
    );
  }

  const supabase = getSupabaseAdmin();
  const [contacts, setups, changes] = await Promise.all([
    supabase.from("contact_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("setup_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("change_link_requests").select("*").order("created_at", { ascending: false })
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-sm font-semibold uppercase text-brand">Admin</p>
      <h1 className="mt-3 text-4xl font-black text-ink">Requests</h1>
      <div className="mt-8 grid gap-8">
        <RequestList title="Contact requests" rows={(contacts.data ?? []) as RequestRow[]} detailKey="message" />
        <RequestList title="Setup requests" rows={(setups.data ?? []) as RequestRow[]} detailKey="review_url" secondaryKey="business_name" />
        <RequestList title="Change-link requests" rows={(changes.data ?? []) as RequestRow[]} detailKey="new_review_url" secondaryKey="taprater_id" />
      </div>
    </section>
  );
}

function RequestList({
  title,
  rows,
  detailKey,
  secondaryKey
}: {
  title: string;
  rows: RequestRow[];
  detailKey: keyof RequestRow;
  secondaryKey?: keyof RequestRow;
}) {
  return (
    <section>
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <h2 className="text-2xl font-black text-ink">{title}</h2>
        <p className="text-sm font-semibold text-muted">{rows.length} saved</p>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.length === 0 ? (
          <p className="rounded-md border border-line bg-white p-4 text-sm text-muted">No requests yet.</p>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="rounded-md border border-line bg-white p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-black text-ink">{row.name}</h3>
                  <p className="text-sm text-muted">{row.email}</p>
                </div>
                <p className="text-xs font-bold uppercase text-muted">{new Date(row.created_at).toLocaleString()}</p>
              </div>
              {secondaryKey && row[secondaryKey] ? <p className="mt-3 text-sm font-semibold text-ink">{row[secondaryKey]}</p> : null}
              {row[detailKey] ? <p className="mt-2 break-words text-sm leading-6 text-muted">{row[detailKey]}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
