import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { getAdminProductBySlug } from "@/lib/admin-products";
import { saveProductContent, type CmsDbClient } from "@/lib/cms-repository";

const inventoryUpdateSchema = z.object({
  slug: z.string().trim().min(2),
  stockStatus: z.enum(["instock", "outofstock"])
});

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = inventoryUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Inventory update is invalid." }, { status: 400 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Database persistence is not configured yet. Stock status cannot be saved." }, { status: 503 });
  }

  const product = await getAdminProductBySlug(parsed.data.slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  try {
    await saveProductContent(getSupabaseAdmin() as CmsDbClient, {
      ...product,
      salePriceCents: product.salePriceCents ?? undefined,
      seoTitle: product.seoTitle ?? undefined,
      seoDescription: product.seoDescription ?? undefined,
      standCategorySlug: product.standCategorySlug,
      destinationType: product.destinationType,
      platformSlug: product.platformSlug,
      tags: product.tags ?? [],
      supportsLogo: product.supportsLogo ?? true,
      supportsBusinessName: product.supportsBusinessName ?? true,
      supportsCustomHeadline: product.supportsCustomHeadline ?? false,
      supportsMultipleLinks: product.supportsMultipleLinks ?? false,
      stockStatus: parsed.data.stockStatus
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Stock status could not be saved." }, { status: 500 });
  }
}
