import Image from "next/image";
import { AdminShell } from "@/components/admin/admin-shell";
import { MediaAssetForm } from "@/components/admin/media-asset-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMediaAssets } from "@/lib/media-assets";

export default async function AdminMediaPage() {
  await requireAdmin();
  const { configured, assets } = await getAdminMediaAssets();

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Content</p>
        <div className="mt-3">
          <h1 className="text-4xl font-semibold text-ink">Media</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            A catalog of image and video assets in use across the site -- product photos, hero images, and more -- so they're
            easy to find and reuse.
          </p>
        </div>

        {!configured ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-ink">
            Database persistence is not configured yet. Media assets can't be saved until a database is connected.
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <MediaAssetForm />

          <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">{assets.length} registered assets</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset) => (
                <div key={asset.id} className="rounded-2xl border border-line p-3">
                  {asset.assetType === "image" ? (
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface">
                      <Image src={asset.src} alt={asset.alt} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-surface text-xs text-muted">
                      Video asset
                    </div>
                  )}
                  <p className="mt-2 text-xs font-bold text-ink">{asset.title}</p>
                  <p className="truncate text-xs text-muted">{asset.src}</p>
                </div>
              ))}
              {assets.length === 0 ? <p className="text-sm text-muted">No media assets registered yet.</p> : null}
            </div>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
