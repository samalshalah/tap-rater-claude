"use client";

import { type FormEvent, useState } from "react";
import type { TaxConfigInput } from "@/lib/validators";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function TaxConfigForm({ initialValues }: { initialValues: TaxConfigInput | null }) {
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);
    const nexusStates = form.getAll("nexusStates").map(String);

    try {
      const response = await fetch("/api/admin/tax-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: form.get("provider"),
          nexusStates,
          pricesIncludeTax: form.get("pricesIncludeTax") === "true",
          notes: form.get("notes")
        })
      });
      const body = await response.json().catch(() => ({}));
      setStatus({ tone: response.ok ? "success" : "error", message: response.ok ? "Tax settings saved." : (body.error ?? "Save failed.") });
    } catch {
      setStatus({ tone: "error", message: "Save failed." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4 rounded-md border border-line bg-white p-5 shadow-sm" onSubmit={submit}>
      <h2 className="text-xl font-black text-ink">Tax configuration</h2>
      <p className="text-sm leading-6 text-muted">
        Sales tax nexus is a real legal question -- which states you're required to collect tax in depends on where you have a
        physical presence or meet economic nexus thresholds. Confirm with an accountant before setting this. Stripe Tax can
        calculate and file automatically if you'd rather not manage rates yourself.
      </p>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Provider
        <select className="rounded-md border border-line px-4 py-3 font-normal" name="provider" defaultValue={initialValues?.provider ?? "none"}>
          <option value="none">Not decided yet</option>
          <option value="stripe_tax">Stripe Tax (automatic)</option>
          <option value="manual">Manual rates</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Prices shown to customers
        <select className="rounded-md border border-line px-4 py-3 font-normal" name="pricesIncludeTax" defaultValue={initialValues?.pricesIncludeTax ? "true" : "false"}>
          <option value="false">Tax added at checkout (prices shown are pre-tax)</option>
          <option value="true">Tax included in displayed price</option>
        </select>
      </label>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold text-ink">Nexus states (where you collect tax)</legend>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
          {US_STATES.map((state) => (
            <label key={state} className="flex items-center gap-1 text-xs font-semibold text-ink">
              <input type="checkbox" name="nexusStates" value={state} defaultChecked={initialValues?.nexusStates?.includes(state)} />
              {state}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Notes
        <textarea className="min-h-24 rounded-md border border-line px-4 py-3 font-normal text-ink" name="notes" defaultValue={initialValues?.notes ?? ""} placeholder="Exemptions, accountant contact, filing schedule" />
      </label>
      <div className="flex items-center gap-3">
        <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save tax settings"}
        </button>
        {status ? <p className={status.tone === "success" ? "text-sm font-bold text-brand" : "text-sm font-bold text-red-600"}>{status.message}</p> : null}
      </div>
    </form>
  );
}
