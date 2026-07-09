import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerPortal } from "@/lib/customer-portal";

export default async function AccountPage() {
  const session = await requireCustomer();
  const portal = await getCustomerPortal(session.email);

  return (
    <AccountShell>
      {!portal.configured ? <PortalMessage message="Customer portal storage is not configured yet." /> : null}
      {portal.configured && !portal.customer ? <PortalMessage message="No customer record was found for this email yet." /> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Businesses" value={String(portal.businesses.length)} />
        <SummaryCard label="Devices" value={String(portal.devices.length)} />
        <SummaryCard label="Active devices" value={String(portal.devices.filter((device) => device.status === "active").length)} />
        <SummaryCard label="Tap events" value={String(portal.devices.reduce((sum, device) => sum + device.tapCount, 0))} />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Link href="/account/business" className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="font-black text-ink">Business profile</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Review business names and saved public links.</p>
        </Link>
        <Link href="/account/devices" className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="font-black text-ink">Devices</h2>
          <p className="mt-2 text-sm leading-6 text-muted">View status, destinations, and tap counts for your stands.</p>
        </Link>
        <div className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="font-black text-ink">Upgrade to Pro later</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Hosted landing pages, advanced analytics, and multi-location tools will be added later. No payment is enabled.</p>
        </div>
      </div>
    </AccountShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase text-muted">{label}</p>
      <p className="mt-2 text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function PortalMessage({ message }: { message: string }) {
  return <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">{message}</div>;
}
