# Tap Rater — Project Finish Plan

This plan sequences remaining work into controlled phases. One phase = one focus = one clean commit set. Do not mix a deployment fix with a redesign change in the same commit.

Source: `docs/owner-audit.md` (2026-07-10).

---

### Priority 0 — Deployment secrets & cutover readiness
**Goal:** `tap-rater-app-git` is genuinely safe to become the source of truth.
- Confirm every secret in the Runtime Variable Inventory table (`docs/deployment.md`) is present on `tap-rater-app-git`.
- Finish Resend domain (DNS) verification for `taprater.com`.
- Re-run admin login, Neon-backed product/device/activation flows, and Resend send test against the live Git-linked Worker.
- Walk your own 8-point cutover checklist in `docs/deployment.md` top to bottom.
- **Do not touch DNS or delete the old Worker until this phase is fully green.**

### Priority 1 — Phase 1 product scope lock
**Goal:** confirm the 16-SKU catalog is final for launch.
- Confirm no card/badge/name-tag/WiFi products are planned for Phase 1 (none exist currently — just document the decision).
- Decide whether "Business Bundles" ships in Phase 1 or moves to Phase 3 (it's currently an empty category with no SKUs).
- Lock this list in `docs/phase-1-products.md` as the frozen scope.

### Priority 2 — Product images and image mapping
**Goal:** real renders for every active SKU.
- Commission/produce real plate renders for the 7 SKUs currently on placeholder art (Yelp, Facebook, TripAdvisor, Rate Your Experience, Follow Us on Social Media, Book Your Next Visit, View Our Menu — plate variants).
- Verify each product's `image` reference in `src/data/migrated-products.ts` points to the new file once ready.
- Remove the `next.config.ts` remote pattern for `taprater.com/wp-content/uploads/**` once nothing depends on the old WordPress media library anymore.

### Priority 3 — Fix the broken purchase path (moved up from general redesign)
**Goal:** a real, working buy or request flow on every product page.
- Wire the existing `AddToCartButton` into the product page (it's fully built, just not rendered anywhere).
- Decide product-by-product whether the CTA should be "Add to cart" (Stripe test checkout) or "Request setup" (current behavior) — right now every Phase 1 product silently defaults to request-only despite being modeled as `checkout_mode = buy_now`.
- Fix or remove the three dead footer links (`/about-us`, `/privacy-policy`, `/review-links-generator`) — every page currently ships a 404 in the footer.

### Priority 4 — Quote/request workflow
- Confirm `/contact-us`, `/setup-new-taprater`, and `/change-taprater-link` fully capture what admin needs to fulfill a physical order (design mode, logo file, destination URL).
- Confirm admin-side visibility into these submissions (`/admin/requests`) reflects real data end-to-end.

### Priority 5 — Real NFC device MVP
- Confirm the physical device → `/r/{deviceCode}` → activation → destination loop with one real physical unit, not just `TR-DEMO-GOOGLE`.
- Confirm packaging includes correct activation-code handling per `docs/launch-checklist.md`.

### Priority 6 — Admin dashboard
- Review `/admin/*` sections for parity with what's actually needed to run the business day-to-day (devices, requests, products already look built — confirm analytics and customer views are usable, not just scaffolded).

### Priority 7 — Customer portal
- Confirm magic-link login (`/account/login`) works once Resend is verified (Priority 0 blocks this).
- Confirm `/account/devices` and `/account/business` reflect real activation data.

### Priority 8 — Resend email
- Finish domain verification (also listed under Priority 0, since it blocks cutover).
- Confirm all four email touchpoints fire correctly: contact form, setup request, order notification, customer magic-link.

### Priority 9 — SEO
- Homepage already has per-page metadata, OpenGraph, and JSON-LD — extend the same pattern to any new pages added in Priority 2–4.
- Once messaging changes (Priority "frontend redesign," below) land, refresh meta descriptions/titles to match.

### Priority 10 — Security / operations
- Revisit activation-code hashing (currently unsalted SHA-256) once device volume is real — low urgency today given rate-limiting, but worth a second pass before scaling.
- Confirm Google Places API key restrictions are actually applied in the Google Cloud console (code-side request scoping already looks correct — this is a console/config check, not a code change).

### Priority 11 — Stripe / payment
- Do not enable live keys until the business bank account is ready (already correctly gated at the API layer).
- Once ready: swap `sk_test_...` for live keys, re-verify the webhook endpoint, and re-run the full checkout QA section of `docs/launch-checklist.md`.

### Priority 12 — Launch
- Full run-through of `docs/launch-checklist.md` (currently a template with all ~200 items unchecked) against the live cutover Worker.
- DNS cutover to `taprater.com` only after Priority 0 and this checklist are both complete.

---

## Where the Apple-inspired frontend redesign fits

Not assigned a single priority number above on purpose — see the "Sequencing note" in `docs/next-sprint.md`. Short answer: **after Priority 0–3, not before.** The current design is already clean and not embarrassing; the purchase-path and cutover issues are actively costing you money and risk today, while the visual redesign is not.
