import Link from "next/link";
import { ArrowRight, Eye, Link2 } from "lucide-react";
import { CopyButton } from "@/components/dashboard/copy-button";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerDashboard } from "@/lib/customer-stands";
import { getPermanentStandUrl } from "@/lib/stand-domain";

export default async function DashboardStandsPage() {
  const session = await requireCustomer();
  const dashboard = await getCustomerDashboard(session.email);

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <p className="text-sm font-semibold text-brand">Stands</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Your Customer Stands</h1>
        <p className="mt-3 text-base text-muted">Each stand keeps one permanent URL for its entire lifetime.</p>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {dashboard.stands.map((stand) => {
          const permanentUrl = getPermanentStandUrl(stand.permanentUrlPath);
          return (
            <article key={stand.publicSlug} className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-brand">{formatValue(stand.standCategory)}</p>
                  <h2 className="mt-2 text-xl font-semibold text-ink">{stand.productName}</h2>
                  <p className="mt-1 text-sm text-muted">{stand.business?.businessName ?? "Business"}</p>
                </div>
                <Status value={stand.status} />
              </div>

              <div className="mt-5 rounded-2xl bg-[#f5f5f7] p-4">
                <p className="text-xs font-semibold text-muted">Permanent Stand URL</p>
                <p className="mt-1 truncate text-sm font-medium text-ink">{permanentUrl}</p>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted">Setup</dt><dd className="mt-1 font-semibold text-ink">{formatValue(stand.status)}</dd></div>
                <div><dt className="text-muted">Print</dt><dd className="mt-1 font-semibold text-ink">{formatValue(stand.printStatus)}</dd></div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                <CopyButton value={permanentUrl} label="Copy URL" />
                <Link href={`/dashboard/stands/${stand.publicSlug}`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">
                  <Link2 className="h-4 w-4" aria-hidden="true" /> Edit links
                </Link>
                <Link href={`/dashboard/stands/${stand.publicSlug}/preview`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink">
                  <Eye className="h-4 w-4" aria-hidden="true" /> Preview
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {dashboard.stands.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-ink">No stands assigned yet</h2>
          <p className="mt-2 text-sm text-muted">Purchased or admin-assigned stands will appear here.</p>
          <Link href="/shop" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">Browse products <ArrowRight className="h-4 w-4" /></Link>
        </div>
      ) : null}
    </div>
  );
}

function Status({ value }: { value: string }) {
  const color = value === "setup_required" ? "bg-amber-50 text-amber-800" : value === "paused" || value === "archived" ? "bg-gray-100 text-gray-700" : "bg-emerald-50 text-emerald-800";
  return <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{formatValue(value)}</span>;
}

function formatValue(value: string) {
  return value.replaceAll("-", " ").replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase());
}
