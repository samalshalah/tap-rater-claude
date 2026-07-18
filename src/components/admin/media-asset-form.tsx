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
    <form className="grid gap-4 rounded-md border border-line bg-white p-4 shadow-sm" onSubmit={submit}>
      <h2 className="text-lg font-black text-ink">Register a media asset</h2>
      <p className="text-xs leading-5 text-muted">
        This catalogs an asset already uploaded to <code>/public/uploads/...</code> (or any URL) so it's easy to find and reuse.
        It doesn't upload files itself -- for that, add the file to the repo the way images have been added throughout this
        project, then register it here.
      </p>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Title
        <input className="rounded-md border border-line bg-white px-4 py-3 font-normal text-ink" name="title" placeholder="Trustpilot Review Stand photo" required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        URL / path
        <input className="rounded-md border border-line bg-white px-4 py-3 font-normal text-ink" name="src" placeholder="/uploads/products/v5/trustpilot-review-stand.png" required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Alt text
        <input className="rounded-md border border-line bg-white px-4 py-3 font-normal text-ink" name="alt" placeholder="Tap Rater Trustpilot Review Stand" />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">
        Type
        <select className="rounded-md border border-line bg-white px-4 py-3 font-normal" name="assetType" defaultValue="image">
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </label>
      <div className="flex items-center gap-3">
        <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300" disabled={isSaving}>
          {isSaving ? "Saving..." : "Register asset"}
        </button>
        {status ? <p className={status.tone === "success" ? "text-sm font-bold text-brand" : "text-sm font-bold text-red-600"}>{status.message}</p> : null}
      </div>
    </form>
  );
}
