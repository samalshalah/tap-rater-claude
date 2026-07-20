"use client";

import { type FormEvent, useState } from "react";

export function PasswordSetupLinkGenerator() {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    setStatus(null);
    setLink("");

    try {
      const response = await fetch("/api/admin/customers/password-setup-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        setLink(body.url);
      } else {
        setStatus({ tone: "error", message: body.error ?? "Could not generate a link." });
      }
    } catch {
      setStatus({ tone: "error", message: "Could not generate a link." });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <form className="grid gap-3 rounded-2xl border border-line bg-white p-5 shadow-sm" onSubmit={submit}>
      <h2 className="text-[18px] font-semibold tracking-tightest text-ink">Password setup link</h2>
      <p className="text-sm leading-6 text-muted">
        Generates a one-hour link the customer opens to set their own password -- this never sees or stores a password value
        here, the customer types it themselves on the page the link opens.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@example.com"
          className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink"
          required
        />
        <button
          disabled={isGenerating}
          className="shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Generate link"}
        </button>
      </div>
      {link ? (
        <div className="rounded-xl bg-teal-50 p-3 text-xs">
          <p className="font-semibold text-brand">Send this link to the customer:</p>
          <a href={link} className="mt-1 block break-all text-brand underline">
            {link}
          </a>
        </div>
      ) : null}
      {status ? <p className="text-sm font-semibold text-red-600">{status.message}</p> : null}
    </form>
  );
}
