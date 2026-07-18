# Phase 1 Products

Phase 1 sells physical tabletop NFC stands as the core catalog, plus two Phase 2/3 catalog entries added ahead of schedule: Custom NFC Stand (managed, request-quote) and Hosted Landing Page Subscription (platform, contact-sales). Cards, employee name tags, badges, staff cards, and plates are postponed or discontinued.

## Active Storefront Products

### Stands (Direct-Link, `buy_now`)

- Google Review Stand
- Yelp Review Stand
- Facebook Review Stand
- TripAdvisor Review Stand
- Rate Your Experience Stand
- Follow Us on Social Media Stand
- Book Your Next Visit Stand
- View Our Menu Stand

### Managed / Platform (`request_quote` / `contact_sales`)

- **Custom NFC Stand** — a fully custom-printed physical stand (logo, business name, custom headline). Can point to a single direct link or a Hosted Landing Page. `productType = physical_managed`, `format = stand`.
- **Hosted Landing Page Subscription** — a device opens a Tap Rater hosted page with multiple buttons/links instead of one direct destination. Requires a customer account and a monthly subscription. `productType = platform_landing_page`, `format = platform`.

### Plates — discontinued

All 8 plate SKUs (`isActive: false`) are kept in `src/data/migrated-products.ts` for reversibility but do not appear anywhere on the storefront (shop, category pages, checkout, or static generation).

## Product Model By Tier

**Direct-Link Stand** (the 8 stands above):

- `productType = physical_redirect`, `serviceMode = basic_redirect`
- `checkoutMode = buy_now` while checkout remains test/preview
- `requiresAccount = false`, `requiresLandingPage = false`, `requiresSubscription = false`
- `activationType = free_basic_activation`, `includedServiceLabel = Free basic activation`

**Custom Printed Stand** (Custom NFC Stand):

- `productType = physical_managed`, `serviceMode = managed_redirect`
- `checkoutMode = request_quote`
- `requiresSubscription = false` — the base product is a one-time custom print job. If the customer's chosen destination is a Hosted Landing Page rather than a direct link, that requirement lives on the destination configuration, not the base SKU.
- `activationType = managed_setup`

**Hosted Landing Page Subscription**:

- `productType = platform_landing_page`, `serviceMode = hosted_landing_page`
- `checkoutMode = contact_sales`
- `requiresAccount = true`, `requiresLandingPage = true`, `requiresSubscription = true`
- `activationType = premium_hosted_activation`

No Stripe subscription billing exists yet for this tier — `checkoutMode = contact_sales` deliberately routes to the contact form rather than a real checkout, matching the "do not enable Stripe subscriptions" constraint until pricing and billing are explicitly approved.

## Design Customization Options

Every active stand (Phase 1 and Custom NFC Stand) supports:

- Standard Design (`standard_design`): uses the Tap Rater template and is the fastest setup path.
- Add Your Logo (`add_logo`): adds the customer's business logo to the Tap Rater design. Logo setup is required and logo files are collected after request.
- Custom Design (`custom_design`): supports custom colors, layout, wording, and logo placement. Custom design requires approval before production.

Customization must stay inside each product page. Do not create separate custom-design categories. Do not imply that logo upload, automated proofs, or custom production approval are live. Use wording such as "Logo and custom design details are collected after request."

## Storefront Categories

Categories are based on customer use case:

- Review Products (`reviews`)
- Social Media Products (`social-media`)
- Appointment Products (`appointments`)
- Menu Products (`menu`)
- Feedback Products (`feedback`)
- Business Bundles (`business-bundles`) — now also home to Custom NFC Stand and Hosted Landing Page Subscription, since both are managed/quote-based rather than standard Phase 1 shop-grid buys.

## Product Copy Rules

- Direct-link physical products must say "No monthly fee required for basic activation."
- Physical products must say "Connects to one destination URL" (except Hosted Landing Page, which explicitly connects to multiple).
- Physical products must say "Tap or scan ready."
- View Our Menu products are menu-only. Do not mention Wi-Fi in customer-facing menu product copy.
- Follow Us on Social Media products should mention Facebook, X, Instagram, and YouTube.
- Avoid review-gating language.

## Image Status (updated 2026-07-17)

Real, dedicated product photography exists for 138 products (the 2026-07-17 batch, `public/uploads/products/v5/`), all matched via OCR against the printed text on each stand and verified against the actual catalog slugs.

**43 products have no dedicated photo yet** and use a genuine "Photo coming soon" placeholder (`public/uploads/products/no-photo-available.png`) — not another product's photo. This spans the review platforms not yet shot (Booking.com, Bing Places, DoorDash, Grubhub, OpenTable review, Resy review) plus every Custom Stand and Hosted Tap Page product (9 + 8 = 17), since those are inherently non-fixed/custom rather than a single fixed design.

All older placeholder-reuse renders (the v2/v3/v4 transparent-background batches) have been deleted from `public/uploads/products/` — nothing in the codebase references them anymore.

## Payment, Tip & Donation Stands — discontinued (2026-07-17)

All 13 products in this stand category were deactivated (`isActive: false`), same reversible pattern as the plates. They're hidden from `/shop`, `/shop/stands`, and category listings, but the data stays in `src/data/extended-catalog.ts` in case this changes.

**Known consequence, not yet fixed:** the "Nonprofits & Donations" use case leaned heavily on this category — it now has only 5 of its original 12 recommended products (and only 1 of its original 4 featured products) still active. Worth revisiting that use case's product list directly if Payment/Tip/Donation stays off.
