"use client";

import { type FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/forms/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message")
      })
    });
    const body = await response.json();
    setStatus(response.ok ? "Message sent." : body.error ?? "Message failed.");
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="name" placeholder="Name" required />
      <input className="rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="email" type="email" placeholder="Email" required />
      <textarea className="min-h-32 rounded-xl border border-line px-4 py-3 outline-none transition focus:border-ink" name="message" placeholder="Message" required />
      <button className="rounded-full bg-brand px-5 py-3 text-sm font-medium text-white">Send message</button>
      {status ? <p className="text-sm font-semibold text-ink">{status}</p> : null}
    </form>
  );
}
