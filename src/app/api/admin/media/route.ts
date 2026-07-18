import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { registerMediaAsset } from "@/lib/media-assets";

const mediaInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  src: z.string().trim().min(1).max(2048),
  alt: z.string().trim().max(300).default(""),
  assetType: z.enum(["image", "video"]).default("image")
});

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = mediaInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Media asset data is invalid." }, { status: 400 });
  }

  const result = await registerMediaAsset(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Media asset could not be saved." }, { status: result.error?.includes("not configured") ? 503 : 500 });
  }

  return NextResponse.json({ ok: true });
}
