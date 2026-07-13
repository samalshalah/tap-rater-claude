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
  // --- Catalog v2 fields (2026-07-13 restructure) ---
  // Optional so the original 16 Phase 1 entries stay valid without edits.
  standCategorySlug?: StandCategorySlug;
  destinationType?: DestinationType;
  platformSlug?: string;
  tags?: string[];
  useCaseSlugs?: string[];
  supportsLogo?: boolean;
  supportsBusinessName?: boolean;
  supportsCustomHeadline?: boolean;
  supportsMultipleLinks?: boolean;
};

export type StandCategorySlug =
  | "review-stands"
  | "social-media-stands"
  | "appointment-stands"
  | "feedback-stands"
  | "menu-info-stands"
  | "website-link-stands"
  | "payment-tip-donation-stands"
  | "loyalty-rewards-stands"
  | "custom-stands"
  | "hosted-tap-page-stands";

export type DestinationType =
  | "review"
  | "social"
  | "appointment"
  | "feedback"
  | "menu_info"
  | "website"
  | "payment"
  | "custom"
  | "hosted_page";

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
  | "business-bundles"
  | "website-links"
  | "payments-donations"
  | "loyalty-rewards";

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
  },
  {
    slug: "website-links",
    title: "Website & Link Products",
    eyebrow: "Website",
    description: "NFC stands that open your website, landing page, offers, newsletter, app, or portfolio.",
    seoTitle: "Website & Link NFC Products | Tap Rater",
    seoDescription: "Shop NFC stands that open your website, landing page, offers, newsletter, app download, or portfolio.",
    buyerIntent: "For businesses that want customers to visit their website, download an app, or view a linked resource.",
    aliases: ["website-link-stands", "link-products"],
    seoCopy: "Website and link products open one website, app, or resource URL through a permanent Tap Rater link."
  },
  {
    slug: "payments-donations",
    title: "Payment, Tip & Donation Products",
    eyebrow: "Payments",
    description: "NFC stands that open a payment link, tip jar, invoice, or donation page.",
    seoTitle: "Payment, Tip & Donation NFC Products | Tap Rater",
    seoDescription: "Shop NFC stands for tips, payments, invoices, and donations via Venmo, PayPal, Cash App, Zelle, and more.",
    buyerIntent: "For businesses, service providers, and nonprofits that want customers to pay, tip, or donate with a tap.",
    aliases: ["payment-tip-donation-stands", "payment-products", "donation-products"],
    seoCopy: "Payment products open one payment, tip, or donation URL. Tap Rater does not process the payment itself."
  },
  {
    slug: "loyalty-rewards",
    title: "Loyalty & Rewards Products",
    eyebrow: "Loyalty",
    description: "NFC stands that open a loyalty program, rewards sign-up, or referral link.",
    seoTitle: "Loyalty & Rewards NFC Products | Tap Rater",
    seoDescription: "Shop NFC stands that open a loyalty program, rewards sign-up, VIP list, or referral link.",
    buyerIntent: "For businesses that want customers to join a rewards program or refer a friend with a tap.",
    aliases: ["loyalty-rewards-stands", "rewards-products"],
    seoCopy: "Loyalty and rewards products open one sign-up or referral URL through a permanent Tap Rater link."
  }
];

const googleStandImage = { src: "/uploads/products/google-review-stand-v4.png", alt: "Tap Rater Google Review Stand" };
const googlePlateImage = { src: "/uploads/products/google-review-plate.png", alt: "Tap Rater Google Review Plate" };
const yelpStandImage = { src: "/uploads/products/yelp-review-stand-v4.png", alt: "Tap Rater Yelp Review Stand" };
const yelpPlateImage = { src: "/uploads/products/yelp-review-plate.png", alt: "Tap Rater Yelp Review Plate placeholder" };
const facebookStandImage = { src: "/uploads/products/facebook-review-stand-v4.png", alt: "Tap Rater Facebook Review Stand" };
const facebookPlateImage = { src: "/uploads/products/facebook-review-plate.png", alt: "Tap Rater Facebook Review Plate placeholder" };
const tripadvisorStandImage = { src: "/uploads/products/tripadvisor-review-stand-v4.png", alt: "Tap Rater TripAdvisor Review Stand" };
const tripadvisorPlateImage = { src: "/uploads/products/tripadvisor-review-plate.png", alt: "Tap Rater TripAdvisor Review Plate placeholder" };
const experienceStandImage = { src: "/uploads/products/rate-your-experience-stand-v4.png", alt: "Tap Rater Rate Your Experience Stand" };
const experiencePlateImage = { src: "/uploads/products/rate-your-experience-plate.png", alt: "Tap Rater Rate Your Experience Plate placeholder" };
const socialStandImage = { src: "/uploads/products/social-media-stand-v4.png", alt: "Tap Rater Follow Us on Social Media Stand" };
const socialPlateImage = { src: "/uploads/products/social-media-plate.png", alt: "Tap Rater Follow Us on Social Media Plate placeholder" };
const bookingStandImage = { src: "/uploads/products/book-next-visit-stand-v4.png", alt: "Tap Rater Book Your Next Visit Stand" };
const bookingPlateImage = { src: "/uploads/products/book-next-visit-plate.png", alt: "Tap Rater Book Your Next Visit Plate placeholder" };
const menuStandImage = { src: "/uploads/products/view-menu-stand-v4.png", alt: "Tap Rater View Our Menu Stand" };
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
  isActive?: boolean;
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
    isActive: input.isActive ?? true,
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
    searchKeywords: ["google review plate", "nfc review plate", "review us on google plate"],
    isActive: false
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
    searchKeywords: ["yelp review plate", "yelp nfc plate", "review us on yelp plate"],
    isActive: false
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
    searchKeywords: ["facebook review plate", "facebook nfc plate", "review us on facebook plate"],
    isActive: false
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
    searchKeywords: ["tripadvisor review plate", "tripadvisor nfc plate", "review us on tripadvisor plate"],
    isActive: false
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
    searchKeywords: ["rate your experience plate", "feedback nfc plate", "customer experience plate"],
    isActive: false
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
    searchKeywords: ["social media nfc plate", "follow us social media plate", "social follow plate"],
    isActive: false
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
    searchKeywords: ["book your next visit plate", "appointment booking nfc plate", "booking nfc plate"],
    isActive: false
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
    searchKeywords: ["view our menu plate", "nfc menu plate", "restaurant menu nfc plate"],
    isActive: false
  }),

  // --- Phase 2/3 catalog entries -------------------------------------------------
  // These are NOT phaseOneProduct() entries: they intentionally use request_quote /
  // contact_sales checkout (no Stripe changes), matching docs/product-strategy.md's
  // guidance for physical_managed and platform_landing_page products. Added per the
  // 2026-07-12 three-tier product model (Direct-Link / Custom Printed / Hosted
  // Landing Page Subscription). Placeholder imagery — see note below.
  {
    slug: "custom-nfc-stand",
    title: "Custom NFC Stand",
    sku: "TR-CUSTOM-STAND",
    categorySlug: "business-bundles",
    basePriceCents: 7900,
    stockStatus: "instock",
    shortDescription: "A fully custom-printed NFC stand with your logo, business name, and headline.",
    description:
      "Custom NFC Stand is a managed, fully custom-printed physical product. Add your business logo, business name, a custom headline, and choose the destination — a single direct link, or a Tap Rater hosted landing page with multiple links. Design details are collected after request and require approval before production.",
    productType: "physical_managed",
    serviceMode: "managed_redirect",
    checkoutMode: "request_quote",
    requiresAccount: false,
    requiresSubscription: false,
    requiresLandingPage: false,
    supportedDestinations: ["google", "facebook", "yelp", "tripadvisor", "instagram", "tiktok", "booking", "menu", "feedback", "referral", "website", "custom"],
    activationType: "managed_setup",
    includedServiceLabel: "Managed setup included",
    format: "stand",
    customizationOptions: ["standard_design", "add_logo", "custom_design"],
    allowsLogoUpload: true,
    allowsCustomDesign: true,
    designMode: "custom",
    images: [experienceStandImage],
    variants: colors.map((color) => ({
      id: color.id,
      label: color.label,
      sku: `TR-CUSTOM-STAND-${color.suffix}`,
      stockStatus: "instock"
    })),
    isActive: true,
    seoTitle: "Custom NFC Stand | Fully Custom-Printed Business Stand | Tap Rater",
    seoDescription: "Custom-printed NFC stand with your logo, business name, and headline. Points to a direct link or a Tap Rater hosted landing page.",
    searchKeywords: ["custom nfc stand", "custom printed stand", "business logo nfc stand", "custom tap rater stand"]
  },
  {
    slug: "hosted-landing-page-subscription",
    title: "Hosted Landing Page Subscription",
    sku: "TR-HOSTED-PAGE",
    categorySlug: "business-bundles",
    basePriceCents: 1900,
    stockStatus: "instock",
    shortDescription: "A hosted Tap Rater page with multiple links, logos, and buttons behind a single tap.",
    description:
      "Hosted Landing Page Subscription connects a Tap Rater device to a hosted page instead of one direct link. Customers tap and see Google, Yelp, Facebook, and TripAdvisor review buttons, a menu, appointment booking, social media, website, feedback, and custom links — all on one branded page. Requires a Tap Rater account and a monthly subscription for hosted features.",
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
    images: [socialStandImage],
    variants: [],
    isActive: true,
    seoTitle: "Hosted Landing Page Subscription | Multi-Link Tap Rater Page",
    seoDescription: "One tap opens a hosted Tap Rater page with review, menu, booking, social, and feedback links. Requires an account and monthly subscription.",
    searchKeywords: ["hosted landing page", "multi link nfc page", "tap rater subscription", "hosted reputation page"]
  }
];

// --- Catalog v2 backfill (2026-07-13) ---------------------------------------
// These 7 slugs already existed in the Phase 1 catalog above AND are also
// explicitly required by the new stand-category/use-case spec under the exact
// same slug. Rather than duplicate them, backfill the new v2 fields directly
// onto the existing live product objects.
const catalogV2Backfill: Record<string, Partial<MigratedProduct>> = {
  "google-review-stand": {
    standCategorySlug: "review-stands",
    destinationType: "review",
    platformSlug: "google",
    tags: ["review", "google", "reputation", "universal"]
  },
  "yelp-review-stand": {
    standCategorySlug: "review-stands",
    destinationType: "review",
    platformSlug: "yelp",
    tags: ["review", "yelp", "reputation", "universal"]
  },
  "facebook-review-stand": {
    standCategorySlug: "review-stands",
    destinationType: "review",
    platformSlug: "facebook",
    tags: ["review", "facebook", "reputation", "universal"]
  },
  "tripadvisor-review-stand": {
    standCategorySlug: "review-stands",
    destinationType: "review",
    platformSlug: "tripadvisor",
    tags: ["review", "tripadvisor", "reputation", "travel", "hospitality"]
  },
  "rate-your-experience-stand": {
    standCategorySlug: "feedback-stands",
    destinationType: "feedback",
    tags: ["feedback", "experience", "universal"]
  },
  "book-your-next-visit-stand": {
    standCategorySlug: "appointment-stands",
    destinationType: "appointment",
    tags: ["appointment", "booking", "universal"]
  },
  "custom-nfc-stand": {
    standCategorySlug: "custom-stands",
    destinationType: "custom",
    tags: ["custom", "logo", "business-name", "headline"],
    supportsLogo: true,
    supportsBusinessName: true,
    supportsCustomHeadline: true,
    supportsMultipleLinks: false
  },
  // These 3 don't have an exact slug match in the new spec (spec instead lists
  // "follow-us-stand"/"social-media-stand", "view-menu-stand", and 7 hosted-*
  // slugs as separate new products) -- but they're real, live, already-sold
  // products, so they're backfilled into the same taxonomy rather than left
  // as orphans outside the new stand-category/use-case system.
  "follow-us-social-media-stand": {
    standCategorySlug: "social-media-stands",
    destinationType: "social",
    tags: ["social"]
  },
  "view-our-menu-stand": {
    standCategorySlug: "menu-info-stands",
    destinationType: "menu_info",
    tags: ["menu", "info"]
  },
  "hosted-landing-page-subscription": {
    standCategorySlug: "hosted-tap-page-stands",
    destinationType: "hosted_page",
    tags: ["hosted", "subscription"],
    supportsLogo: true,
    supportsBusinessName: true,
    supportsCustomHeadline: true,
    supportsMultipleLinks: true
  }
};

for (const product of migratedProducts) {
  const backfill = catalogV2Backfill[product.slug];
  if (backfill) {
    Object.assign(product, backfill);
  }
}

