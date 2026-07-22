# Customer Stands

The Customer Stand foundation keeps the existing `devices` table as the physical-instance record. This preserves activation and `/r/{deviceCode}` behavior while exposing the same owned record as a `CustomerStand` through `/t/{shortCode}` and `/dashboard`.

## Domain Model

- Product: the catalog item sold by Tap Rater.
- Customer Stand: one customer-owned physical or digital instance, stored in `devices` with Customer Stand columns.
- Permanent Stand URL: immutable `/t/{publicSlug}` path. PostgreSQL rejects updates to `public_slug` and `permanent_url_path` after assignment.
- Destination Links: normalized rows in `stand_destination_links`.
- Hosted Tap Page: one optional `hosted_tap_page_configs` row plus active destination links.
- Tap analytics: existing privacy-conscious `tap_events` rows; raw IP addresses are never stored.

Existing activated devices are backfilled with a `/t` alias and their current destination becomes the first Stand Destination Link. The original `/r/{deviceCode}` path remains supported for already-programmed NFC chips and printed QR codes.

## Routes

Public:

- `/t/[shortCode]`: redirect or hosted Tap Page resolver.
- `/r/[deviceCode]`: legacy activation and redirect compatibility.

Customer:

- `/dashboard`
- `/dashboard/business`
- `/dashboard/stands`
- `/dashboard/stands/[shortCode]`
- `/dashboard/stands/[shortCode]/preview`

Admin:

- `/admin/stands`
- `/api/admin/stands`
- `/api/admin/stands/[id]`

Legacy `/account`, `/account/business`, and `/account/devices` URLs redirect to the corresponding dashboard views.

## Database Setup

Apply `supabase/schema.sql` to the target Postgres database before enabling the portal. The script is idempotent and adds:

- Customer Stand snapshot, lifecycle, fulfillment, and immutable URL columns to `devices`.
- `stand_destination_links`.
- `hosted_tap_page_configs`.
- indexes, constraints, legacy data backfill, and the permanent-URL trigger.

Do not deploy application code that uses `/dashboard` or `/t` before this schema change has been applied to the same database.

## Environment

The feature adds no new environment-variable names. Database-backed login and portal behavior require:

```text
DATABASE_URL
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
CUSTOMER_SESSION_SECRET
NEXT_PUBLIC_SITE_URL
RESEND_API_KEY
RESEND_FROM_EMAIL
```

Supabase credentials may be used instead of `DATABASE_URL`. See `.env.example` for the complete optional integration list.

## Order Provisioning

`createCustomerStandForOrderItem(orderItem, userId, businessId, options)` creates one Customer Stand per purchased quantity and can use `options.orderId` to produce idempotency keys.

It is intentionally not called from the Stripe webhook yet. The current Checkout Session stores customer email but does not establish a trusted customer ID and selected business ID. Wire provisioning only after checkout captures that ownership contract and webhook tests cover retries.

## Local Verification

```bash
npm test
npm run check:platform-schema
npm run build
npm run cf:build
npm run backend:build
```

For interactive testing, configure a local Postgres database with `supabase/schema.sql`, start `npm run dev`, create or assign a stand at `/admin/stands`, and log in at `/account/login` to manage it under `/dashboard`.
