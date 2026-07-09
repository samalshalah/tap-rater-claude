import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { saveHomepageContent, type CmsDbClient } from "@/lib/cms-repository";
import { homepageContentSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = homepageContentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Homepage content is invalid." }, { status: 400 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });
  }

  try {
    await saveHomepageContent(getSupabaseAdmin() as CmsDbClient, parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Homepage content could not be saved." }, { status: 500 });
  }
}
