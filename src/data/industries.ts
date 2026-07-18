export type Industry = {
  slug: string;
  title: string;
  subhead: string;
  image: string;
  useCaseSlug: string;
};

export const industries: Industry[] = [
  {
    slug: "restaurants-cafes",
    title: "Restaurants & Cafés",
    subhead: "Share menus, promote specials, and turn counter visits into repeat business.",
    image: "/uploads/industries/restaurants-cafes.png",
    useCaseSlug: "restaurants-cafes"
  },
  {
    slug: "auto-dealer-repair",
    title: "Auto Dealer & Repair",
    subhead: "Guide shoppers, book service appointments, and improve the dealership and repair shop experience.",
    image: "/uploads/industries/car-dealerships.png",
    useCaseSlug: "auto-dealer-repair"
  },
  {
    slug: "front-desk-reception",
    title: "Front Desk & Reception",
    subhead: "Welcome guests, share information, and capture feedback with ease.",
    image: "/uploads/industries/front-desk-reception.png",
    useCaseSlug: "front-desk-reception"
  },
  {
    slug: "retail-grocery",
    title: "Retail & Grocery",
    subhead: "Create smoother checkouts, stronger reviews, and better in-store engagement.",
    image: "/uploads/industries/retail-grocery.png",
    useCaseSlug: "retail-grocery"
  },
  {
    slug: "hotels-hospitality",
    title: "Hotels & Hospitality",
    subhead: "Welcome guests, share information, and capture feedback with ease.",
    image: "/uploads/industries/hotels-hospitality.jpg",
    useCaseSlug: "hotels-hospitality"
  },
  {
    slug: "healthcare-dental",
    title: "Healthcare & Dental",
    subhead: "Capture patient feedback, encourage reviews, and simplify booking.",
    image: "/uploads/industries/healthcare-dental.jpg",
    useCaseSlug: "healthcare-dental"
  },
  {
    slug: "salons-spas-wellness",
    title: "Salons, Spas & Wellness",
    subhead: "Fill the chair, grow the following, and make rebooking effortless.",
    image: "/uploads/industries/salons-spas-wellness.jpg",
    useCaseSlug: "salons-spas-wellness"
  },
  {
    slug: "events-popups",
    title: "Events & Pop-Ups",
    subhead: "Grow your following and collect feedback in a temporary space.",
    image: "/uploads/industries/events-popups.jpg",
    useCaseSlug: "events-popups"
  }
];
