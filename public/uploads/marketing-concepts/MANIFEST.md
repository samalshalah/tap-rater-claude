# Marketing Concept Images

Uploaded 2026-07-10. Stored at `public/uploads/marketing-concepts/`. Reference by number below when telling Claude where to use one.

| # | File | Category | Headline | Scene |
|---|---|---|---|---|
| 1 | `01-reviews-turn-checkout-into-reviews.png` | Reviews | Turn Checkout Into Reviews | Bakery counter, cashier + customer |
| 2 | `02-menu-share-todays-specials.png` | Menu | Share Today's Specials | Bar/restaurant counter |
| 3 | `03-feedback-make-feedback-easy.png` | Feedback | Make Feedback Easy | Office front desk, two guests |
| 4 | `04-reviews-capture-reviews-front-desk.png` | Reviews | Capture Reviews at the Front Desk | Hotel-style front desk |
| 5 | `05-social-follow-us-before-you-go.png` | Social | Follow Us Before You Go | Coffee shop counter |
| 6 | `06-social-grow-your-social-following-a.png` | Social | Grow Your Social Following | Coffee shop, male barista |
| 7 | `07-reviews-turn-every-purchase-into-review.png` | Reviews | Turn Every Purchase Into a Review | Grocery store checkout |
| 8 | `08-menu-showcase-signature-dishes.png` | Menu | Showcase Signature Dishes | BBQ ribs plate, no people |
| 9 | `09-appointments-start-the-next-visit.png` | Appointments | Start the Next Visit | Car dealership counter |
| 10 | `10-appointments-book-the-next-visit-a.png` | Appointments | Book the Next Visit | Car dealership, phone shows "Appointment Booked!" |
| 11 | `11-social-grow-your-social-following-b.png` | Social | Grow Your Social Following | Cafe counter, full-bleed photo, "T" logo variant |
| 12 | `12-reviews-capture-more-reviews-hotel.png` | Reviews | Capture More Reviews | Hotel front desk |
| 13 | `13-appointments-book-the-next-visit-b.png` | Appointments | Book the Next Visit | Car dealership, blue-star logo variant |
| 14 | `14-menu-share-your-menu-instantly.png` | Menu | Share Your Menu Instantly | Restaurant table, burger + fries, blue-circle logo variant |
| 15 | `15-reference-apple-store-page.png` | Reference | — | Screenshot of apple.com/store for design reference (not a Tap Rater asset) |

## Round 2 — Apple-tile-style stand renders (2026-07-10)

8 additional images, stored at `public/uploads/marketing-concepts/round2/`, in the exact Apple homepage-tile format (eyebrow + headline + subhead + "Learn more" link + studio product shot, composed as one image). These mapped cleanly 1:1 onto 8 existing STAND SKUs, so the product photo portion was cropped out (headline/text column removed) and swapped in as the new live product images:

| # | File | Replaced product image | Used for |
|---|---|---|---|
| 16 | `round2/16-menu-stand.png` | `view-menu-stand-v2.png` | View Our Menu Stand |
| 17 | `round2/17-social-media-stand.png` | `social-media-stand-v2.png` | Follow Us on Social Media Stand |
| 18 | `round2/18-appointment-stand.png` | `book-next-visit-stand-v2.png` | Book Your Next Visit Stand |
| 19 | `round2/19-google-review-stand.png` | `google-review-stand-v2.png` | Google Review Stand |
| 20 | `round2/20-yelp-review-stand.png` | `yelp-review-stand-v2.png` | Yelp Review Stand |
| 21 | `round2/21-facebook-review-stand.png` | `facebook-review-stand-v2.png` | Facebook Review Stand |
| 22 | `round2/22-tripadvisor-review-stand.png` | `tripadvisor-review-stand-v2.png` | TripAdvisor Review Stand |
| 23 | `round2/23-rate-your-experience-stand.png` | `rate-your-experience-stand-v2.png` | Rate Your Experience Stand |

The cropped versions live in `public/uploads/products/*-v2.png` and are now referenced directly in `src/data/migrated-products.ts`. The original full composite images (with baked-in headline/link text) are kept in `round2/` for reference — e.g. if we ever want to reuse the full tile (text + image combined) as a homepage promo module rather than a plain product photo.

Plate-format equivalents (8 SKUs) still use the older renders/placeholders — not covered by this batch.

## Round 3 — true transparent-background stand renders (2026-07-11) — CURRENT

9 images (8 SKUs + 1 duplicate), stored at `public/uploads/marketing-concepts/round3/`. These are genuine isolated product shots — **true alpha transparency** (verified: corner pixels are `alpha=0`, not just white), no baked-in headline/link text at all. Better than round 2 in every way, so these are now the live images for all 8 stand SKUs, replacing the round-2 crops:

| File | Used for |
|---|---|
| `google-review-stand-v3.png` (from `google-review-stand-v3-b.png`, the July 11 regeneration) | Google Review Stand |
| `yelp-review-stand-v3.png` | Yelp Review Stand |
| `facebook-review-stand-v3.png` | Facebook Review Stand |
| `tripadvisor-review-stand-v3.png` | TripAdvisor Review Stand |
| `rate-your-experience-stand-v3.png` | Rate Your Experience Stand |
| `social-media-stand-v3.png` | Follow Us on Social Media Stand |
| `book-next-visit-stand-v3.png` | Book Your Next Visit Stand |
| `view-menu-stand-v3.png` | View Our Menu Stand |

Note: there were two Google Review Stand renders (`google-review-stand-v3-a.png` from Jul 9, `-b.png` from Jul 11). Used `-b` (the newer one) as the live image since it looked like a refinement of the same shot — both are kept in `round3/` if `-a` is preferred instead.

The round-2 crops (`*-v2.png` in `public/uploads/products/`) are now superseded but left in place for rollback.

## Note on logo inconsistency

The mocked-up "TAP RATER" device screens across these images use **different placeholder logos** — a shield/checkmark mark, a star, a "T" monogram, a speech-bubble icon, and a blue star wordmark all appear across different images. None of these match the real Tap Rater logo currently in `public/uploads/brand/tap-rater-logo.png`. Worth deciding on one final device-screen design before any of these go live, or treating the device screen as illustrative only and not literal.

## Round 4 — refreshed stand renders + plates discontinued (2026-07-11)

7 new stand images sent (all except Yelp), stored at `public/uploads/marketing-concepts/round4/`, swapped in as `*-v4.png` for: Google, Facebook, TripAdvisor, Rate Your Experience, Social Media, Book Your Next Visit, View Our Menu. Yelp remains on the round-3 image (no new Yelp render sent this round).

**Plates discontinued**: all 8 plate-format products (`isActive: false`) — removed from shop, category pages, checkout, and static generation, but kept in the data file for easy reversal. All "stands and plates" copy across the site (homepage, shop, footer, meta descriptions, FAQ, contact) updated to stands-only language. The product-page comparison table's "Plate" row was removed.

**Tech specs section added**: a new brand-adapted specifications table now appears on every stand product page (dimensions in both mm and inches, material, chip, tap range, personalization options, etc.), sourced from the actual factory spec sheet with all factory/OEM/origin information stripped per instruction.

**Category row redesigned**: homepage "What do you want customers to open?" section now matches Apple's actual category-row pattern (small product image above a plain text label, no card chrome), using real product photography for each category's icon.

## Round 6 — Yelp transparent render + Shop by Stand page (2026-07-11)

8 transparent stand images resent; 7 were byte-identical to round 4 (confirmed already live). Only Yelp was new — filled the one gap left from round 4. Now all 8 stands use matching `-v4.png` transparent renders.

Built the new **Shop by Stand** page (`/shop/by-stand`), rebuilding the marketing-tile concept (round 5's promo images) as real HTML — headline, subhead, and eyebrow are actual text (indexable, accessible, editable), paired with the clean transparent product photo. A "Shop by use / Shop by stand" toggle links the two catalog views on both `/shop` and `/shop/by-stand`.

## Round 7 — industry vertical images for Shop by Use (2026-07-11)

4 lifestyle images (Restaurants & Cafés, Car Dealerships, Front Desk & Reception, Retail & Grocery), stored full at `public/uploads/marketing-concepts/round7/`. Cropped (headline/subhead text removed via row-variance detection) and saved as clean photos at `public/uploads/industries/`. Headline and subhead are now real HTML in a new "Find your industry" section on `/shop` (Shop by Use), each linking to its best-fit category: Restaurants & Cafés → menu, Car Dealerships → appointments, Front Desk & Reception → feedback, Retail & Grocery → reviews.
