# Tap Rater Backend

Tap Rater uses two backend surfaces:

- Cloudflare Workers/OpenNext runs the production website, API routes, admin, activation flow, redirect engine, and customer portal.
- Railway is reserved for future background jobs and operational tasks that should not replace the Cloudflare frontend.

Live Stripe payments are intentionally disabled until final approval.

## Cloudflare App Backend

The Cloudflare Worker handles:

- storefront API routes
- admin login and admin APIs
- product and CMS persistence
- contact/setup/change-link requests
- device activation
- public redirect route `/r/{deviceCode}`
- landing page form submissions
- customer login/session APIs

Required production secrets stay in Cloudflare Worker settings:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
CUSTOMER_SESSION_SECRET
DATABASE_URL
RESEND_API_KEY
RESEND_FROM_EMAIL
ORDER_NOTIFICATION_EMAIL
ADMIN_NOTIFICATION_EMAIL
NEXT_PUBLIC_SITE_URL
```

Do not expose `DATABASE_URL` or `RESEND_API_KEY` to browser code.

## Railway Backend

The Railway backend package lives in:

```text
apps/backend
```

It is a small Node service for future background work:

- `GET /healthz`
- `POST /jobs/daily-report`
- `POST /jobs/review-monitoring`
- `POST /jobs/billing-reminder`

Job routes require:

```text
Authorization: Bearer {CRON_SECRET}
```

The current job handlers are safe placeholders. They return skipped statuses until the business logic is built.

## Commands

```bash
npm run backend:dev
npm run backend:build
npm run backend:start
npm run backend:db-check
npm run backend:email-test
```

`backend:db-check` runs `select 1` against `DATABASE_URL`.

`backend:email-test` sends only when `RESEND_API_KEY` and either `EMAIL_TEST_TO` or `ADMIN_NOTIFICATION_EMAIL` are configured. If not configured, it exits with a skip message instead of failing.

## Local Environment

Use `apps/backend/.env.example` as the safe template. Do not commit real values.

```text
DATABASE_URL
RESEND_API_KEY
RESEND_FROM_EMAIL
ORDER_NOTIFICATION_EMAIL
ADMIN_NOTIFICATION_EMAIL
CRON_SECRET
NEXT_PUBLIC_SITE_URL
NODE_ENV
PORT
```

## Email Utility

Shared website email helpers live in:

```text
src/lib/email.ts
```

Supported email types:

- customer login magic link
- quote request notification
- quote request confirmation
- feedback alert
- link change request
- scheduled report placeholder

The helper escapes dynamic content before building HTML and returns a safe skipped result when `RESEND_API_KEY` is missing.

## Verification

Run:

```bash
npm run build
npm test
npm run cf:build
npm run backend:build
npm run backend:db-check
```

For production, verify:

- Cloudflare Worker still serves `/`, `/shop`, `/activate`, `/admin/login`, and `/r/TR-DEMO-GOOGLE`.
- Railway `/healthz` returns `{ "ok": true, "service": "tap-rater-backend" }`.
- Railway can connect to Neon through `DATABASE_URL`.
- Resend domain is verified before production emails are enabled.
