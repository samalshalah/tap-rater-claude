"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "taprater:cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function respond(choice: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // If storage isn't available, just hide the banner for this session.
    }
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-6 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-5 text-muted">
          We use cookies for essential site function and basic analytics. See our{" "}
          <a href="/privacy-policy" className="text-brand hover:text-brand-dark">
            Privacy Policy
          </a>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => respond("declined")}
            className="rounded-full border border-line px-4 py-2 text-[13px] font-medium text-ink transition hover:border-ink"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:bg-brand"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
