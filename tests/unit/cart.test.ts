import { describe, expect, it } from "vitest";
import { calculateCartTotalCents, mergeCartItem, normalizeCartItems, parseStoredCart, updateCartQuantity } from "@/lib/cart";

describe("cart utilities", () => {
  it("merges matching products and counts only positive quantities", () => {
    const items = mergeCartItem([{ productId: "google-review-nfc-stand", quantity: 1 }], {
      productId: "google-review-nfc-stand",
      quantity: 2
    });

    expect(items).toEqual([{ productId: "google-review-nfc-stand", quantity: 3 }]);
  });

  it("prevents quantity updates from going below one", () => {
    const items = updateCartQuantity([{ productId: "google-review-nfc-stand", quantity: 1 }], "google-review-nfc-stand", -4);

    expect(items).toEqual([{ productId: "google-review-nfc-stand", quantity: 1 }]);
  });

  it("removes stale product ids and invalid quantities from stored carts", () => {
    const items = normalizeCartItems([
      { productId: "google-review-nfc-stand", quantity: 2 },
      { productId: "old-product", quantity: 4 },
      { productId: "google-review-nfc-plate", quantity: 0 },
      { productId: "", quantity: 3 }
    ]);

    expect(items).toEqual([{ productId: "google-review-nfc-stand", quantity: 2 }]);
  });

  it("restores only valid items from localStorage JSON", () => {
    const items = parseStoredCart(
      JSON.stringify([
        { productId: "google-review-nfc-stand", quantity: 1 },
        { productId: "old-product", quantity: 3 }
      ])
    );

    expect(items).toEqual([{ productId: "google-review-nfc-stand", quantity: 1 }]);
  });

  it("returns an empty cart when stored JSON is corrupted", () => {
    expect(parseStoredCart("not-json")).toEqual([]);
  });

  it("calculates total using active catalog prices", () => {
    const total = calculateCartTotalCents([
      { productId: "google-review-nfc-stand", quantity: 2 },
      { productId: "business-review-starter-kit", quantity: 1 }
    ]);

    expect(total).toBe(19960);
  });
});
