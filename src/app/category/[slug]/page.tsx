import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { catalogCategories } from "@/data/migrated-products";
import { getStorefrontProductsByCategory } from "@/lib/product-repository";
import { getCategoryBySlug } from "@/lib/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found"
    };
  }

  return {
    title: category.seoTitle.replace(" | Tap Rater", ""),
    description: category.seoDescription,
    alternates: {
      canonical: `/category/${category.slug}`
    },
    openGraph: {
      title: category.seoTitle,
      description: category.seoDescription,
      url: `/category/${category.slug}`
    }
  };
}

export function generateStaticParams() {
  return catalogCategories.flatMap((category) => [category.slug, ...(category.aliases ?? [])].map((slug) => ({ slug })));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getStorefrontProductsByCategory(category.slug);

  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <Link href="/shop" className="text-[13px] font-medium text-brand hover:text-brand-dark">
            &lsaquo; Shop all products
          </Link>
          <h1 className="mt-6 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">{category.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-6 text-muted">{category.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted">Best for</p>
              <p className="mt-2 text-[14px] leading-5 text-ink">{category.buyerIntent}</p>
            </div>
            <div className="rounded-2xl bg-surface p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted">Service expectation</p>
              <p className="mt-2 text-[14px] leading-5 text-ink">{category.seoCopy}</p>
            </div>
          </div>
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
