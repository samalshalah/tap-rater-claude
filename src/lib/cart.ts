import { getActiveProducts, getProductBySlug, getProductPriceCents } from "@/lib/products";

export const cartStorageKey = "taprater:cart";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartRow = {
  item: CartItem;
  product: NonNullable<ReturnType<typeof getProductBySlug>>;
  unitPriceCents: number;
  lineSubtotalCents: number;
};

function isPositiveQuantity(quantity: unknown): quantity is number {
  return typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0;
}

export function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const activeProductIds = new Set(getActiveProducts().map((product) => product.slug));
  const normalized = new Map<string, number>();

  for (const entry of value) {
    const productId = typeof entry?.productId === "string" ? entry.productId : "";
    const quantity = entry?.quantity;

    if (!activeProductIds.has(productId) || !isPositiveQuantity(quantity)) {
      continue;
    }

    normalized.set(productId, (normalized.get(productId) ?? 0) + quantity);
  }

  return Array.from(normalized, ([productId, quantity]) => ({ productId, quantity }));
}

export function parseStoredCart(value: string | null): CartItem[] {
  if (!value) {
    return [];
  }

  try {
    return normalizeCartItems(JSON.parse(value));
  } catch {
    return [];
  }
}

export function mergeCartItem(items: CartItem[], item: CartItem): CartItem[] {
  return normalizeCartItems([...items, item]);
}

export function updateCartQuantity(items: CartItem[], productId: string, delta: number): CartItem[] {
  return normalizeCartItems(
    items.map((item) =>
      item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    )
  );
}

export function removeCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function getCartRows(items: CartItem[]): CartRow[] {
  return normalizeCartItems(items).flatMap((item) => {
    const product = getProductBySlug(item.productId);

    if (!product) {
      return [];
    }

    const unitPriceCents = getProductPriceCents(product);

    return [
      {
        item,
        product,
        unitPriceCents,
        lineSubtotalCents: unitPriceCents * item.quantity
      }
    ];
  });
}

export function calculateCartTotalCents(items: CartItem[]): number {
  return getCartRows(items).reduce((sum, row) => sum + row.lineSubtotalCents, 0);
}
