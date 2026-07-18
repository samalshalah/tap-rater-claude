export type SolutionLink = {
  slug: string;
  title: string;
  categorySlug: string;
};

// Nav-only list: no photography required (unlike src/data/industries.ts, which
// backs the photo-card "Find your industry" section and stays at its original 4).
export const solutions: SolutionLink[] = [
  { slug: "restaurants-cafes", title: "Restaurants & Cafés", categorySlug: "menu" },
  { slug: "auto-dealer-repair", title: "Auto Dealer & Repair", categorySlug: "appointments" },
  { slug: "front-desk-reception", title: "Front Desk & Reception", categorySlug: "feedback" },
  { slug: "retail-grocery", title: "Retail & Grocery", categorySlug: "reviews" },
  { slug: "hotels-hospitality", title: "Hotels & Hospitality", categorySlug: "reviews" },
  { slug: "healthcare-dental", title: "Healthcare & Dental", categorySlug: "feedback" },
  { slug: "salons-service-businesses", title: "Salons & Service Businesses", categorySlug: "appointments" },
  { slug: "events-pop-ups", title: "Events & Pop-Ups", categorySlug: "social-media" }
];
