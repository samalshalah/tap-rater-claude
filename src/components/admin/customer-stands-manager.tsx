"use client";

import { Check, Copy, Plus, Save } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import type { AdminCustomerStand } from "@/lib/customer-stands";
import { getPermanentStandUrl, standPrintStatuses, standStatuses, type StandPrintStatus, type StandStatus } from "@/lib/stand-domain";

type ProductOption = { slug: string; title: string };

export function CustomerStandsManager({ initialStands, products, configured, siteUrl }: { initialStands: AdminCustomerStand[]; products: ProductOption[]; configured: boolean; siteUrl: string }) {
  const [stands, setStands] = useState(initialStands);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const [createForm, setCreateForm] = useState({ customerEmail: "", businessName: "", productSlug: products[0]?.slug ?? "", initialDestinationUrl: "" });

  const summary = useMemo(
    () => ({ total: stands.length, setup: stands.filter((stand) => stand.status === "setup_required").length, printReady: stands.filter((stand) => stand.printStatus === "ready").length, shipped: stands.filter((stand) => stand.printStatus === "shipped").length }),
    [stands]
  );

  async function refresh() {
    const response = await fetch("/api/admin/stands");
    const body = await response.json().catch(() => null);
    if (response.ok && Array.isArray(body?.stands)) setStands(body.stands);
  }

  async function createStand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/stands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createForm)
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(body?.error ?? "Customer Stand could not be created.");
      return;
    }
    setMessage(`Customer Stand created: ${body.stand.permanentUrlPath}`);
    setCreateForm((current) => ({ ...current, initialDestinationUrl: "" }));
    await refresh();
  }

  async function updateStand(id: string, input: { status: StandStatus; printStatus: StandPrintStatus; nfcProgrammed: boolean; qrGenerated: boolean }) {
    setMessage("");
    const response = await fetch(`/api/admin/stands/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(body?.error ?? "Customer Stand could not be updated.");
      return;
    }
    setMessage("Customer Stand updated.");
    await refresh();
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <div className="mt-8 grid gap-6">
      {!configured ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">Database persistence is not configured. Stands cannot be loaded or saved.</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Customer Stands" value={summary.total} />
        <Summary label="Setup required" value={summary.setup} />
        <Summary label="Ready to print" value={summary.printReady} />
        <Summary label="Shipped" value={summary.shipped} />
      </div>

      <form onSubmit={createStand} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-brand" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-ink">Assign a Customer Stand</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Customer email" type="email" value={createForm.customerEmail} onChange={(value) => setCreateForm((current) => ({ ...current, customerEmail: value }))} required />
          <Field label="Business name" value={createForm.businessName} onChange={(value) => setCreateForm((current) => ({ ...current, businessName: value }))} required />
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Product
            <select value={createForm.productSlug} onChange={(event) => setCreateForm((current) => ({ ...current, productSlug: event.target.value }))} className="min-h-12 rounded-xl border border-line px-3 text-sm font-normal" required>
              {products.map((product) => <option key={product.slug} value={product.slug}>{product.title}</option>)}
            </select>
          </label>
          <Field label="Initial destination" type="url" value={createForm.initialDestinationUrl} onChange={(value) => setCreateForm((current) => ({ ...current, initialDestinationUrl: value }))} placeholder="Optional https://" />
        </div>
        <button disabled={!configured || !products.length} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-40">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create and assign
        </button>
      </form>

      {message ? <p className="rounded-2xl border border-line bg-white p-4 text-sm font-semibold text-ink shadow-sm">{message}</p> : null}

      <div className="grid gap-4">
        {stands.map((stand) => (
          <AdminStandRow key={stand.id} stand={stand} siteUrl={siteUrl} onSave={updateStand} onCopy={copy} copied={copied} />
        ))}
        {stands.length === 0 ? <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted shadow-sm">No assigned Customer Stands found.</p> : null}
      </div>
    </div>
  );
}

function AdminStandRow({ stand, siteUrl, onSave, onCopy, copied }: { stand: AdminCustomerStand; siteUrl: string; onSave: (id: string, input: { status: StandStatus; printStatus: StandPrintStatus; nfcProgrammed: boolean; qrGenerated: boolean }) => void; onCopy: (value: string) => void; copied: string }) {
  const [status, setStatus] = useState(stand.status);
  const [printStatus, setPrintStatus] = useState(stand.printStatus);
  const [nfcProgrammed, setNfcProgrammed] = useState(stand.nfcProgrammed);
  const [qrGenerated, setQrGenerated] = useState(stand.qrGenerated);
  const url = getPermanentStandUrl(stand.permanentUrlPath, siteUrl);

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr_auto] xl:items-center">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-brand">{stand.standCategory.replaceAll("-", " ")}</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{stand.productName}</h3>
          <p className="mt-1 text-sm text-muted">{stand.business?.businessName ?? "Business"} · {stand.customerEmail ?? "Customer"}</p>
          <p className="mt-3 truncate text-sm font-medium text-ink">{url}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Setup status" value={status} options={standStatuses} onChange={(value) => setStatus(value as StandStatus)} />
          <Select label="Print status" value={printStatus} options={standPrintStatuses} onChange={(value) => setPrintStatus(value as StandPrintStatus)} />
          <CheckField label="NFC programmed" checked={nfcProgrammed} onChange={setNfcProgrammed} />
          <CheckField label="QR generated" checked={qrGenerated} onChange={setQrGenerated} />
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <button type="button" onClick={() => onSave(stand.id, { status, printStatus, nfcProgrammed, qrGenerated })} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">
            <Save className="h-4 w-4" aria-hidden="true" /> Save
          </button>
          <button type="button" onClick={() => onCopy(url)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink">
            {copied === url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied === url ? "Copied" : "Copy URL"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-line bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-2 text-2xl font-semibold text-ink">{value}</p></div>;
}

function Field({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-semibold text-ink">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="min-h-12 rounded-xl border border-line px-3 text-sm font-normal" /></label>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="grid gap-2 text-xs font-semibold text-muted">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 rounded-xl border border-line px-3 text-sm font-normal text-ink">{options.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}</select></label>;
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex min-h-10 items-center gap-2 text-sm font-semibold text-ink"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>;
}
