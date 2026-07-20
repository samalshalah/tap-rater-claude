import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { useCases, getUseCaseBySlug } from "@/data/use-cases";
import { getStorefrontProducts } from "@/lib/product-repository";
import type { MigratedProduct } from "@/data/migrated-products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return useCases.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);

  if (!useCase) {
    return { title: "Use Case Not Found" };
  }

  return {
    title: useCase.name,
    description: useCase.description,
    alternates: {
      canonical: `/use/${useCase.slug}`
    }
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const useCase = getUseCaseBySlug(slug);

  if (!useCase) {
    notFound();
  }

  // Fetched dynamically (DB-aware, falls back to static catalog-v2 data when no
  // database is configured) so a tag edited via admin shows up here without
  // waiting for a redeploy -- previously this page only ever saw the static
  // catalog snapshot.
  const products = await getStorefrontProducts();
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  // The real relationship: a product belongs to this use case if its tags say
  // so. recommendedProductSlugs is only used here as a display-order hint --
  // it plays no part in *whether* a product shows up on this page.
  const orderIndex = new Map(useCase.recommendedProductSlugs.map((productSlug, index) => [productSlug, index]));
  const recommended = products
    .filter((product) => product.tags?.includes(useCase.slug))
    .sort((a, b) => (orderIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (orderIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER));

  // Featured stays a small, explicitly hand-picked highlight subset (not a
  // separate relationship mechanism -- every featured product is also reachable
  // through its tags in the list above).
  const featured = useCase.featuredProductSlugs.flatMap((productSlug) => {
    const product = productBySlug.get(productSlug);
    return product ? [product] : [];
  });

  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: "Shop by Use", href: "/shop/use" }, { label: useCase.name }]} />
          <h1 className="mt-6 max-w-2xl text-[34px] font-semibold tracking-tightest text-ink sm:text-[44px]">{useCase.name}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-6 text-muted">{useCase.description}</p>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="bg-surface py-16 sm:py-20">
          <div className="mx-auto max-w-[1100px] px-6">
            <h2 className="text-[22px] font-semibold tracking-tightest text-ink">Featured for {useCase.name}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product: MigratedProduct) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="text-[22px] font-semibold tracking-tightest text-ink">All recommended stands</h2>
          <p className="mt-2 text-[13px] text-muted">{recommended.length} products, in recommended order</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((product: MigratedProduct) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
