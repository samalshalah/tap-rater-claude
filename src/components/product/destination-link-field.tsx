"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

type VerifyState = "idle" | "checking" | "verified" | "error";

export function DestinationLinkField({ productId }: { productId: string }) {
  const cart = useCart();
  const [url, setUrl] = useState("");
  const [state, setState] = useState<VerifyState>("idle");
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);

  async function handleVerify() {
    const trimmed = url.trim();
    if (!trimmed) {
      setState("error");
      setMessage("Paste your destination link first.");
      return;
    }

    setState("checking");
    setMessage("");

    try {
      const response = await fetch("/api/verify-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed })
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok && body.ok) {
        setState("verified");
        setMessage(body.note ?? "Link verified — it's live and reachable.");
      } else {
        setState("error");
        setMessage(body.message ?? "We couldn't verify that link.");
      }
    } catch {
      setState("error");
      setMessage("We couldn't verify that link. Check your connection and try again.");
    }
  }

  function handleAddToCart() {
    if (state !== "verified") {
      return;
    }
    cart.addItem({ productId, quantity: 1, destinationUrl: url.trim() });
    setAdded(true);
  }

  function handleChange(value: string) {
    setUrl(value);
    setState("idle");
    setMessage("");
    setAdded(false);
  }

  return (
    <div className="mt-7 rounded-2xl bg-surface p-5">
      <label htmlFor={`destination-${productId}`} className="text-[13px] font-medium text-ink">
        Your destination link
      </label>
      <p className="mt-1 text-[12px] leading-5 text-muted">
        Paste the exact link this stand should open — your Google review page, menu, booking page, or profile. We check
        it's live before checkout.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id={`destination-${productId}`}
          type="url"
          inputMode="url"
          placeholder="https://..."
          value={url}
          onChange={(event) => handleChange(event.target.value)}
          className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-[13px] text-ink outline-none focus:border-ink"
        />
        <button
          type="button"
          onClick={handleVerify}
          disabled={state === "checking" || state === "verified"}
          className="shrink-0 rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "checking" ? "Checking..." : state === "verified" ? "Verified ✓" : "Verify link"}
        </button>
      </div>
      {message ? (
        <p className={`mt-2 text-[12px] leading-5 ${state === "verified" ? "text-brand" : "text-red-600"}`}>
          {state === "verified" ? "✓ " : ""}
          {message}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={state !== "verified" || added}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        {added ? "Added to cart ✓" : "Add to cart"}
      </button>
      {!added ? (
        <p className="mt-2 text-[12px] text-muted">Verify your link works before adding to cart — checkout stays in Stripe test mode.</p>
      ) : (
        <p className="mt-2 text-[12px] text-muted">
          <a href="/cart" className="text-brand hover:text-brand-dark">
            View cart
          </a>{" "}
          to check out.
        </p>
      )}
    </div>
  );
}
