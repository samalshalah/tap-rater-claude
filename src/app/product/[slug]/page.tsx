import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGallery } from "@/components/product/product-gallery";
import { formatPrice, getProductBySlug, getProductPriceCents } from "@/lib/products";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2">
      <ProductGallery product={product} />
      <div>
        <p className="text-sm font-semibold text-brand">{product.stockStatus === "instock" ? "In stock" : "Out of stock"}</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">{product.title}</h1>
        <p className="mt-4 text-2xl font-bold text-brand">{formatPrice(getProductPriceCents(product))}</p>
        <p className="mt-5 text-muted">{product.description}</p>
        {product.variants.length > 0 ? (
          <div className="mt-6">
            <p className="text-sm font-semibold text-ink">Available colors</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <span key={variant.id} className="rounded-md border border-line px-3 py-2 text-sm text-muted">
                  {variant.label}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <AddToCartButton productId={product.slug} disabled={product.stockStatus !== "instock"} />
      </div>
    </section>
  );
}
