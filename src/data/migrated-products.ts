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
};

export const migratedProducts: MigratedProduct[] = [
  {
    slug: "google-review-white-stand",
    title: "White Stand - Google Review",
    sku: "TRATER01",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "White NFC review stand for Google reviews.",
    description: "A Tap Rater NFC stand that helps customers open your Google review link with a tap.",
    images: [{ src: "/uploads/products/google-review-white-stand.jpg", alt: "Tap Rater Google Review white stand" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER01-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER01-B", stockStatus: "instock" }
    ],
    isActive: true
  },
  {
    slug: "google-review-white-plate",
    title: "White Plate - Google Review",
    sku: "TRATER02",
    basePriceCents: 3900,
    stockStatus: "instock",
    shortDescription: "White NFC review plate for Google reviews.",
    description: "A Tap Rater NFC plate for counters, tables, and front desks.",
    images: [{ src: "/uploads/products/google-review-white-plate.jpg", alt: "Tap Rater Google Review white plate" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER02-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER02-B", stockStatus: "instock" }
    ],
    isActive: true
  },
  {
    slug: "facebook-review-stand",
    title: "White Stand - Facebook Review",
    sku: "TRATER05",
    basePriceCents: 4900,
    stockStatus: "outofstock",
    shortDescription: "White NFC review stand for Facebook reviews.",
    description: "A Tap Rater NFC stand that opens your Facebook review destination.",
    images: [{ src: "/uploads/products/facebook-review-stand.jpg", alt: "Tap Rater Facebook Review white stand" }],
    variants: [],
    isActive: true
  },
  {
    slug: "yelp-review-stand",
    title: "White Stand - Yelp Review",
    sku: "TRATER06",
    basePriceCents: 4900,
    stockStatus: "outofstock",
    shortDescription: "White NFC review stand for Yelp reviews.",
    description: "A Tap Rater NFC stand that opens your Yelp review destination.",
    images: [{ src: "/uploads/products/yelp-review-stand.jpg", alt: "Tap Rater Yelp Review white stand" }],
    variants: [],
    isActive: true
  },
  {
    slug: "tap-rater-business-white-bundle",
    title: "Business - Google White Bundle",
    sku: "TRATER07",
    basePriceCents: 12700,
    salePriceCents: 10160,
    stockStatus: "instock",
    shortDescription: "Google review business bundle with Tap Rater products.",
    description: "A discounted Tap Rater bundle for businesses that want multiple Google review touchpoints.",
    images: [{ src: "/uploads/products/business-google-white-bundle.jpg", alt: "Tap Rater Google white business bundle" }],
    variants: [],
    isActive: true
  },
  {
    slug: "tap-rater-business-white-stands-bundle",
    title: "Business - Google White Stands Bundle",
    sku: "TRATER10",
    basePriceCents: 14700,
    salePriceCents: 11760,
    stockStatus: "instock",
    shortDescription: "Bundle of white Google review stands.",
    description: "A discounted bundle for businesses that need multiple Tap Rater Google review stands.",
    images: [{ src: "/uploads/products/business-google-white-stands-bundle.jpg", alt: "Tap Rater Google white stands bundle" }],
    variants: [],
    isActive: true
  },
  {
    slug: "tap-rater-white-stand-rate-your-experience",
    title: "White Stand - Rate Your Experience",
    sku: "TRATER12",
    basePriceCents: 4900,
    stockStatus: "instock",
    shortDescription: "White NFC stand for a Rate Your Experience flow.",
    description: "A Tap Rater NFC stand for directing customers to your preferred review or feedback flow.",
    images: [{ src: "/uploads/products/rate-your-experience-white-stand.jpg", alt: "Tap Rater Rate Your Experience white stand" }],
    variants: [
      { id: "white", label: "White", sku: "TRATER12-W", stockStatus: "instock" },
      { id: "black", label: "Black", sku: "TRATER12-B", stockStatus: "instock" }
    ],
    isActive: true
  }
];
