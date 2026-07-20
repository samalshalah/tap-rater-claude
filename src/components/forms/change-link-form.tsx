"use client";

import { type FormEvent, useState } from "react";

export function ChangeLinkForm() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/forms/change-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        tapraterId: form.get("tapraterId"),
        newReviewUrl: form.get("newReviewUrl"),
        notes: form.get("notes") ?? ""
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Change request sent." : body.error ?? "Change request failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="name" placeholder="Name" required />
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="email" type="email" placeholder="Email" required />
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="tapraterId" placeholder="TapRater ID or product SKU" required />
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="newReviewUrl" type="url" placeholder="New review or feedback URL" required />
      <textarea className="min-h-28 rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="notes" placeholder="Notes" />
      <button className="rounded-full bg-brand px-5 py-3 text-sm font-medium text-white">Send change request</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}
