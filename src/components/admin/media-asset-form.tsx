"use client";

import { type FormEvent, useState } from "react";

export function MediaAssetForm() {
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          src: form.get("src"),
          alt: form.get("alt"),
          assetType: form.get("assetType")
        })
      });
      const body = await response.json().catch(() => ({}));
      setStatus({
        tone: response.ok ? "success" : "error",
        message: response.ok ? "Media asset registered." : (body.error ?? "Could not register media asset.")
      });
      if (response.ok) {
        event.currentTarget.reset();
      }
    } catch {
      setStatus({ tone: "error", message: "Could not register media asset." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm" onSubmit={submit}>
      <h2 className="text-[18px] font-semibold tracking-tightest text-ink">Register a media asset</h2>
      <p className="text-xs leading-5 text-muted">
        This catalogs an asset already uploaded to <code>/public/uploads/...</code> (or any URL) so it's easy to find and reuse.
        It doesn't upload files itself -- for that, add the file to the repo the way images have been added throughout this
        project, then register it here.
      </p>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Title
        <input className="rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink outline-none transition focus:border-ink" name="title" placeholder="Trustpilot Review Stand photo" required />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        URL / path
        <input className="rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink outline-none transition focus:border-ink" name="src" placeholder="/uploads/products/v5/trustpilot-review-stand.png" required />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Alt text
        <input className="rounded-xl border border-line bg-white px-4 py-3 font-normal text-ink outline-none transition focus:border-ink" name="alt" placeholder="Tap Rater Trustpilot Review Stand" />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Type
        <select className="rounded-xl border border-line bg-white px-4 py-3 font-normal outline-none transition focus:border-ink" name="assetType" defaultValue="image">
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </label>
      <div className="flex items-center gap-3">
        <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted" disabled={isSaving}>
          {isSaving ? "Saving..." : "Register asset"}
        </button>
        {status ? <p className={status.tone === "success" ? "text-sm font-semibold text-brand" : "text-sm font-semibold text-red-600"}>{status.message}</p> : null}
      </div>
    </form>
  );
}
