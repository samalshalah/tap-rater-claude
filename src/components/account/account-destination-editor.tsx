"use client";

import { useState } from "react";

type VerifyState = "idle" | "checking" | "verified" | "error";

export function AccountDestinationEditor({
  deviceId,
  deviceCode,
  currentDestinationUrl,
  currentDestinationType
}: {
  deviceId: string;
  deviceCode: string;
  currentDestinationUrl?: string;
  currentDestinationType?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(currentDestinationUrl ?? "");
  const [destinationType, setDestinationType] = useState(currentDestinationType ?? "custom");
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [message, setMessage] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");

  async function verifyLink() {
    const trimmed = url.trim();
    if (!trimmed) {
      setVerifyState("error");
      setMessage("Paste your destination link first.");
      return;
    }

    setVerifyState("checking");
    setMessage("");

    try {
      const response = await fetch("/api/verify-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed })
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok && body.ok) {
        setVerifyState("verified");
        setMessage(body.note ?? "Link verified -- it's live and reachable.");
      } else {
        setVerifyState("error");
        setMessage(body.message ?? "We couldn't verify that link.");
      }
    } catch {
      setVerifyState("error");
      setMessage("We couldn't verify that link. Check your connection and try again.");
    }
  }

  async function save() {
    if (verifyState !== "verified") return;
    setSaveState("saving");

    try {
      const response = await fetch("/api/account/devices/update-destination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, destinationUrl: url.trim(), destinationType })
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        setSaveState("success");
        setEditing(false);
      } else {
        setSaveState("error");
        setMessage(body.error ?? "Could not save your link.");
      }
    } catch {
      setSaveState("error");
      setMessage("Could not save your link.");
    }
  }

  if (!editing) {
    return (
      <button type="button" onClick={() => setEditing(true)} className="text-xs font-bold text-brand hover:text-brand-dark">
        {saveState === "success" ? "Saved -- edit again" : "Edit link"}
      </button>
    );
  }

  return (
    <div className="mt-2 grid gap-2 rounded-md border border-line bg-gray-50 p-3">
      <p className="text-xs font-bold text-ink">Update destination for {deviceCode}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setVerifyState("idle");
            setMessage("");
          }}
          placeholder="https://..."
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-xs text-ink outline-none focus:border-ink"
        />
        <select
          value={destinationType}
          onChange={(e) => setDestinationType(e.target.value)}
          className="rounded-md border border-line bg-white px-2 py-2 text-xs text-ink"
        >
          <option value="google_review">Google review</option>
          <option value="facebook_review">Facebook review</option>
          <option value="yelp_profile">Yelp</option>
          <option value="booking">Booking</option>
          <option value="social">Social</option>
          <option value="menu">Menu</option>
          <option value="custom">Custom</option>
        </select>
        <button
          type="button"
          onClick={verifyLink}
          disabled={verifyState === "checking"}
          className="shrink-0 rounded-md border border-line bg-white px-3 py-2 text-xs font-bold text-ink disabled:opacity-50"
        >
          {verifyState === "checking" ? "Checking..." : verifyState === "verified" ? "Verified" : "Verify"}
        </button>
      </div>
      {message ? (
        <p className={`text-xs ${verifyState === "verified" ? "text-brand" : "text-red-600"}`}>{message}</p>
      ) : null}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={verifyState !== "verified" || saveState === "saving"}
          className="rounded-md bg-ink px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saveState === "saving" ? "Saving..." : "Save link"}
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-xs font-bold text-muted">
          Cancel
        </button>
      </div>
    </div>
  );
}
