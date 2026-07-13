import { describe, expect, it } from "vitest";
import { migratedProducts } from "@/data/migrated-products";
import {
  buildStripeCheckoutLineItems,
  createCheckoutSessionParams,
  isStripeTestSecretKey,
  validateCheckoutCart
} from "@/lib/checkout";

const GOOGLE_REVIEW_URL = "https://g.page/r/example-business/review";

describe("Stripe checkout helpers", () => {
  it("validates cart items server-side against active in-stock products", () => {
    const result = validateCheckoutCart(
      [
        { productId: "google-review-stand", quantity: 2, destinationUrl: GOOGLE_REVIEW_URL },
        { productId: "old-product", quantity: 5 },
        { productId: "stale-platform-product", quantity: 1 }
      ],
      migratedProducts
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toMatchObject({
      productId: "google-review-stand",
      quantity: 2,
      unitAmountCents: 4900,
      lineSubtotalCents: 9800,
      destinationUrl: GOOGLE_REVIEW_URL
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
    expect(validateCheckoutCart([{ productId: "stale-platform-product", quantity: 1 }], migratedProducts)).toMatchObject({
      ok: false,
      reason: "empty_cart"
    });
  });

  it("rejects a buy-now product missing a verified destination link, even if it slips past the client", () => {
    const result = validateCheckoutCart([{ productId: "google-review-stand", quantity: 1 }], migratedProducts);

    expect(result).toMatchObject({ ok: false, reason: "missing_destination" });
  });

  it("drops an unsafe destination URL (SSRF attempt) rather than trusting client input", () => {
    const result = validateCheckoutCart(
      [{ productId: "google-review-stand", quantity: 1, destinationUrl: "http://169.254.169.254/latest/meta-data" }],
      migratedProducts
    );

    expect(result).toMatchObject({ ok: false, reason: "missing_destination" });
  });

  it("only accepts Stripe test secret keys", () => {
    expect(isStripeTestSecretKey("sk_test_123")).toBe(true);
    expect(isStripeTestSecretKey("sk_live_123")).toBe(false);
    expect(isStripeTestSecretKey("")).toBe(false);
  });

  it("builds Stripe line items from validated cart rows, including the destination URL in metadata", () => {
    const result = validateCheckoutCart(
      [{ productId: "google-review-stand", quantity: 1, destinationUrl: GOOGLE_REVIEW_URL }],
      migratedProducts
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(buildStripeCheckoutLineItems(result.rows)).toEqual([
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: "Google Review Stand",
            description: "Countertop NFC stand that opens your Google review link with one tap or scan.",
            metadata: {
              product_id: "google-review-stand",
              sku: "TR-GOOGLE-STAND",
              destination_url: GOOGLE_REVIEW_URL
            }
          },
          unit_amount: 4900
        }
      }
    ]);
  });

  it("creates test-mode Checkout Session params with success and cancel URLs", () => {
    const result = validateCheckoutCart(
      [{ productId: "google-review-stand", quantity: 1, destinationUrl: GOOGLE_REVIEW_URL }],
      migratedProducts
    );

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
