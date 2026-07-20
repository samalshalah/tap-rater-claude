import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { standCategories, getStandCategoryBySlug } from "@/data/stand-categories";
import { getActiveProducts } from "@/lib/products";

type PageProps = {
  params: Promise<{ categorySlug: string }>;
};

export function generateStaticParams() {
  return standCategories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getStandCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: `/shop/stands/${category.slug}`
    }
  };
}

export default async function StandCategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = getStandCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const products = getActiveProducts().filter((product) => product.standCategorySlug === category.slug);

  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: "Shop by Stand", href: "/shop/stands" }, { label: category.name }]} />
          <h1 className="mt-6 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">{category.name}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-6 text-muted">{category.description}</p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[13px] text-muted">{products.length} products</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
