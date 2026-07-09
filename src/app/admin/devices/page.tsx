import { AdminShell } from "@/components/admin/admin-shell";
import { DevicesManager } from "@/components/admin/devices-manager";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDevices, isAdminDeviceStoreConfigured } from "@/lib/admin-devices";

export default async function AdminDevicesPage() {
  await requireAdmin();
  const configured = isAdminDeviceStoreConfigured();
  const devices = configured ? await getAdminDevices() : [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taprater.com";

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Admin</p>
        <div className="mt-3">
          <h1 className="text-4xl font-black text-ink">Devices</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Create Tap Rater NFC and QR device codes, issue private activation codes, monitor activation status, edit destinations, and pause or
            reactivate devices.
          </p>
        </div>
        <DevicesManager initialDevices={devices} configured={configured} siteUrl={siteUrl} />
      </section>
    </AdminShell>
  );
}
