"use client";

import { useCart } from "@/components/cart/cart-provider";

export function AddToCartButton({ productId, disabled }: { productId: string; disabled: boolean }) {
  const cart = useCart();

  return (
    <button
      className="mt-8 w-full rounded-md bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      disabled={disabled}
      onClick={() => cart.addItem({ productId, quantity: 1 })}
    >
      Add to cart
    </button>
  );
}
