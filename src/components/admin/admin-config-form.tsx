"use client";

import { type FormEvent, useState } from "react";

type AdminConfigFormProps = {
  area: string;
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  notesLabel: string;
  primaryPlaceholder: string;
  secondaryPlaceholder: string;
  notesPlaceholder: string;
  initialValues?: {
    status?: string;
    settings?: { primary?: string; secondary?: string; notes?: string };
  } | null;
};

export function AdminConfigForm({
  area,
  title,
  primaryLabel,
  secondaryLabel,
  notesLabel,
  primaryPlaceholder,
  secondaryPlaceholder,
  notesPlaceholder,
  initialValues
}: AdminConfigFormProps) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        area,
        title,
        status: form.get("status"),
        settings: {
          primary: form.get("primary"),
          secondary: form.get("secondary"),
          notes: form.get("notes") ?? ""
        }
      })
    });
    const body = await response.json();
    setStatus(response.ok ? `${title} settings saved.` : body.error ?? "Settings save failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      {initialValues ? (
        <p className="rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-brand">
          Showing your last saved settings for {title.toLowerCase()}.
        </p>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-ink">
        {primaryLabel}
        <input
          className="rounded-xl border border-line px-4 py-3 font-normal text-ink"
          name="primary"
          defaultValue={initialValues?.settings?.primary ?? ""}
          placeholder={primaryPlaceholder}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        {secondaryLabel}
        <input
          className="rounded-xl border border-line px-4 py-3 font-normal text-ink"
          name="secondary"
          defaultValue={initialValues?.settings?.secondary ?? ""}
          placeholder={secondaryPlaceholder}
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        {notesLabel}
        <textarea
          className="min-h-28 rounded-xl border border-line px-4 py-3 font-normal text-ink"
          name="notes"
          defaultValue={initialValues?.settings?.notes ?? ""}
          placeholder={notesPlaceholder}
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Status
        <select className="rounded-xl border border-line px-4 py-3 font-normal text-ink" name="status" defaultValue={initialValues?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand">Save {title}</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}
