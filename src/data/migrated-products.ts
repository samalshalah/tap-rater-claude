export type MigratedProduct = {
  slug: string;
  title: string;
  sku: string;
  basePriceCents: number;
  salePriceCents?: number;
  stockStatus: "instock" | "outofstock";
  shortDescription: string;
  description: string;
  images: { src: string; alt: string }[];
  variants: { id: string; label: string; sku: string; stockStatus: "instock" | "outofstock" }[];
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  searchKeywords?: string[];
};

export const migratedProducts: MigratedProduct[] = [
  {
    slug: "google-review-white-stand",
    title: "White Stand - Google Review",
    sku: "TRATER01",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "NFC Google review stand for counters, checkout desks, salons, restaurants, clinics, and local service businesses.",
    description: "A Tap Rater Google Review NFC stand helps customers open your Google review link with one tap. Place it near checkout, the front desk, or the service counter so happy customers can leave a review before they leave.",
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
    basePriceCents: 3900,
    stockStatus: "instock",
    shortDescription: "Low-profile NFC Google review plate for desks, tables, counters, and checkout areas.",
    description: "A Tap Rater Google Review NFC plate gives customers a clean, compact way to open your Google review link. It is built for counters, front desks, table service, and tight spaces where a stand is not the right fit.",
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
    basePriceCents: 4900,
    stockStatus: "outofstock",
    shortDescription: "NFC Facebook review stand for businesses that collect recommendations and social proof on Facebook.",
    description: "A Tap Rater Facebook Review NFC stand sends customers to your Facebook recommendation or review destination with one tap. Use it at your counter, reception desk, or checkout area.",
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
    basePriceCents: 4900,
    stockStatus: "outofstock",
    shortDescription: "NFC Yelp review stand for restaurants, salons, service businesses, and local storefronts.",
    description: "A Tap Rater Yelp Review NFC stand helps customers open your Yelp review destination with one tap. It is useful for businesses where Yelp visibility helps customers choose where to go next.",
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
    basePriceCents: 12700,
    salePriceCents: 10160,
    stockStatus: "instock",
    shortDescription: "Google review NFC bundle for businesses that need multiple review touchpoints.",
    description: "The Tap Rater Google White Bundle gives your business multiple NFC review touchpoints, making it easier to request reviews at the front desk, checkout counter, reception area, or table.",
    images: [{ src: "/uploads/products/business-google-white-bundle.jpg", alt: "Tap Rater Google Review NFC business bundle with stand and plates" }],
    variants: [],
    isActive: true,
    seoTitle: "Google Review NFC Business Bundle | Tap Rater",
    seoDescription: "Discounted Google Review NFC bundle for businesses that want multiple stands and plates to collect more customer reviews.",
    searchKeywords: ["google review nfc bundle", "business review stand bundle", "google review display bundle"]
  },
  {
    slug: "tap-rater-business-white-stands-bundle",
    title: "Business - Google White Stands Bundle",
    sku: "TRATER10",
    basePriceCents: 14700,
    salePriceCents: 11760,
    stockStatus: "instock",
    shortDescription: "Multi-stand Google review NFC bundle for businesses with several counters, rooms, or service points.",
    description: "The Tap Rater Google White Stands Bundle is made for businesses that need several NFC Google review stands across a location or team. Place them where customers check in, pay, or finish service.",
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
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "NFC feedback stand for custom review links, surveys, and rate-your-experience pages.",
    description: "The Tap Rater Rate Your Experience NFC stand sends customers to your preferred feedback, survey, or review page. Use it when you want a flexible review flow instead of a single platform destination.",
    images: [{ src: "/uploads/products/rate-your-experience-white-stand.jpg", alt: "Tap Rater Rate Your Experience NFC feedback stand" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER12-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER12-B", stockStatus: "instock" }
    ],
    isActive: true,
    seoTitle: "NFC Feedback Stand for Customer Experience Links | Tap Rater",
    seoDescription: "NFC rate-your-experience stand for customer feedback, surveys, and custom review links. Customers tap their phone to open your preferred destination.",
    searchKeywords: ["nfc feedback stand", "rate your experience stand", "customer feedback nfc sign", "nfc survey stand"]
  }
];
