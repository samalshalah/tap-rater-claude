import { AccountShell } from "@/components/account/account-shell";
import { AccountDestinationEditor } from "@/components/account/account-destination-editor";
import { ChangeRequestForm } from "@/components/account/change-request-form";
import { getBusinessTapSummary, type BusinessTapSummary, type TapsByDay } from "@/lib/analytics";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerPortal } from "@/lib/customer-portal";

export default async function AccountDevicesPage() {
  const session = await requireCustomer();
  const portal = await getCustomerPortal(session.email);
  const summaries = await Promise.all(portal.businesses.map((business) => getBusinessTapSummary(business.id)));
  const analytics = buildCustomerAnalytics(summaries);

  return (
    <AccountShell>
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <SummaryCard label="Taps 7 days" value={analytics.tapsLast7Days} />
        <SummaryCard label="Taps 30 days" value={analytics.tapsLast30Days} />
        <SummaryCard label="Destination clicks" value={analytics.destinationClicks} />
        <SummaryCard label="Submissions" value={analytics.submissions} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-xs uppercase text-muted">
                <th className="p-4">Device</th>
                <th className="p-4">Product</th>
                <th className="p-4">Status</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Tap count</th>
              </tr>
            </thead>
            <tbody>
              {portal.devices.map((device) => (
                <tr key={device.id} className="border-b border-line last:border-b-0">
                  <td className="p-4 font-semibold text-ink">{device.deviceCode}</td>
                  <td className="p-4 text-muted">{device.productType}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-ink">{device.status}</span>
                  </td>
                  <td className="p-4 text-muted">
                    <p>{device.destinationType ?? "-"}</p>
                    <p className="mt-1 max-w-[360px] truncate">{device.destinationUrl ?? ""}</p>
                    <div className="mt-2">
                      <AccountDestinationEditor
                        deviceId={device.id}
                        deviceCode={device.deviceCode}
                        currentDestinationUrl={device.destinationUrl}
                        currentDestinationType={device.destinationType}
                      />
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-ink">{device.tapCount}</td>
                </tr>
              ))}
              {portal.devices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted">
                    No activated devices found for this account yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Taps by day</h2>
            <div className="mt-3 grid gap-2 text-sm">
              {analytics.tapsByDay.map((day) => (
                <div key={day.date} className="flex items-center justify-between border-b border-line py-2 last:border-b-0">
                  <span className="font-semibold text-ink">{day.date}</span>
                  <span className="text-muted">{day.count}</span>
                </div>
              ))}
              {analytics.tapsByDay.length === 0 ? <p className="text-sm text-muted">No tap events yet.</p> : null}
            </div>
          </div>
          <ChangeRequestForm deviceCode={portal.devices[0]?.deviceCode} />
          <div className="rounded-2xl border border-line bg-white p-4 text-sm leading-6 text-muted shadow-sm">
            Direct destination editing is intentionally disabled for the first portal version. Support will verify change requests before updating
            device links.
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

function buildCustomerAnalytics(summaries: BusinessTapSummary[]) {
  const dayCounts = new Map<string, number>();
  for (const summary of summaries) {
    for (const day of summary.tapsByDay) {
      dayCounts.set(day.date, (dayCounts.get(day.date) ?? 0) + day.count);
    }
  }

  return {
    tapsLast7Days: summaries.reduce((sum, summary) => sum + summary.tapsLast7Days, 0),
    tapsLast30Days: summaries.reduce((sum, summary) => sum + summary.tapsLast30Days, 0),
    destinationClicks: summaries.reduce((sum, summary) => sum + summary.destinationClicks, 0),
    submissions: summaries.reduce((sum, summary) => sum + summary.submissions, 0),
    tapsByDay: Array.from(dayCounts.entries())
      .map(([date, count]): TapsByDay => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  };
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
