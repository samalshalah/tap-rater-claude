"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/products";
import { calculateCartTotalCents, getCartRows } from "@/lib/cart";

export function CartTable() {
  const { decreaseItem, increaseItem, items, removeItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const rows = getCartRows(items);
  const total = calculateCartTotalCents(items);

  async function startCheckout() {
    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok || typeof body.url !== "string") {
        setCheckoutError(body.error ?? "Stripe test checkout is not available yet.");
        return;
      }

      window.location.href = body.url;
    } catch {
      setCheckoutError("Stripe test checkout is not available yet.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl bg-surface p-10 text-center">
        <p className="text-[15px] text-muted">Your cart is empty.</p>
        <Link href="/shop" className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-white transition hover:bg-brand">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {rows.map((row) => (
        <div key={row.product.slug} className="grid gap-4 border-b border-line py-5 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="text-[15px] font-medium text-ink">{row.product.title}</p>
            <p className="text-[13px] text-muted">{formatPrice(row.unitPriceCents)} each</p>
          </div>
          <div className="flex h-10 w-fit items-center overflow-hidden rounded-full border border-line">
            <button
              type="button"
              aria-label={`Decrease ${row.product.title} quantity`}
              className="grid h-10 w-10 place-items-center text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:text-muted"
              disabled={row.item.quantity <= 1}
              onClick={() => decreaseItem(row.product.slug)}
            >
              <Minus size={14} />
            </button>
            <span className="grid h-10 min-w-10 place-items-center text-[13px] font-medium text-ink">
              {row.item.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${row.product.title} quantity`}
              className="grid h-10 w-10 place-items-center text-ink transition hover:bg-surface"
              onClick={() => increaseItem(row.product.slug)}
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 md:min-w-40 md:justify-end">
            <div className="text-right">
              <p className="text-[12px] text-muted">Subtotal</p>
              <p className="text-[15px] font-medium text-ink">{formatPrice(row.lineSubtotalCents)}</p>
            </div>
            <button
              type="button"
              aria-label={`Remove ${row.product.title}`}
              className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
              onClick={() => removeItem(row.product.slug)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 text-[17px] font-medium text-ink">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <button
        type="button"
        disabled={isCheckingOut}
        className="rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line"
        onClick={startCheckout}
      >
        {isCheckingOut ? "Starting Stripe test checkout..." : "Checkout with Stripe test mode"}
      </button>
      <p className="text-[13px] leading-5 text-muted">
        Test mode only. Use Stripe test cards; live payments stay disabled until explicitly approved.
      </p>
      {checkoutError ? (
        <p className="rounded-xl bg-amber-50 p-3 text-[13px] font-medium text-ink">{checkoutError}</p>
      ) : null}
    </div>
  );
}
