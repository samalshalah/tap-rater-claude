# Tap Rater — Next Sprint

Scope: the smallest set of changes that removes real risk and unblocks revenue, without touching deployment or starting the redesign.

## Sequencing note: redesign timing

**Start the Apple-inspired frontend redesign after this sprint, not during it.**

Reasoning:
- The current frontend is clean, organized by use case, and not embarrassing — it does not look like a cheap template. It needs tone adjustments (font weight, restraint), not a rebuild.
- Three things are actively costing you conversions or carrying real risk right now, and none of them require a redesign to fix: the missing add-to-cart wiring, the three dead footer links, and the unfinished cutover/Resend verification.
- Redesigning the frontend before the purchase path works means polishing a page that still can't take an order.
- Doing deployment fixes and redesign work in the same sprint risks exactly the "uncontrolled commit" mixing you asked to avoid.

Recommended order: this sprint (below) → Priority 0 cutover checklist fully green → then start redesign as its own isolated phase.

## This sprint

1. **Wire the add-to-cart button.** `AddToCartButton` already exists and works (`src/components/cart/add-to-cart-button.tsx`, backed by a working `useCart` provider). It just isn't imported into the product page. This is the highest-leverage single fix available.
2. **Fix the three dead footer links.** `/about-us`, `/privacy-policy`, `/review-links-generator` all 404 live, on every page. Either build minimal real pages or remove the links until they exist — don't ship dead links in a global footer.
3. **Finish Resend domain verification** for `taprater.com`. Blocks contact form delivery, order notifications, and customer magic-link login in production.
4. **Re-run the deployment cutover checklist** in `docs/deployment.md` against `tap-rater-app-git` now that secrets are in place, and confirm each of the 8 cutover gates.
5. **Decide the Business Bundles question**: ship a real bundle SKU this phase, or explicitly defer the category to a later phase and note it in `docs/phase-1-products.md` so it stops looking like an oversight.

## Explicitly not in this sprint
- No Apple-inspired visual redesign.
- No live Stripe keys.
- No DNS changes.
- No new product categories beyond the Bundle decision above.
- No plate photography commissioning (Priority 2 — separate phase, not blocking revenue the way the cart fix is).

## What I need from you to keep moving

- **GitHub write access**: I only have read access to `samalshalah/tap-rater` right now (cloned via public HTTPS). If you want me to actually push the cart-button fix, footer-link fix, or these three docs, I'll need a fine-grained PAT scoped to this repo — same pattern as Tap4Drive.
- **Cloudflare dashboard confirmation**: I can't see the actual secret values or build logs on `tap-rater-app-git` from here — I verified the live site behaves correctly, but the deployment doc's "secrets present" claims are based on your notes, not something I independently confirmed against the Cloudflare dashboard.
- **A decision on Business Bundles** (ship vs. defer) before Priority 1 is truly locked.
- **A decision on the buy-now vs. request-setup mismatch**: should Phase 1 products actually go through Stripe test checkout once the cart button is wired, or should "Request setup" stay the intended flow until live Stripe is approved? This determines exactly what the cart-button fix should do once clicked.
