# Tap Rater Deployment

Tap Rater currently has two Cloudflare Worker deployments:

- Production-safe Worker: `tap-rater-app`
- Git-linked test Worker: `tap-rater-app-git`

Do not delete or retire `tap-rater-app` until `tap-rater-app-git` has the same required secrets, passes admin/platform smoke tests, and is approved for cutover.

## Production Worker

- Worker name: `tap-rater-app`
- URL: `https://tap-rater-app.sam-alshalah1.workers.dev/`
- Source today: GitHub Actions runs `npx wrangler deploy`
- Repo: `samalshalah/tap-rater`
- Branch: `nextjs-commerce`
- Wrangler config: `wrangler.jsonc`
- Compatibility date: `2026-07-09`
- Compatibility flags: `nodejs_compat`
- Assets binding: `ASSETS`
- Public variable in config: `NEXT_PUBLIC_SITE_URL=https://taprater.com`
- Custom domains: none
- Routes: none

Required Worker secret names:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `CUSTOMER_SESSION_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ORDER_NOTIFICATION_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`

Secret values must not be committed or printed in logs.

## Git-Linked Worker Build

Cloudflare Workers Builds was connected to GitHub with:

- Build project / Worker name: `tap-rater-app-git`
- URL: `https://tap-rater-app-git.sam-alshalah1.workers.dev/`
- Repo: `samalshalah/tap-rater`
- Production branch: `nextjs-commerce`
- Root directory: `/`
- Wrangler config for this test Worker: `wrangler.cloudflare-git.jsonc`
- Build command: `npm ci && npm test && npm run cf:build`
- Deploy command: `npx wrangler deploy -c wrangler.cloudflare-git.jsonc`

Important: Cloudflare Workers Builds deploys `tap-rater-app-git`. It does not inherit secrets from `tap-rater-app`.

Current blocker before cutover:

- `tap-rater-app-git` has no Worker secrets.
- Only the public `NEXT_PUBLIC_SITE_URL` variable is present through `wrangler.jsonc`.
- Public/static smoke routes pass, but admin, Neon persistence, customer sessions, and Resend notifications are not production-ready on `tap-rater-app-git`.

## Current GitHub Actions Fallback

The repository still contains `.github/workflows/deploy-cloudflare-worker.yml`.

That workflow deploys `nextjs-commerce` to the production-safe `tap-rater-app` Worker using GitHub Actions and Wrangler. Keep it enabled until the Cloudflare Git-linked Worker has all required secrets and passes the full smoke checklist.

The default `wrangler.jsonc` must stay pointed at `tap-rater-app` while the GitHub Actions fallback remains active.

## Local Verification

Run from the repo root:

```bash
npm ci
npm run build
npm test
npm run cf:build
```

Smoke test the current production-safe Worker:

```bash
SMOKE_BASE_URL=https://tap-rater-app.sam-alshalah1.workers.dev npm run smoke
```

Smoke test the Git-linked Worker:

```bash
SMOKE_BASE_URL=https://tap-rater-app-git.sam-alshalah1.workers.dev npm run smoke
```

## Manual Route Checks

Check these paths before any cutover:

- `/`
- `/shop`
- `/category/reviews`
- `/category/social-media`
- `/category/appointments`
- `/category/menu`
- `/category/feedback`
- `/product/google-review-stand`
- `/product/google-review-plate`
- `/activate`
- `/admin/login`
- `/r/TR-DEMO-GOOGLE`

## Cutover Rules

Do not cut over to `tap-rater-app-git` until:

1. All required Worker secrets are added to `tap-rater-app-git`.
2. `NEXT_PUBLIC_SITE_URL` remains `https://taprater.com`.
3. Admin login works.
4. Neon-backed product/device/activation flows work.
5. Resend notifications are tested or explicitly deferred.
6. Cloudflare logs show no runtime errors during smoke tests.
7. A push to `nextjs-commerce` automatically starts and completes a Cloudflare Workers Build.
8. The deployed commit SHA matches the latest pushed commit.

After cutover, remove the older manual deploy path only after the Git-linked Worker is proven stable.

## Rollback

If the Git-linked Worker fails:

1. Keep using `tap-rater-app`.
2. Re-run the GitHub Actions workflow `Deploy Cloudflare Worker` from GitHub Actions.
3. Confirm `https://tap-rater-app.sam-alshalah1.workers.dev/` passes smoke tests.
4. Do not delete any Worker, secret, domain, or route until a replacement has passed verification.
