export type Industry = {
  slug: string;
  title: string;
  subhead: string;
  image: string;
  categorySlug: string;
};

export const industries: Industry[] = [
  {
    slug: "restaurants-cafes",
    title: "Restaurants & Cafés",
    subhead: "Share menus, promote specials, and turn counter visits into repeat business.",
    image: "/uploads/industries/restaurants-cafes.png",
    categorySlug: "menu"
  },
  {
    slug: "car-dealerships",
    title: "Car Dealerships",
    subhead: "Guide shoppers, book appointments, and improve the showroom experience.",
    image: "/uploads/industries/car-dealerships.png",
    categorySlug: "appointments"
  },
  {
    slug: "front-desk-reception",
    title: "Front Desk & Reception",
    subhead: "Welcome guests, share information, and capture feedback with ease.",
    image: "/uploads/industries/front-desk-reception.png",
    categorySlug: "feedback"
  },
  {
    slug: "retail-grocery",
    title: "Retail & Grocery",
    subhead: "Create smoother checkouts, stronger reviews, and better in-store engagement.",
    image: "/uploads/industries/retail-grocery.png",
    categorySlug: "reviews"
  }
];
