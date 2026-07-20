"use client";

import { type FormEvent, useState } from "react";
import type { TaxConfigInput } from "@/lib/validators";

type StateRateRow = { state: string; ratePercent: string };

export function TaxConfigForm({ initialValues }: { initialValues: TaxConfigInput }) {
  const [rows, setRows] = useState<StateRateRow[]>(
    initialValues.stateRates.length > 0
      ? initialValues.stateRates.map((r) => ({ state: r.state, ratePercent: String(r.ratePercent) }))
      : [{ state: "VA", ratePercent: "6" }]
  );
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateRow(index: number, field: keyof StateRateRow, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, { state: "", ratePercent: "" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);
    const stateRates = rows
      .filter((row) => row.state.trim() && row.ratePercent.trim())
      .map((row) => ({ state: row.state.trim().toUpperCase(), ratePercent: Number(row.ratePercent) }));

    try {
      const response = await fetch("/api/admin/tax-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: form.get("provider"),
          stateRates,
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
    <form className="grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm" onSubmit={submit}>
      <h2 className="text-[20px] font-semibold tracking-tightest text-ink">Tax configuration</h2>
      <p className="text-sm leading-6 text-muted">
        Rates are stored per state, not hardcoded, so adding nexus in a new state later is just another row here -- no code
        change needed. Confirm rates with an accountant, especially if local/county tax adds on top of the state rate.
      </p>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Provider
        <select className="rounded-xl border border-line px-4 py-3 font-normal" name="provider" defaultValue={initialValues.provider}>
          <option value="manual">Manual rates (set below)</option>
          <option value="stripe_tax">Stripe Tax (automatic)</option>
          <option value="none">Not decided yet</option>
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Prices shown to customers
        <select className="rounded-xl border border-line px-4 py-3 font-normal" name="pricesIncludeTax" defaultValue={initialValues.pricesIncludeTax ? "true" : "false"}>
          <option value="false">Tax added at checkout (prices shown are pre-tax)</option>
          <option value="true">Tax included in displayed price</option>
        </select>
      </label>

      <div className="grid gap-3">
        <p className="text-sm font-semibold text-ink">Nexus states and rates</p>
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              className="w-20 rounded-xl border border-line px-3 py-2 text-center font-normal uppercase text-ink"
              value={row.state}
              onChange={(e) => updateRow(index, "state", e.target.value)}
              maxLength={2}
              placeholder="VA"
            />
            <div className="flex items-center gap-2">
              <input
                className="w-24 rounded-xl border border-line px-3 py-2 font-normal text-ink"
                value={row.ratePercent}
                onChange={(e) => updateRow(index, "ratePercent", e.target.value)}
                inputMode="decimal"
                placeholder="6"
              />
              <span className="text-sm text-muted">%</span>
            </div>
            <button type="button" onClick={() => removeRow(index)} className="text-xs font-semibold text-red-600 hover:text-red-700">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addRow} className="w-fit rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink hover:border-ink">
          + Add another state
        </button>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Notes
        <textarea className="min-h-24 rounded-xl border border-line px-4 py-3 font-normal text-ink" name="notes" defaultValue={initialValues.notes} placeholder="Exemptions, accountant contact, filing schedule" />
      </label>

      <div className="flex items-center gap-3">
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save tax settings"}
        </button>
        {status ? <p className={status.tone === "success" ? "text-sm font-semibold text-brand" : "text-sm font-semibold text-red-600"}>{status.message}</p> : null}
      </div>
    </form>
  );
}
