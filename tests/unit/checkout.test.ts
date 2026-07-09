import { describe, expect, it } from "vitest";
import { migratedProducts } from "@/data/migrated-products";
import {
  buildStripeCheckoutLineItems,
  createCheckoutSessionParams,
  isStripeTestSecretKey,
  validateCheckoutCart
} from "@/lib/checkout";

describe("Stripe checkout helpers", () => {
  it("validates cart items server-side against active in-stock products", () => {
    const result = validateCheckoutCart(
      [
        { productId: "google-review-white-stand", quantity: 2 },
        { productId: "old-product", quantity: 5 },
        { productId: "facebook-review-stand", quantity: 1 }
      ],
      migratedProducts
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      productId: "google-review-white-stand",
      quantity: 2,
      unitAmountCents: 4900,
      lineSubtotalCents: 9800
    });
    expect(result.totalCents).toBe(9800);
  });

  it("rejects empty or invalid checkout carts", () => {
    expect(validateCheckoutCart([], migratedProducts)).toMatchObject({ ok: false, reason: "empty_cart" });
    expect(validateCheckoutCart([{ productId: "old-product", quantity: 1 }], migratedProducts)).toMatchObject({
      ok: false,
      reason: "empty_cart"
    });
  });

  it("allows only buy-now products in the current one-time checkout", () => {
    expect(validateCheckoutCart([{ productId: "tap-rater-white-stand-rate-your-experience", quantity: 1 }], migratedProducts)).toMatchObject({
      ok: false,
      reason: "empty_cart"
    });
  });

  it("only accepts Stripe test secret keys", () => {
    expect(isStripeTestSecretKey("sk_test_123")).toBe(true);
    expect(isStripeTestSecretKey("sk_live_123")).toBe(false);
    expect(isStripeTestSecretKey("")).toBe(false);
  });

  it("builds Stripe line items from validated cart rows", () => {
    const result = validateCheckoutCart([{ productId: "google-review-white-stand", quantity: 1 }], migratedProducts);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(buildStripeCheckoutLineItems(result.rows)).toEqual([
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: "White Stand - Google Review",
            description: "NFC Google review stand for counters, checkout desks, salons, restaurants, clinics, and local service businesses.",
            metadata: {
              product_id: "google-review-white-stand",
              sku: "TRATER01"
            }
          },
          unit_amount: 4900
        }
      }
    ]);
  });

  it("creates test-mode Checkout Session params with success and cancel URLs", () => {
    const result = validateCheckoutCart([{ productId: "google-review-white-stand", quantity: 1 }], migratedProducts);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const params = createCheckoutSessionParams({
      cart: result,
      siteUrl: "https://taprater.com"
    });

    expect(params.mode).toBe("payment");
    expect(params.success_url).toBe("https://taprater.com/checkout/success?session_id={CHECKOUT_SESSION_ID}");
    expect(params.cancel_url).toBe("https://taprater.com/checkout/cancel");
    expect(params.payment_method_types).toEqual(["card"]);
    expect(params.metadata?.test_mode_only).toBe("true");
    expect(params.metadata?.total_cents).toBe("4900");
    expect(params.metadata).not.toHaveProperty("order_items");
  });
});
