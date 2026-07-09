"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { migratedProducts } from "@/data/migrated-products";
import { formatPrice, getProductPriceCents } from "@/lib/products";

export function CartTable() {
  const { items, removeItem } = useCart();

  const rows = items.map((item) => {
    const product = migratedProducts.find((entry) => entry.slug === item.productId);
    return product ? { item, product } : null;
  }).filter(Boolean);

  const total = rows.reduce((sum, row) => sum + getProductPriceCents(row!.product) * row!.item.quantity, 0);

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
        <div key={row!.product.slug} className="flex items-center justify-between border-b border-line py-4">
          <div>
            <p className="font-semibold text-ink">{row!.product.title}</p>
            <p className="text-sm text-muted">Qty {row!.item.quantity} x {formatPrice(getProductPriceCents(row!.product))}</p>
          </div>
          <button className="text-sm font-semibold text-brand" onClick={() => removeItem(row!.product.slug)}>
            Remove
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between text-xl font-bold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <button className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
        Stripe checkout coming next
      </button>
    </div>
  );
}
