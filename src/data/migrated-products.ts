export type MigratedProduct = {
  slug: string;
  title: string;
  sku: string;
  categorySlug: CatalogCategorySlug;
  basePriceCents: number;
  salePriceCents?: number;
  stockStatus: "instock" | "outofstock";
  shortDescription: string;
  description: string;
  productType: ProductCommerceType;
  serviceMode: ProductServiceMode;
  checkoutMode: ProductCheckoutMode;
  requiresAccount: boolean;
  requiresSubscription: boolean;
  requiresLandingPage: boolean;
  activationType: ProductActivationType;
  includedServiceLabel: string;
  images: { src: string; alt: string }[];
  variants: { id: string; label: string; sku: string; stockStatus: "instock" | "outofstock" }[];
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  searchKeywords?: string[];
};

export type ProductCommerceType = "physical_redirect" | "physical_managed" | "platform_landing_page" | "bundle";

export type ProductServiceMode = "basic_redirect" | "managed_redirect" | "hosted_landing_page" | "multi_location_platform";

export type ProductCheckoutMode = "buy_now" | "request_quote" | "subscription" | "contact_sales";

export type ProductActivationType = "free_basic_activation" | "managed_setup" | "premium_hosted_activation";

export type CatalogCategorySlug =
  | "google-review-stands"
  | "review-plates"
  | "business-bundles"
  | "social-booking-stands"
  | "feedback-referral-stands"
  | "custom-uv-printed-stands";

export type CatalogCategory = {
  slug: CatalogCategorySlug;
  title: string;
  eyebrow: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  buyerIntent: string;
  aliases?: string[];
  seoCopy: string;
};

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "google-review-stands",
    title: "Google Review Stands",
    eyebrow: "Best sellers",
    description:
      "Countertop NFC stands that open your Google review link after checkout, service, pickup, or a front-desk visit.",
    seoTitle: "Google Review NFC Stand for Local Businesses | Tap Rater",
    seoDescription:
      "Shop a Google Review NFC Stand that lets customers tap or scan to open your Google review link from a counter, desk, or checkout area.",
    buyerIntent: "For businesses that mainly want customers to open a Google review link from an in-person touchpoint.",
    seoCopy:
      "A Google Review NFC Stand gives customers a clear tap or scan action at the counter, front desk, pickup area, or service desk."
  },
  {
    slug: "review-plates",
    title: "Review Plates",
    eyebrow: "Low profile",
    description:
      "Compact NFC review plates for front desks, tables, counters, and tight spaces where a stand is not the right fit.",
    seoTitle: "NFC Review Plate for Counters and Tables | Tap Rater",
    seoDescription:
      "Buy an NFC Review Plate for counters, tables, reception desks, and checkout areas where customers can tap or scan to share their experience.",
    buyerIntent: "For desks, tables, and compact counters where a flat plate looks cleaner.",
    aliases: ["google-review-plates"],
    seoCopy:
      "An NFC Review Plate keeps the review prompt low-profile while still giving customers a simple way to open the right business link."
  },
  {
    slug: "business-bundles",
    title: "Business Bundles",
    eyebrow: "Save with sets",
    description:
      "Multi-piece Tap Rater bundles for businesses with several counters, rooms, tables, or team members.",
    seoTitle: "Business Bundles for NFC Review Stands | Tap Rater",
    seoDescription:
      "Shop Tap Rater business bundles with multiple NFC review stands and plates for several customer touchpoints.",
    buyerIntent: "For multi-station businesses that need review prompts in several customer touchpoints.",
    seoCopy:
      "Business bundles help one location place the same clear tap or scan prompt at checkout, reception, service rooms, and pickup counters."
  },
  {
    slug: "social-booking-stands",
    title: "Social & Booking Stands",
    eyebrow: "Links beyond reviews",
    description:
      "NFC stands for Facebook, Yelp, appointment booking, social follow, and other direct business links.",
    seoTitle: "Appointment Booking NFC Stand and Social Link Stands | Tap Rater",
    seoDescription:
      "Shop an Appointment Booking NFC Stand, Facebook review stand, Yelp profile stand, or social link stand for direct customer actions.",
    buyerIntent: "For businesses that want customers to open a booking, social, Facebook, Yelp, or profile link in one tap.",
    aliases: ["review-platform-stands"],
    seoCopy:
      "An Appointment Booking NFC Stand can open your booking page directly, while social and profile stands help customers find the right destination without searching."
  },
  {
    slug: "feedback-referral-stands",
    title: "Feedback & Referral Stands",
    eyebrow: "Hosted flows",
    description:
      "NFC stands that open feedback forms, referral forms, rate-your-experience pages, or hosted Tap Rater landing pages.",
    seoTitle: "Feedback NFC Stand and Referral Stand for Customer Forms | Tap Rater",
    seoDescription:
      "Shop a Feedback NFC Stand or referral stand that opens a hosted Tap Rater form, feedback page, or custom customer flow.",
    buyerIntent: "For businesses that want a feedback, referral, or hosted customer flow instead of one direct review platform.",
    aliases: ["feedback-stands"],
    seoCopy:
      "A Feedback NFC Stand can open a hosted Tap Rater form where customers can share their experience without being pushed toward a specific rating."
  },
  {
    slug: "custom-uv-printed-stands",
    title: "Custom UV Printed Stands",
    eyebrow: "Custom direct links",
    description:
      "Custom UV printed NFC stands for direct business links, branded prompts, menus, Wi-Fi, booking pages, and review destinations.",
    seoTitle: "Custom Review Stand and UV Printed NFC Stands | Tap Rater",
    seoDescription:
      "Order a Custom Review Stand or UV printed NFC stand for a Google review link, booking page, menu, Wi-Fi link, social profile, or custom URL.",
    buyerIntent: "For businesses that want custom printed wording, branding, or a direct link that does not fit a standard design.",
    seoCopy:
      "A Custom Review Stand can use your brand, wording, and destination while still keeping basic direct activation available without a monthly fee."
  }
];

export const migratedProducts: MigratedProduct[] = [
  {
    slug: "google-review-white-stand",
    title: "White Stand - Google Review",
    sku: "TRATER01",
    categorySlug: "google-review-stands",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "NFC Google review stand for counters, checkout desks, salons, restaurants, clinics, and local service businesses.",
    description: "A Tap Rater Google Review NFC stand helps customers open your Google review link with one tap. Place it near checkout, the front desk, or the service counter so customers can tap or scan before they leave.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [{ src: "/uploads/products/google-review-white-stand.jpg", alt: "White Tap Rater Google Review NFC stand for business counters" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER01-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER01-B", stockStatus: "instock" }
    ],
    isActive: true,
    seoTitle: "Google Review NFC Stand for Businesses | Tap Rater",
    seoDescription: "Buy a Google Review NFC stand that lets customers tap their phone to open your review link. Ideal for restaurants, salons, clinics, retail stores, and local businesses.",
    searchKeywords: ["google review nfc stand", "nfc review stand", "review us on google sign", "google review tap card"]
  },
  {
    slug: "google-review-white-plate",
    title: "White Plate - Google Review",
    sku: "TRATER02",
    categorySlug: "review-plates",
    basePriceCents: 3900,
    stockStatus: "instock",
    shortDescription: "Low-profile NFC Google review plate for desks, tables, counters, and checkout areas.",
    description: "A Tap Rater Google Review NFC plate gives customers a clean, compact way to open your Google review link. It is built for counters, front desks, table service, and tight spaces where a stand is not the right fit.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [{ src: "/uploads/products/google-review-white-plate.jpg", alt: "White Tap Rater Google Review NFC plate for counters and tables" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER02-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER02-B", stockStatus: "instock" }
    ],
    isActive: true,
    seoTitle: "Google Review NFC Plate for Counters and Tables | Tap Rater",
    seoDescription: "Compact NFC Google review plate for businesses that want customers to tap and open a Google review link from a counter, table, or front desk.",
    searchKeywords: ["google review nfc plate", "google review plate", "nfc review plate", "google review table sign"]
  },
  {
    slug: "facebook-review-stand",
    title: "White Stand - Facebook Review",
    sku: "TRATER05",
    categorySlug: "social-booking-stands",
    basePriceCents: 4900,
    stockStatus: "outofstock",
    shortDescription: "NFC Facebook review stand for businesses that collect recommendations and social proof on Facebook.",
    description: "A Tap Rater Facebook Review NFC stand sends customers to your Facebook recommendation or review destination with one tap. Use it at your counter, reception desk, or checkout area.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [{ src: "/uploads/products/facebook-review-stand.jpg", alt: "White Tap Rater Facebook Review NFC stand" }],
    variants: [],
    isActive: true,
    seoTitle: "Facebook Review NFC Stand for Businesses | Tap Rater",
    seoDescription: "NFC Facebook review stand for local businesses that want customers to tap and open a Facebook recommendation or review link.",
    searchKeywords: ["facebook review nfc stand", "facebook review stand", "nfc review sign"]
  },
  {
    slug: "yelp-review-stand",
    title: "White Stand - Yelp Review",
    sku: "TRATER06",
    categorySlug: "social-booking-stands",
    basePriceCents: 4900,
    stockStatus: "outofstock",
    shortDescription: "NFC Yelp review stand for restaurants, salons, service businesses, and local storefronts.",
    description: "A Tap Rater Yelp Review NFC stand helps customers open your Yelp review destination with one tap. It is useful for businesses where Yelp visibility helps customers choose where to go next.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [{ src: "/uploads/products/yelp-review-stand.jpg", alt: "White Tap Rater Yelp Review NFC stand for local businesses" }],
    variants: [],
    isActive: true,
    seoTitle: "Yelp Review NFC Stand for Local Businesses | Tap Rater",
    seoDescription: "NFC Yelp review stand that helps customers tap their phone and open your Yelp review link from the counter, table, or front desk.",
    searchKeywords: ["yelp review nfc stand", "yelp review stand", "nfc review stand for restaurants"]
  },
  {
    slug: "tap-rater-business-white-bundle",
    title: "Business - Google White Bundle",
    sku: "TRATER07",
    categorySlug: "business-bundles",
    basePriceCents: 12700,
    salePriceCents: 10160,
    stockStatus: "instock",
    shortDescription: "Google review NFC bundle for businesses that need multiple review touchpoints.",
    description: "The Tap Rater Google White Bundle gives your business multiple NFC review touchpoints, making it easier to request reviews at the front desk, checkout counter, reception area, or table.",
    productType: "bundle",
    serviceMode: "managed_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    activationType: "managed_setup",
    includedServiceLabel: "Managed setup included",
    images: [{ src: "/uploads/products/business-google-white-bundle.jpg", alt: "Tap Rater Google Review NFC business bundle with stand and plates" }],
    variants: [],
    isActive: true,
    seoTitle: "Google Review NFC Business Bundle | Tap Rater",
    seoDescription: "Discounted Google Review NFC bundle for businesses that want multiple stands and plates for customer review touchpoints.",
    searchKeywords: ["google review nfc bundle", "business review stand bundle", "google review display bundle"]
  },
  {
    slug: "tap-rater-business-white-stands-bundle",
    title: "Business - Google White Stands Bundle",
    sku: "TRATER10",
    categorySlug: "business-bundles",
    basePriceCents: 14700,
    salePriceCents: 11760,
    stockStatus: "instock",
    shortDescription: "Multi-stand Google review NFC bundle for businesses with several counters, rooms, or service points.",
    description: "The Tap Rater Google White Stands Bundle is made for businesses that need several NFC Google review stands across a location or team. Place them where customers check in, pay, or finish service.",
    productType: "bundle",
    serviceMode: "managed_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    activationType: "managed_setup",
    includedServiceLabel: "Managed setup included",
    images: [{ src: "/uploads/products/business-google-white-stands-bundle.jpg", alt: "Tap Rater Google Review NFC white stands bundle for businesses" }],
    variants: [],
    isActive: true,
    seoTitle: "Google Review NFC Stands Bundle | Tap Rater",
    seoDescription: "Bundle of Google Review NFC stands for businesses that want more review touchpoints across checkout counters, rooms, or service desks.",
    searchKeywords: ["google review stands bundle", "nfc review stands bundle", "review us on google stand bundle"]
  },
  {
    slug: "tap-rater-white-stand-rate-your-experience",
    title: "White Stand - Rate Your Experience",
    sku: "TRATER12",
    categorySlug: "feedback-referral-stands",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "Feedback NFC stand for hosted feedback forms, custom customer flows, surveys, and rate-your-experience pages.",
    description: "The Tap Rater Feedback NFC stand opens a hosted Tap Rater landing page, feedback form, survey, or verified customer flow. Use it when you need a flexible platform-powered experience instead of one direct review destination.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "subscription",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [{ src: "/uploads/products/rate-your-experience-white-stand.jpg", alt: "Tap Rater Rate Your Experience NFC feedback stand" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER12-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER12-B", stockStatus: "instock" }
    ],
    isActive: true,
    seoTitle: "Feedback NFC Stand for Customer Experience Forms | Tap Rater",
    seoDescription: "Feedback NFC Stand for hosted forms, customer surveys, and rate-your-experience pages. Customers tap or scan to share their experience.",
    searchKeywords: ["feedback nfc stand", "nfc feedback stand", "rate your experience stand", "customer feedback nfc sign", "nfc survey stand"]
  }
];
