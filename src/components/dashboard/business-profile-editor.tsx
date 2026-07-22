"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CustomerStandBusiness } from "@/lib/stand-domain";

export function BusinessProfileEditor({ business }: { business?: CustomerStandBusiness }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("saving");
    setMessage("");
    const data = new FormData(form);
    const response = await fetch("/api/dashboard/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId: business?.id,
        businessName: data.get("businessName"),
        logoUrl: data.get("logoUrl"),
        websiteUrl: data.get("websiteUrl"),
        phone: data.get("phone"),
        address: data.get("address")
      })
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(body?.error ?? "Business profile could not be saved.");
      return;
    }

    setStatus("success");
    setMessage(business ? "Business profile saved." : "Business profile created.");
    if (!business) form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">{business?.businessName ?? "Add a business"}</h2>
          <p className="mt-1 text-sm text-muted">Business details used on your hosted tap pages.</p>
        </div>
        <button disabled={status === "saving"} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white disabled:opacity-50">
          <Save className="h-4 w-4" aria-hidden="true" />
          {status === "saving" ? "Saving" : "Save"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Business name" name="businessName" defaultValue={business?.businessName} required />
        <Field label="Logo URL" name="logoUrl" type="url" defaultValue={business?.logoUrl} placeholder="https://" />
        <Field label="Website" name="websiteUrl" type="url" defaultValue={business?.websiteUrl} placeholder="https://" />
        <Field label="Phone" name="phone" type="tel" defaultValue={business?.phone} />
        <label className="grid gap-2 text-sm font-semibold text-ink sm:col-span-2">
          Address
          <textarea name="address" defaultValue={business?.address} rows={3} className="resize-y rounded-2xl border border-line px-4 py-3 text-sm font-normal outline-none focus:border-ink" />
        </label>
      </div>
      {message ? <p className={`mt-4 text-sm font-medium ${status === "error" ? "text-red-600" : "text-brand"}`}>{message}</p> : null}
    </form>
  );
}

function Field({ label, name, type = "text", defaultValue, placeholder, required }: { label: string; name: string; type?: string; defaultValue?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required} className="min-h-12 rounded-2xl border border-line px-4 text-sm font-normal outline-none focus:border-ink" />
    </label>
  );
}
