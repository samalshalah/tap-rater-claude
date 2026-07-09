"use client";

import { useEffect, useState, type FormEvent } from "react";

export function AccountLoginForm({ token }: { token?: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devMagicLink, setDevMagicLink] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");

  useEffect(() => {
    if (!token) {
      return;
    }

    setStatus("loading");
    fetch("/api/account/login/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(body?.error ?? "Login link is invalid or expired.");
        }
        window.location.href = body?.redirectTo ?? "/account";
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Login link is invalid or expired.");
      });
  }, [token]);

  async function requestLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setDevMagicLink("");

    const response = await fetch("/api/account/login/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(body?.error ?? "Login link could not be requested.");
      return;
    }

    setStatus("success");
    setMessage(body?.message ?? "If this email has an account, a login link will be sent.");
    setDevMagicLink(body?.devMagicLink ?? "");
  }

  return (
    <form onSubmit={requestLogin} className="grid gap-4 rounded-lg border border-line bg-white p-5 shadow-sm md:p-7">
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-line px-4 py-3 text-sm font-medium outline-none focus:border-brand"
          autoComplete="email"
          placeholder="owner@example.com"
        />
      </label>
      <button
        disabled={status === "loading"}
        className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
      >
        {status === "loading" ? "Sending..." : "Send login link"}
      </button>
      {message ? (
        <div className={`rounded-md border px-4 py-3 text-sm font-semibold ${status === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-800"}`}>
          {message}
          {devMagicLink ? (
            <a href={devMagicLink} className="mt-2 block break-all text-brand underline">
              Development admin login link
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
