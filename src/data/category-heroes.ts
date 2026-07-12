export type CategoryHero = {
  src: string;
  alt: string;
};

export const categoryHeroes: Record<string, CategoryHero> = {
  reviews: {
    src: "/uploads/heroes/reviews-category.jpg",
    alt: "Customer at a retail checkout counter, the moment a review request lands best"
  },
  "social-media": {
    src: "/uploads/heroes/social-media-category.jpg",
    alt: "Cafe employee welcoming a customer at the counter"
  },
  appointments: {
    src: "/uploads/heroes/appointments-category.jpg",
    alt: "Dealership manager handing over car keys to a happy customer after booking"
  },
  menu: {
    src: "/uploads/heroes/menu-category.jpg",
    alt: "Burger and fries plated at a restaurant counter"
  },
  feedback: {
    src: "/uploads/heroes/feedback-category.jpg",
    alt: "Clients arriving and checking in at an office front desk"
  },
  "business-bundles": {
    src: "/uploads/heroes/business-bundles-category.jpg",
    alt: "A team collaborating around a table, planning a multi-location setup"
  }
};
