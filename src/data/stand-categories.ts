import type { MigratedProduct, StandCategorySlug } from "@/data/migrated-products";

export type StandCategory = {
  slug: StandCategorySlug;
  name: string;
  description: string;
};

export const standCategories: StandCategory[] = [
  {
    slug: "review-stands",
    name: "Review Stands",
    description: "Direct-link stands that open a review page — Google, Yelp, Facebook, TripAdvisor, and dozens of industry-specific review platforms."
  },
  {
    slug: "social-media-stands",
    name: "Social Media Stands",
    description: "Direct-link stands that open a social profile or a general follow-us prompt."
  },
  {
    slug: "appointment-stands",
    name: "Appointment Stands",
    description: "Direct-link stands that open a booking, scheduling, reservation, or waitlist page."
  },
  {
    slug: "feedback-stands",
    name: "Feedback Stands",
    description: "Direct-link stands that open a feedback or experience form."
  },
  {
    slug: "menu-info-stands",
    name: "Menu & Info Stands",
    description: "Direct-link stands that open a menu, price list, catalog, brochure, or business information page."
  },
  {
    slug: "website-link-stands",
    name: "Website & Link Stands",
    description: "Direct-link stands that open a website, landing page, offers page, or app download."
  },
  {
    slug: "payment-tip-donation-stands",
    name: "Payment, Tip & Donation Stands",
    description: "Direct-link stands that open a payment, tip, or donation link."
  },
  {
    slug: "loyalty-rewards-stands",
    name: "Loyalty & Rewards Stands",
    description: "Direct-link stands that open a loyalty program, rewards sign-up, or referral link."
  },
  {
    slug: "custom-stands",
    name: "Custom Stands",
    description: "Fully custom-printed stands with your logo, business name, and a custom headline — request a quote."
  },
  {
    slug: "hosted-tap-page-stands",
    name: "Hosted Tap Page Stands",
    description: "Stands that open a hosted Tap Rater page with multiple links instead of one direct destination. Requires an account and subscription."
  }
];

export function getStandCategoryBySlug(slug: string): StandCategory | undefined {
  return standCategories.find((category) => category.slug === slug);
}

export function getProductSlugsForStandCategory(standCategorySlug: StandCategorySlug, products: MigratedProduct[]): string[] {
  return products.filter((product) => product.isActive && product.standCategorySlug === standCategorySlug).map((product) => product.slug);
}
