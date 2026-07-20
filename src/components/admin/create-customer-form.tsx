"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CreateCustomerForm() {
  const router = useRouter();
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          name: form.get("name"),
          phone: form.get("phone")
        })
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus({ tone: "success", message: "Customer created." });
        event.currentTarget.reset();
        router.refresh();
      } else {
        setStatus({ tone: "error", message: body.error ?? "Could not create customer." });
      }
    } catch {
      setStatus({ tone: "error", message: "Could not create customer." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm" onSubmit={submit}>
      <h2 className="text-lg font-semibold text-ink">Add a customer</h2>
      <p className="text-sm leading-6 text-muted">
        For phone orders, walk-ins, or test accounts. This just creates the contact record -- customers log in with a magic link
        sent to their email, there's no password to set here.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-ink">
          Email
          <input className="rounded-xl border border-line px-4 py-3 font-normal text-ink" name="email" type="email" placeholder="customer@example.com" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Name (optional)
          <input className="rounded-xl border border-line px-4 py-3 font-normal text-ink" name="name" placeholder="Jane Doe" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink">
          Phone (optional)
          <input className="rounded-xl border border-line px-4 py-3 font-normal text-ink" name="phone" placeholder="(555) 555-5555" />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted" disabled={isSaving}>
          {isSaving ? "Creating..." : "Create customer"}
        </button>
        {status ? <p className={status.tone === "success" ? "text-sm font-bold text-brand" : "text-sm font-bold text-red-600"}>{status.message}</p> : null}
      </div>
    </form>
  );
}
