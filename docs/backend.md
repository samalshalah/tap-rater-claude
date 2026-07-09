# Tap Rater Backend

## Current Backend Scope

This phase includes request storage, admin login, admin request views, and public forms.
Stripe checkout and paid order storage are intentionally deferred to the final launch stage.
The backend now also includes the first CMS foundation for editing homepage copy, page content records, and product records.

## Services

- Supabase Postgres stores contact, setup, change-link, and product records.
- Resend can send request notifications when configured.
- Next.js API routes validate and persist form submissions.
- Admin access uses one signed HTTP-only cookie account from environment variables.
- Admin CMS editors save homepage/page/product records to Supabase.

## Environment Variables

Set these locally in `.env.local` and in production:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ORDER_NOTIFICATION_EMAIL=
ADMIN_EMAIL=admin@taprater.com
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

`ADMIN_SESSION_SECRET` should be a long random string.

## Database

Run `supabase/schema.sql` in the Supabase SQL editor before using the forms in production.
This creates request tables, product tables, `site_content`, and `media_assets`.

## Routes

- `/api/forms/contact`
- `/api/forms/setup`
- `/api/forms/change-link`
- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/requests`
- `/admin/content`
- `/admin/content/homepage`
- `/admin/content/pages`
- `/admin/products/[slug]`
- `/admin/categories`
- `/admin/inventory`
- `/admin/customers`
- `/admin/media`
- `/admin/discounts`
- `/admin/shipping`
- `/admin/taxes`
- `/admin/seo`
- `/admin/analytics`
- `/admin/settings`

## Admin Control Menu

The admin dashboard has a persistent sidebar with four groups:

- Operations: Dashboard, Requests, Orders, Customers.
- Commerce: Products, Categories, Inventory, Discounts, Shipping, Taxes.
- Growth: Website, Media, SEO, Analytics.
- System: Settings.

Some sections are structural placeholders with implementation checklists. They define the professional ecommerce backend surface before each deeper CRUD workflow is built.

## CMS Editing

The homepage editor controls the homepage hero copy and buttons through the `site_content` record with key `homepage`.

The page editor writes generic page records into `site_content` using keys such as `page:about-us`.

The product editor writes product records into the `products` table. The storefront still uses local migrated product data as fallback until Supabase is configured and seeded.

## Local Behavior Without Supabase

The frontend pages still render. Valid form submissions return `503` with `Request storage is not configured yet.` until Supabase credentials are added.
