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
      <div className="rounded-md border border-line p-8 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/shop" className="mt-5 inline-block rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {rows.map((row) => (
        <div key={row.product.slug} className="grid gap-4 border-b border-line py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="font-semibold text-ink">{row.product.title}</p>
            <p className="text-sm text-muted">{formatPrice(row.unitPriceCents)} each</p>
          </div>
          <div className="flex h-11 w-fit items-center overflow-hidden rounded-md border border-line">
            <button
              type="button"
              aria-label={`Decrease ${row.product.title} quantity`}
              className="grid h-11 w-11 place-items-center text-ink hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-muted"
              disabled={row.item.quantity <= 1}
              onClick={() => decreaseItem(row.product.slug)}
            >
              <Minus size={16} />
            </button>
            <span className="grid h-11 min-w-12 place-items-center border-x border-line px-3 text-sm font-black text-ink">
              {row.item.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${row.product.title} quantity`}
              className="grid h-11 w-11 place-items-center text-ink hover:bg-gray-50"
              onClick={() => increaseItem(row.product.slug)}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 md:min-w-44 md:justify-end">
            <div className="text-right">
              <p className="text-xs font-bold uppercase text-muted">Subtotal</p>
              <p className="font-black text-ink">{formatPrice(row.lineSubtotalCents)}</p>
            </div>
            <button
              type="button"
              aria-label={`Remove ${row.product.title}`}
              className="grid h-10 w-10 place-items-center rounded-md border border-line text-brand hover:bg-gray-50"
              onClick={() => removeItem(row.product.slug)}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between text-xl font-bold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <button
        type="button"
        disabled={isCheckingOut}
        className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        onClick={startCheckout}
      >
        {isCheckingOut ? "Starting Stripe test checkout..." : "Checkout with Stripe test mode"}
      </button>
      <p className="text-sm leading-6 text-muted">
        Test mode only. Use Stripe test cards; live payments stay disabled until explicitly approved.
      </p>
      {checkoutError ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-ink">{checkoutError}</p>
      ) : null}
    </div>
  );
}
