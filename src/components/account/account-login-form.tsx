"use client";

import { useEffect, useState, type FormEvent } from "react";

export function AccountLoginForm({ token }: { token?: string }) {
  const [mode, setMode] = useState<"magic_link" | "password">("magic_link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  async function loginWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/account/login/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(body?.error ?? "Incorrect email or password.");
      return;
    }

    window.location.href = "/account";
  }

  return (
    <div className="grid gap-4 rounded-lg border border-line bg-white p-5 shadow-sm md:p-7">
      <div className="flex gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMode("magic_link")}
          className={mode === "magic_link" ? "rounded-full bg-ink px-3 py-1.5 text-white" : "rounded-full border border-line px-3 py-1.5 text-ink"}
        >
          Email link
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={mode === "password" ? "rounded-full bg-ink px-3 py-1.5 text-white" : "rounded-full border border-line px-3 py-1.5 text-ink"}
        >
          Password
        </button>
      </div>

      {mode === "magic_link" ? (
        <form onSubmit={requestLogin} className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-line px-4 py-3 text-sm font-medium outline-none focus:border-brand"
              autoComplete="email"
              placeholder="owner@example.com"
            />
          </label>
          <button
            disabled={status === "loading"}
            className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {status === "loading" ? "Sending..." : "Send login link"}
          </button>
        </form>
      ) : (
        <form onSubmit={loginWithPassword} className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-line px-4 py-3 text-sm font-medium outline-none focus:border-brand"
              autoComplete="email"
              placeholder="owner@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-line px-4 py-3 text-sm font-medium outline-none focus:border-brand"
              autoComplete="current-password"
              placeholder="Your password"
            />
          </label>
          <button
            disabled={status === "loading"}
            className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {status === "loading" ? "Logging in..." : "Log in"}
          </button>
          <p className="text-xs text-muted">
            No password set yet? Ask us for a password setup link, or use the email link option instead.
          </p>
        </form>
      )}

      {message ? (
        <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${status === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-800"}`}>
          {message}
          {devMagicLink ? (
            <a href={devMagicLink} className="mt-2 block break-all text-brand underline">
              Development admin login link
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
