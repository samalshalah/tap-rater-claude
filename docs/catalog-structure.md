# Catalog Structure (Catalog v2 — 2026-07-13)

## Shop by Stand — 10 Stand Categories

Route: `/shop/stands` (index), `/shop/stands/[categorySlug]` (products in that category). Grouping is controlled by `Product.standCategorySlug` — one value per product, not tags.

| # | Category | Slug | Active products |
|---|---|---|---|
| 1 | Review Stands | `review-stands` | 59 |
| 2 | Social Media Stands | `social-media-stands` | 14 |
| 3 | Appointment Stands | `appointment-stands` | 19 |
| 4 | Feedback Stands | `feedback-stands` | 15 |
| 5 | Menu & Info Stands | `menu-info-stands` | 23 |
| 6 | Website & Link Stands | `website-link-stands` | 12 |
| 7 | Payment, Tip & Donation Stands | `payment-tip-donation-stands` | 13 |
| 8 | Loyalty & Rewards Stands | `loyalty-rewards-stands` | 8 |
| 9 | Custom Stands | `custom-stands` | 9 |
| 10 | Hosted Tap Page Stands | `hosted-tap-page-stands` | 8 |

**168 active products total** (13 Payment/Tip/Donation products discontinued 2026-07-18; see docs/phase-1-products.md).

## Shop by Use — 14 Use Cases

Route: `/shop/use` (index), `/use/[slug]` (that use case's recommended products). Membership is controlled by `product.tags` — a product belongs to a use case if its `tags` array includes that use case's slug. `UseCase.recommendedProductSlugs` is where this is authored (a curated list, easier to write and review than hand-tagging 181 products) and doubles as the display-order hint, but tags are the actual runtime relationship — see `docs/product-model.md`.

1. Restaurants & Cafés — `restaurants-cafes`
2. Auto Dealer & Repair — `auto-dealer-repair` (renamed from "Car Dealerships" 2026-07-17; old URL `/use/car-dealerships` redirects here)
3. Front Desk & Reception — `front-desk-reception`
4. Retail & Grocery — `retail-grocery`
5. Hotels & Hospitality — `hotels-hospitality`
6. Healthcare & Dental Offices — `healthcare-dental`
7. Salons, Spas & Wellness — `salons-spas-wellness`
8. Home Services — `home-services`
9. Legal & Professional Services — `legal-professional-services`
10. Real Estate — `real-estate`
11. Events & Pop-Ups — `events-popups`
12. Nonprofits & Donations — `nonprofits-donations`
13. Ecommerce & Retail Brands — `ecommerce-retail-brands`
14. Fitness, Classes & Studios — `fitness-classes-studios`

A product can appear in many use cases (via `useCaseSlugs`, computed automatically from every `UseCase.recommendedProductSlugs`/`featuredProductSlugs` list that includes it) without ever being duplicated as a separate product record.

## Conditional Slug Resolutions

The original spec included a few "use X if it exists, otherwise Y" fallbacks. Resolved as follows:

| Use case | Conditional reference | Resolution |
|---|---|---|
| Auto Dealer & Repair | `appointment-stand` if it exists, else `book-appointment-stand` | `appointment-stand` is not a real product slug → resolved to `book-appointment-stand` (already listed once; not duplicated). |
| Auto Dealer & Repair | `feedback-stand` if it exists, else `rate-your-experience-stand` | `feedback-stand` is not a real product slug → resolved to `rate-your-experience-stand` (already listed once; not duplicated). |
| Automotive Service & Repair (merged into Auto Dealer & Repair, 2026-07-18 -- 11 of its 12 products were already duplicates) | `surecritic-review-stand` if it exists, else exclude | Not in the approved product list → **excluded entirely**, per "otherwise do not include." |
| Fitness, Classes & Studios (featured) | `book-a-class-stand` if it exists, else `book-appointment-stand` | Doesn't exist → resolved to `book-appointment-stand`. |
| Fitness, Classes & Studios (recommended) | `book-a-class-stand` if it exists, else exclude | Doesn't exist → **excluded entirely** (different fallback instruction than the featured list, respected independently). |

No broken slugs remain — every `featuredProductSlugs` and `recommendedProductSlugs` entry across all 14 use cases resolves to a real, active product (enforced by an automated test).

## Legacy Product Reconciliation

7 products already existed under an exact-matching slug before this restructure and were backfilled with the new fields rather than duplicated: `google-review-stand`, `yelp-review-stand`, `facebook-review-stand`, `tripadvisor-review-stand`, `rate-your-experience-stand`, `book-your-next-visit-stand`, `custom-nfc-stand`.

3 more legacy products didn't have an exact slug match in the new spec (the spec instead defines similarly-named but differently-sluggged products — e.g. `follow-us-stand`/`social-media-stand` instead of `follow-us-social-media-stand`) but are real, already-sold products, so they were folded into the new taxonomy rather than left as orphans: `follow-us-social-media-stand`, `view-our-menu-stand`, `hosted-landing-page-subscription`.

## Images

No new images were generated and no existing stand graphics were changed, per constraint. Image assignment for the ~171 new products:

- Products with `platformSlug` matching `google`, `yelp`, `facebook`, or `tripadvisor` reuse that exact existing branded photo.
- Every other new product uses a shared generic placeholder (the Rate Your Experience Stand render, chosen specifically because it carries no third-party branding) until dedicated photography exists.
