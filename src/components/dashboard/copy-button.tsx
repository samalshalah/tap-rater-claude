"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const Icon = copied ? Check : Copy;
  return (
    <button type="button" onClick={copy} title={`Copy ${label.toLowerCase()}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-ink">
      <Icon className="h-4 w-4" aria-hidden="true" />
      {copied ? "Copied" : label}
    </button>
  );
}
