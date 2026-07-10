# Tap Rater Product Strategy

Tap Rater is both a product store and a reputation platform. The public storefront sells physical NFC products first, while the platform layer powers permanent device URLs, activation, business profiles, hosted landing pages, tap tracking, forms, and future customer dashboards. In the long-term model, some products are standalone NFC products, some require managed setup, some require hosted landing pages, and some require a customer account.

The current storefront strategy is intentionally narrower than the long-term platform strategy. Phase 1 sells only products Tap Rater can fulfill now: tabletop NFC stands and flat NFC plates.

## Phase 1 Fulfillment Scope

Phase 1 active storefront products:

- Google Review Stand
- Yelp Review Stand
- Facebook Review Stand
- TripAdvisor Review Stand
- Rate Your Experience Stand
- Follow Us on Social Media Stand
- Book Your Next Visit Stand
- View Our Menu Stand
- Google Review Plate
- Yelp Review Plate
- Facebook Review Plate
- TripAdvisor Review Plate
- Rate Your Experience Plate
- Follow Us on Social Media Plate
- Book Your Next Visit Plate
- View Our Menu Plate

Cards, employee name tags, badges, staff cards, and other card/tag products are postponed until Tap Rater has card or badge printing ready. They should not appear as active storefront products.

## Phase 1 Design Customization

Every active Phase 1 stand and plate can be sold in three design modes:

- Standard Design: uses the Tap Rater template and is the fastest setup path.
- Add Your Logo: adds the customer business logo to the Tap Rater design. Logo setup is required and logo files are collected after the order or setup request.
- Custom Design: supports custom colors, layout, wording, and logo placement. Custom designs require approval before production.

The product model supports this with:

- `customizationOptions = standard_design | add_logo | custom_design`
- `allowsLogoUpload = true` for stand and plate products
- `allowsCustomDesign = true` for stand and plate products
- `designMode = standard | logo | custom`

Customization is an option inside each product, not a storefront category. The categories remain based on customer use case: Reviews, Social Media, Appointments, Menu, Feedback, and Business Bundles.

Logo upload, automated proofing, and custom approval workflows are not live in Phase 1. Product pages and admin copy must use request-based wording such as "Logo and custom design details are collected after request."

## Product Families

### Standalone Physical Redirect Products

Standalone NFC products are simple physical products that open one destination URL. Phase 1 stands and plates use this model.

These products use:

- `productType = physical_redirect`
- `serviceMode = basic_redirect`
- `checkoutMode = buy_now` while checkout remains test/preview
- `requiresAccount = false`
- `requiresLandingPage = false`
- `requiresSubscription = false`
- `activationType = free_basic_activation`
- `includedServiceLabel = Free basic activation`

Basic activation can work with only a destination URL. The device can still point to a permanent Tap Rater route such as `/r/{deviceCode}`, but the behavior is a direct redirect after activation.

### Managed Setup and Bundles

Managed setup and bundles remain quote-based while Phase 1 focuses on individual stands and plates.

These products should use:

- `productType = physical_managed` or `bundle`
- `serviceMode = managed_redirect`
- `checkoutMode = request_quote`
- `requiresAccount = false` for now
- `requiresLandingPage = false`
- `requiresSubscription = false`
- `activationType = managed_setup`
- `includedServiceLabel = Managed setup included`

Bundles may create multiple devices during fulfillment or setup, but they are not the main Phase 1 shop grid.

### Platform Products

Hosted landing page products remain part of the long-term Tap Rater platform strategy, not the main Phase 1 physical product grid. They require Tap Rater platform setup, a customer account, business profile, device or public URL, landing page, and usually tracking or form storage.

Future platform products should use:

- `productType = platform_landing_page`
- `serviceMode = hosted_landing_page` or `multi_location_platform`
- `checkoutMode = request_quote` or `contact_sales`
- `requiresAccount = true`
- `requiresLandingPage = true`
- `requiresSubscription = true` only where hosted features require recurring service

## Phase 1 Categories

Phase 1 categories are based on customer use case, not physical format. The physical format is stored separately as `format = stand | plate | bundle | platform`.

The storefront categories are:

- Review Products (`reviews`)
- Social Media Products (`social-media`)
- Appointment Products (`appointments`)
- Menu Products (`menu`)
- Feedback Products (`feedback`)
- Business Bundles (`business-bundles`)

The first five categories contain the active Phase 1 stand and plate products. Each use-case category can show both physical formats. Business Bundles remains quote-based and optional while Phase 1 focuses on individual sellable products.

## Supported Destinations

The product model still supports these destinations for current and future products:

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

Phase 1 menu products are menu-only in customer-facing copy and should not be marketed as Wi-Fi products.

## Compliance Language

Tap Rater must avoid review-gating language. Do not block unhappy customers from public review platforms. Do not imply unhappy customers are blocked from public review platforms. Do not say or imply that Tap Rater gets only positive reviews, filters negative reviews, asks only happy customers, rewards reviews, or prevents public review access.

Acceptable language focuses on reducing friction:

- "Tap or scan to open your review link."
- "Make it easier for customers to share their experience."
- "Open the right review, booking, social, menu, feedback, or business link."
- "Hosted pages can include public review links and private feedback options without steering customers based on sentiment."

## Checkout Direction

Live Stripe payments are not enabled. Current one-time Stripe test checkout is only for `checkoutMode = buy_now` products. Platform products, managed setup, and bundles should use `request_quote` or `contact_sales` until pricing, subscription billing, tax, shipping, and fulfillment are intentionally approved.

## Launch Phases

### Phase 1: Physical Stands and Plates

- Publish SEO-focused marketing pages and product discovery pages.
- Sell only tabletop NFC stands and flat NFC plates.
- Keep card, badge, and name-tag products postponed.
- Support device activation for simple redirect devices with a destination URL.
- Support basic customer, business, location, and device records for platform growth.
- Track basic tap analytics without storing raw IP addresses.

### Phase 2: Hosted Reputation Pages

- Add hosted landing pages for multi-platform review, feedback, referral, social hub, and reputation hub products.
- Connect hosted pages to customer accounts, businesses, locations, devices, and analytics.
- Store feedback and referral submissions in a compliance-safe way.
- Keep review links available without steering customers based on sentiment.

### Phase 3: Quotes, Bundles, Billing, and Subscriptions

- Add quote requests for bundles, custom setup, and multi-location platform products.
- Add bundle fulfillment flows that can create multiple devices.
- Add subscription plans for hosted pages, analytics, and dashboards only after pricing is approved.
- Add Stripe live checkout only after explicit approval, bank account readiness, tax/shipping decisions, and webhook verification.
