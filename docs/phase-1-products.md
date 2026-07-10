# Phase 1 Products

Phase 1 sells only physical tabletop NFC stands and flat NFC plates. Cards, employee name tags, badges, staff cards, and other card/tag products are postponed until printing and fulfillment are ready.

## Active Storefront Products

### Stands

- Google Review Stand
- Yelp Review Stand
- Facebook Review Stand
- TripAdvisor Review Stand
- Rate Your Experience Stand
- Follow Us on Social Media Stand
- Book Your Next Visit Stand
- View Our Menu Stand

### Plates

- Google Review Plate
- Yelp Review Plate
- Facebook Review Plate
- TripAdvisor Review Plate
- Rate Your Experience Plate
- Follow Us on Social Media Plate
- Book Your Next Visit Plate
- View Our Menu Plate

## Shared Phase 1 Product Model

Phase 1 physical products use:

- `productType = physical_redirect`
- `serviceMode = basic_redirect`
- `checkoutMode = buy_now` while checkout remains test/preview
- `format = stand` or `format = plate`
- `requiresAccount = false`
- `requiresLandingPage = false`
- `requiresSubscription = false`
- `activationType = free_basic_activation`
- `includedServiceLabel = Free basic activation`

Each product supports direct redirect activation. The physical NFC chip or QR code can point to a permanent Tap Rater URL, then redirect to one configured destination URL.

## Design Customization Options

Every active Phase 1 stand and plate supports:

- Standard Design (`standard_design`): uses the Tap Rater template and is the fastest setup path.
- Add Your Logo (`add_logo`): adds the customer's business logo to the Tap Rater design. Logo setup is required and logo files are collected after request.
- Custom Design (`custom_design`): supports custom colors, layout, wording, and logo placement. Custom design requires approval before production.

The product model also stores:

- `allowsLogoUpload = true`
- `allowsCustomDesign = true`
- `designMode = standard` by default

Customization must stay inside each product page. Do not create separate custom-design categories. Do not imply that logo upload, automated proofs, or custom production approval are live. Use wording such as "Logo and custom design details are collected after request."

## Storefront Categories

Categories are based on customer use case:

- Review Products (`reviews`)
- Social Media Products (`social-media`)
- Appointment Products (`appointments`)
- Menu Products (`menu`)
- Feedback Products (`feedback`)
- Business Bundles (`business-bundles`)

The format field describes the physical item. For example, Google Review Stand uses `categorySlug = reviews` and `format = stand`; Google Review Plate uses `categorySlug = reviews` and `format = plate`.

## Product Copy Rules

- Physical products must say "No monthly fee required for basic activation."
- Physical products must say "Connects to one destination URL."
- Physical products must say "Tap or scan ready."
- Plate products should not be described as stands.
- View Our Menu products are menu-only. Do not mention Wi-Fi in customer-facing menu product copy.
- Follow Us on Social Media products should mention Facebook, X, Instagram, and YouTube.
- Avoid review-gating language.

## Image Status

Real stand renders exist for all eight stand products.

Real plate renders are currently missing for:

- Yelp Review Plate
- Facebook Review Plate
- TripAdvisor Review Plate
- Rate Your Experience Plate
- Follow Us on Social Media Plate
- Book Your Next Visit Plate
- View Our Menu Plate

The storefront uses clear branded "Plate image coming soon" placeholders for those products until real plate renders are created. Google Review Plate uses the existing plate image.
