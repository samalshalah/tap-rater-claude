import Image from "next/image";
import type { MigratedProduct } from "@/data/migrated-products";

export function ProductGallery({ product }: { product: MigratedProduct }) {
  const image = product.images[0];

  return (
    <div className="relative aspect-square rounded-md border border-line bg-gray-50">
      <Image src={image.src} alt={image.alt} fill priority className="object-contain p-8" />
    </div>
  );
}
