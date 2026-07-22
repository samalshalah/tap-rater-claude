"use client";

import { ArrowDown, ArrowUp, Eye, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultLinkLabel, standLinkTypes, type CustomerStand, type StandDestinationLink, type StandLinkType } from "@/lib/stand-domain";

type EditableLink = Pick<StandDestinationLink, "label" | "type" | "provider" | "url" | "isActive"> & { key: string };

export function StandSetupEditor({ stand }: { stand: CustomerStand }) {
  const router = useRouter();
  const [links, setLinks] = useState<EditableLink[]>(() =>
    stand.destinationLinks.map((link, index) => ({ ...link, key: link.id ?? `${index}-${link.url}` }))
  );
  const [pageTitle, setPageTitle] = useState(stand.hostedPageConfig?.pageTitle ?? stand.business?.businessName ?? stand.productName);
  const [pageSubtitle, setPageSubtitle] = useState(stand.hostedPageConfig?.pageSubtitle ?? "");
  const [businessLogoUrl, setBusinessLogoUrl] = useState(stand.hostedPageConfig?.businessLogoUrl ?? stand.business?.logoUrl ?? "");
  const [primaryColor, setPrimaryColor] = useState(stand.hostedPageConfig?.primaryColor ?? "#0a6c64");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function addLink() {
    const type = stand.requiredLinkTypes[0] ?? "custom";
    setLinks((current) => [
      ...current,
      { key: crypto.randomUUID(), label: defaultLinkLabel(type), type, provider: stand.supportedProviders[0] ?? "", url: "", isActive: true }
    ]);
  }

  function updateLink(index: number, values: Partial<EditableLink>) {
    setLinks((current) => current.map((link, linkIndex) => (index === linkIndex ? { ...link, ...values } : link)));
  }

  function moveLink(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    setLinks((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save(completeSetup: boolean) {
    setStatus("saving");
    setMessage("");
    const response = await fetch(`/api/dashboard/stands/${encodeURIComponent(stand.publicSlug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        links: links.map(({ key: _key, ...link }) => link),
        hostedPageConfig:
          stand.mode === "hosted_page"
            ? { pageTitle, pageSubtitle, businessLogoUrl, theme: "light", primaryColor }
            : undefined,
        completeSetup
      })
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(body?.error ?? "Stand setup could not be saved.");
      return;
    }

    setStatus("success");
    setMessage(completeSetup ? "Setup is complete and ready for print." : "Stand setup saved.");
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      {stand.mode === "hosted_page" ? (
        <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold text-ink">Hosted tap page</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField label="Page title" value={pageTitle} onChange={setPageTitle} required />
            <TextField label="Page subtitle" value={pageSubtitle} onChange={setPageSubtitle} />
            <TextField label="Business logo URL" value={businessLogoUrl} onChange={setBusinessLogoUrl} type="url" placeholder="https://" />
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Button color
              <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-line px-3">
                <input type="color" value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0" />
                <input value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} pattern="#[0-9a-fA-F]{6}" className="min-w-0 flex-1 text-sm font-normal outline-none" aria-label="Button color hex value" />
              </span>
            </label>
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-ink">Destination links</h2>
            <p className="mt-1 text-sm text-muted">The permanent stand URL stays the same when these links change.</p>
          </div>
          <button type="button" onClick={addLink} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add link
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {links.map((link, index) => (
            <div key={link.key} className="grid gap-3 rounded-2xl border border-line p-4 lg:grid-cols-[1fr_150px_150px_1.5fr_auto] lg:items-end">
              <TextField label="Label" value={link.label} onChange={(value) => updateLink(index, { label: value })} required />
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Type
                <select value={link.type} onChange={(event) => updateLink(index, { type: event.target.value as StandLinkType })} className="min-h-12 rounded-2xl border border-line px-3 text-sm font-normal">
                  {standLinkTypes.map((type) => (
                    <option key={type} value={type}>{formatOption(type)}</option>
                  ))}
                </select>
              </label>
              <TextField label="Provider" value={link.provider ?? ""} onChange={(value) => updateLink(index, { provider: value })} placeholder="google" />
              <TextField label="Destination URL" value={link.url} onChange={(value) => updateLink(index, { url: value })} type="url" placeholder="https://" required />
              <div className="flex items-center gap-1">
                <label className="mr-2 flex min-h-10 items-center gap-2 text-xs font-semibold text-ink">
                  <input type="checkbox" checked={link.isActive} onChange={(event) => updateLink(index, { isActive: event.target.checked })} />
                  Active
                </label>
                <IconButton label="Move link up" onClick={() => moveLink(index, -1)} disabled={index === 0}><ArrowUp /></IconButton>
                <IconButton label="Move link down" onClick={() => moveLink(index, 1)} disabled={index === links.length - 1}><ArrowDown /></IconButton>
                <IconButton label="Remove link" onClick={() => setLinks((current) => current.filter((_, linkIndex) => linkIndex !== index))}><Trash2 /></IconButton>
              </div>
            </div>
          ))}
          {links.length === 0 ? <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">No destination links yet.</p> : null}
        </div>

        {message ? <p className={`mt-5 text-sm font-medium ${status === "error" ? "text-red-600" : "text-brand"}`}>{message}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => save(false)} disabled={status === "saving"} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink px-5 text-sm font-semibold text-ink disabled:opacity-50">
            <Save className="h-4 w-4" aria-hidden="true" />
            Save changes
          </button>
          <button type="button" onClick={() => save(true)} disabled={status === "saving"} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-50">
            Mark setup complete
          </button>
          <Link href={`/dashboard/stands/${stand.publicSlug}/preview`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ink">
            <Eye className="h-4 w-4" aria-hidden="true" />
            Preview
          </Link>
        </div>
      </section>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="min-h-12 min-w-0 rounded-2xl border border-line px-4 text-sm font-normal outline-none focus:border-ink" />
    </label>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactElement<{ className?: string }> }) {
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick} disabled={disabled} className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-[#f5f5f7] hover:text-ink disabled:opacity-30">
      {children}
    </button>
  );
}

function formatOption(value: string) {
  return value.replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase());
}
