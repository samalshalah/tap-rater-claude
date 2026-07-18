export type UseCase = {
  slug: string;
  name: string;
  description: string;
  featuredProductSlugs: string[];
  recommendedProductSlugs: string[];
  bundleSlugs?: string[];
  tags: string[];
};

// Conditional-slug resolutions (per spec's own fallback instructions), documented here:
// - auto-dealer-repair (originally "car-dealerships", renamed 2026-07-17): "appointment-stand"
//   doesn't exist as a product slug -> resolved to "book-appointment-stand" (deduplicated
//   against the explicit entry already in the list).
// - auto-dealer-repair: "feedback-stand" doesn't exist as a product slug -> resolved to
//   "rate-your-experience-stand" (deduplicated against the explicit entry already in the list).
// - automotive-service-repair: "surecritic-review-stand" does not exist in the catalog and
//   was not in the approved product list -> excluded entirely, per "otherwise do not include".
// - fitness-classes-studios (featured): "book-a-class-stand" does not exist -> resolved to
//   "book-appointment-stand" per "otherwise use book-appointment-stand".
// - fitness-classes-studios (recommended): "book-a-class-stand" does not exist -> excluded
//   entirely per "otherwise do not include" (book-appointment-stand is already listed separately).
export const useCases: UseCase[] = [
  {
    slug: "restaurants-cafes",
    name: "Restaurants & Cafés",
    description: "Share menus, promote specials, and turn counter visits into repeat business.",
    tags: ["restaurant", "cafe", "food"],
    featuredProductSlugs: ["google-review-stand", "yelp-review-stand", "view-menu-stand", "follow-us-stand", "hosted-tap-page-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "yelp-review-stand",
      "facebook-review-stand",
      "tripadvisor-review-stand",
      "opentable-review-stand",
      "toast-review-stand",
      "doordash-review-stand",
      "uber-eats-review-stand",
      "grubhub-review-stand",
      "resy-review-stand",
      "view-menu-stand",
      "restaurant-menu-stand",
      "cafe-menu-stand",
      "bar-menu-stand",
      "view-specials-stand",
      "reserve-a-table-stand",
      "opentable-reservation-stand",
      "resy-reservation-stand",
      "follow-us-stand",
      "instagram-stand",
      "tiktok-stand",
      "rate-your-experience-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "auto-dealer-repair",
    name: "Auto Dealer & Repair",
    description: "Guide shoppers, book service appointments, and improve the dealership and repair shop experience.",
    tags: ["automotive", "dealership", "repair"],
    featuredProductSlugs: ["google-review-stand", "dealerrater-review-stand", "cars-com-review-stand", "schedule-service-stand", "hosted-tap-page-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "yelp-review-stand",
      "facebook-review-stand",
      "dealerrater-review-stand",
      "cars-com-review-stand",
      "cargurus-review-stand",
      "edmunds-review-stand",
      "autotrader-review-stand",
      "carfax-review-stand",
      "schedule-service-stand",
      "book-appointment-stand",
      "rate-your-experience-stand",
      "social-media-stand",
      "follow-us-stand",
      "request-a-quote-stand",
      "auto-service-menu-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "front-desk-reception",
    name: "Front Desk & Reception",
    description: "Welcome guests, share information, and capture feedback with ease.",
    tags: ["reception", "office", "front-desk"],
    featuredProductSlugs: ["google-review-stand", "rate-your-experience-stand", "book-appointment-stand", "hosted-tap-page-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "facebook-review-stand",
      "yelp-review-stand",
      "rate-your-experience-stand",
      "share-your-feedback-stand",
      "customer-satisfaction-stand",
      "book-appointment-stand",
      "schedule-consultation-stand",
      "follow-us-stand",
      "contact-us-stand",
      "request-a-quote-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "retail-grocery",
    name: "Retail & Grocery",
    description: "Create smoother checkouts, stronger reviews, and better in-store engagement.",
    tags: ["retail", "grocery"],
    featuredProductSlugs: ["google-review-stand", "facebook-review-stand", "follow-us-stand", "join-rewards-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "yelp-review-stand",
      "facebook-review-stand",
      "nextdoor-review-stand",
      "follow-us-stand",
      "instagram-stand",
      "tiktok-stand",
      "join-rewards-stand",
      "join-loyalty-program-stand",
      "get-offers-stand",
      "view-promotions-stand",
      "visit-our-website-stand",
      "rate-your-experience-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "hotels-hospitality",
    name: "Hotels & Hospitality",
    description: "Welcome guests, share information, and capture feedback with ease.",
    tags: ["hotel", "hospitality", "travel"],
    featuredProductSlugs: ["tripadvisor-review-stand", "booking-com-review-stand", "google-review-stand", "hotel-info-stand", "hosted-tap-page-stand"],
    recommendedProductSlugs: [
      "tripadvisor-review-stand",
      "google-review-stand",
      "booking-com-review-stand",
      "expedia-review-stand",
      "hotels-com-review-stand",
      "airbnb-review-stand",
      "vrbo-review-stand",
      "hotel-info-stand",
      "view-event-details-stand",
      "view-hours-stand",
      "follow-us-stand",
      "instagram-stand",
      "guest-feedback-stand",
      "rate-your-experience-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "healthcare-dental",
    name: "Healthcare & Dental",
    description: "Capture patient feedback, encourage reviews, and simplify booking.",
    tags: ["healthcare", "dental", "medical"],
    featuredProductSlugs: ["google-review-stand", "healthgrades-review-stand", "zocdoc-review-stand", "book-appointment-stand", "hosted-tap-page-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "facebook-review-stand",
      "healthgrades-review-stand",
      "zocdoc-review-stand",
      "vitals-review-stand",
      "ratemds-review-stand",
      "webmd-care-review-stand",
      "realself-review-stand",
      "dentalinsider-review-stand",
      "opencare-review-stand",
      "book-appointment-stand",
      "zocdoc-booking-stand",
      "patient-feedback-stand",
      "rate-your-experience-stand",
      "view-services-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "salons-spas-wellness",
    name: "Salons, Spas & Wellness",
    description: "Fill the chair, grow the following, and make rebooking effortless.",
    tags: ["salon", "spa", "wellness", "beauty"],
    featuredProductSlugs: ["google-review-stand", "booksy-review-stand", "book-appointment-stand", "follow-us-stand", "hosted-tap-page-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "yelp-review-stand",
      "facebook-review-stand",
      "booksy-review-stand",
      "fresha-review-stand",
      "styleseat-review-stand",
      "vagaro-review-stand",
      "mindbody-review-stand",
      "realself-review-stand",
      "book-appointment-stand",
      "vagaro-booking-stand",
      "fresha-booking-stand",
      "booksy-booking-stand",
      "mindbody-booking-stand",
      "spa-services-stand",
      "salon-services-stand",
      "follow-us-stand",
      "instagram-stand",
      "rate-your-experience-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "home-services",
    name: "Home Services",
    description: "Win more reviews, more referrals, and more quote requests.",
    tags: ["home-services", "contractor", "trades"],
    featuredProductSlugs: ["google-review-stand", "angi-review-stand", "homeadvisor-review-stand", "request-a-quote-stand", "hosted-tap-page-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "yelp-review-stand",
      "facebook-review-stand",
      "angi-review-stand",
      "homeadvisor-review-stand",
      "thumbtack-review-stand",
      "houzz-review-stand",
      "porch-review-stand",
      "nextdoor-review-stand",
      "better-business-bureau-review-stand",
      "request-a-quote-stand",
      "schedule-service-stand",
      "rate-your-experience-stand",
      "visit-our-website-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "legal-professional-services",
    name: "Legal & Professional Services",
    description: "Build trust with reviews and make it easy to book a consultation.",
    tags: ["legal", "professional-services", "consulting"],
    featuredProductSlugs: ["google-review-stand", "avvo-review-stand", "schedule-consultation-stand", "request-a-quote-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "facebook-review-stand",
      "avvo-review-stand",
      "martindale-review-stand",
      "justia-review-stand",
      "findlaw-review-stand",
      "lawyers-com-review-stand",
      "better-business-bureau-review-stand",
      "schedule-consultation-stand",
      "request-a-quote-stand",
      "visit-our-website-stand",
      "contact-us-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    description: "Capture reviews, book tours, and showcase listings.",
    tags: ["real-estate", "property"],
    featuredProductSlugs: ["google-review-stand", "zillow-review-stand", "book-a-tour-stand", "request-a-quote-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "facebook-review-stand",
      "zillow-review-stand",
      "realtor-com-review-stand",
      "apartments-com-review-stand",
      "trulia-review-stand",
      "book-a-tour-stand",
      "schedule-consultation-stand",
      "view-our-portfolio-stand",
      "view-our-gallery-stand",
      "get-directions-stand",
      "contact-us-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "events-popups",
    name: "Events & Pop-Ups",
    description: "Grow your following and collect feedback in a temporary space.",
    tags: ["events", "pop-up", "temporary"],
    featuredProductSlugs: ["follow-us-stand", "event-feedback-stand", "view-event-details-stand", "scan-to-donate-stand"],
    recommendedProductSlugs: [
      "follow-us-stand",
      "instagram-stand",
      "tiktok-stand",
      "youtube-stand",
      "event-feedback-stand",
      "view-event-details-stand",
      "view-promotions-stand",
      "join-vip-list-stand",
      "get-offers-stand",
      "scan-to-donate-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "nonprofits-donations",
    name: "Nonprofits & Donations",
    description: "Make it effortless for supporters to give, tip, or donate.",
    tags: ["nonprofit", "donation", "charity"],
    featuredProductSlugs: ["donate-now-stand", "scan-to-donate-stand", "support-us-stand", "hosted-tap-page-stand"],
    recommendedProductSlugs: [
      "donate-now-stand",
      "scan-to-donate-stand",
      "support-us-stand",
      "paypal-stand",
      "venmo-stand",
      "cash-app-stand",
      "gofundme-stand",
      "visit-our-website-stand",
      "join-our-newsletter-stand",
      "follow-us-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "automotive-service-repair",
    name: "Automotive Service & Repair",
    description: "Capture reviews and make it easy to book the next service visit.",
    tags: ["automotive", "repair", "service"],
    featuredProductSlugs: ["google-review-stand", "repairpal-review-stand", "schedule-service-stand", "auto-service-menu-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "yelp-review-stand",
      "facebook-review-stand",
      "repairpal-review-stand",
      "carfax-review-stand",
      "schedule-service-stand",
      "book-appointment-stand",
      "auto-service-menu-stand",
      "rate-your-experience-stand",
      "request-a-quote-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "ecommerce-retail-brands",
    name: "Ecommerce & Retail Brands",
    description: "Turn in-person moments into online reviews, followers, and subscribers.",
    tags: ["ecommerce", "retail-brand"],
    featuredProductSlugs: ["amazon-review-stand", "trustpilot-review-stand", "shopify-store-review-stand", "visit-our-website-stand"],
    recommendedProductSlugs: [
      "amazon-review-stand",
      "shopify-store-review-stand",
      "etsy-review-stand",
      "ebay-review-stand",
      "trustpilot-review-stand",
      "google-customer-reviews-stand",
      "visit-our-website-stand",
      "join-our-newsletter-stand",
      "download-our-app-stand",
      "get-offers-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  },
  {
    slug: "fitness-classes-studios",
    name: "Fitness, Classes & Studios",
    description: "Fill classes, grow the following, and make booking effortless.",
    tags: ["fitness", "studio", "classes"],
    featuredProductSlugs: ["google-review-stand", "book-appointment-stand", "mindbody-booking-stand", "follow-us-stand"],
    recommendedProductSlugs: [
      "google-review-stand",
      "yelp-review-stand",
      "facebook-review-stand",
      "mindbody-review-stand",
      "mindbody-booking-stand",
      "book-appointment-stand",
      "join-waitlist-stand",
      "join-rewards-stand",
      "follow-us-stand",
      "instagram-stand",
      "rate-your-experience-stand",
      "custom-nfc-stand",
      "hosted-tap-page-stand"
    ]
  }
];

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return useCases.find((useCase) => useCase.slug === slug);
}
