import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";

export type MediaAsset = {
  id: string;
  title: string;
  src: string;
  alt: string;
  assetType: string;
  createdAt: string | null;
};

type MediaDbClient = {
  from: (table: string) => {
    select: (columns?: string) => PromiseLike<{ data: unknown[] | null; error: null | { message: string } }>;
    insert: (values: Record<string, unknown>) => PromiseLike<{ error: null | { message: string } }>;
  };
};

function normalizeMediaRow(row: unknown): MediaAsset | null {
  if (!row || typeof row !== "object") return null;
  const record = row as Record<string, unknown>;

  const title = typeof record.title === "string" ? record.title : null;
  const src = typeof record.src === "string" ? record.src : null;
  if (!title || !src) return null;

  return {
    id: typeof record.id === "string" ? record.id : src,
    title,
    src,
    alt: typeof record.alt === "string" ? record.alt : "",
    assetType: typeof record.asset_type === "string" ? record.asset_type : "image",
    createdAt: typeof record.created_at === "string" ? record.created_at : null
  };
}

export async function getAdminMediaAssets(): Promise<{ configured: boolean; assets: MediaAsset[] }> {
  if (!hasSupabaseAdminConfig()) {
    return { configured: false, assets: [] };
  }

  try {
    const { data, error } = await (getSupabaseAdmin() as MediaDbClient).from("media_assets").select("*");

    if (error || !Array.isArray(data)) {
      return { configured: true, assets: [] };
    }

    const assets = data.flatMap((row) => {
      const normalized = normalizeMediaRow(row);
      return normalized ? [normalized] : [];
    });
    assets.sort((a, b) => (a.createdAt && b.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0));

    return { configured: true, assets };
  } catch {
    return { configured: true, assets: [] };
  }
}

export async function registerMediaAsset(input: { title: string; src: string; alt: string; assetType: string }): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabaseAdminConfig()) {
    return { ok: false, error: "Database persistence is not configured yet." };
  }

  try {
    const { error } = await (getSupabaseAdmin() as MediaDbClient).from("media_assets").insert({
      title: input.title,
      src: input.src,
      alt: input.alt,
      asset_type: input.assetType
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Media asset could not be saved." };
  }
}
