import { AccountShell } from "@/components/account/account-shell";
import { ChangeRequestForm } from "@/components/account/change-request-form";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerPortal } from "@/lib/customer-portal";

export default async function AccountDevicesPage() {
  const session = await requireCustomer();
  const portal = await getCustomerPortal(session.email);

  return (
    <AccountShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto rounded-md border border-line bg-white shadow-sm">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-gray-50 text-xs uppercase text-muted">
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
                  <td className="p-4 font-black text-ink">{device.deviceCode}</td>
                  <td className="p-4 text-muted">{device.productType}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase text-ink">{device.status}</span>
                  </td>
                  <td className="p-4 text-muted">
                    <p>{device.destinationType ?? "-"}</p>
                    <p className="mt-1 max-w-[360px] truncate">{device.destinationUrl ?? ""}</p>
                  </td>
                  <td className="p-4 font-bold text-ink">{device.tapCount}</td>
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
          <ChangeRequestForm deviceCode={portal.devices[0]?.deviceCode} />
          <div className="rounded-md border border-line bg-white p-4 text-sm leading-6 text-muted shadow-sm">
            Direct destination editing is intentionally disabled for the first portal version. Support will verify change requests before updating
            device links.
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
