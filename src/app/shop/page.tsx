import { ProductCard } from "@/components/product/product-card";
import { getActiveProducts } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop NFC Review Stands and Google Review Plates",
  description:
    "Shop Tap Rater NFC review stands, Google review plates, Facebook review stands, Yelp review stands, feedback stands, and business bundles.",
  alternates: {
    canonical: "/shop"
  }
};

export default function ShopPage() {
  const products = getActiveProducts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink">Shop NFC Review Stands and Google Review Plates</h1>
      <p className="mt-3 max-w-3xl text-muted">
        Buy NFC review stands, Google review plates, business bundles, and customer feedback stands that help customers tap their phone to open your review link.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
