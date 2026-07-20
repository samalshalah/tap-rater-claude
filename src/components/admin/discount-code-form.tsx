"use client";

import { type FormEvent, useState } from "react";

export function DiscountCodeForm() {
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);
    const usageLimit = String(form.get("usageLimit") ?? "");
    const expiresAt = String(form.get("expiresAt") ?? "");

    try {
      const response = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.get("code"),
          discountType: form.get("discountType"),
          value: Number(form.get("value")),
          isActive: form.get("isActive") === "true",
          usageLimit: usageLimit ? Number(usageLimit) : undefined,
          expiresAt: expiresAt || undefined,
          notes: form.get("notes")
        })
      });
      const body = await response.json().catch(() => ({}));
      setStatus({
        tone: response.ok ? "success" : "error",
        message: response.ok ? "Discount code saved." : (body.error ?? "Could not save discount code.")
      });
      if (response.ok) {
        event.currentTarget.reset();
      }
    } catch {
      setStatus({ tone: "error", message: "Could not save discount code." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm" onSubmit={submit}>
      <h2 className="text-[18px] font-semibold tracking-tightest text-ink">New discount code</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Code
          <input
            className="rounded-xl border border-line bg-white px-4 py-3 font-normal uppercase text-ink"
            name="code"
            placeholder="WELCOME10"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Type
          <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="discountType" defaultValue="percent">
            <option value="percent">Percent off</option>
            <option value="fixed_cents">Fixed amount off (cents)</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Value
          <input
            className="rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink"
            name="value"
            inputMode="numeric"
            placeholder="10 for 10%, or 500 for $5.00 off"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Status
          <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal" name="isActive" defaultValue="true">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Usage limit (optional)
          <input className="rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink" name="usageLimit" inputMode="numeric" placeholder="Unlimited if blank" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Expires (optional)
          <input className="rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink" name="expiresAt" type="date" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Notes
        <textarea className="rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink" name="notes" rows={2} placeholder="What this code is for, who it's shared with" />
      </label>
      <div className="flex items-center gap-3">
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted" disabled={isSaving}>
          {isSaving ? "Saving..." : "Create discount code"}
        </button>
        {status ? (
          <p className={status.tone === "success" ? "text-sm font-semibold text-brand" : "text-sm font-semibold text-red-600"}>{status.message}</p>
        ) : null}
      </div>
      <p className="text-xs leading-5 text-muted">
        Codes are created and tracked here now. Applying them to an actual checkout total is wired up alongside going live with
        Stripe, since that's the point a code would affect a real payment amount.
      </p>
    </form>
  );
}
