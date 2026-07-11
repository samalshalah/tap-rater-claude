import Image from "next/image";
import { ProductCard } from "@/components/product/product-card";
import { getStorefrontProducts } from "@/lib/product-repository";
import { getCatalogCategories } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop NFC Review, Social, Appointment, Menu, and Feedback Products",
  description:
    "Shop Tap Rater Phase 1 tabletop NFC stands for reviews, social, booking, menu, and experience flows.",
  alternates: {
    canonical: "/shop"
  }
};

const industries = [
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

export default async function ShopPage() {
  const products = await getStorefrontProducts();
  const categories = getCatalogCategories();

  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <div className="inline-flex rounded-full bg-surface p-1 text-[13px] font-medium">
            <span className="rounded-full bg-white px-4 py-1.5 text-ink shadow-sm">Shop by use</span>
            <Link href="/shop/by-stand" className="rounded-full px-4 py-1.5 text-muted transition hover:text-ink">
              Shop by stand
            </Link>
          </div>
          <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.08em] text-muted">Tap Rater shop</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">
            Shop by what you want customers to open.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-6 text-muted">
            Tabletop NFC stands for reviews, social, booking, menu, and feedback. Every product supports free basic activation.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="text-[22px] font-semibold tracking-tightest text-ink">Shop by category</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-2xl bg-white p-6 transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <p className="text-[15px] font-medium text-ink">{category.title}</p>
                <p className="mt-2 text-[13px] leading-5 text-muted">{category.buyerIntent}</p>
                <p className="mt-4 text-[13px] font-medium text-brand">
                  {products.filter((product) => product.categorySlug === category.slug).length} products &rsaquo;
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="text-[22px] font-semibold tracking-tightest text-ink">Find your industry</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/category/${industry.categorySlug}`}
                className="group overflow-hidden rounded-2xl bg-surface transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              >
                <div className="p-6">
                  <h3 className="text-[20px] font-semibold tracking-tightest text-ink">{industry.title}</h3>
                  <p className="mt-2 text-[14px] leading-5 text-muted">{industry.subhead}</p>
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={industry.image}
                    alt={industry.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[22px] font-semibold tracking-tightest text-ink">All products</h2>
            <p className="text-[13px] text-muted">{products.length} products available</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
