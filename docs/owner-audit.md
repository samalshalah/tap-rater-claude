# Tap Rater — Owner Audit

Date: 2026-07-10
Branch inspected: `nextjs-commerce` (local clone of `samalshalah/tap-rater`)
Method: static code read, `npm ci && npm test && npm run build && npm run cf:build`, plus live checks against the deployed Git-linked Worker (`tap-rater-app-git.sam-alshalah1.workers.dev`).

No functional code was changed as part of this audit.

## 1. Project Status

### Working (verified, not just documented)
- **Tests**: 115/115 pass across 26 files (activation, checkout, admin auth, redirects, CMS, analytics, landing pages, catalog).
- **Build**: `npm run build` and `npm run cf:build` both complete clean, 94 routes, no type errors.
- **Live site** (`tap-rater-app-git`) renders correctly: homepage, `/admin` (redirects to login), `/product/google-review-stand`, `/cart` all return real, correct HTML.
- **Admin auth**: HMAC-signed session cookie, timing-safe comparison, TTL + clock-skew handling. Solid.
- **Activation flow**: SHA-256 hashed activation codes (never stored plain), timing-safe validation, rate-limited (10 attempts / 15 min), failed attempts logged, IP addresses hashed before storage, destination URLs restricted to `http`/`https` (blocks `javascript:`/`data:`).
- **Catalog data**: 16 Phase 1 products (8 stands + 8 plates) across 5 use-case categories (reviews, social-media, appointments, menu, feedback), matching `docs/phase-1-products.md` exactly. No cards/badges/name-tags/WiFi products exist to remove — they were never added, which matches the intended scope.
- **CI**: `.github/workflows/ci.yml` runs install/test/build on every push. A separate manual-only workflow can redeploy the old Worker as a rollback path.

### Placeholder / not yet real
- **Plate product photography**: 7 of 8 plate images are branded "coming soon" placeholder graphics (confirmed in code: `alt: "... placeholder"` on all plate images except Google's). Files exist at the expected paths, but they are not real product renders.
- **Checkout**: Stripe is deliberately test-mode-only at the API layer (`STRIPE_SECRET_KEY` must be `sk_test_...`, live keys are rejected). This is correct given no live bank account yet.
- **Platform/hosted-page products**: schema and code paths exist (`landing_pages`, `tap_events`, etc.) but there is no real hosted-page product for sale yet — Phase 1 is redirect-only, as documented.
- **Railway backend**: scaffold only (~190 lines across `apps/backend`), intentionally deferred per README.

### Broken (found live, not previously documented)
- **Footer links are dead on every page**: "About Us" (`/about-us`), "Privacy Policy" (`/privacy-policy`), and "Review Links Generator" (`/review-links-generator`) all return live 404s on the deployed Git-linked Worker. These render on every single page via the global footer, so it's a site-wide issue, not a one-off.
- **Cart/checkout is disconnected from the storefront UI**: `AddToCartButton` is fully implemented (calls `cart.addItem`, wired to a working `useCart` provider) but it is not imported or rendered anywhere in the app. The live product page shows only "Request setup" / "Request custom design" links, and `/cart` is permanently empty because nothing can add to it. The Stripe checkout API, webhook route, and `checkout/success` / `checkout/cancel` pages all exist and build fine — they're just not reachable from any real user flow right now.

### Confusing
- **Buy-now messaging mismatch**: `docs/phase-1-products.md` and the DB schema define `checkout_mode = buy_now` for every Phase 1 product, implying direct purchase. The live product page instead says "Checkout is not live yet. Setup details are collected by request." This isn't wrong (Stripe live isn't approved), but the docs and the live copy tell two different stories about what "buy_now" currently means. Worth one clear internal note on what buy_now means *today* vs. after live Stripe.
- **Two live Workers with diverging config**: `tap-rater-app` (old, manual-deploy, points to `taprater.com`) and `tap-rater-app-git` (new, auto-deploy from `nextjs-commerce`, points to its own `.workers.dev` URL). Anyone jumping into the repo cold could easily test the wrong one. `docs/deployment.md` already explains this well — it just needs to stay the single source of truth as work continues.

### Risky
- **Cutover gate is genuinely not met yet**: per your own `docs/deployment.md`, `tap-rater-app-git` needs (a) all secrets confirmed, (b) Neon-backed flows verified, (c) Resend domain verification finished, (d) a clean commit-SHA match, before DNS/custom domain moves over. Don't shortcut this — the two-Worker approach is the right safety net; keep it until the gates are actually green.
- **Resend domain not verified**: email delivery (contact forms, magic-link customer login, order notifications) is configured but will silently fail in production until `taprater.com` is verified in Resend. This is a "looks done, isn't done" risk — nothing will error loudly, customers will just never get emails.
- **Activation code hashing has no per-code salt**: SHA-256 over a canonicalized code is fine given rate-limiting and presumably high-entropy codes, but if activation codes turn out to be short/guessable, an attacker with DB read access could precompute a rainbow table. Low priority given current controls, but worth a second look before scaling device volume.

## 2. Deployment Status

| Item | Status |
|---|---|
| Old Worker (`tap-rater-app`) | Live, manual-deploy only via GitHub Actions (`workflow_dispatch`), points to `taprater.com` in its own `vars`. Not deleted — correct, keep it as rollback. |
| New Worker (`tap-rater-app-git`) | Live, confirmed via direct fetch. Homepage, admin redirect, product page, and cart page all render correctly. |
| Auto-deploy from GitHub | Confirmed working per `docs/deployment.md` (Cloudflare Workers Builds connected to `nextjs-commerce`) — not independently re-verified here since I don't have Cloudflare dashboard access. |
| Secrets on `tap-rater-app-git` | Per your own deployment doc: all required Worker secrets are now present. Resend domain verification for `taprater.com` is the one explicitly open item. |
| Old GitHub Actions workflow | Still present (`deploy-cloudflare-worker.yml`), manual-only, targets the old Worker — correct as a fallback. |
| Cutover safety | **Not yet safe to cut over.** Your own 8-point cutover checklist in `docs/deployment.md` has real, unfinished items (Resend verification, and re-confirming Neon-backed flows post any new secret changes). Follow that checklist as written — it's well built. |

## 3. Product / Catalog Status

- **Active products**: 16 SKUs — Google/Yelp/Facebook/TripAdvisor review (stand+plate), Rate Your Experience (stand+plate), Follow Us on Social Media (stand+plate), Book Your Next Visit (stand+plate), View Our Menu (stand+plate). Matches your brief's Phase 1 scope exactly.
- **Categories**: reviews, social-media, appointments, menu, feedback, business-bundles. First five have real products; **business-bundles category exists with zero products in it** — "Bundle" is a defined format in your brief but there's no actual bundle SKU yet.
- **Products to remove**: none found — cards, name tags, badges, and WiFi products were never added to the catalog, so there's nothing to clean up there. Good discipline already.
- **Images**: 8/8 stand renders are real. 1/8 plate renders (Google) is real; the other 7 use a branded placeholder graphic, which is honestly labeled in code and (per `docs/phase-1-products.md`) on the storefront.
- **CTAs**: every product page CTA currently routes to "Request setup" or "Request custom design" (contact/setup forms), not to cart/checkout — see the "Broken" section above. This is consistent across all 16 products since they share one template.

## 4. Frontend Status

Assessed from source (Tailwind classes, copy, structure, page composition) and the live rendered HTML/text — not a visual screenshot pass, so treat design-quality scores as directional.

- **5-second clarity**: Reasonably clear. Hero headline is "NFC review stands and smart reputation pages for local businesses," sub-copy lists the use cases, two CTAs ("Shop NFC Products," "Explore Platform Options"). It communicates what Tap Rater is, though it's not the punchier "Tap. Scan. Review." framing you described in your brief — the homepage hasn't been rewritten to that messaging yet.
- **Organization**: Good — shop is organized by use case (reviews, social, appointments, menu, feedback) before format (stand/plate), which matches how a buyer actually thinks about the product.
- **Premium feel**: The layout is clean and modern (generous whitespace, consistent card patterns, dark "platform preview" band for contrast) — it does not look like a cheap ecommerce template. It leans heavier and bolder than a typical Apple-style page: nearly every heading and label uses `font-black` (900 weight), which reads more "confident startup" than "restrained premium." Getting to the Apple-inspired brief will mean deliberately dialing back weight/contrast in places, not a from-scratch rebuild.
- **CTAs connected to real flows**: Partially. "Shop NFC Products" and category navigation work end-to-end. "Request setup" and "Request custom design" go to real contact/setup pages. The one CTA that's *not* connected to anything is the missing add-to-cart button — see Broken, above.
- **Mobile**: Not independently verified (no rendered screenshot in this pass) — code uses responsive Tailwind breakpoints throughout, which is a good sign, but this should get an actual device/browser check before scoring it with confidence.

Scores (directional, based on code + rendered text, not a visual audit):

| Dimension | Score /10 | Why |
|---|---|---|
| Clarity | 7 | Clear who it's for and what it does; messaging not yet aligned to your "Tap. Scan. Review." brief |
| Design quality | 6 | Clean and consistent, but heavier/bolder than the Apple-inspired target; not cluttered |
| Conversion | 4 | No working add-to-cart/buy path currently reachable from product pages — this alone caps conversion |
| Trust | 7 | Honest copy about test-mode checkout and "coming soon" images; real security practices under the hood |
| Mobile | — | Not scored — needs an actual rendered check, not inferred from Tailwind classes |
| SEO | 7 | Per-page metadata, OpenGraph, JSON-LD (organization + website) on the homepage, canonical URLs present |

## 5. Backend / Platform Status

- **Device redirect (`/r/[deviceCode]`)**: implemented with status handling (active/paused/disabled/unactivated), protocol allowlist on destinations, tap-event logging that doesn't block the redirect. Real, not placeholder.
- **Activation (`/activate`, `/api/activate`)**: real — rate-limited, hashed codes, logged attempts, creates/finds customer + business records.
- **Admin login**: real, cryptographically sound session handling.
- **Tap logging**: implemented against `tap_events`, IP-hashed.
- **Neon database usage**: primary persistence path; Supabase supported as an alternative adapter (tests cover both).
- **Railway**: reserved for future backend jobs only, correctly not in the critical path today.
- **Real vs. placeholder summary**: activation, redirects, admin auth, and analytics logging are real. Hosted landing pages, subscriptions, and live payments are intentionally not built yet (Phase 2/3 per your own `docs/mvp-scope.md`).

## 6. QA Status

| Command | Result |
|---|---|
| `npm ci` | ✅ Pass (472 packages) |
| `npm test` | ✅ Pass — 115/115 tests, 26 files |
| `npm run build` | ✅ Pass — 94 routes generated, no errors |
| `npm run cf:build` | ✅ Pass — OpenNext Cloudflare bundle built clean |
| `npm run smoke` (local) | ⚠️ Inconclusive — the sandbox this audit ran in doesn't keep a background server alive across tool calls, so the smoke script itself couldn't hold a connection open. Not a code issue. |
| Live check against `tap-rater-app-git.sam-alshalah1.workers.dev` | ✅ Homepage, `/admin` → login redirect, `/product/google-review-stand`, `/cart` all verified live via direct fetch. ❌ `/about-us`, `/privacy-policy`, `/review-links-generator` confirmed live 404s. |

Recommend re-running `npm run smoke` yourself against both Worker URLs from a machine that can hold the process open, to get a clean pass/fail on the remaining routes (`/activate`, `/r/TR-DEMO-GOOGLE`, etc.) that I couldn't reach given this session's network rules.

## 7. Top Owner-Priority Issues (ranked)

1. **No working purchase path.** `AddToCartButton` exists, works, and is simply never rendered on the product page. This is the single highest-leverage fix — it's small (wire one existing component in), and it directly unblocks real conversion.
2. **Three dead footer links on every page** (`/about-us`, `/privacy-policy`, `/review-links-generator`). Cheap to fix (either build the pages or remove the links) but currently live and visible to any real visitor.
3. **Resend domain not verified** — silent email failure risk (contact forms, order notifications, customer magic-link login).
4. **Cutover checklist not yet fully green** — don't move DNS until items 2–3 here plus your own 8-point list in `docs/deployment.md` are actually done.
5. **Homepage messaging** doesn't yet match your "Tap. Scan. Review." / "Tap. Scan. Review." direction from the brief — straightforward copy change, not a rebuild.
6. **Plate photography** — 7 of 8 plates still show placeholder art, which likely suppresses plate conversion specifically.
7. **Bundle format has no real SKU** yet, despite being called out as an active format in your brief.
8. **Buy-now vs. request-setup mismatch** between docs/schema intent and live copy — needs one clear internal decision on what "buy now" means pre-live-Stripe.
9. **Visual/mobile QA hasn't actually been done** with a rendered browser — only inferred from code. Worth an actual pass before any redesign work starts.
10. **Design tone** (very heavy `font-black` usage throughout) is further from "Apple-inspired restraint" than the current structure/organization is — worth noting now so redesign work has a clear before/after target instead of guessing at "premium."
