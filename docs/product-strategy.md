# Tap Rater Product Strategy

Tap Rater is both a product store and a reputation platform. The public storefront sells physical NFC products, managed setup packages, hosted reputation pages, feedback flows, and business bundles. The platform layer powers permanent device URLs, activation, business profiles, hosted landing pages, tap tracking, forms, and future customer dashboards.

In plain terms: some products are standalone NFC products, some products require hosted landing pages, some products require a customer account and dashboard, and some products are bundles.

## Product Families

### Standalone NFC Products

Standalone NFC products are simple physical products that open one destination. Examples include Google Review NFC Stand, Google Review NFC Plate, Google Review NFC Card, Facebook Review Stand, Yelp Review Stand, TripAdvisor Review Stand, Appointment Booking Stand, Social Follow NFC Stand, and Menu / WiFi / Direct Link Stand.

These products use:

- `productType = physical_redirect`
- `serviceMode = basic_redirect`
- `checkoutMode = buy_now`
- `requiresAccount = false`
- `requiresLandingPage = false`
- `requiresSubscription = false`

Basic activation can work with only a destination URL. The device can still point to a permanent Tap Rater route such as `/r/{deviceCode}`, but the behavior is a direct redirect after activation.

### Managed Physical Products

Managed physical products are still physical NFC products, but Tap Rater helps configure or maintain the destination. Employee Review Name Tag is an example because staff-level destinations may need naming, routing, or reporting setup.

These products usually use:

- `productType = physical_managed`
- `serviceMode = managed_redirect`
- `checkoutMode = request_quote`
- `requiresLandingPage = false`
- `requiresSubscription = false`

### Hosted Landing Page Products

Hosted landing page products require Tap Rater platform setup. They need a customer account, business profile, device or public URL, landing page, and usually tracking or form storage. Examples include Multi-Platform Review Page, Reputation Hub Page, Rate Your Experience Page, Private Feedback Page, Referral Request Page, Social Media Hub Page, Review + Feedback Combo Page, Staff Review Tracking Page, and Multi-Location Dashboard.

These products use:

- `productType = platform_landing_page`
- `serviceMode = hosted_landing_page` or `multi_location_platform`
- `checkoutMode = request_quote` or `contact_sales`
- `requiresAccount = true`
- `requiresLandingPage = true`
- `requiresSubscription = true` only where hosted features require recurring service

Platform landing page activation must create or connect to a customer account, business, device, and landing page. It should not be treated like a simple one-destination redirect.

### Bundles

Bundles combine physical NFC products with managed setup. Business Review Starter Kit is the starting bundle model.

Bundles use:

- `productType = bundle`
- `serviceMode = managed_redirect`
- `checkoutMode = request_quote`
- `requiresAccount = false` unless dashboard access is included
- `requiresLandingPage = false` unless hosted pages are part of the bundle

Bundles may create multiple devices during fulfillment or setup.

## Supported Destinations

Products declare the destinations they support:

- `google`
- `facebook`
- `yelp`
- `tripadvisor`
- `instagram`
- `tiktok`
- `booking`
- `website`
- `menu`
- `wifi`
- `feedback`
- `referral`
- `custom`

## Compliance Language

Tap Rater must avoid review-gating language. Do not imply unhappy customers are blocked from public review platforms. Do not say or imply that Tap Rater gets only positive reviews, filters negative reviews, asks only happy customers, rewards reviews, or prevents public review access.

Do not block unhappy customers from public review platforms. Acceptable language focuses on reducing friction:

- "Tap or scan to open your review link."
- "Make it easier for customers to share their experience."
- "Open the right review, booking, social, feedback, or business link."
- "Hosted pages can include public review links and private feedback options without steering customers based on sentiment."

## Checkout Direction

Live Stripe payments are not enabled. Current one-time Stripe test checkout is only for `checkoutMode = buy_now` products. Platform products and bundles should use `request_quote` or `contact_sales` until pricing, subscription billing, tax, shipping, and fulfillment are intentionally approved.

## Launch Phases

### Phase 1: Storefront, Activation, and Basic Platform Foundation

Phase 1 should make Tap Rater useful as a real replacement for the WordPress/WooCommerce storefront while preserving the platform direction.

- Publish SEO-focused marketing pages and product discovery pages.
- Expand the catalog around physical redirect products, managed setup products, hosted platform products, and bundles.
- Keep `buy_now` for simple physical redirect products only.
- Use `request_quote` or `contact_sales` for managed, platform, and bundle products until billing is intentionally approved.
- Support device activation for simple redirect devices with a destination URL.
- Support basic customer, business, location, and device records for platform growth.
- Track basic tap analytics without storing raw IP addresses.

### Phase 2: Hosted Reputation Pages

Phase 2 should make platform products distinct from simple hardware.

- Add hosted landing pages for multi-platform review, feedback, referral, social hub, and reputation hub products.
- Connect hosted pages to customer accounts, businesses, locations, devices, and analytics.
- Store feedback and referral submissions in a compliance-safe way.
- Keep review links available without steering customers based on sentiment.

### Phase 3: Quotes, Bundles, Billing, and Subscriptions

Phase 3 should add commercial workflows after the product and platform model is stable.

- Add quote requests for bundles, custom setup, and multi-location platform products.
- Add bundle fulfillment flows that can create multiple devices.
- Add subscription plans for hosted pages, analytics, and dashboards only after pricing is approved.
- Add Stripe live checkout only after explicit approval, bank account readiness, tax/shipping decisions, and webhook verification.
