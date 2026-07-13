import type {
  CatalogCategorySlug,
  DestinationType,
  MigratedProduct,
  StandCategorySlug,
  SupportedDestination
} from "@/data/migrated-products";

const STAND_PRICE = 4900;

const genericStandImage = {
  src: "/uploads/products/rate-your-experience-stand-v4.png",
  alt: "Tap Rater NFC stand (placeholder image pending dedicated product photography)"
};
const googleImg = { src: "/uploads/products/google-review-stand-v4.png", alt: "Tap Rater Google-branded NFC stand" };
const yelpImg = { src: "/uploads/products/yelp-review-stand-v4.png", alt: "Tap Rater Yelp-branded NFC stand" };
const facebookImg = { src: "/uploads/products/facebook-review-stand-v4.png", alt: "Tap Rater Facebook-branded NFC stand" };
const tripadvisorImg = {
  src: "/uploads/products/tripadvisor-review-stand-v4.png",
  alt: "Tap Rater TripAdvisor-branded NFC stand"
};

function imageFor(platformSlug?: string) {
  switch (platformSlug) {
    case "google":
      return googleImg;
    case "yelp":
      return yelpImg;
    case "facebook":
      return facebookImg;
    case "tripadvisor":
      return tripadvisorImg;
    default:
      return genericStandImage;
  }
}

type Entry = { slug: string; title: string; platformSlug?: string };

function skuFor(slug: string): string {
  return `TR-${slug.toUpperCase()}`;
}

function supportedDestinationsFor(destinationType: DestinationType, platformSlug?: string): SupportedDestination[] {
  const direct: SupportedDestination[] = ["google", "facebook", "yelp", "tripadvisor", "instagram", "tiktok"];
  if (platformSlug && (direct as string[]).includes(platformSlug)) {
    return [platformSlug as SupportedDestination];
  }
  switch (destinationType) {
    case "appointment":
      return ["booking"];
    case "feedback":
      return ["feedback"];
    case "menu_info":
      return ["menu"];
    case "website":
      return ["website"];
    default:
      return ["custom"];
  }
}

const destinationVerb: Record<DestinationType, string> = {
  review: "opens your review page",
  social: "opens your social profile",
  appointment: "opens your booking or scheduling link",
  feedback: "opens a feedback or experience form",
  menu_info: "opens your menu or business information",
  website: "opens your website or landing page",
  payment: "opens a payment, tip, or donation link",
  custom: "opens your custom destination",
  hosted_page: "opens a hosted Tap Rater page with multiple links"
};

function directLinkStand(
  entry: Entry,
  opts: { standCategorySlug: StandCategorySlug; destinationType: DestinationType; categorySlug: CatalogCategorySlug; tags: string[] }
): MigratedProduct {
  const verb = destinationVerb[opts.destinationType];
  const displayText = entry.title.replace(/ Stand$/, "");

  return {
    slug: entry.slug,
    title: entry.title,
    sku: skuFor(entry.slug),
    categorySlug: opts.categorySlug,
    basePriceCents: STAND_PRICE,
    stockStatus: "instock",
    shortDescription: `Countertop NFC stand that ${verb} with one tap or scan.`,
    description: `${entry.title} is a direct-link NFC stand for counters, desks, checkout areas, and reception spaces. It ${verb} through free basic activation, connects to one destination URL, and is tap or scan ready. No monthly subscription is required.`,
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: supportedDestinationsFor(opts.destinationType, entry.platformSlug),
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    format: "stand",
    customizationOptions: ["standard_design", "add_logo", "custom_design"],
    allowsLogoUpload: true,
    allowsCustomDesign: true,
    designMode: "standard",
    displayText,
    images: [imageFor(entry.platformSlug)],
    variants: [],
    isActive: true,
    seoTitle: `${entry.title} | NFC Stand | Tap Rater`,
    seoDescription: `${entry.title} ${verb} with one tap or scan. No monthly fee for basic activation.`,
    searchKeywords: [entry.title.toLowerCase(), entry.slug.replace(/-/g, " "), "nfc stand"],
    standCategorySlug: opts.standCategorySlug,
    destinationType: opts.destinationType,
    platformSlug: entry.platformSlug,
    tags: opts.tags,
    supportsLogo: true,
    supportsBusinessName: true,
    supportsCustomHeadline: false,
    supportsMultipleLinks: false
  };
}

function customPrintedStand(entry: Entry, tags: string[]): MigratedProduct {
  return {
    slug: entry.slug,
    title: entry.title,
    sku: skuFor(entry.slug),
    categorySlug: "business-bundles",
    basePriceCents: STAND_PRICE + 3000,
    stockStatus: "instock",
    shortDescription: `Custom-printed NFC stand with your logo, business name, and headline.`,
    description: `${entry.title} is a managed, fully custom-printed physical product. Add your business logo, business name, a custom headline, and choose the destination — a single direct link, or a Tap Rater hosted landing page. Design details are collected after request and require approval before production.`,
    productType: "physical_managed",
    serviceMode: "managed_redirect",
    checkoutMode: "request_quote",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["custom"],
    activationType: "managed_setup",
    includedServiceLabel: "Managed setup included",
    format: "stand",
    customizationOptions: ["standard_design", "add_logo", "custom_design"],
    allowsLogoUpload: true,
    allowsCustomDesign: true,
    designMode: "custom",
    images: [genericStandImage],
    variants: [],
    isActive: true,
    seoTitle: `${entry.title} | Custom-Printed NFC Stand | Tap Rater`,
    seoDescription: `${entry.title}: custom-printed NFC stand with your logo, business name, and headline.`,
    searchKeywords: [entry.title.toLowerCase(), "custom nfc stand"],
    standCategorySlug: "custom-stands",
    destinationType: "custom",
    tags: ["custom", ...tags],
    supportsLogo: true,
    supportsBusinessName: true,
    supportsCustomHeadline: true,
    supportsMultipleLinks: false
  };
}

function hostedTapPageStand(entry: Entry, tags: string[]): MigratedProduct {
  return {
    slug: entry.slug,
    title: entry.title,
    sku: skuFor(entry.slug),
    categorySlug: "business-bundles",
    basePriceCents: 1900,
    stockStatus: "instock",
    shortDescription: `A hosted Tap Rater page with multiple links, logos, and buttons behind a single tap.`,
    description: `${entry.title} connects a Tap Rater device to a hosted page instead of one direct link. Customers tap and see review, social, menu, booking, and feedback buttons — all on one branded page. Requires a Tap Rater account and a monthly subscription for hosted features.`,
    productType: "platform_landing_page",
    serviceMode: "hosted_landing_page",
    checkoutMode: "contact_sales",
    requiresAccount: true,
    requiresSubscription: true,
    requiresLandingPage: true,
    supportedDestinations: ["google", "facebook", "yelp", "tripadvisor", "instagram", "tiktok", "booking", "menu", "feedback", "referral", "website", "custom"],
    activationType: "premium_hosted_activation",
    includedServiceLabel: "Hosted landing page and account setup included",
    format: "platform",
    customizationOptions: ["standard_design", "add_logo", "custom_design"],
    allowsLogoUpload: true,
    allowsCustomDesign: true,
    designMode: "standard",
    images: [genericStandImage],
    variants: [],
    isActive: true,
    seoTitle: `${entry.title} | Hosted Tap Rater Page | Tap Rater`,
    seoDescription: `${entry.title}: one tap opens a hosted Tap Rater page with multiple links. Requires an account and monthly subscription.`,
    searchKeywords: [entry.title.toLowerCase(), "hosted landing page", "multi link nfc"],
    standCategorySlug: "hosted-tap-page-stands",
    destinationType: "hosted_page",
    tags: ["hosted", "subscription", ...tags],
    supportsLogo: true,
    supportsBusinessName: true,
    supportsCustomHeadline: true,
    supportsMultipleLinks: true
  };
}

// ---------------------------------------------------------------------------
// REVIEW STANDS (review-stands / reviews) -- google/yelp/facebook/tripadvisor
// already exist in migrated-products.ts under these exact slugs, so they are
// intentionally excluded here to avoid duplication.
// ---------------------------------------------------------------------------
const reviewUniversal: Entry[] = [
  { slug: "trustpilot-review-stand", title: "Trustpilot Review Stand", platformSlug: "trustpilot" },
  { slug: "better-business-bureau-review-stand", title: "Better Business Bureau Review Stand", platformSlug: "bbb" },
  { slug: "nextdoor-review-stand", title: "Nextdoor Review Stand", platformSlug: "nextdoor" },
  { slug: "apple-maps-review-stand", title: "Apple Maps Review Stand", platformSlug: "apple-maps" },
  { slug: "bing-places-review-stand", title: "Bing Places Review Stand", platformSlug: "bing-places" }
];

const reviewRestaurant: Entry[] = [
  { slug: "opentable-review-stand", title: "OpenTable Review Stand", platformSlug: "opentable" },
  { slug: "toast-review-stand", title: "Toast Review Stand", platformSlug: "toast" },
  { slug: "doordash-review-stand", title: "DoorDash Review Stand", platformSlug: "doordash" },
  { slug: "uber-eats-review-stand", title: "Uber Eats Review Stand", platformSlug: "uber-eats" },
  { slug: "grubhub-review-stand", title: "Grubhub Review Stand", platformSlug: "grubhub" },
  { slug: "resy-review-stand", title: "Resy Review Stand", platformSlug: "resy" }
];

const reviewHotel: Entry[] = [
  { slug: "booking-com-review-stand", title: "Booking.com Review Stand", platformSlug: "booking-com" },
  { slug: "expedia-review-stand", title: "Expedia Review Stand", platformSlug: "expedia" },
  { slug: "hotels-com-review-stand", title: "Hotels.com Review Stand", platformSlug: "hotels-com" },
  { slug: "airbnb-review-stand", title: "Airbnb Review Stand", platformSlug: "airbnb" },
  { slug: "vrbo-review-stand", title: "Vrbo Review Stand", platformSlug: "vrbo" }
];

const reviewAutomotive: Entry[] = [
  { slug: "dealerrater-review-stand", title: "DealerRater Review Stand", platformSlug: "dealerrater" },
  { slug: "cars-com-review-stand", title: "Cars.com Review Stand", platformSlug: "cars-com" },
  { slug: "cargurus-review-stand", title: "CarGurus Review Stand", platformSlug: "cargurus" },
  { slug: "edmunds-review-stand", title: "Edmunds Review Stand", platformSlug: "edmunds" },
  { slug: "autotrader-review-stand", title: "Autotrader Review Stand", platformSlug: "autotrader" },
  { slug: "carfax-review-stand", title: "CARFAX Review Stand", platformSlug: "carfax" },
  { slug: "repairpal-review-stand", title: "RepairPal Review Stand", platformSlug: "repairpal" }
];

const reviewHealthcare: Entry[] = [
  { slug: "healthgrades-review-stand", title: "Healthgrades Review Stand", platformSlug: "healthgrades" },
  { slug: "zocdoc-review-stand", title: "Zocdoc Review Stand", platformSlug: "zocdoc" },
  { slug: "vitals-review-stand", title: "Vitals Review Stand", platformSlug: "vitals" },
  { slug: "ratemds-review-stand", title: "RateMDs Review Stand", platformSlug: "ratemds" },
  { slug: "webmd-care-review-stand", title: "WebMD Care Review Stand", platformSlug: "webmd-care" },
  { slug: "realself-review-stand", title: "RealSelf Review Stand", platformSlug: "realself" },
  { slug: "dentalinsider-review-stand", title: "DentalInsider Review Stand", platformSlug: "dentalinsider" },
  { slug: "opencare-review-stand", title: "Opencare Review Stand", platformSlug: "opencare" }
];

const reviewHomeServices: Entry[] = [
  { slug: "angi-review-stand", title: "Angi Review Stand", platformSlug: "angi" },
  { slug: "homeadvisor-review-stand", title: "HomeAdvisor Review Stand", platformSlug: "homeadvisor" },
  { slug: "thumbtack-review-stand", title: "Thumbtack Review Stand", platformSlug: "thumbtack" },
  { slug: "houzz-review-stand", title: "Houzz Review Stand", platformSlug: "houzz" },
  { slug: "porch-review-stand", title: "Porch Review Stand", platformSlug: "porch" }
];

const reviewLegal: Entry[] = [
  { slug: "avvo-review-stand", title: "Avvo Review Stand", platformSlug: "avvo" },
  { slug: "martindale-review-stand", title: "Martindale Review Stand", platformSlug: "martindale" },
  { slug: "justia-review-stand", title: "Justia Review Stand", platformSlug: "justia" },
  { slug: "findlaw-review-stand", title: "FindLaw Review Stand", platformSlug: "findlaw" },
  { slug: "lawyers-com-review-stand", title: "Lawyers.com Review Stand", platformSlug: "lawyers-com" }
];

const reviewRealEstate: Entry[] = [
  { slug: "zillow-review-stand", title: "Zillow Review Stand", platformSlug: "zillow" },
  { slug: "realtor-com-review-stand", title: "Realtor.com Review Stand", platformSlug: "realtor-com" },
  { slug: "apartments-com-review-stand", title: "Apartments.com Review Stand", platformSlug: "apartments-com" },
  { slug: "trulia-review-stand", title: "Trulia Review Stand", platformSlug: "trulia" }
];

const reviewBeauty: Entry[] = [
  { slug: "booksy-review-stand", title: "Booksy Review Stand", platformSlug: "booksy" },
  { slug: "fresha-review-stand", title: "Fresha Review Stand", platformSlug: "fresha" },
  { slug: "styleseat-review-stand", title: "StyleSeat Review Stand", platformSlug: "styleseat" },
  { slug: "vagaro-review-stand", title: "Vagaro Review Stand", platformSlug: "vagaro" },
  { slug: "mindbody-review-stand", title: "Mindbody Review Stand", platformSlug: "mindbody" }
];

const reviewEcommerce: Entry[] = [
  { slug: "amazon-review-stand", title: "Amazon Review Stand", platformSlug: "amazon" },
  { slug: "shopify-store-review-stand", title: "Shopify Store Review Stand", platformSlug: "shopify" },
  { slug: "etsy-review-stand", title: "Etsy Review Stand", platformSlug: "etsy" },
  { slug: "ebay-review-stand", title: "eBay Review Stand", platformSlug: "ebay" },
  { slug: "google-customer-reviews-stand", title: "Google Customer Reviews Stand", platformSlug: "google-customer-reviews" }
];

const socialMedia: Entry[] = [
  { slug: "follow-us-stand", title: "Follow Us Stand" },
  { slug: "social-media-stand", title: "Social Media Stand" },
  { slug: "instagram-stand", title: "Instagram Stand", platformSlug: "instagram" },
  { slug: "facebook-follow-stand", title: "Facebook Follow Stand", platformSlug: "facebook" },
  { slug: "tiktok-stand", title: "TikTok Stand", platformSlug: "tiktok" },
  { slug: "youtube-stand", title: "YouTube Stand", platformSlug: "youtube" },
  { slug: "x-twitter-stand", title: "X / Twitter Stand", platformSlug: "x-twitter" },
  { slug: "linkedin-stand", title: "LinkedIn Stand", platformSlug: "linkedin" },
  { slug: "pinterest-stand", title: "Pinterest Stand", platformSlug: "pinterest" },
  { slug: "snapchat-stand", title: "Snapchat Stand", platformSlug: "snapchat" },
  { slug: "threads-stand", title: "Threads Stand", platformSlug: "threads" },
  { slug: "whatsapp-stand", title: "WhatsApp Stand", platformSlug: "whatsapp" },
  { slug: "telegram-stand", title: "Telegram Stand", platformSlug: "telegram" }
];

const appointment: Entry[] = [
  { slug: "book-appointment-stand", title: "Book Appointment Stand" },
  { slug: "schedule-service-stand", title: "Schedule Service Stand" },
  { slug: "schedule-consultation-stand", title: "Schedule Consultation Stand" },
  { slug: "reserve-a-table-stand", title: "Reserve a Table Stand" },
  { slug: "book-a-demo-stand", title: "Book a Demo Stand" },
  { slug: "book-a-tour-stand", title: "Book a Tour Stand" },
  { slug: "join-waitlist-stand", title: "Join Waitlist Stand" },
  { slug: "check-availability-stand", title: "Check Availability Stand" },
  { slug: "calendly-stand", title: "Calendly Stand", platformSlug: "calendly" },
  { slug: "square-appointments-stand", title: "Square Appointments Stand", platformSlug: "square-appointments" },
  { slug: "acuity-scheduling-stand", title: "Acuity Scheduling Stand", platformSlug: "acuity-scheduling" },
  { slug: "vagaro-booking-stand", title: "Vagaro Booking Stand", platformSlug: "vagaro" },
  { slug: "fresha-booking-stand", title: "Fresha Booking Stand", platformSlug: "fresha" },
  { slug: "booksy-booking-stand", title: "Booksy Booking Stand", platformSlug: "booksy" },
  { slug: "mindbody-booking-stand", title: "Mindbody Booking Stand", platformSlug: "mindbody" },
  { slug: "opentable-reservation-stand", title: "OpenTable Reservation Stand", platformSlug: "opentable" },
  { slug: "resy-reservation-stand", title: "Resy Reservation Stand", platformSlug: "resy" },
  { slug: "zocdoc-booking-stand", title: "Zocdoc Booking Stand", platformSlug: "zocdoc" }
];

const feedback: Entry[] = [
  { slug: "share-your-feedback-stand", title: "Share Your Feedback Stand" },
  { slug: "customer-satisfaction-stand", title: "Customer Satisfaction Stand" },
  { slug: "tell-us-how-we-did-stand", title: "Tell Us How We Did Stand" },
  { slug: "quick-feedback-stand", title: "Quick Feedback Stand" },
  { slug: "service-feedback-stand", title: "Service Feedback Stand" },
  { slug: "patient-feedback-stand", title: "Patient Feedback Stand" },
  { slug: "guest-feedback-stand", title: "Guest Feedback Stand" },
  { slug: "event-feedback-stand", title: "Event Feedback Stand" },
  { slug: "report-an-issue-stand", title: "Report an Issue Stand" },
  { slug: "contact-manager-stand", title: "Contact Manager Stand" },
  { slug: "google-forms-feedback-stand", title: "Google Forms Feedback Stand", platformSlug: "google-forms" },
  { slug: "typeform-feedback-stand", title: "Typeform Feedback Stand", platformSlug: "typeform" },
  { slug: "jotform-feedback-stand", title: "Jotform Feedback Stand", platformSlug: "jotform" },
  { slug: "surveymonkey-feedback-stand", title: "SurveyMonkey Feedback Stand", platformSlug: "surveymonkey" }
];

const menuInfo: Entry[] = [
  { slug: "menu-info-stand", title: "Menu & Info Stand" },
  { slug: "view-menu-stand", title: "View Menu Stand" },
  { slug: "view-specials-stand", title: "View Specials Stand" },
  { slug: "view-services-stand", title: "View Services Stand" },
  { slug: "view-price-list-stand", title: "View Price List Stand" },
  { slug: "view-catalog-stand", title: "View Catalog Stand" },
  { slug: "view-product-info-stand", title: "View Product Info Stand" },
  { slug: "view-digital-brochure-stand", title: "View Digital Brochure Stand" },
  { slug: "view-event-details-stand", title: "View Event Details Stand" },
  { slug: "view-instructions-stand", title: "View Instructions Stand" },
  { slug: "view-warranty-info-stand", title: "View Warranty Info Stand" },
  { slug: "view-safety-info-stand", title: "View Safety Info Stand" },
  { slug: "view-hours-stand", title: "View Hours Stand" },
  { slug: "view-promotions-stand", title: "View Promotions Stand" },
  { slug: "restaurant-menu-stand", title: "Restaurant Menu Stand" },
  { slug: "cafe-menu-stand", title: "Café Menu Stand" },
  { slug: "bar-menu-stand", title: "Bar Menu Stand" },
  { slug: "food-truck-menu-stand", title: "Food Truck Menu Stand" },
  { slug: "spa-services-stand", title: "Spa Services Stand" },
  { slug: "salon-services-stand", title: "Salon Services Stand" },
  { slug: "auto-service-menu-stand", title: "Auto Service Menu Stand" },
  { slug: "hotel-info-stand", title: "Hotel Info Stand" },
  { slug: "event-info-stand", title: "Event Info Stand" }
];

const websiteLink: Entry[] = [
  { slug: "visit-our-website-stand", title: "Visit Our Website Stand" },
  { slug: "visit-our-landing-page-stand", title: "Visit Our Landing Page Stand" },
  { slug: "view-our-offers-stand", title: "View Our Offers Stand" },
  { slug: "join-our-newsletter-stand", title: "Join Our Newsletter Stand" },
  { slug: "download-our-app-stand", title: "Download Our App Stand" },
  { slug: "download-our-brochure-stand", title: "Download Our Brochure Stand" },
  { slug: "view-our-portfolio-stand", title: "View Our Portfolio Stand" },
  { slug: "view-our-gallery-stand", title: "View Our Gallery Stand" },
  { slug: "view-our-locations-stand", title: "View Our Locations Stand" },
  { slug: "contact-us-stand", title: "Contact Us Stand" },
  { slug: "request-a-quote-stand", title: "Request a Quote Stand" },
  { slug: "get-directions-stand", title: "Get Directions Stand" }
];

const paymentTipDonation: Entry[] = [
  { slug: "leave-a-tip-stand", title: "Leave a Tip Stand" },
  { slug: "donate-now-stand", title: "Donate Now Stand" },
  { slug: "pay-here-stand", title: "Pay Here Stand" },
  { slug: "pay-invoice-stand", title: "Pay Invoice Stand" },
  { slug: "support-us-stand", title: "Support Us Stand" },
  { slug: "scan-to-donate-stand", title: "Scan to Donate Stand" },
  { slug: "venmo-stand", title: "Venmo Stand", platformSlug: "venmo" },
  { slug: "cash-app-stand", title: "Cash App Stand", platformSlug: "cash-app" },
  { slug: "paypal-stand", title: "PayPal Stand", platformSlug: "paypal" },
  { slug: "zelle-stand", title: "Zelle Stand", platformSlug: "zelle" },
  { slug: "square-payment-stand", title: "Square Payment Stand", platformSlug: "square" },
  { slug: "stripe-payment-link-stand", title: "Stripe Payment Link Stand", platformSlug: "stripe" },
  { slug: "gofundme-stand", title: "GoFundMe Stand", platformSlug: "gofundme" }
];

const loyaltyRewards: Entry[] = [
  { slug: "join-rewards-stand", title: "Join Rewards Stand" },
  { slug: "join-loyalty-program-stand", title: "Join Loyalty Program Stand" },
  { slug: "collect-points-stand", title: "Collect Points Stand" },
  { slug: "sign-up-and-save-stand", title: "Sign Up & Save Stand" },
  { slug: "join-vip-list-stand", title: "Join VIP List Stand" },
  { slug: "get-offers-stand", title: "Get Offers Stand" },
  { slug: "birthday-club-stand", title: "Birthday Club Stand" },
  { slug: "refer-a-friend-stand", title: "Refer a Friend Stand" }
];

const customStands: Entry[] = [
  { slug: "custom-review-stand", title: "Custom Review Stand" },
  { slug: "custom-social-stand", title: "Custom Social Stand" },
  { slug: "custom-booking-stand", title: "Custom Booking Stand" },
  { slug: "custom-feedback-stand", title: "Custom Feedback Stand" },
  { slug: "custom-menu-info-stand", title: "Custom Menu & Info Stand" },
  { slug: "custom-logo-stand", title: "Custom Logo Stand" },
  { slug: "custom-business-name-stand", title: "Custom Business Name Stand" },
  { slug: "custom-link-stand", title: "Custom Link Stand" }
];

const hostedTapPage: Entry[] = [
  { slug: "hosted-tap-page-stand", title: "Hosted Tap Page Stand" },
  { slug: "hosted-review-page-stand", title: "Hosted Review Page Stand" },
  { slug: "hosted-social-page-stand", title: "Hosted Social Page Stand" },
  { slug: "hosted-menu-page-stand", title: "Hosted Menu Page Stand" },
  { slug: "hosted-business-links-stand", title: "Hosted Business Links Stand" },
  { slug: "all-in-one-tap-page-stand", title: "All-in-One Tap Page Stand" },
  { slug: "multi-link-nfc-stand", title: "Multi-Link NFC Stand" }
];

export const extendedCatalogProducts: MigratedProduct[] = [
  ...reviewUniversal.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "universal"] })),
  ...reviewRestaurant.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "restaurant", "food"] })),
  ...reviewHotel.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "hotel", "travel", "hospitality"] })),
  ...reviewAutomotive.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "automotive"] })),
  ...reviewHealthcare.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "healthcare", "dental"] })),
  ...reviewHomeServices.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "home-services"] })),
  ...reviewLegal.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "legal", "professional-services"] })),
  ...reviewRealEstate.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "real-estate"] })),
  ...reviewBeauty.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "beauty", "wellness", "salon"] })),
  ...reviewEcommerce.map((e) => directLinkStand(e, { standCategorySlug: "review-stands", destinationType: "review", categorySlug: "reviews", tags: ["review", "ecommerce", "retail"] })),

  ...socialMedia.map((e) => directLinkStand(e, { standCategorySlug: "social-media-stands", destinationType: "social", categorySlug: "social-media", tags: ["social"] })),

  ...appointment.map((e) => directLinkStand(e, { standCategorySlug: "appointment-stands", destinationType: "appointment", categorySlug: "appointments", tags: ["appointment", "booking"] })),

  ...feedback.map((e) => directLinkStand(e, { standCategorySlug: "feedback-stands", destinationType: "feedback", categorySlug: "feedback", tags: ["feedback"] })),

  ...menuInfo.map((e) => directLinkStand(e, { standCategorySlug: "menu-info-stands", destinationType: "menu_info", categorySlug: "menu", tags: ["menu", "info"] })),

  ...websiteLink.map((e) => directLinkStand(e, { standCategorySlug: "website-link-stands", destinationType: "website", categorySlug: "website-links", tags: ["website", "link"] })),

  ...paymentTipDonation.map((e) => directLinkStand(e, { standCategorySlug: "payment-tip-donation-stands", destinationType: "payment", categorySlug: "payments-donations", tags: ["payment", "tip", "donation"] })),

  ...loyaltyRewards.map((e) => directLinkStand(e, { standCategorySlug: "loyalty-rewards-stands", destinationType: "custom", categorySlug: "loyalty-rewards", tags: ["loyalty", "rewards"] })),

  ...customStands.map((e) => customPrintedStand(e, ["custom-stand"])),

  ...hostedTapPage.map((e) => hostedTapPageStand(e, ["hosted-tap-page"]))
];
