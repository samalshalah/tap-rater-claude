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

## Supabase Schema Setup

The platform device, activation, landing page, tap event, and form submission schema is documented in:

```text
docs/supabase-schema.sql
```

To apply it:

1. Open the Supabase project SQL editor.
2. Review `docs/supabase-schema.sql`.
3. Run it against the target project.
4. Confirm the demo devices exist:
   - `TR-DEMO-GOOGLE`
   - `TR-DEMO-SOCIAL`
   - `TR-DEMO-FEEDBACK`

The schema file is intentionally non-destructive. It uses `create table if not exists`, `create index if not exists`, and `insert ... on conflict do nothing` for demo devices.

Platform schema tables:

- `customers`
- `businesses`
- `devices`
- `landing_pages`
- `tap_events`
- `form_submissions`
- `device_activation_attempts`

The demo activation hashes are placeholders only. Replace them with real hashed activation codes before manufacturing or production use.

## Device Activation

Every Tap Rater NFC chip and QR code should point to the permanent route:

```text
https://taprater.com/r/{deviceCode}
```

If a device is still unactivated, the redirect route sends the customer to:

```text
/activate?device={deviceCode}
```

The activation form asks for:

- device code
- private activation code
- customer email
- customer name
- business name
- destination type
- destination URL

Activation writes server-side only through `POST /api/activate`. When activation succeeds, it creates or finds the customer, creates or finds the business, sets the device to `active`, saves `customer_id`, `business_id`, `destination_type`, `destination_url`, and `activated_at`, then future scans route through `/r/{deviceCode}`.

Supported activation destination types:

- `google_review_url`
- `direct_url`
- `facebook_url`
- `yelp_url`
- `booking_url`
- `social_url`

Destination URLs must use `http://` or `https://`. Unsafe schemes such as `javascript:` and `data:` are rejected.

Activation requires the platform Supabase schema and server credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

No Stripe configuration is required for activation.

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
