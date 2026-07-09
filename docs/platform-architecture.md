# Tap Rater Platform Architecture

This document defines the long-term Tap Rater platform architecture before the next implementation phases. It is intentionally planning-only: no Stripe checkout, payment processing, or UI rebuild is included here.

## Strategic Direction

Tap Rater sells physical NFC and QR products that help businesses send customers to the right post-service action. Some products are simple one-time hardware sales. Other products require a hosted Tap Rater platform layer for activation, hosted pages, analytics, forms, and multi-location management.

The core platform principle is:

```text
Every platform-powered stand uses a permanent Tap Rater URL:
https://taprater.com/r/{deviceCode}
```

The physical NFC chip and QR code should point to that permanent Tap Rater URL. The Tap Rater backend decides what happens next:

- redirect directly to a destination URL
- show an activation page for unactivated devices
- open a hosted Tap Rater landing page
- record tap events and form submissions when allowed by the service mode

## Product Categories

### One-Time Products

These products can be sold as hardware without requiring a customer account or recurring service. They can still optionally use a permanent Tap Rater URL if the business wants managed updates later.

- `google_review`: Google Review Stand or Plate that links to a Google review URL.
- `facebook_review`: Facebook Review Stand that links to a Facebook page, recommendation, or review destination.
- `yelp_profile`: Yelp Profile Stand that links to a Yelp business profile.
- `appointment_booking`: Appointment Booking Stand that links to Calendly, Square, Fresha, Google booking, or another booking URL.
- `social_follow`: Social Follow Stand that links to Instagram, TikTok, Facebook, LinkedIn, or a social hub.
- `wifi_menu`: Menu or Wi-Fi Stand that links to a menu, Wi-Fi info page, or hosted static page.
- `custom_url`: Custom UV printed direct-link stand that opens any approved customer URL.

### Platform Products

These products need Tap Rater platform support because they require hosted pages, forms, routing logic, analytics, staff/location management, or customer self-service.

- `multi_platform_review`: Hosted page with Google, Facebook, Yelp, and other review options.
- `feedback_form`: Hosted feedback form that captures customer comments before redirecting or notifying the business.
- `referral_form`: Hosted referral capture page.
- `business_card`: Digital business card page for a person, staff member, or business.
- `staff_cards_with_analytics`: Staff-specific cards with tap/event attribution.
- `multi_location_dashboard`: Dashboard for multiple business locations and device groups.
- `hosted_landing_pages`: Tap Rater-managed landing pages for campaigns, menus, reviews, and service links.
- `analytics_dashboard`: Tap and conversion reporting for devices, pages, staff, and locations.

## Product Type Enum

Use these product type identifiers in the database and application code:

- `google_review`
- `facebook_review`
- `yelp_profile`
- `appointment_booking`
- `social_follow`
- `wifi_menu`
- `multi_platform_review`
- `feedback_form`
- `referral_form`
- `business_card`
- `custom_url`

## Service Modes

### `basic_redirect`

Best for one-time products.

- No customer login required after setup.
- Device resolves to one destination URL.
- No monthly fee.
- Destination can be configured during activation or by admin support.
- Minimal or no analytics.

### `managed_redirect`

Best for businesses that want Tap Rater to host a permanent redirect URL and allow future destination changes.

- Customer login can be optional for first version; admin can manage changes.
- Device resolves through Tap Rater before redirecting.
- Destination changes do not require rewriting NFC chips or QR codes.
- Basic tap logs may be captured.

### `premium_landing_page`

Best for multi-option review pages, feedback forms, referrals, business cards, and analytics products.

- Customer login required.
- Device opens a hosted Tap Rater page or form.
- Supports page templates, branding, form submissions, analytics, locations, staff, and premium features.
- Can become subscription-backed later.

## Core Entities

### `customer`

Represents the person who owns an account or manages one or more businesses.

Suggested fields:

- `id`
- `email`
- `name`
- `phone`
- `role`
- `created_at`
- `updated_at`
- `email_verified_at`

### `business`

Represents a company, location group, or single local business.

Suggested fields:

- `id`
- `customer_id`
- `name`
- `website_url`
- `phone`
- `address`
- `google_place_id`
- `default_review_url`
- `created_at`
- `updated_at`

### `device`

Represents a physical NFC/QR product.

Suggested fields:

- `id`
- `device_code`
- `activation_code_hash`
- `product_type`
- `service_mode`
- `status`
- `business_id`
- `destination_id`
- `landing_page_id`
- `order_id`
- `batch_id`
- `printed_at`
- `activated_at`
- `created_at`
- `updated_at`

`device_code` is public and appears in `/r/{deviceCode}`. The activation code is private and should be stored hashed, not in plain text.

### `activation`

Represents a device activation event.

Suggested fields:

- `id`
- `device_id`
- `customer_id`
- `business_id`
- `activation_code_verified`
- `ip_hash`
- `user_agent`
- `created_at`

### `destination`

Represents the URL or target action for a device.

Suggested fields:

- `id`
- `business_id`
- `type`
- `url`
- `label`
- `is_active`
- `created_at`
- `updated_at`

Destination types can include `google_review`, `facebook_review`, `yelp_profile`, `booking`, `social`, `menu`, `wifi`, `custom`, and `landing_page`.

### `landing_page`

Represents a hosted Tap Rater page.

Suggested fields:

- `id`
- `business_id`
- `slug`
- `template_type`
- `title`
- `logo_url`
- `theme`
- `content`
- `status`
- `created_at`
- `updated_at`

### `tap_event`

Represents a device scan/tap or hosted page view.

Suggested fields:

- `id`
- `device_id`
- `business_id`
- `landing_page_id`
- `event_type`
- `referrer`
- `ip_hash`
- `user_agent`
- `country`
- `region`
- `created_at`

Do not store raw IP addresses unless there is a clear compliance need. Prefer hashing or coarse analytics.

### `form_submission`

Represents a hosted feedback, referral, or contact form submission.

Suggested fields:

- `id`
- `business_id`
- `device_id`
- `landing_page_id`
- `form_type`
- `name`
- `email`
- `phone`
- `rating`
- `message`
- `payload`
- `status`
- `created_at`

### `order`

Represents ecommerce order metadata once checkout is implemented.

Suggested fields:

- `id`
- `customer_id`
- `email`
- `status`
- `subtotal_cents`
- `tax_cents`
- `shipping_cents`
- `total_cents`
- `stripe_checkout_session_id`
- `stripe_payment_intent_id`
- `created_at`
- `updated_at`

Payment fields are reserved for the future Stripe phase and should not be used before checkout is live.

## Activation Model

Each platform-capable device should have:

- Public `device_code`: used in `https://taprater.com/r/{deviceCode}`.
- Private activation code: printed inside packaging, on an insert card, or included with order paperwork.
- Device status: `unactivated`, `active`, `paused`, `lost`, or `retired`.

Flow:

1. Device NFC/QR opens `/r/{deviceCode}`.
2. Backend looks up `device_code`.
3. If device is missing, show a not-found/support page.
4. If device is unactivated, open an activation page.
5. Customer enters private activation code and setup details.
6. Backend verifies activation code, creates/links customer and business records, and assigns service mode.
7. Activated device either redirects to a destination or opens a hosted landing page.

Activation-code rules:

- Store activation codes hashed.
- Rate-limit activation attempts per device and IP.
- Lock or slow down repeated failures.
- Allow admin reset/reissue.
- Never expose private activation codes in client-side code.

## Redirect Model

Route:

```text
GET /r/{deviceCode}
```

Resolution:

1. Validate `deviceCode` format.
2. Fetch device by `device_code`.
3. If unactivated, render activation page.
4. If `service_mode = basic_redirect`, redirect to active destination URL.
5. If `service_mode = managed_redirect`, log minimal event if enabled, then redirect.
6. If `service_mode = premium_landing_page`, render the hosted landing page.
7. If paused/retired, show support or inactive-device page.

Performance requirements:

- Public redirects must be fast.
- Avoid slow third-party API calls in the redirect path.
- Cache safe device resolution data where possible.
- Keep event logging non-blocking where possible.

## Customer Login Requirements

### No Customer Login Required

These can work with admin-assisted setup or one-time activation:

- `google_review` in `basic_redirect`
- `facebook_review` in `basic_redirect`
- `yelp_profile` in `basic_redirect`
- `appointment_booking` in `basic_redirect`
- `social_follow` in `basic_redirect`
- `wifi_menu` in `basic_redirect`
- `custom_url` in `basic_redirect`

### Customer Login Recommended

These benefit from login but can start admin-managed:

- `google_review` in `managed_redirect`
- `facebook_review` in `managed_redirect`
- `yelp_profile` in `managed_redirect`
- `appointment_booking` in `managed_redirect`
- `social_follow` in `managed_redirect`
- `wifi_menu` in `managed_redirect`
- `custom_url` in `managed_redirect`

### Customer Login Required

These require a portal for self-service, analytics, forms, or hosted pages:

- `multi_platform_review`
- `feedback_form`
- `referral_form`
- `business_card`
- staff cards with analytics
- multi-location dashboard
- hosted landing pages
- analytics dashboard

## Amazon and FBA Model

Tap Rater products sold through Amazon/FBA should be preloaded before shipment:

- NFC chip points to `https://taprater.com/r/{deviceCode}`.
- QR code points to the same permanent URL.
- Device package includes private activation code.
- Buyer activates by entering device code or scanning URL plus private activation code.
- Basic direct redirect has no monthly fee.
- Premium landing pages, analytics, staff tracking, and multi-location features can become subscriptions later.

This model avoids needing to know the customer before Amazon ships the product.

## Admin Backend Sections

The internal admin should eventually include:

- Dashboard: health, request counts, devices, activations, and pending setup.
- Customers: customer accounts and support context.
- Businesses: business profiles, locations, and review destinations.
- Devices: device code, activation status, product type, service mode, destination, landing page, batch.
- Activations: activation attempts, successful activations, failed attempts, abuse signals.
- Landing pages: templates, page status, branding, content, publishing.
- Tap events: high-level analytics, device activity, filtering by business/location/device.
- Setup requests: form submissions and activation support queue.
- Products: ecommerce products, pricing, SEO, stock, active/inactive state.
- Orders later: order records after Stripe checkout is implemented.

## Customer Portal Sections

The customer portal should eventually include:

- My Business: profile, logo, contact info, website, review profile links.
- My Devices: device list, device status, product type, service mode, assigned destination.
- Destinations: Google review links, Facebook, Yelp, booking, social, custom URLs.
- Landing Pages: hosted page builder, templates, branding, status.
- Analytics: taps, page views, form submissions, device performance, location/staff breakdown.
- Support: setup help, link change requests, billing support later.

## Build Phases

### Phase 1: Basic Redirect and Activation

Goal: make `/r/{deviceCode}` real.

- Add device schema.
- Add activation page.
- Add activation code verification.
- Add basic destination setup.
- Support `basic_redirect`.
- Keep customer login optional.
- No Stripe.

### Phase 2: Admin Device Manager

Goal: allow Tap Rater staff to manage devices.

- Device list and detail views.
- Create/import devices by batch.
- Assign product type and service mode.
- View activation status.
- Pause/retire devices.
- Reset activation codes.

### Phase 3: Customer Portal

Goal: allow customers to manage their own business and devices.

- Customer login.
- Business profile.
- Device list.
- Destination editor.
- Support requests.
- Email verification.

### Phase 4: Hosted Landing Page Templates

Goal: support platform products.

- Multi-platform review page template.
- Feedback form page template.
- Referral form template.
- Digital business card template.
- Branding controls.
- Publish/unpublish status.

### Phase 5: Analytics

Goal: make premium products valuable.

- Tap events.
- Page views.
- Form submissions.
- Device-level reporting.
- Location/staff reporting.
- Admin analytics and customer analytics.

### Phase 6: Stripe Later

Goal: add paid checkout and subscriptions only after banking and Stripe setup are ready.

- Stripe checkout.
- Paid order records.
- Webhooks.
- Subscription plans for premium landing pages and analytics.
- Tax/shipping integration.

Stripe is intentionally deferred and should not block Phases 1-5 architecture.

## Technical Risks and Decisions

### Supabase Schema

Decision: use Supabase as the first platform database because the current admin/CMS already uses Supabase.

Risks:

- Schema needs to separate ecommerce products from devices.
- Public redirect path must not depend on service-role credentials in the browser.
- RLS policies must be planned before customer portal launch.

### Public Redirect Performance

Decision: `/r/{deviceCode}` must stay lightweight.

Risks:

- Slow database reads can make scans feel broken.
- Event logging should not delay redirects.
- Landing page rendering should be cached or optimized.

### Google Places API Key Security

Decision: any Google Places lookup should happen server-side.

Risks:

- Browser-exposed keys can be abused.
- API quotas and billing need controls.
- Store only needed place metadata.

### Email Verification

Decision: customer portal should require verified email before sensitive device changes.

Risks:

- Unverified users could hijack device setup if activation code is leaked.
- Account recovery needs a support process.

### Activation-Code Abuse Prevention

Decision: activation code attempts need throttling.

Risks:

- Device codes are public.
- Attackers could brute force activation codes.
- Repeated failed attempts should be logged and slowed down.

### Review-Platform Compliance

Decision: Tap Rater should help customers reach review pages without gating positive/negative reviews in a way that violates platform rules.

Risks:

- Review gating can violate Google and other platform policies.
- Feedback forms should not mislead users or suppress legitimate reviews.
- Customer copy should avoid incentives for reviews unless compliant with the platform.

## Current Boundaries

Already built:

- Next.js storefront.
- Static product fallback.
- Admin login.
- Admin product editor foundation.
- Admin request inbox.
- Supabase-backed CMS/product/request paths.
- Cart persistence.

Not implemented by this document:

- Stripe checkout.
- Payment processing.
- Live order capture.
- Device activation routes.
- Customer portal.
- Hosted landing page renderer.
- Analytics pipeline.
