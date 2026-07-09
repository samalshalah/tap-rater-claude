# Tap Rater MVP Scope

This scope keeps Tap Rater focused while replacing the old WordPress/WooCommerce site with a real product store and reputation platform.

## Phase 1: Storefront, Activation, and Basic Platform

Phase 1 should make Tap Rater sellable and operable without pretending the full platform is finished.

- marketing pages for the homepage, shop, categories, product pages, FAQs, setup, and contact/quote entry points
- expanded product catalog covering physical redirect products, managed products, hosted landing page products, and bundles
- device activation using a public device code and private activation code
- basic customer account foundation
- business/location/device management foundation
- basic redirects through permanent Tap Rater URLs
- basic tap analytics using `tap_events`
- no live Stripe checkout for platform products or bundles

Phase 1 success means a simple NFC product can be discovered, purchased or requested, activated, connected to a destination URL, scanned through `/r/{deviceCode}`, and counted in basic analytics.

## Phase 2: Hosted Reputation Pages

Phase 2 turns platform products into hosted customer workflows.

- hosted landing pages
- feedback forms
- referral forms
- social hub pages
- reputation hub pages
- multi-platform review pages
- landing page form submissions
- customer-visible device/page analytics
- admin support views for hosted pages and submissions

Phase 2 success means a platform product can connect a device to a hosted Tap Rater page, collect feedback or referral submissions, and show basic performance in the portal.

## Phase 3: Quotes, Bundles, Subscriptions, and Billing

Phase 3 adds sales operations and billing after the platform workflow is proven.

- quote requests for custom, bundle, hosted page, and multi-location products
- bundle setup that can create multiple devices
- subscription packaging for hosted pages, dashboards, analytics, and multi-location management
- Stripe live checkout only after approval
- live paid orders only after webhook, tax, shipping, fulfillment, and bank account readiness are verified

Phase 3 success means Tap Rater can support sales-led platform products and bundles without forcing every product through immediate checkout.

## Not In MVP

- live Stripe payments before explicit approval
- review gating
- blocking customers from public review destinations based on sentiment
- full drag-and-drop landing page builder
- advanced attribution or ad analytics
- automated tax/shipping workflows
