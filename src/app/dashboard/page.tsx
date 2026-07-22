import Link from "next/link";
import { ArrowRight, Building2, RadioTower, ScanLine } from "lucide-react";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerDashboard } from "@/lib/customer-stands";

export default async function DashboardPage() {
  const session = await requireCustomer();
  const dashboard = await getCustomerDashboard(session.email);
  const activeStands = dashboard.stands.filter((stand) => stand.status === "active").length;
  const setupNeeded = dashboard.stands.filter((stand) => stand.status === "setup_required").length;

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <p className="text-sm font-semibold text-brand">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Welcome{dashboard.customer?.name ? `, ${dashboard.customer.name}` : ""}</h1>
        <p className="mt-3 text-base text-muted">Manage your permanent stand links and business profiles.</p>
      </header>

      {!dashboard.configured ? <Notice text="Customer portal storage is not configured in this environment." /> : null}
      {dashboard.configured && !dashboard.customer ? <Notice text="No customer record was found for this login." /> : null}

      <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Summary icon={<RadioTower />} label="Total stands" value={dashboard.stands.length} />
        <Summary icon={<ScanLine />} label="Active" value={activeStands} />
        <Summary icon={<ArrowRight />} label="Setup needed" value={setupNeeded} />
        <Summary icon={<Building2 />} label="Businesses" value={dashboard.businesses.length} />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/stands" className="group rounded-3xl bg-white p-6 shadow-sm">
          <RadioTower className="h-6 w-6 text-brand" aria-hidden="true" />
          <h2 className="mt-5 text-xl font-semibold text-ink">Your stands</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Update destinations, copy permanent URLs, and preview hosted pages.</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">Open stands <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
        </Link>
        <Link href="/dashboard/business" className="group rounded-3xl bg-white p-6 shadow-sm">
          <Building2 className="h-6 w-6 text-brand" aria-hidden="true" />
          <h2 className="mt-5 text-xl font-semibold text-ink">Business profiles</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Keep your business identity, website, phone, logo, and address current.</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">Manage profiles <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
        </Link>
      </section>
    </div>
  );
}

function Summary({ icon, label, value }: { icon: React.ReactElement<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="text-brand">{icon}</div>
      <p className="mt-5 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-ink">{text}</p>;
}
