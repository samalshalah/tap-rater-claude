import { NextResponse } from "next/server";
import {
  createCheckoutSessionParams,
  getCheckoutSiteUrl,
  getStripeClient,
  isStripeTestSecretKey,
  validateCheckoutCart
} from "@/lib/checkout";
import { hasSupabaseAdminConfig } from "@/lib/db";
import { createPendingOrderForCheckout } from "@/lib/orders";
import { getStorefrontProducts } from "@/lib/product-repository";
import { checkoutCartSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = checkoutCartSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Cart payload is invalid." }, { status: 400 });
  }

  if (!isStripeTestSecretKey(process.env.STRIPE_SECRET_KEY)) {
    return NextResponse.json({ error: "Stripe test mode is not configured yet." }, { status: 503 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Database order persistence is required before checkout can be used." }, { status: 503 });
  }

  const products = await getStorefrontProducts();
  const cart = validateCheckoutCart(parsed.data.items, products);

  if (!cart.ok) {
    return NextResponse.json({ error: cart.message, reason: cart.reason }, { status: 400 });
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create(
      createCheckoutSessionParams({
        cart,
        siteUrl: getCheckoutSiteUrl()
      })
    );

    if (!session.id || !session.url) {
      return NextResponse.json({ error: "Stripe Checkout Session could not be created." }, { status: 500 });
    }

    const pendingOrder = await createPendingOrderForCheckout({
      stripeCheckoutSessionId: session.id,
      rows: cart.rows,
      subtotalCents: cart.totalCents,
      totalCents: cart.totalCents,
      currency: cart.currency
    });

    if (!pendingOrder.ok) {
      return NextResponse.json({ error: "Order could not be prepared for checkout." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Stripe Checkout could not be started." }, { status: 500 });
  }
}
