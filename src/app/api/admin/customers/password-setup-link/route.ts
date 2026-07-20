import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { createPasswordSetupToken } from "@/lib/customer-auth";

const requestSchema = z.object({ email: z.string().trim().email() });

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // This only ever generates a link -- it never sees, sets, or stores an
  // actual password value. The customer types their own password themselves
  // when they open this link.
  const token = createPasswordSetupToken(parsed.data.email);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taprater.com";
  const url = `${siteUrl.replace(/\/$/, "")}/account/set-password?token=${encodeURIComponent(token)}`;

  return NextResponse.json({ ok: true, url });
}
