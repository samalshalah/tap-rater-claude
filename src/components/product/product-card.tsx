import Image from "next/image";
import Link from "next/link";
import type { MigratedProduct } from "@/data/migrated-products";
import { formatPrice, getProductPriceCents } from "@/lib/products";

export function ProductCard({ product }: { product: MigratedProduct }) {
  const image = product.images[0];
  const formatLabel = product.format === "stand" ? "Stand" : product.format === "plate" ? "Plate" : product.format;
  const purchaseLabel = getPurchaseLabel(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl bg-surface p-6 transition hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-contain transition duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-5">
        <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted">{formatLabel}</p>
        <h2 className="mt-1 text-[15px] font-medium text-ink">{product.title}</h2>
        <p className="mt-2 text-[15px] text-muted">{purchaseLabel}</p>
      </div>
    </Link>
  );
}

function getPurchaseLabel(product: MigratedProduct) {
  if (product.checkoutMode === "request_quote") return "Request quote";
  if (product.checkoutMode === "contact_sales") return "Contact sales";
  if (product.checkoutMode === "subscription") return "Subscription setup";
  return formatPrice(getProductPriceCents(product));
}
