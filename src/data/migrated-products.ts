export type SupportedDestination =
  | "google"
  | "facebook"
  | "yelp"
  | "tripadvisor"
  | "instagram"
  | "tiktok"
  | "booking"
  | "website"
  | "menu"
  | "wifi"
  | "feedback"
  | "referral"
  | "custom";

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
  supportedDestinations: SupportedDestination[];
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
  | "google-review-products"
  | "review-platform-products"
  | "social-booking-products"
  | "feedback-referral-products"
  | "hosted-landing-page-products"
  | "business-bundles";

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
    slug: "google-review-products",
    title: "Google Review Products",
    eyebrow: "Google-first",
    description: "NFC stands, plates, cards, and managed employee prompts that open a Google review destination.",
    seoTitle: "Google Review NFC Products | Tap Rater",
    seoDescription: "Shop Google Review NFC stands, plates, cards, name tags, and starter kits for local businesses.",
    buyerIntent: "For businesses that want a clear in-person prompt to open a Google review link.",
    aliases: ["google-review-stands", "review-plates", "google-review-plates"],
    seoCopy:
      "Google Review NFC products help customers tap or scan a physical prompt and open the business Google review link without searching."
  },
  {
    slug: "review-platform-products",
    title: "Review Platform Products",
    eyebrow: "Review sites",
    description: "Physical NFC products for Facebook, Yelp, TripAdvisor, and multi-platform review flows.",
    seoTitle: "Review Platform NFC Products | Tap Rater",
    seoDescription: "Shop Facebook, Yelp, TripAdvisor, and multi-platform review NFC products for local businesses.",
    buyerIntent: "For businesses that need review prompts beyond Google.",
    aliases: ["review-platform-stands"],
    seoCopy:
      "Review platform products connect physical NFC prompts to public review profiles or hosted multi-platform pages."
  },
  {
    slug: "social-booking-products",
    title: "Social & Booking Products",
    eyebrow: "Direct actions",
    description: "NFC products for appointment booking, social follow pages, menus, Wi-Fi, websites, and direct links.",
    seoTitle: "Social, Booking and Direct Link NFC Products | Tap Rater",
    seoDescription: "Shop NFC stands for appointment booking, social follows, menus, Wi-Fi, websites, and custom direct links.",
    buyerIntent: "For businesses that want customers to open a booking page, social profile, menu, Wi-Fi page, or custom URL.",
    aliases: ["social-booking-stands", "custom-uv-printed-stands"],
    seoCopy:
      "Social and booking NFC products give customers a quick tap or scan path to the next action a business wants them to take."
  },
  {
    slug: "feedback-referral-products",
    title: "Feedback & Referral Products",
    eyebrow: "Forms",
    description: "Hosted feedback, referral, and rate-your-experience pages powered by Tap Rater forms.",
    seoTitle: "Feedback and Referral NFC Products | Tap Rater",
    seoDescription: "Shop hosted feedback, referral, and rate-your-experience Tap Rater products for local businesses.",
    buyerIntent: "For businesses that need private forms, referral requests, and customer experience flows.",
    aliases: ["feedback-referral-stands", "feedback-stands"],
    seoCopy:
      "Feedback and referral products collect customer input through Tap Rater hosted pages without blocking access to public review platforms."
  },
  {
    slug: "hosted-landing-page-products",
    title: "Hosted Landing Page Products",
    eyebrow: "Platform",
    description: "Hosted reputation pages, social hubs, review hubs, staff tracking pages, and multi-location dashboards.",
    seoTitle: "Hosted Reputation Landing Pages | Tap Rater",
    seoDescription: "Tap Rater hosted landing pages support review hubs, reputation pages, social hubs, staff tracking, and multi-location dashboards.",
    buyerIntent: "For businesses that need account-based platform features, hosted pages, analytics, forms, and dashboards.",
    seoCopy:
      "Hosted landing page products require Tap Rater platform setup, a customer account, a business profile, and a hosted page or dashboard."
  },
  {
    slug: "business-bundles",
    title: "Business Bundles",
    eyebrow: "Setup included",
    description: "Bundles that combine physical NFC products with managed setup for business review programs.",
    seoTitle: "Business Bundles and Review Starter Kits | Tap Rater",
    seoDescription: "Shop Tap Rater business bundles with physical NFC products and managed setup for local business reputation programs.",
    buyerIntent: "For businesses that want physical products plus Tap Rater setup help.",
    seoCopy:
      "Business bundles combine NFC hardware and managed setup so a business can launch several review touchpoints together."
  }
];

const googleStandImage = { src: "/uploads/products/google-review-white-stand.jpg", alt: "Tap Rater NFC stand for Google reviews" };
const googlePlateImage = { src: "/uploads/products/google-review-white-plate.jpg", alt: "Tap Rater NFC review plate for counters and tables" };
const facebookImage = { src: "/uploads/products/facebook-review-stand.jpg", alt: "Tap Rater Facebook review NFC stand" };
const yelpImage = { src: "/uploads/products/yelp-review-stand.jpg", alt: "Tap Rater Yelp review NFC stand" };
const feedbackImage = { src: "/uploads/products/rate-your-experience-white-stand.jpg", alt: "Tap Rater hosted feedback NFC stand" };
const bundleImage = { src: "/uploads/products/business-google-white-bundle.jpg", alt: "Tap Rater business review starter kit bundle" };
const standsBundleImage = { src: "/uploads/products/business-google-white-stands-bundle.jpg", alt: "Tap Rater multi-stand business bundle" };

export const migratedProducts: MigratedProduct[] = [
  {
    slug: "google-review-nfc-stand",
    title: "Google Review NFC Stand",
    sku: "TR-GOOGLE-STAND",
    categorySlug: "google-review-products",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "Countertop NFC stand that opens a Google review link with one tap or scan.",
    description:
      "A Google Review NFC Stand gives customers a clear counter, front-desk, or checkout prompt that opens your Google review destination. Basic activation redirects directly to the URL you provide.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["google"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [googleStandImage],
    variants: [
      { id: "white", label: "White", sku: "TR-GOOGLE-STAND-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TR-GOOGLE-STAND-B", stockStatus: "instock" }
    ],
    isActive: true,
    seoTitle: "Google Review NFC Stand for Local Businesses | Tap Rater",
    seoDescription: "Buy a Google Review NFC Stand that lets customers tap or scan to open your Google review link.",
    searchKeywords: ["google review nfc stand", "nfc review stand", "google review stand"]
  },
  {
    slug: "google-review-nfc-plate",
    title: "Google Review NFC Plate",
    sku: "TR-GOOGLE-PLATE",
    categorySlug: "google-review-products",
    basePriceCents: 3900,
    stockStatus: "instock",
    shortDescription: "Low-profile NFC plate for desks, tables, counters, and reception areas.",
    description:
      "A Google Review NFC Plate keeps the review prompt compact while still giving customers a simple way to open your Google review destination.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["google"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [googlePlateImage],
    variants: [
      { id: "white", label: "White", sku: "TR-GOOGLE-PLATE-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TR-GOOGLE-PLATE-B", stockStatus: "instock" }
    ],
    isActive: true,
    seoTitle: "Google Review NFC Plate for Counters and Tables | Tap Rater",
    seoDescription: "Compact NFC Google review plate for counters, tables, front desks, and checkout areas.",
    searchKeywords: ["google review nfc plate", "nfc review plate", "review plate"]
  },
  {
    slug: "google-review-nfc-card",
    title: "Google Review NFC Card",
    sku: "TR-GOOGLE-CARD",
    categorySlug: "google-review-products",
    basePriceCents: 2900,
    stockStatus: "instock",
    shortDescription: "Portable NFC card for opening a Google review link during handoffs, events, or service visits.",
    description:
      "A Google Review NFC Card is a portable review prompt for staff, technicians, events, and customer handoffs. It opens one configured Google review destination.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["google"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [googlePlateImage],
    variants: [],
    isActive: true,
    seoTitle: "Google Review NFC Card | Tap Rater",
    seoDescription: "Portable NFC card that opens a Google review link for service teams and local businesses.",
    searchKeywords: ["google review nfc card", "review tap card", "nfc review card"]
  },
  {
    slug: "employee-review-name-tag",
    title: "Employee Review Name Tag",
    sku: "TR-STAFF-TAG",
    categorySlug: "google-review-products",
    basePriceCents: 5900,
    stockStatus: "instock",
    shortDescription: "Managed employee NFC name tag for staff-specific review or feedback routing.",
    description:
      "Employee Review Name Tags help staff invite customers to open the correct review, feedback, or staff tracking destination. Tap Rater managed setup is included.",
    productType: "physical_managed",
    serviceMode: "managed_redirect",
    checkoutMode: "request_quote",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["google", "feedback", "custom"],
    activationType: "managed_setup",
    includedServiceLabel: "Managed setup included",
    images: [googleStandImage],
    variants: [],
    isActive: true,
    seoTitle: "Employee Review Name Tag | Tap Rater",
    seoDescription: "Managed NFC employee name tag for staff review, feedback, or custom destination routing.",
    searchKeywords: ["employee review name tag", "staff nfc review tag", "nfc name tag"]
  },
  {
    slug: "facebook-review-stand",
    title: "Facebook Review Stand",
    sku: "TR-FACEBOOK-STAND",
    categorySlug: "review-platform-products",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "NFC stand that opens a Facebook review, recommendation, or business profile destination.",
    description:
      "A Facebook Review Stand gives customers a simple tap or scan prompt for your Facebook recommendation, review, or profile destination.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["facebook"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [facebookImage],
    variants: [],
    isActive: true,
    seoTitle: "Facebook Review NFC Stand | Tap Rater",
    seoDescription: "NFC Facebook review stand for businesses that want customers to open a Facebook review or recommendation destination.",
    searchKeywords: ["facebook review stand", "facebook nfc stand"]
  },
  {
    slug: "yelp-review-stand",
    title: "Yelp Review Stand",
    sku: "TR-YELP-STAND",
    categorySlug: "review-platform-products",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "NFC stand that opens a Yelp business profile or review destination.",
    description:
      "A Yelp Review Stand helps customers open your Yelp destination from a counter, host stand, table, or service desk.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["yelp"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [yelpImage],
    variants: [],
    isActive: true,
    seoTitle: "Yelp Review NFC Stand | Tap Rater",
    seoDescription: "NFC Yelp review stand for restaurants, salons, retail stores, and local service businesses.",
    searchKeywords: ["yelp review stand", "yelp nfc stand"]
  },
  {
    slug: "tripadvisor-review-stand",
    title: "TripAdvisor Review Stand",
    sku: "TR-TRIPADVISOR-STAND",
    categorySlug: "review-platform-products",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "NFC stand for hotels, restaurants, attractions, and visitor-facing businesses.",
    description:
      "A TripAdvisor Review Stand opens your TripAdvisor destination for guests, diners, visitors, and travelers after an in-person experience.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["tripadvisor"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [googleStandImage],
    variants: [],
    isActive: true,
    seoTitle: "TripAdvisor Review NFC Stand | Tap Rater",
    seoDescription: "NFC TripAdvisor review stand for hospitality, tourism, restaurant, and attraction businesses.",
    searchKeywords: ["tripadvisor review stand", "tripadvisor nfc stand"]
  },
  {
    slug: "appointment-booking-stand",
    title: "Appointment Booking Stand",
    sku: "TR-BOOKING-STAND",
    categorySlug: "social-booking-products",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "NFC stand that opens a booking page, appointment form, calendar, or scheduling URL.",
    description:
      "An Appointment Booking Stand opens your scheduling page in one tap or scan, making it useful for salons, clinics, consultants, and service businesses.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["booking", "website", "custom"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [googleStandImage],
    variants: [],
    isActive: true,
    seoTitle: "Appointment Booking NFC Stand | Tap Rater",
    seoDescription: "NFC appointment booking stand that opens your booking, calendar, or scheduling page.",
    searchKeywords: ["appointment booking nfc stand", "booking stand", "nfc booking sign"]
  },
  {
    slug: "social-follow-nfc-stand",
    title: "Social Follow NFC Stand",
    sku: "TR-SOCIAL-STAND",
    categorySlug: "social-booking-products",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "NFC stand for Instagram, TikTok, Facebook, and social profile follow actions.",
    description:
      "A Social Follow NFC Stand gives customers a quick way to open your Instagram, TikTok, Facebook, or other social profile.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["instagram", "tiktok", "facebook", "custom"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [facebookImage],
    variants: [],
    isActive: true,
    seoTitle: "Social Follow NFC Stand | Tap Rater",
    seoDescription: "NFC social follow stand for Instagram, TikTok, Facebook, and other social profiles.",
    searchKeywords: ["social follow nfc stand", "instagram nfc stand", "tiktok nfc stand"]
  },
  {
    slug: "menu-wifi-direct-link-stand",
    title: "Menu / WiFi / Direct Link Stand",
    sku: "TR-DIRECT-STAND",
    categorySlug: "social-booking-products",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "Custom NFC stand for menus, Wi-Fi pages, websites, forms, and direct business links.",
    description:
      "A Menu / WiFi / Direct Link Stand opens one configured destination such as a menu, Wi-Fi page, website, form, or custom URL.",
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["menu", "wifi", "website", "custom"],
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    images: [googleStandImage],
    variants: [],
    isActive: true,
    seoTitle: "Menu, WiFi and Direct Link NFC Stand | Tap Rater",
    seoDescription: "Custom NFC stand for menus, Wi-Fi pages, websites, forms, and direct links.",
    searchKeywords: ["menu nfc stand", "wifi nfc stand", "direct link nfc stand"]
  },
  {
    slug: "multi-platform-review-page",
    title: "Multi-Platform Review Page",
    sku: "TR-MULTI-REVIEW",
    categorySlug: "hosted-landing-page-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Hosted Tap Rater page with multiple public review destination buttons.",
    description:
      "A Multi-Platform Review Page gives a business one hosted Tap Rater URL with buttons for Google, Facebook, Yelp, TripAdvisor, or other approved destinations. It requires account and landing page setup.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "contact_sales",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["google", "facebook", "yelp", "tripadvisor", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [feedbackImage],
    variants: [],
    isActive: true,
    seoTitle: "Multi-Platform Review Page | Tap Rater",
    seoDescription: "Hosted review landing page with buttons for Google, Facebook, Yelp, TripAdvisor, and custom destinations.",
    searchKeywords: ["multi platform review page", "review landing page", "reputation landing page"]
  },
  {
    slug: "reputation-hub-page",
    title: "Reputation Hub Page",
    sku: "TR-REPUTATION-HUB",
    categorySlug: "hosted-landing-page-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Hosted reputation page for reviews, business links, social profiles, and support actions.",
    description:
      "A Reputation Hub Page centralizes review links, social links, contact actions, and business destinations in one Tap Rater hosted page.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "contact_sales",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["google", "facebook", "yelp", "website", "instagram", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [feedbackImage],
    variants: [],
    isActive: true,
    seoTitle: "Reputation Hub Page | Tap Rater",
    seoDescription: "Hosted reputation hub page for reviews, social profiles, business links, and local customer actions.",
    searchKeywords: ["reputation hub page", "hosted review page", "business reputation page"]
  },
  {
    slug: "rate-your-experience-page",
    title: "Rate Your Experience Page",
    sku: "TR-RATE-EXPERIENCE",
    categorySlug: "feedback-referral-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Hosted experience page for customer feedback and follow-up routing.",
    description:
      "A Rate Your Experience Page opens a hosted Tap Rater page where customers can share feedback or choose an approved business destination.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "request_quote",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["feedback", "google", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [feedbackImage],
    variants: [
      { id: "white", label: "White stand", sku: "TR-RATE-EXPERIENCE-W", stockStatus: "instock" },
      { id: "black", label: "Black stand", sku: "TR-RATE-EXPERIENCE-B", stockStatus: "instock" }
    ],
    isActive: true,
    seoTitle: "Rate Your Experience Page | Tap Rater",
    seoDescription: "Hosted Tap Rater customer experience page for feedback, review links, and custom routing.",
    searchKeywords: ["rate your experience page", "feedback nfc stand", "customer experience page"]
  },
  {
    slug: "private-feedback-page",
    title: "Private Feedback Page",
    sku: "TR-PRIVATE-FEEDBACK",
    categorySlug: "feedback-referral-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Hosted private feedback form for customers to send comments directly to the business.",
    description:
      "A Private Feedback Page collects customer comments through a Tap Rater hosted form. It is not a review-gating tool and does not block access to public review destinations.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "request_quote",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["feedback", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [feedbackImage],
    variants: [],
    isActive: true,
    seoTitle: "Private Feedback Page | Tap Rater",
    seoDescription: "Hosted private feedback page for collecting customer comments through Tap Rater forms.",
    searchKeywords: ["private feedback page", "customer feedback form", "nfc feedback page"]
  },
  {
    slug: "referral-request-page",
    title: "Referral Request Page",
    sku: "TR-REFERRAL-PAGE",
    categorySlug: "feedback-referral-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Hosted referral request page for customers who want to share your business.",
    description:
      "A Referral Request Page lets customers open a hosted Tap Rater page for referral prompts, share links, and referral form submissions.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "request_quote",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["referral", "website", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [feedbackImage],
    variants: [],
    isActive: true,
    seoTitle: "Referral Request Page | Tap Rater",
    seoDescription: "Hosted referral request page for local businesses using Tap Rater NFC products.",
    searchKeywords: ["referral request page", "nfc referral stand", "referral form page"]
  },
  {
    slug: "social-media-hub-page",
    title: "Social Media Hub Page",
    sku: "TR-SOCIAL-HUB",
    categorySlug: "hosted-landing-page-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Hosted social hub for Instagram, TikTok, Facebook, website, and custom links.",
    description:
      "A Social Media Hub Page gives customers one hosted Tap Rater page for social profiles, website links, booking links, and custom calls to action.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "contact_sales",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["instagram", "tiktok", "facebook", "website", "booking", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [facebookImage],
    variants: [],
    isActive: true,
    seoTitle: "Social Media Hub Page | Tap Rater",
    seoDescription: "Hosted social media hub page for Instagram, TikTok, Facebook, booking links, websites, and custom actions.",
    searchKeywords: ["social media hub page", "social links nfc page", "instagram tiktok nfc"]
  },
  {
    slug: "review-feedback-combo-page",
    title: "Review + Feedback Combo Page",
    sku: "TR-REVIEW-FEEDBACK",
    categorySlug: "hosted-landing-page-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Hosted page that combines public review links and private feedback options.",
    description:
      "A Review + Feedback Combo Page can show public review buttons and a private feedback form without steering customers away from public review platforms based on sentiment.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "contact_sales",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["google", "facebook", "yelp", "feedback", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [feedbackImage],
    variants: [],
    isActive: true,
    seoTitle: "Review and Feedback Combo Page | Tap Rater",
    seoDescription: "Hosted review and feedback combo page with public review links and private feedback options.",
    searchKeywords: ["review feedback combo page", "review and feedback page", "hosted feedback page"]
  },
  {
    slug: "staff-review-tracking-page",
    title: "Staff Review Tracking Page",
    sku: "TR-STAFF-TRACKING",
    categorySlug: "hosted-landing-page-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Hosted staff tracking page for employee cards, tags, and team-level reporting.",
    description:
      "A Staff Review Tracking Page connects staff NFC cards, tags, or stands to Tap Rater reporting so a business can understand tap activity by employee or team.",
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "contact_sales",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["google", "feedback", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [googleStandImage],
    variants: [],
    isActive: true,
    seoTitle: "Staff Review Tracking Page | Tap Rater",
    seoDescription: "Hosted staff review tracking page for employee review cards, NFC tags, and team reporting.",
    searchKeywords: ["staff review tracking", "employee review tracking", "staff nfc dashboard"]
  },
  {
    slug: "multi-location-dashboard",
    title: "Multi-Location Dashboard",
    sku: "TR-MULTI-LOCATION",
    categorySlug: "hosted-landing-page-products",
    basePriceCents: 0,
    stockStatus: "instock",
    shortDescription: "Account-based dashboard for businesses with multiple locations, devices, and reputation pages.",
    description:
      "A Multi-Location Dashboard is for businesses that need location-level Tap Rater devices, hosted pages, analytics, destination management, and reporting.",
    productType: "platform_landing_page",
    serviceMode: "multi_location_platform",
    checkoutMode: "contact_sales",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["google", "facebook", "yelp", "tripadvisor", "feedback", "referral", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Premium landing page",
    images: [standsBundleImage],
    variants: [],
    isActive: true,
    seoTitle: "Multi-Location Reputation Dashboard | Tap Rater",
    seoDescription: "Tap Rater multi-location dashboard for devices, hosted pages, analytics, and business reputation workflows.",
    searchKeywords: ["multi location review dashboard", "reputation dashboard", "tap rater dashboard"]
  },
  {
    slug: "business-review-starter-kit",
    title: "Business Review Starter Kit",
    sku: "TR-STARTER-KIT",
    categorySlug: "business-bundles",
    basePriceCents: 12700,
    salePriceCents: 10160,
    stockStatus: "instock",
    shortDescription: "Bundle of physical review products with Tap Rater managed setup included.",
    description:
      "The Business Review Starter Kit combines NFC review hardware and managed setup so a local business can launch multiple review touchpoints together.",
    productType: "bundle",
    serviceMode: "managed_redirect",
    checkoutMode: "request_quote",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["google", "facebook", "yelp", "website", "custom"],
    activationType: "managed_setup",
    includedServiceLabel: "Managed setup included",
    images: [bundleImage],
    variants: [],
    isActive: true,
    seoTitle: "Business Review Starter Kit | Tap Rater",
    seoDescription: "Business review starter kit with physical NFC products and Tap Rater managed setup for local businesses.",
    searchKeywords: ["business review starter kit", "nfc review bundle", "tap rater bundle"]
  }
];
