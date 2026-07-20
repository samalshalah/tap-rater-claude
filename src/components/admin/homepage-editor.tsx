"use client";

import { type FormEvent, useState } from "react";
import type { HomepageContentInput } from "@/lib/validators";

export function HomepageEditor({ content }: { content: HomepageContentInput }) {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/cms/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eyebrow: form.get("eyebrow"),
        heroTitle: form.get("heroTitle"),
        heroDescription: form.get("heroDescription"),
        primaryButtonLabel: form.get("primaryButtonLabel"),
        primaryButtonHref: form.get("primaryButtonHref"),
        secondaryButtonLabel: form.get("secondaryButtonLabel"),
        secondaryButtonHref: form.get("secondaryButtonHref"),
        featuredBadge: form.get("featuredBadge"),
        featuredLabel: form.get("featuredLabel")
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Homepage saved." : body.error ?? "Homepage save failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <Input name="eyebrow" label="Eyebrow" defaultValue={content.eyebrow} />
      <Input name="heroTitle" label="Hero title" defaultValue={content.heroTitle} />
      <Textarea name="heroDescription" label="Hero description" defaultValue={content.heroDescription} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="primaryButtonLabel" label="Primary button label" defaultValue={content.primaryButtonLabel} />
        <Input name="primaryButtonHref" label="Primary button URL" defaultValue={content.primaryButtonHref} />
        <Input name="secondaryButtonLabel" label="Secondary button label" defaultValue={content.secondaryButtonLabel} />
        <Input name="secondaryButtonHref" label="Secondary button URL" defaultValue={content.secondaryButtonHref} />
      </div>
      <Input name="featuredBadge" label="Featured badge" defaultValue={content.featuredBadge} />
      <Input name="featuredLabel" label="Featured product label" defaultValue={content.featuredLabel} />
      <button className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand">Save homepage</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}

function Input({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input className="rounded-xl border border-line px-4 py-3 font-normal text-ink" name={name} defaultValue={defaultValue} required />
    </label>
  );
}

function Textarea({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <textarea className="min-h-28 rounded-xl border border-line px-4 py-3 font-normal text-ink" name={name} defaultValue={defaultValue} required />
    </label>
  );
}
