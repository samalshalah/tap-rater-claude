"use client";

import { useState } from "react";

export function StockToggle({ slug, initialStatus }: { slug: string; initialStatus: "instock" | "outofstock" }) {
  const [status, setStatus] = useState(initialStatus);
  const [isSaving, setIsSaving] = useState(false);

  async function toggle() {
    const next = status === "instock" ? "outofstock" : "instock";
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, stockStatus: next })
      });
      if (response.ok) {
        setStatus(next);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isSaving}
      className={
        status === "instock"
          ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-black uppercase text-brand transition hover:bg-teal-100 disabled:opacity-50"
          : "rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase text-muted transition hover:bg-gray-200 disabled:opacity-50"
      }
    >
      {isSaving ? "Saving..." : status === "instock" ? "In stock" : "Out of stock"}
    </button>
  );
}
