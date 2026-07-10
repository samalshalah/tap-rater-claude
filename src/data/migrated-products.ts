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
  format: ProductFormat;
  customizationOptions: ProductCustomizationOption[];
  allowsLogoUpload: boolean;
  allowsCustomDesign: boolean;
  designMode: ProductDesignMode;
  displayText?: string;
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

export type ProductFormat = "stand" | "plate" | "bundle" | "platform";

export type ProductCustomizationOption = "standard_design" | "add_logo" | "custom_design";

export type ProductDesignMode = "standard" | "logo" | "custom";

export type CatalogCategorySlug =
  | "reviews"
  | "social-media"
  | "appointments"
  | "menu"
  | "feedback"
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
    slug: "reviews",
    title: "Review Products",
    eyebrow: "Reviews",
    description: "NFC stands and plates that open Google, Yelp, Facebook, TripAdvisor, or other review destinations.",
    seoTitle: "NFC Review Products | Tap Rater",
    seoDescription: "Shop NFC review stands and plates for Google, Yelp, Facebook, TripAdvisor, and other review destinations.",
    buyerIntent: "For businesses that want customers to tap or scan and open a public review destination.",
    aliases: ["review-stands", "review-plates", "google-review-products", "review-platform-products", "google-review-stands", "review-platform-stands", "google-review-plates"],
    seoCopy:
      "Review products focus on the review use case first, then let the customer choose the physical format: tabletop stand or low-profile plate."
  },
  {
    slug: "social-media",
    title: "Social Media Products",
    eyebrow: "Social",
    description: "NFC stands and plates that open social profiles or a social media hub for Facebook, X, Instagram, and YouTube.",
    seoTitle: "NFC Social Media Products | Tap Rater",
    seoDescription: "Shop NFC social media stands and plates that open social profiles or a social media hub.",
    buyerIntent: "For businesses that want customers to follow or visit social profiles after an in-person interaction.",
    aliases: ["social-booking-products", "social-booking-stands", "social-booking-plates", "social-follow-products", "social-media-products"],
    seoCopy:
      "Social media products can open a direct social profile or a social media hub for Facebook, X, Instagram, and YouTube."
  },
  {
    slug: "appointments",
    title: "Appointment Products",
    eyebrow: "Booking",
    description: "NFC stands and plates that open booking pages, appointment forms, calendars, or scheduling URLs.",
    seoTitle: "Appointment NFC Products | Tap Rater",
    seoDescription: "Shop NFC appointment stands and plates that open booking pages, appointment forms, calendars, or scheduling URLs.",
    buyerIntent: "For salons, clinics, consultants, service businesses, and teams that want customers to book the next visit.",
    aliases: ["appointment-products", "booking-products"],
    seoCopy:
      "Appointment products open one booking, calendar, form, or scheduling URL through a permanent Tap Rater link."
  },
  {
    slug: "menu",
    title: "Menu Products",
    eyebrow: "Menu",
    description: "NFC stands and plates that open a restaurant, cafe, or service menu.",
    seoTitle: "NFC Menu Products | Tap Rater",
    seoDescription: "Shop NFC menu stands and plates that open a restaurant, cafe, or service menu.",
    buyerIntent: "For restaurants, cafes, counters, tables, and service businesses that need customers to open a menu.",
    aliases: ["menu-products"],
    seoCopy:
      "Menu products are menu-only customer prompts. They should not be marketed as Wi-Fi products."
  },
  {
    slug: "feedback",
    title: "Feedback Products",
    eyebrow: "Feedback",
    description: "NFC stands and plates that open customer feedback or experience forms.",
    seoTitle: "NFC Feedback Products | Tap Rater",
    seoDescription: "Shop NFC feedback stands and plates that open customer feedback or experience forms.",
    buyerIntent: "For businesses that want customers to tap or scan and share experience feedback.",
    aliases: ["experience-feedback-products", "feedback-referral-products", "feedback-referral-stands", "feedback-stands"],
    seoCopy:
      "Feedback products open customer feedback or experience forms without review-gating language."
  },
  {
    slug: "business-bundles",
    title: "Business Bundles",
    eyebrow: "Managed",
    description: "Managed setup packages and multi-product kits for businesses that need several tap points.",
    seoTitle: "Business Bundles and Managed Setup | Tap Rater",
    seoDescription: "Tap Rater business bundles and managed setup options for future multi-device launches.",
    buyerIntent: "For businesses that want Tap Rater to configure several physical products together.",
    aliases: ["hosted-landing-page-products"],
    seoCopy:
      "Business bundles and managed setup remain quote-based while Phase 1 focuses on sellable tabletop stands and flat plates."
  }
];

const googleStandImage = { src: "/uploads/products/google-review-stand.png", alt: "Tap Rater Google Review Stand" };
const googlePlateImage = { src: "/uploads/products/google-review-plate.png", alt: "Tap Rater Google Review Plate" };
const yelpStandImage = { src: "/uploads/products/yelp-review-stand.png", alt: "Tap Rater Yelp Review Stand" };
const yelpPlateImage = { src: "/uploads/products/yelp-review-plate.png", alt: "Tap Rater Yelp Review Plate placeholder" };
const facebookStandImage = { src: "/uploads/products/facebook-review-stand.png", alt: "Tap Rater Facebook Review Stand" };
const facebookPlateImage = { src: "/uploads/products/facebook-review-plate.png", alt: "Tap Rater Facebook Review Plate placeholder" };
const tripadvisorStandImage = { src: "/uploads/products/tripadvisor-review-stand.png", alt: "Tap Rater TripAdvisor Review Stand" };
const tripadvisorPlateImage = { src: "/uploads/products/tripadvisor-review-plate.png", alt: "Tap Rater TripAdvisor Review Plate placeholder" };
const experienceStandImage = { src: "/uploads/products/rate-your-experience-stand.png", alt: "Tap Rater Rate Your Experience Stand" };
const experiencePlateImage = { src: "/uploads/products/rate-your-experience-plate.png", alt: "Tap Rater Rate Your Experience Plate placeholder" };
const socialStandImage = { src: "/uploads/products/social-media-stand.png", alt: "Tap Rater Follow Us on Social Media Stand" };
const socialPlateImage = { src: "/uploads/products/social-media-plate.png", alt: "Tap Rater Follow Us on Social Media Plate placeholder" };
const bookingStandImage = { src: "/uploads/products/book-next-visit-stand.png", alt: "Tap Rater Book Your Next Visit Stand" };
const bookingPlateImage = { src: "/uploads/products/book-next-visit-plate.png", alt: "Tap Rater Book Your Next Visit Plate placeholder" };
const menuStandImage = { src: "/uploads/products/view-menu-stand.png", alt: "Tap Rater View Our Menu Stand" };
const menuPlateImage = { src: "/uploads/products/view-menu-plate.png", alt: "Tap Rater View Our Menu Plate placeholder" };

const standPriceCents = 4900;
const platePriceCents = 3900;
const defaultPhysicalCustomizationOptions: ProductCustomizationOption[] = ["standard_design", "add_logo", "custom_design"];

const colors = [
  { id: "white", label: "White", suffix: "W" },
  { id: "black", label: "Black", suffix: "B" }
];

type PhaseOneProductInput = {
  slug: string;
  title: string;
  sku: string;
  categorySlug: CatalogCategorySlug;
  basePriceCents: number;
  shortDescription: string;
  description: string;
  supportedDestinations: SupportedDestination[];
  displayText: string;
  image: { src: string; alt: string };
  seoTitle: string;
  seoDescription: string;
  searchKeywords: string[];
};

function phaseOneProduct(input: PhaseOneProductInput): MigratedProduct {
  return {
    slug: input.slug,
    title: input.title,
    sku: input.sku,
    categorySlug: input.categorySlug,
    basePriceCents: input.basePriceCents,
    stockStatus: "instock",
    shortDescription: input.shortDescription,
    description: `${input.description} Available as standard design, with your logo, or with a custom layout.`,
    productType: "physical_redirect",
    serviceMode: "basic_redirect",
    checkoutMode: "buy_now",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: input.supportedDestinations,
    activationType: "free_basic_activation",
    includedServiceLabel: "Free basic activation",
    format: input.title.includes("Plate") ? "plate" : "stand",
    customizationOptions: [...defaultPhysicalCustomizationOptions],
    allowsLogoUpload: true,
    allowsCustomDesign: true,
    designMode: "standard",
    displayText: input.displayText,
    images: [input.image],
    variants: colors.map((color) => ({
      id: color.id,
      label: color.label,
      sku: `${input.sku}-${color.suffix}`,
      stockStatus: "instock"
    })),
    isActive: true,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    searchKeywords: input.searchKeywords
  };
}

export const migratedProducts: MigratedProduct[] = [
  phaseOneProduct({
    slug: "google-review-stand",
    title: "Google Review Stand",
    sku: "TR-GOOGLE-STAND",
    categorySlug: "reviews",
    basePriceCents: standPriceCents,
    shortDescription: "Countertop NFC stand that opens your Google review link with one tap or scan.",
    description:
      "Google Review Stand is a tabletop NFC display for counters, desks, checkout areas, and reception spaces. It opens your Google review link through free basic activation, connects to one destination URL, and is tap or scan ready.",
    supportedDestinations: ["google"],
    displayText: "Review us on Google",
    image: googleStandImage,
    seoTitle: "Google Review Stand | NFC Review Stand for Local Businesses",
    seoDescription: "Buy a Google Review Stand that opens your Google review link with one tap or scan. No monthly fee required for basic activation.",
    searchKeywords: ["google review stand", "google nfc stand", "review us on google stand"]
  }),
  phaseOneProduct({
    slug: "google-review-plate",
    title: "Google Review Plate",
    sku: "TR-GOOGLE-PLATE",
    categorySlug: "reviews",
    basePriceCents: platePriceCents,
    shortDescription: "Low-profile NFC plate for counters, desks, tables, and reception areas.",
    description:
      "Google Review Plate is a flat NFC prompt for counters, desks, tables, and reception areas. It opens your Google review link through free basic activation, connects to one destination URL, and is tap or scan ready.",
    supportedDestinations: ["google"],
    displayText: "Review us on Google",
    image: googlePlateImage,
    seoTitle: "Google Review Plate | NFC Review Plate for Counters and Tables",
    seoDescription: "Buy a Google Review Plate for counters, desks, tables, and reception areas. Opens your Google review link with one tap or scan.",
    searchKeywords: ["google review plate", "nfc review plate", "review us on google plate"]
  }),
  phaseOneProduct({
    slug: "yelp-review-stand",
    title: "Yelp Review Stand",
    sku: "TR-YELP-STAND",
    categorySlug: "reviews",
    basePriceCents: standPriceCents,
    shortDescription: "Countertop NFC stand that opens your Yelp review or business profile destination.",
    description:
      "Yelp Review Stand is a tabletop NFC display for businesses that want customers to open a Yelp review or business profile destination. It connects to one destination URL and does not require a monthly fee for basic activation.",
    supportedDestinations: ["yelp"],
    displayText: "Review us on Yelp",
    image: yelpStandImage,
    seoTitle: "Yelp Review Stand | NFC Yelp Review Product",
    seoDescription: "Buy a Yelp Review Stand that opens your Yelp review or business profile destination with one tap or scan.",
    searchKeywords: ["yelp review stand", "yelp nfc stand", "review us on yelp stand"]
  }),
  phaseOneProduct({
    slug: "yelp-review-plate",
    title: "Yelp Review Plate",
    sku: "TR-YELP-PLATE",
    categorySlug: "reviews",
    basePriceCents: platePriceCents,
    shortDescription: "Low-profile NFC plate that helps customers open your Yelp destination.",
    description:
      "Yelp Review Plate is a low-profile NFC prompt that helps customers open your Yelp destination from a counter, table, desk, or reception area. It connects to one destination URL and is tap or scan ready.",
    supportedDestinations: ["yelp"],
    displayText: "Review us on Yelp",
    image: yelpPlateImage,
    seoTitle: "Yelp Review Plate | Low-Profile NFC Yelp Product",
    seoDescription: "Low-profile NFC plate that helps customers open your Yelp destination from counters, desks, tables, or reception areas.",
    searchKeywords: ["yelp review plate", "yelp nfc plate", "review us on yelp plate"]
  }),
  phaseOneProduct({
    slug: "facebook-review-stand",
    title: "Facebook Review Stand",
    sku: "TR-FACEBOOK-STAND",
    categorySlug: "reviews",
    basePriceCents: standPriceCents,
    shortDescription: "Countertop NFC stand that opens your Facebook review, recommendation, or business profile destination.",
    description:
      "Facebook Review Stand is a tabletop NFC display that opens your Facebook review, recommendation, or business profile destination. It uses free basic activation, connects to one destination URL, and is tap or scan ready.",
    supportedDestinations: ["facebook"],
    displayText: "Review us on Facebook",
    image: facebookStandImage,
    seoTitle: "Facebook Review Stand | NFC Facebook Review Product",
    seoDescription: "Buy a Facebook Review Stand that opens your Facebook review, recommendation, or business profile destination.",
    searchKeywords: ["facebook review stand", "facebook nfc stand", "review us on facebook stand"]
  }),
  phaseOneProduct({
    slug: "facebook-review-plate",
    title: "Facebook Review Plate",
    sku: "TR-FACEBOOK-PLATE",
    categorySlug: "reviews",
    basePriceCents: platePriceCents,
    shortDescription: "Low-profile NFC plate for Facebook reviews, recommendations, or profile visits.",
    description:
      "Facebook Review Plate is a flat NFC product for Facebook reviews, recommendations, or profile visits. It connects to one destination URL and does not require a monthly fee for basic activation.",
    supportedDestinations: ["facebook"],
    displayText: "Review us on Facebook",
    image: facebookPlateImage,
    seoTitle: "Facebook Review Plate | Low-Profile NFC Facebook Product",
    seoDescription: "Low-profile NFC plate for Facebook reviews, recommendations, or profile visits.",
    searchKeywords: ["facebook review plate", "facebook nfc plate", "review us on facebook plate"]
  }),
  phaseOneProduct({
    slug: "tripadvisor-review-stand",
    title: "TripAdvisor Review Stand",
    sku: "TR-TRIPADVISOR-STAND",
    categorySlug: "reviews",
    basePriceCents: standPriceCents,
    shortDescription: "Countertop NFC stand for hotels, restaurants, attractions, and visitor-facing businesses.",
    description:
      "TripAdvisor Review Stand is a tabletop NFC display for hotels, restaurants, attractions, and visitor-facing businesses. It opens your TripAdvisor destination through one configured URL.",
    supportedDestinations: ["tripadvisor"],
    displayText: "Review us on TripAdvisor",
    image: tripadvisorStandImage,
    seoTitle: "TripAdvisor Review Stand | NFC Review Stand for Hospitality",
    seoDescription: "Buy a TripAdvisor Review Stand for hotels, restaurants, attractions, and visitor-facing businesses.",
    searchKeywords: ["tripadvisor review stand", "tripadvisor nfc stand", "review us on tripadvisor stand"]
  }),
  phaseOneProduct({
    slug: "tripadvisor-review-plate",
    title: "TripAdvisor Review Plate",
    sku: "TR-TRIPADVISOR-PLATE",
    categorySlug: "reviews",
    basePriceCents: platePriceCents,
    shortDescription: "Low-profile NFC plate for hospitality, restaurants, tourism, and visitor-facing businesses.",
    description:
      "TripAdvisor Review Plate is a flat NFC product for hospitality, restaurants, tourism, and visitor-facing businesses. It opens your TripAdvisor destination with one tap or scan.",
    supportedDestinations: ["tripadvisor"],
    displayText: "Review us on TripAdvisor",
    image: tripadvisorPlateImage,
    seoTitle: "TripAdvisor Review Plate | Low-Profile NFC Hospitality Product",
    seoDescription: "Low-profile NFC plate for TripAdvisor destinations at hotels, restaurants, attractions, and visitor-facing businesses.",
    searchKeywords: ["tripadvisor review plate", "tripadvisor nfc plate", "review us on tripadvisor plate"]
  }),
  phaseOneProduct({
    slug: "rate-your-experience-stand",
    title: "Rate Your Experience Stand",
    sku: "TR-EXPERIENCE-STAND",
    categorySlug: "feedback",
    basePriceCents: standPriceCents,
    shortDescription: "Countertop NFC stand for collecting customer experience feedback through a Tap Rater destination.",
    description:
      "Rate Your Experience Stand is a tabletop NFC display for customer experience feedback through a Tap Rater destination. It connects to one destination URL and can support a direct feedback or follow-up flow.",
    supportedDestinations: ["feedback", "custom"],
    displayText: "Rate Your Experience",
    image: experienceStandImage,
    seoTitle: "Rate Your Experience Stand | NFC Feedback Stand",
    seoDescription: "Countertop NFC stand for collecting customer experience feedback through a Tap Rater destination.",
    searchKeywords: ["rate your experience stand", "feedback nfc stand", "customer experience stand"]
  }),
  phaseOneProduct({
    slug: "rate-your-experience-plate",
    title: "Rate Your Experience Plate",
    sku: "TR-EXPERIENCE-PLATE",
    categorySlug: "feedback",
    basePriceCents: platePriceCents,
    shortDescription: "Low-profile NFC plate for customer experience feedback and follow-up flows.",
    description:
      "Rate Your Experience Plate is a low-profile NFC product for customer experience feedback and follow-up flows. It opens one Tap Rater destination URL and is tap or scan ready.",
    supportedDestinations: ["feedback", "custom"],
    displayText: "Rate Your Experience",
    image: experiencePlateImage,
    seoTitle: "Rate Your Experience Plate | Low-Profile NFC Feedback Product",
    seoDescription: "Low-profile NFC plate for customer experience feedback and follow-up flows.",
    searchKeywords: ["rate your experience plate", "feedback nfc plate", "customer experience plate"]
  }),
  phaseOneProduct({
    slug: "follow-us-social-media-stand",
    title: "Follow Us on Social Media Stand",
    sku: "TR-SOCIAL-STAND",
    categorySlug: "social-media",
    basePriceCents: standPriceCents,
    shortDescription: "Countertop NFC stand that opens a social media hub or direct social profile.",
    description:
      "Follow Us on Social Media Stand is a tabletop NFC display that opens a social media hub or direct social profile. It is designed for Facebook, X, Instagram, and YouTube destinations through one configured URL.",
    supportedDestinations: ["facebook", "instagram", "website", "custom"],
    displayText: "Follow Us on Social Media",
    image: socialStandImage,
    seoTitle: "Follow Us on Social Media Stand | NFC Social Follow Stand",
    seoDescription: "Countertop NFC stand that opens a social media hub or direct profile for Facebook, X, Instagram, and YouTube.",
    searchKeywords: ["social media nfc stand", "follow us social media stand", "instagram facebook youtube nfc stand"]
  }),
  phaseOneProduct({
    slug: "follow-us-social-media-plate",
    title: "Follow Us on Social Media Plate",
    sku: "TR-SOCIAL-PLATE",
    categorySlug: "social-media",
    basePriceCents: platePriceCents,
    shortDescription: "Low-profile NFC plate that opens a social media hub or direct social profile.",
    description:
      "Follow Us on Social Media Plate is a flat NFC prompt that opens a social media hub or direct profile. It supports Facebook, X, Instagram, and YouTube through one configured URL.",
    supportedDestinations: ["facebook", "instagram", "website", "custom"],
    displayText: "Follow Us on Social Media",
    image: socialPlateImage,
    seoTitle: "Follow Us on Social Media Plate | NFC Social Follow Plate",
    seoDescription: "Low-profile NFC plate that opens a social media hub or direct social profile for Facebook, X, Instagram, and YouTube.",
    searchKeywords: ["social media nfc plate", "follow us social media plate", "social follow plate"]
  }),
  phaseOneProduct({
    slug: "book-your-next-visit-stand",
    title: "Book Your Next Visit Stand",
    sku: "TR-BOOKING-STAND",
    categorySlug: "appointments",
    basePriceCents: standPriceCents,
    shortDescription: "Countertop NFC stand that opens a booking page, appointment form, calendar, or scheduling URL.",
    description:
      "Book Your Next Visit Stand is a tabletop NFC display that opens a booking page, appointment form, calendar, or scheduling URL. It connects to one destination URL and is tap or scan ready.",
    supportedDestinations: ["booking", "website", "custom"],
    displayText: "Book Your Next Visit",
    image: bookingStandImage,
    seoTitle: "Book Your Next Visit Stand | Appointment Booking NFC Stand",
    seoDescription: "Countertop NFC stand that opens a booking page, appointment form, calendar, or scheduling URL.",
    searchKeywords: ["book your next visit stand", "appointment booking nfc stand", "booking nfc stand"]
  }),
  phaseOneProduct({
    slug: "book-your-next-visit-plate",
    title: "Book Your Next Visit Plate",
    sku: "TR-BOOKING-PLATE",
    categorySlug: "appointments",
    basePriceCents: platePriceCents,
    shortDescription: "Low-profile NFC plate that opens a booking page, appointment form, calendar, or scheduling URL.",
    description:
      "Book Your Next Visit Plate is a flat NFC prompt that opens a booking page, appointment form, calendar, or scheduling URL. It connects to one destination URL and is tap or scan ready.",
    supportedDestinations: ["booking", "website", "custom"],
    displayText: "Book Your Next Visit",
    image: bookingPlateImage,
    seoTitle: "Book Your Next Visit Plate | Appointment Booking NFC Plate",
    seoDescription: "Low-profile NFC plate that opens a booking page, appointment form, calendar, or scheduling URL.",
    searchKeywords: ["book your next visit plate", "appointment booking nfc plate", "booking nfc plate"]
  }),
  phaseOneProduct({
    slug: "view-our-menu-stand",
    title: "View Our Menu Stand",
    sku: "TR-MENU-STAND",
    categorySlug: "menu",
    basePriceCents: standPriceCents,
    shortDescription: "Countertop NFC stand that opens a restaurant, cafe, or service menu.",
    description:
      "View Our Menu Stand is a tabletop NFC display that opens a restaurant, cafe, or service menu. It connects to one menu destination URL and is tap or scan ready.",
    supportedDestinations: ["menu", "website", "custom"],
    displayText: "View Our Menu",
    image: menuStandImage,
    seoTitle: "View Our Menu Stand | NFC Menu Stand",
    seoDescription: "Countertop NFC stand that opens a restaurant, cafe, or service menu with one tap or scan.",
    searchKeywords: ["view our menu stand", "nfc menu stand", "restaurant menu nfc stand"]
  }),
  phaseOneProduct({
    slug: "view-our-menu-plate",
    title: "View Our Menu Plate",
    sku: "TR-MENU-PLATE",
    categorySlug: "menu",
    basePriceCents: platePriceCents,
    shortDescription: "Low-profile NFC plate that opens a restaurant, cafe, or service menu.",
    description:
      "View Our Menu Plate is a flat NFC product that opens a restaurant, cafe, or service menu. It connects to one menu destination URL and is tap or scan ready.",
    supportedDestinations: ["menu", "website", "custom"],
    displayText: "View Our Menu",
    image: menuPlateImage,
    seoTitle: "View Our Menu Plate | Low-Profile NFC Menu Product",
    seoDescription: "Low-profile NFC plate that opens a restaurant, cafe, or service menu.",
    searchKeywords: ["view our menu plate", "nfc menu plate", "restaurant menu nfc plate"]
  })
];
