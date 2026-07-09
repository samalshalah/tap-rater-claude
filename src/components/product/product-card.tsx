import Image from "next/image";
import Link from "next/link";
import type { MigratedProduct } from "@/data/migrated-products";
import { formatPrice, getCategoryBySlug, getProductPriceCents } from "@/lib/products";

export function ProductCard({ product }: { product: MigratedProduct }) {
  const image = product.images[0];
  const category = getCategoryBySlug(product.categorySlug);

  return (
    <Link href={`/product/${product.slug}`} className="group block rounded-md border border-line bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50">
        <Image src={image.src} alt={image.alt} fill className="object-contain p-4 transition group-hover:scale-105" />
      </div>
      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase">
          <span className={product.stockStatus === "instock" ? "text-brand" : "text-muted"}>
            {product.stockStatus === "instock" ? "In stock" : "Out of stock"}
          </span>
          {category ? <span className="text-muted">{category.title}</span> : null}
        </div>
        <h2 className="mt-1 text-base font-semibold text-ink">{product.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{product.shortDescription}</p>
        <p className="mt-2 text-lg font-bold text-brand">{formatPrice(getProductPriceCents(product))}</p>
      </div>
    </Link>
  );
}
