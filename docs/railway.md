# Railway Setup

Railway is used only for Tap Rater background jobs and future operational workers. It does not replace the Cloudflare Worker application.

## Project

Create one Railway project:

```text
tap-rater-backend
```

Connect it to:

```text
GitHub repository: samalshalah/tap-rater
Branch: nextjs-commerce
Service directory: apps/backend
```

Build/start commands:

```text
npm install
npm run backend:build
npm run backend:start
```

If Railway runs commands from `apps/backend`, use:

```text
npm install
npm run build
npm run start
```

## Environment Variables

Set these in Railway variables. Do not commit or paste real values into chat.

```text
DATABASE_URL
RESEND_API_KEY
RESEND_FROM_EMAIL
ORDER_NOTIFICATION_EMAIL
ADMIN_NOTIFICATION_EMAIL
CRON_SECRET
NEXT_PUBLIC_SITE_URL
NODE_ENV=production
```

Do not add live Stripe variables until live checkout is explicitly approved.

## Health Check

The backend exposes:

```text
GET /healthz
```

Expected response:

```json
{ "ok": true, "service": "tap-rater-backend" }
```

## Protected Jobs

Future job routes:

```text
POST /jobs/daily-report
POST /jobs/review-monitoring
POST /jobs/billing-reminder
```

Include:

```text
Authorization: Bearer {CRON_SECRET}
```

Without `CRON_SECRET`, job routes return `503`. With a missing or invalid bearer token, they return `401`.

## Database Verification

Run:

```bash
npm run backend:db-check
```

Expected success:

```text
PASS backend database check
```

If this fails, confirm Railway has the same Neon `DATABASE_URL` used by the Cloudflare Worker.

## Deployment Rules

- Keep Cloudflare as the public website and API runtime.
- Use Railway for background jobs only.
- Do not enable live Stripe on Railway.
- Keep `DATABASE_URL`, `RESEND_API_KEY`, and `CRON_SECRET` secret.
