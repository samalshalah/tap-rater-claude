import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { useCases, getUseCaseBySlug } from "@/data/use-cases";
import { getActiveProducts } from "@/lib/products";
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

  const allProducts = getActiveProducts();
  const productBySlug = new Map(allProducts.map((product) => [product.slug, product]));

  // Order matters: recommendedProductSlugs controls exactly what appears and in
  // what order, per the spec's explicit-relationship rule.
  const recommended = useCase.recommendedProductSlugs.flatMap((productSlug) => {
    const product = productBySlug.get(productSlug);
    return product ? [product] : [];
  });
  const featured = useCase.featuredProductSlugs.flatMap((productSlug) => {
    const product = productBySlug.get(productSlug);
    return product ? [product] : [];
  });

  return (
    <>
      <section className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <Link href="/shop/use" className="text-[13px] font-medium text-brand hover:text-brand-dark">
            &lsaquo; Shop by use
          </Link>
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
