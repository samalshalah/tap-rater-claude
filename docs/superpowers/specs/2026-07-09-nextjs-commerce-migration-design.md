# Tap Rater Next.js Commerce Migration Design

## Goal

Replace the current Tap Rater WordPress/WooCommerce site with a new Next.js ecommerce application. WordPress, WooCommerce, Elementor, and PHP plugins will be removed from the production architecture.

The existing WordPress export and backups are migration inputs only. They provide product data, page content, images, SEO references, and current ecommerce behavior.

## Source Material

- WordPress export: `C:/Users/hussa/Downloads/taprater.WordPress.2026-07-09.xml`
- WordPress backup archives from July 8-9, 2026
- Goru electronics ecommerce HTML template: `C:/Users/hussa/Downloads/goru-electronics-e-commerce-html-template-2023-11-27-04-58-27-utc.zip`
- Current public site: `https://taprater.com/`

The current site includes 13 published pages, 7 published products, product variations, bundles, media uploads, Elementor layouts, WooCommerce payment flow, SEO plugins, analytics/listing integrations, and forms.

## Recommended Architecture

Use a full Next.js application with a custom backend:

- Next.js App Router for pages, layouts, API routes, and server actions where appropriate.
- TypeScript for application code.
- Tailwind CSS for styling.
- Goru HTML template adapted into React components and restyled for Tap Rater branding.
- Supabase Postgres or Neon Postgres for persistent backend data.
- Stripe Checkout for customer payment.
- Stripe webhooks for payment confirmation and order persistence.
- Resend or SendGrid for transactional emails and form notifications.

## Public Pages

Rebuild these routes in Next.js:

- `/`
- `/shop`
- `/product/[slug]`
- `/cart`
- `/checkout`
- `/checkout/success`
- `/checkout/cancel`
- `/about-us`
- `/setup-new-taprater`
- `/faqs`
- `/contact-us`
- `/review-links-generator`
- `/change-taprater-link`
- `/privacy-policy`

Old WordPress URLs should redirect to the matching Next.js routes where slugs change.

## Backend Data Model

Initial backend tables:

- `products`: title, slug, description, short description, status, SKU, base price, sale price, stock status, category, SEO fields.
- `product_images`: product ID, image path, alt text, sort order.
- `product_variants`: product ID, option values, SKU, price override, stock status.
- `orders`: Stripe checkout session ID, payment intent ID, status, totals, customer details, timestamps.
- `order_items`: order ID, product ID, variant ID, quantity, unit price, line total.
- `customers`: email, name, phone, shipping/billing details where needed.
- `contact_requests`: contact form submissions.
- `setup_requests`: setup-new-TapRater submissions.
- `change_link_requests`: change-link submissions.

Products can be seeded from the WordPress export first, then managed through an admin dashboard.

## Ecommerce Flow

1. Customer browses product catalog.
2. Customer adds products or variants to cart.
3. Next.js validates product IDs, prices, stock status, and quantities server-side.
4. API route creates a Stripe Checkout Session.
5. Customer pays on Stripe-hosted checkout.
6. Stripe sends webhook event to the Next.js backend.
7. Backend records the paid order and line items in the database.
8. Backend sends customer/admin email notifications.
9. Customer lands on success page.

Stripe is the source of truth for payment state. The database stores operational order records for admin use.

## Admin Dashboard

Create a protected `/admin` area after the public storefront and checkout are working.

Admin features:

- Login-protected access.
- View orders.
- View customer/order details.
- Manage products, prices, images, and stock labels.
- View contact requests.
- View setup requests.
- View change-link requests.

The first version can use a single admin account configured through environment variables or Supabase auth. Role-based permissions are not required for the initial launch.

## Template Use

Use the Goru template as a starting point for ecommerce layout patterns, not as a final brand identity.

Adaptable areas:

- Header/navigation.
- Homepage product sections.
- Shop grid.
- Product detail page.
- Cart layout.
- Checkout-related visual pages.

Required changes:

- Replace generic electronics styling with Tap Rater product-focused branding.
- Use real Tap Rater product images.
- Remove unused template pages and scripts.
- Convert HTML/CSS/JS into maintainable React components.
- Keep the UI clean, fast, responsive, and conversion-focused.

## Migration Scope

Migrate:

- Product titles, slugs, prices, SKUs, stock statuses, descriptions, images, and variants.
- Published public pages.
- FAQ and policy content.
- Product image assets from uploads.
- SEO titles/descriptions where available.
- Analytics/pixel snippets only if still needed.

Do not migrate:

- WordPress runtime.
- WooCommerce runtime.
- Elementor data structures.
- Backup/security/cache plugins.
- PHP theme/plugin code.
- WordPress admin behavior.

## Error Handling

- Checkout session creation fails with a clear cart-level error.
- Invalid product IDs or stale prices are rejected server-side.
- Stripe webhook signature verification is mandatory.
- Duplicate webhook deliveries must be idempotent by Stripe session/payment ID.
- Form submissions must validate required fields and rate-limit basic spam.
- Admin pages must reject unauthenticated access.

## Testing

Minimum verification before launch:

- Product catalog renders migrated products.
- Product detail pages render images, prices, variants, and add-to-cart behavior.
- Cart totals calculate correctly.
- Stripe test checkout succeeds.
- Stripe webhook records paid orders.
- Success/cancel pages behave correctly.
- Contact/setup/change-link forms submit and notify correctly.
- Admin dashboard can view orders and requests.
- Mobile and desktop layouts are checked visually.
- Old WordPress URLs redirect correctly.

## Deployment

Recommended production setup:

- Next.js hosted on Vercel.
- Database hosted on Supabase or Neon.
- Stripe configured with production keys and webhook endpoint.
- Email provider configured with production API key.
- `taprater.com` points to the Next.js deployment.
- WordPress hosting can be retired after data migration, payment testing, URL redirects, and launch verification are complete.

## Open Decisions

- Choose Supabase or Neon for Postgres.
- Choose Resend or SendGrid for email.
- Decide whether `/admin` uses Supabase auth or a simpler first-version admin login.
- Confirm which analytics and marketing pixels should remain.
