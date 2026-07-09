# Tap Rater Backend

## Current Backend Scope

This phase includes request storage, admin login, admin request views, and public forms.
Stripe checkout and paid order storage are intentionally deferred to the final launch stage.

## Services

- Supabase Postgres stores contact, setup, change-link, and product records.
- Resend can send request notifications when configured.
- Next.js API routes validate and persist form submissions.
- Admin access uses one signed HTTP-only cookie account from environment variables.

## Environment Variables

Set these locally in `.env.local` and in production:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ORDER_NOTIFICATION_EMAIL=
ADMIN_EMAIL=admin@taprater.com
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

`ADMIN_SESSION_SECRET` should be a long random string.

## Database

Run `supabase/schema.sql` in the Supabase SQL editor before using the forms in production.

## Routes

- `/api/forms/contact`
- `/api/forms/setup`
- `/api/forms/change-link`
- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/requests`

## Local Behavior Without Supabase

The frontend pages still render. Valid form submissions return `503` with `Request storage is not configured yet.` until Supabase credentials are added.
