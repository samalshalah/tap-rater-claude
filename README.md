# Tap Rater

Tap Rater is a Next.js ecommerce storefront for NFC review stands, review plates, and business bundles. The site is replacing the old WordPress/WooCommerce build with a faster storefront, a simple admin/CMS layer, Supabase-backed persistence, and Resend-powered request notifications.

Stripe checkout is intentionally deferred until the business bank account and final payment setup are ready. The current cart is ecommerce-prep only.

## Stack

- Next.js storefront for product pages, categories, cart, and SEO content.
- Static `migratedProducts` catalog fallback so local preview and builds work without Supabase.
- Supabase-backed admin/CMS for homepage content, product records, request inbox data, and ecommerce settings.
- Resend notifications for customer inquiry forms.
- Stripe planned for the final launch stage, not required now.

## Local Setup

```bash
git clone https://github.com/samalshalah/tap-rater.git
cd tap-rater
git checkout nextjs-commerce
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm test
```

Local dev usually runs at:

```text
http://localhost:3000
```

## Environment Variables

Create `.env.local` for local development. Do not commit real secret values.

### Required For Admin Login

```env
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

`ADMIN_SESSION_SECRET` should be a long random value. Optional admin session TTL:

```env
ADMIN_SESSION_TTL_HOURS=168
```

### Required For Supabase Persistence

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-side only. Do not expose it in browser code.

### Required For Notifications

```env
RESEND_API_KEY=
ORDER_NOTIFICATION_EMAIL=
```

`ORDER_NOTIFICATION_EMAIL` is used as the internal destination for customer request notifications.

### Public URL

```env
NEXT_PUBLIC_SITE_URL=
```

Use the production domain for deployment, for example `https://taprater.com`.

### Future Stripe Variables

Stripe is final-stage work and is not required for the current build.

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Do not add live payment processing until bank and Stripe setup are ready.

## Supabase Table Checklist

The admin and request workflows expect these tables when Supabase persistence is enabled:

- `site_content`
- `products`
- `media_assets`
- `contact_requests`
- `setup_requests`
- `change_link_requests`

The storefront remains safe without Supabase because it falls back to the static migrated product catalog.

## Deployment Checklist

- Set required environment variables in the deployment platform.
- Run `npm run build`.
- Run `npm test`.
- Test public product pages and category pages.
- Test cart persistence after refresh.
- Test customer forms: contact, setup, and change-link.
- Test admin login at `/admin/login`.
- Test admin product editing and requests inbox.
- Confirm Supabase writes are working where persistence is expected.
- Connect bank account and Stripe later during the final checkout stage.

## Known Not Live Yet

- Stripe checkout.
- Paid orders.
- Stripe webhooks.
- Live tax calculation.
- Live shipping calculation.

Until checkout is launched, the cart button remains a “Checkout coming soon” flow and no payment is processed.
