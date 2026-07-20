"use client";

import { useState, type FormEvent } from "react";

export function SetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setStatus({ tone: "error", message: "This link is missing its token. Ask for a new setup link." });
      return;
    }
    if (password.length < 8) {
      setStatus({ tone: "error", message: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ tone: "error", message: "Passwords don't match." });
      return;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      const response = await fetch("/api/account/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus({ tone: "success", message: "Password set. You can log in with it now." });
      } else {
        setStatus({ tone: "error", message: body.error ?? "Could not set your password." });
      }
    } catch {
      setStatus({ tone: "error", message: "Could not set your password." });
    } finally {
      setIsSaving(false);
    }
  }

  if (!token) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
        This link is missing its token. Ask for a new password setup link.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-line bg-white p-5 shadow-sm md:p-7">
      <label className="grid gap-2 text-sm font-semibold text-ink">
        New password
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-md border border-line px-4 py-3 text-sm font-medium outline-none focus:border-brand"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Confirm password
        <input
          required
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="rounded-md border border-line px-4 py-3 text-sm font-medium outline-none focus:border-brand"
          autoComplete="new-password"
        />
      </label>
      <button
        disabled={isSaving}
        className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
      >
        {isSaving ? "Saving..." : "Set password"}
      </button>
      {status ? (
        <div
          className={`rounded-md border px-4 py-3 text-sm font-semibold ${
            status.tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {status.message}
          {status.tone === "success" ? (
            <a href="/account/login" className="mt-2 block text-brand underline">
              Go to login
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
