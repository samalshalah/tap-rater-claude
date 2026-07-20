"use client";

import { type FormEvent, useState } from "react";

export function SetupForm() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/forms/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        businessName: form.get("businessName"),
        reviewUrl: form.get("reviewUrl"),
        notes: form.get("notes") ?? ""
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Setup request sent." : body.error ?? "Setup request failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="name" placeholder="Name" required />
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="email" type="email" placeholder="Email" required />
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="businessName" placeholder="Business name" required />
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="reviewUrl" type="url" placeholder="Google, Facebook, Yelp, or feedback URL" required />
      <textarea className="min-h-28 rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="notes" placeholder="Product, color, or setup notes" />
      <button className="rounded-full bg-brand px-5 py-3 text-sm font-medium text-white">Send setup request</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}
