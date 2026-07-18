# Product Model (Catalog v2 — 2026-07-13)

Tap Rater is a print-on-demand NFC stand business. Every product below can be listed and sold now — stands are printed on demand, so there is no "later" phase for the catalog itself. What *is* still gated is Stripe going live and hosted-page subscription billing, both explicitly untouched by this restructure.

## The Three Product Tiers

1. **Direct-link stand** — opens one destination URL. No account, no subscription.
2. **Custom printed stand** — a direct-link stand that's fully custom-printed (logo, business name, custom headline). Can point to a direct link or a hosted page.
3. **Hosted Tap Page stand** — opens a Tap Rater hosted page with multiple links. Requires an account and a monthly subscription.

## Categories, Slugs, and Tags — what each one is actually for

This is the single most important rule in the catalog, and it was corrected on 2026-07-17 after an earlier pass had it backwards:

- **Categories** (`standCategorySlug`) describe **what kind of stand this is** — review, social, appointment, feedback, menu & info, website & link, payment/tip/donation, loyalty & rewards, custom, or hosted tap page. One category per product. Drives `/shop/stands` and `/shop/stands/[categorySlug]`.
- **Slugs** are the **permanent URL** for a product or a category (`/product/[slug]`, `/shop/stands/[categorySlug]`, `/use/[slug]`). Slugs are never used to express use-case membership.
- **Tags** describe **which business/use case(s) a product belongs to** (restaurants-cafes, auto-dealer-repair, healthcare-dental, etc.). A product's `tags` array includes every use case that recommends it. `/use/[slug]` pages query products by tag (`product.tags.includes(useCaseSlug)`) — this is the actual mechanism that lets one product appear on many Shop by Use pages without ever being duplicated into a separate SKU per use case.

Concretely: `google-review-stand` has one category (`review-stands`) and one slug (its permanent URL), but its `tags` array includes `restaurants-cafes`, `auto-dealer-repair`, `retail-grocery`, and every other use case that recommends it — which is exactly why the same Google Review Stand shows up on `/use/auto-dealer-repair` and `/use/restaurants-cafes` without existing twice.

`UseCase.recommendedProductSlugs` still exists in `src/data/use-cases.ts` as the place this is *authored* (it's much easier to write and review a curated list per use case than to hand-edit tags on 181 products), but at runtime it is used only as a display-order hint — the actual question "does this product belong on this page" is answered by `product.tags`, via `getProductsForUseCase()` in `src/data/catalog.ts`. If a product's tags and a use case's authored list ever disagree, tags win.

## Spec Terminology → Implementation Terminology

The business/spec naming and the actual TypeScript field values differ in a few places, kept intentionally non-breaking:

| Spec term | Implementation value | Why kept separate |
|---|---|---|
| `direct_link_stand` | `productType: "physical_redirect"` | Existing checkout, cart, and destination-link-verification code all gate on `"physical_redirect"` / `"buy_now"` already — renaming would be a breaking change to live, tested functionality. |
| `custom_printed_stand` | `productType: "physical_managed"` | Same reason — `checkoutMode: "request_quote"` already implements this tier. |
| `hosted_tap_page_stand` | `productType: "platform_landing_page"` | Same reason — `checkoutMode: "contact_sales"`, `requiresSubscription: true` already implement this tier. |

`destinationType` (review/social/appointment/feedback/menu_info/website/payment/custom/hosted_page) is a new field using the spec's exact vocabulary, since nothing existing depended on different names for it.

## Where Things Live

- `src/data/migrated-products.ts` — the original 16 Phase 1 entries (8 active stands, 8 discontinued plates), plus the `MigratedProduct` type (now extended with the catalog-v2 fields, all optional for backward compatibility) and the `CatalogCategorySlug`/`CatalogCategory` "Shop by Use"-style grouping (9 values now, 3 new).
- `src/data/extended-catalog.ts` — the ~171 new catalog-v2 products, generated via factory functions (`directLinkStand`, `customPrintedStand`, `hostedTapPageStand`) rather than hand-typed, since almost every field within a stand category is identical except slug/name/platform.
- `src/data/stand-categories.ts` — the 10 `StandCategory` entries that drive `/shop/stands` and `/shop/stands/[categorySlug]`.
- `src/data/use-cases.ts` — the 15 `UseCase` entries (name, description, `featuredProductSlugs`, `recommendedProductSlugs`, tags) that drive `/shop/use` and `/use/[slug]`.
- `src/data/catalog.ts` — the single merge point. Combines the original 16 + the new ~171, and computes each product's `useCaseSlugs` by reverse-scanning `use-cases.ts` (so use-case membership is never duplicated by hand on the product side — it's derived from the one place it's actually declared).
- `src/lib/products.ts` / `src/lib/product-repository.ts` — updated to read from `src/data/catalog.ts`'s combined list instead of the raw Phase 1 array. This is the only change needed for cart, checkout, and every existing page to automatically see the full catalog.

## Subscription Rules

- Every `direct_link_stand` (`physical_redirect`): `requiresSubscription: false`, always.
- Every `custom_printed_stand` (`physical_managed`): `requiresSubscription: false` at the base-SKU level. If the customer's chosen destination is a hosted page rather than a direct link, that requirement lives on the destination configuration, not the stand SKU itself.
- Every `hosted_tap_page_stand` (`platform_landing_page`): `requiresSubscription: true`, always, plus `requiresAccount: true` and `requiresLandingPage: true`.

No Stripe subscription billing exists for the third tier — `checkoutMode: "contact_sales"` deliberately routes to the contact form instead of a real charge, matching the constraint not to enable Stripe.
