import Image from "next/image";
import type { MigratedProduct } from "@/data/migrated-products";

export function ProductGallery({ product }: { product: MigratedProduct }) {
  const image = product.images[0];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
        <Image src={image.src} alt={image.alt} fill priority unoptimized className="object-contain p-10" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted">
        <div className="rounded-full bg-surface px-3 py-2.5">NFC enabled</div>
        <div className="rounded-full bg-surface px-3 py-2.5">Tap ready</div>
        <div className="rounded-full bg-surface px-3 py-2.5">Business use</div>
      </div>
    </div>
  );
}
