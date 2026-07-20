"use client";

import { type FormEvent, useState } from "react";
import type { ShippingConfigInput } from "@/lib/validators";

export function ShippingConfigForm({ initialValues }: { initialValues: ShippingConfigInput | null }) {
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);
    const freeThreshold = String(form.get("freeShippingThresholdCents") ?? "");

    try {
      const response = await fetch("/api/admin/shipping-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flatRateCents: Number(form.get("flatRateCents")),
          freeShippingThresholdCents: freeThreshold ? Number(freeThreshold) : undefined,
          shipsInternationally: form.get("shipsInternationally") === "true",
          estimatedDeliveryDays: form.get("estimatedDeliveryDays"),
          notes: form.get("notes")
        })
      });
      const body = await response.json().catch(() => ({}));
      setStatus({ tone: response.ok ? "success" : "error", message: response.ok ? "Shipping settings saved." : (body.error ?? "Save failed.") });
    } catch {
      setStatus({ tone: "error", message: "Save failed." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm" onSubmit={submit}>
      <h2 className="text-[20px] font-semibold tracking-tightest text-ink">Shipping configuration</h2>
      <p className="text-sm leading-6 text-muted">
        These are the actual numbers checkout will use once wired in. Fill in your real rate and delivery window before going
        live -- these fields don't have a sensible default I can guess for you.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Flat rate (cents)
          <input
            className="rounded-xl border border-line px-4 py-3 font-normal text-ink"
            name="flatRateCents"
            inputMode="numeric"
            defaultValue={initialValues?.flatRateCents ?? ""}
            placeholder="795 for $7.95"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Free shipping over (cents, optional)
          <input
            className="rounded-xl border border-line px-4 py-3 font-normal text-ink"
            name="freeShippingThresholdCents"
            inputMode="numeric"
            defaultValue={initialValues?.freeShippingThresholdCents ?? ""}
            placeholder="15000 for $150.00, blank for none"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Estimated delivery
          <input
            className="rounded-xl border border-line px-4 py-3 font-normal text-ink"
            name="estimatedDeliveryDays"
            defaultValue={initialValues?.estimatedDeliveryDays ?? ""}
            placeholder="3-7 business days"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Ships internationally?
          <select className="rounded-xl border border-line px-4 py-3 font-normal" name="shipsInternationally" defaultValue={initialValues?.shipsInternationally ? "true" : "false"}>
            <option value="false">US only</option>
            <option value="true">Yes, internationally</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Notes
        <textarea className="min-h-24 rounded-xl border border-line px-4 py-3 font-normal text-ink" name="notes" defaultValue={initialValues?.notes ?? ""} placeholder="Carrier, packaging, handling time" />
      </label>
      <div className="flex items-center gap-3">
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save shipping settings"}
        </button>
        {status ? <p className={status.tone === "success" ? "text-sm font-semibold text-brand" : "text-sm font-semibold text-red-600"}>{status.message}</p> : null}
      </div>
    </form>
  );
}
