import Stripe from "stripe";
import type { MigratedProduct } from "@/data/migrated-products";
import { getProductPriceCents } from "@/lib/products";
import type { CartItem } from "@/lib/cart";
import { isSafeExternalUrl } from "@/lib/link-verification";

export type CheckoutCartRow = {
  productId: string;
  title: string;
  sku: string;
  quantity: number;
  unitAmountCents: number;
  lineSubtotalCents: number;
  shortDescription: string;
  destinationUrl?: string;
};

export type ValidatedCheckoutCart =
  | {
      ok: true;
      rows: CheckoutCartRow[];
      totalCents: number;
      currency: "usd";
    }
  | {
      ok: false;
      reason: "empty_cart" | "missing_destination";
      message: string;
    };

export function validateCheckoutCart(items: CartItem[], products: MigratedProduct[]): ValidatedCheckoutCart {
  const productById = new Map(
    products
      .filter((product) => product.isActive && product.stockStatus === "instock" && product.checkoutMode === "buy_now")
      .map((product) => [product.slug, product])
  );
  const quantityByProductId = new Map<string, number>();
  const destinationByProductId = new Map<string, string>();

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || !productById.has(item.productId)) {
      continue;
    }

    quantityByProductId.set(item.productId, (quantityByProductId.get(item.productId) ?? 0) + item.quantity);
    if (item.destinationUrl && isSafeExternalUrl(item.destinationUrl)) {
      destinationByProductId.set(item.productId, item.destinationUrl);
    }
  }

  const rows = Array.from(quantityByProductId.entries()).map(([productId, quantity]) => {
    const product = productById.get(productId)!;
    const unitAmountCents = getProductPriceCents(product);

    return {
      productId,
      title: product.title,
      sku: product.sku,
      quantity,
      unitAmountCents,
      lineSubtotalCents: unitAmountCents * quantity,
      shortDescription: product.shortDescription,
      destinationUrl: destinationByProductId.get(productId)
    };
  });

  if (rows.length === 0) {
    return { ok: false, reason: "empty_cart", message: "Your cart is empty or contains unavailable products." };
  }

  const missingDestination = rows.find((row) => productById.get(row.productId)?.checkoutMode === "buy_now" && !row.destinationUrl);
  if (missingDestination) {
    return {
      ok: false,
      reason: "missing_destination",
      message: `${missingDestination.title} is missing a verified destination link. Add it again from the product page.`
    };
  }

  return {
    ok: true,
    rows,
    totalCents: rows.reduce((sum, row) => sum + row.lineSubtotalCents, 0),
    currency: "usd"
  };
}

export function buildStripeCheckoutLineItems(rows: CheckoutCartRow[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return rows.map((row) => ({
    quantity: row.quantity,
    price_data: {
      currency: "usd",
      product_data: {
        name: row.title,
        description: row.shortDescription,
        metadata: {
          product_id: row.productId,
          sku: row.sku,
          destination_url: row.destinationUrl ?? ""
        }
      },
      unit_amount: row.unitAmountCents
    }
  }));
}

export function createCheckoutSessionParams({
  cart,
  siteUrl
}: {
  cart: Extract<ValidatedCheckoutCart, { ok: true }>;
  siteUrl: string;
}): Stripe.Checkout.SessionCreateParams {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, "");

  return {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: buildStripeCheckoutLineItems(cart.rows),
    success_url: `${normalizedSiteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${normalizedSiteUrl}/checkout/cancel`,
    billing_address_collection: "auto",
    shipping_address_collection: {
      allowed_countries: ["US"]
    },
    phone_number_collection: {
      enabled: true
    },
    metadata: {
      test_mode_only: "true",
      total_cents: String(cart.totalCents)
    }
  };
}

export function isStripeTestSecretKey(value: string | undefined) {
  return Boolean(value?.startsWith("sk_test_"));
}

export function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!isStripeTestSecretKey(key)) {
    throw new Error("Stripe test mode is not configured. Use a sk_test_ key only.");
  }

  return key!;
}

export function getStripeClient() {
  return new Stripe(getStripeSecretKey());
}

export function getCheckoutSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";
}
