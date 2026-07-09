"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { AdminDevice } from "@/lib/admin-devices";

type DevicesManagerProps = {
  initialDevices: AdminDevice[];
  configured: boolean;
  siteUrl: string;
};

type CreatedDevice = {
  deviceCode: string;
  activationCode: string;
  deviceUrl: string;
};

const productTypes = [
  "google_review",
  "facebook_review",
  "yelp_profile",
  "appointment_booking",
  "social_follow",
  "wifi_menu",
  "multi_platform_review",
  "feedback_form",
  "referral_form",
  "business_card",
  "custom_url"
];

const serviceModes = ["basic_redirect", "managed_redirect", "premium_landing_page"];
const statuses = ["unactivated", "active", "paused", "lost", "retired"];
const destinationTypes = ["", "google_review", "facebook_review", "yelp_profile", "booking", "social", "menu", "wifi", "custom", "landing_page"];

export function DevicesManager({ initialDevices, configured, siteUrl }: DevicesManagerProps) {
  const [devices, setDevices] = useState(initialDevices);
  const [message, setMessage] = useState("");
  const [createdDevice, setCreatedDevice] = useState<CreatedDevice | null>(null);
  const [createForm, setCreateForm] = useState({
    productType: "google_review",
    serviceMode: "basic_redirect",
    deviceCode: "",
    activationCode: "",
    label: ""
  });

  const summary = useMemo(
    () => ({
      total: devices.length,
      active: devices.filter((device) => device.status === "active").length,
      unactivated: devices.filter((device) => device.status === "unactivated").length,
      taps: devices.reduce((sum, device) => sum + device.tapCount, 0)
    }),
    [devices]
  );

  async function refreshDevices() {
    const response = await fetch("/api/admin/devices");
    const body = await response.json().catch(() => null);
    if (response.ok && Array.isArray(body?.devices)) {
      setDevices(body.devices);
    }
  }

  async function createDevice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setCreatedDevice(null);

    const response = await fetch("/api/admin/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm)
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(body?.error ?? "Device could not be created.");
      return;
    }

    setCreatedDevice(body.device);
    setMessage("Device created. Copy the activation code now; it will not be shown again.");
    setCreateForm({ productType: "google_review", serviceMode: "basic_redirect", deviceCode: "", activationCode: "", label: "" });
    await refreshDevices();
  }

  async function updateDevice(id: string, form: HTMLFormElement) {
    setMessage("");
    const formData = new FormData(form);
    const response = await fetch(`/api/admin/devices/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: String(formData.get("status") ?? ""),
        destinationType: String(formData.get("destinationType") ?? ""),
        destinationUrl: String(formData.get("destinationUrl") ?? ""),
        label: String(formData.get("label") ?? "")
      })
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(body?.error ?? "Device could not be updated.");
      return;
    }

    setMessage("Device updated.");
    await refreshDevices();
  }

  function deviceUrl(deviceCode: string) {
    return `${siteUrl.replace(/\/$/, "")}/r/${encodeURIComponent(deviceCode)}`;
  }

  function activationInstructions(deviceCode: string) {
    return `Scan or tap your Tap Rater, then enter your private activation code at ${siteUrl.replace(/\/$/, "")}/activate?device=${encodeURIComponent(deviceCode)}.`;
  }

  async function copyText(value: string) {
    await navigator.clipboard?.writeText(value);
    setMessage("Copied.");
  }

  return (
    <div className="mt-8 grid gap-6">
      {!configured ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
          Database persistence is not configured yet. Devices can be planned here, but records cannot be loaded or saved.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total devices" value={String(summary.total)} />
        <SummaryCard label="Active" value={String(summary.active)} />
        <SummaryCard label="Unactivated" value={String(summary.unactivated)} />
        <SummaryCard label="Tap events" value={String(summary.taps)} />
      </div>

      <form onSubmit={createDevice} className="grid gap-4 rounded-md border border-line bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-ink">Create device</h2>
          <p className="mt-1 text-sm text-muted">Leave codes blank to auto-generate. The activation code is shown once after creation.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          <Select label="Product type" value={createForm.productType} options={productTypes} onChange={(value) => setCreateForm((form) => ({ ...form, productType: value }))} />
          <Select label="Service mode" value={createForm.serviceMode} options={serviceModes} onChange={(value) => setCreateForm((form) => ({ ...form, serviceMode: value }))} />
          <TextInput label="Device code" value={createForm.deviceCode} placeholder="Auto" onChange={(value) => setCreateForm((form) => ({ ...form, deviceCode: value }))} />
          <TextInput label="Activation code" value={createForm.activationCode} placeholder="Auto" onChange={(value) => setCreateForm((form) => ({ ...form, activationCode: value }))} />
          <TextInput label="Label" value={createForm.label} placeholder="Counter stand" onChange={(value) => setCreateForm((form) => ({ ...form, label: value }))} />
        </div>
        <button disabled={!configured} className="w-fit rounded-md bg-brand px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-muted">
          Create device
        </button>
      </form>

      {createdDevice ? (
        <div className="rounded-md border border-green-200 bg-green-50 p-5 text-sm text-green-900">
          <p className="font-black">Activation code shown once</p>
          <p className="mt-2">Device: {createdDevice.deviceCode}</p>
          <p className="mt-1">Activation code: {createdDevice.activationCode}</p>
          <p className="mt-1 break-all">Device URL: {createdDevice.deviceUrl}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => copyText(createdDevice.deviceUrl)} className="rounded-md bg-white px-4 py-2 font-bold text-ink">
              Copy device URL
            </button>
            <button type="button" onClick={() => copyText(activationInstructions(createdDevice.deviceCode))} className="rounded-md bg-white px-4 py-2 font-bold text-ink">
              Copy activation instructions
            </button>
          </div>
        </div>
      ) : null}

      {message ? <div className="rounded-md border border-line bg-white p-4 text-sm font-semibold text-ink shadow-sm">{message}</div> : null}

      <div className="overflow-x-auto rounded-md border border-line bg-white shadow-sm">
        <table className="w-full min-w-[1300px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-gray-50 text-xs uppercase text-muted">
              <th className="p-4">Device code</th>
              <th className="p-4">Product</th>
              <th className="p-4">Mode</th>
              <th className="p-4">Status</th>
              <th className="p-4">Business</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Taps</th>
              <th className="p-4">Activated</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <DeviceRow key={device.id} device={device} deviceUrl={deviceUrl(device.deviceCode)} onCopy={copyText} onSave={updateDevice} activationInstructions={activationInstructions(device.deviceCode)} />
            ))}
            {devices.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-6 text-center text-muted">
                  No devices found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeviceRow({
  device,
  deviceUrl,
  activationInstructions,
  onCopy,
  onSave
}: {
  device: AdminDevice;
  deviceUrl: string;
  activationInstructions: string;
  onCopy: (value: string) => void;
  onSave: (id: string, form: HTMLFormElement) => void;
}) {
  return (
    <tr className="border-b border-line align-top last:border-b-0">
      <td className="p-4 font-black text-ink">{device.deviceCode}</td>
      <td className="p-4 text-muted">{device.productType}</td>
      <td className="p-4 text-muted">{device.serviceMode}</td>
      <td className="p-4">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase text-ink">{device.status}</span>
      </td>
      <td className="p-4 text-muted">{device.businessName ?? "-"}</td>
      <td className="p-4 text-muted">{device.customerEmail ?? "-"}</td>
      <td className="p-4 text-muted">
        <p>{device.destinationType ?? "-"}</p>
        <p className="mt-1 max-w-[240px] truncate">{device.destinationUrl ?? ""}</p>
      </td>
      <td className="p-4 font-bold text-ink">{device.tapCount}</td>
      <td className="p-4 text-muted">{device.activatedAt ? new Date(device.activatedAt).toLocaleDateString() : "-"}</td>
      <td className="p-4">
        <form
          className="grid min-w-[280px] gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSave(device.id, event.currentTarget);
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            <select name="status" defaultValue={device.status} className="rounded-md border border-line px-3 py-2">
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select name="destinationType" defaultValue={device.destinationType ?? ""} className="rounded-md border border-line px-3 py-2">
              {destinationTypes.map((type) => (
                <option key={type || "none"} value={type}>
                  {type || "none"}
                </option>
              ))}
            </select>
          </div>
          <input name="destinationUrl" defaultValue={device.destinationUrl ?? ""} placeholder="https://" className="rounded-md border border-line px-3 py-2" />
          <input name="label" defaultValue={device.label ?? ""} placeholder="Label" className="rounded-md border border-line px-3 py-2" />
          <div className="flex flex-wrap gap-2">
            <button className="rounded-md bg-brand px-3 py-2 text-xs font-bold text-white">Save</button>
            <button type="button" onClick={() => onCopy(deviceUrl)} className="rounded-md border border-line px-3 py-2 text-xs font-bold text-ink">
              Copy URL
            </button>
            <button type="button" onClick={() => onCopy(activationInstructions)} className="rounded-md border border-line px-3 py-2 text-xs font-bold text-ink">
              Copy instructions
            </button>
          </div>
        </form>
      </td>
    </tr>
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

function TextInput({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="rounded-md border border-line px-3 py-2 text-sm" />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-md border border-line px-3 py-2 text-sm">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
