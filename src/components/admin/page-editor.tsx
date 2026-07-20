"use client";

import { type FormEvent, useState } from "react";

export function PageEditor() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/cms/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.get("slug"),
        title: form.get("title"),
        seoTitle: form.get("seoTitle"),
        seoDescription: form.get("seoDescription"),
        body: form.get("body"),
        status: form.get("status")
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Page saved." : body.error ?? "Page save failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Input name="slug" label="Page slug" placeholder="about-us" />
      <Input name="title" label="Page title" placeholder="About Tap Rater" />
      <Input name="seoTitle" label="SEO title" placeholder="About Tap Rater" />
      <Textarea name="seoDescription" label="SEO description" placeholder="Short search result description." />
      <Textarea name="body" label="Page body" placeholder="Page content..." tall />
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Status
        <select className="rounded-xl border border-line px-4 py-3 font-normal outline-none transition focus:border-ink" name="status" defaultValue="draft">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand">Save page</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}

function Input({ name, label, placeholder }: { name: string; label: string; placeholder: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input className="rounded-xl border border-line px-4 py-3 font-normal text-ink outline-none transition focus:border-ink" name={name} placeholder={placeholder} required />
    </label>
  );
}

function Textarea({ name, label, placeholder, tall = false }: { name: string; label: string; placeholder: string; tall?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <textarea className={`${tall ? "min-h-56" : "min-h-24"} rounded-xl border border-line px-4 py-3 font-normal text-ink`} name={name} placeholder={placeholder} required />
    </label>
  );
}
