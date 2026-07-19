import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { createCustomer, type CustomerPortalDbClient } from "@/lib/customer-portal";

const createCustomerSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional()
});

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = createCustomerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Database persistence is not configured yet." }, { status: 503 });
  }

  const result = await createCustomer(getSupabaseAdmin() as CustomerPortalDbClient, parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Could not create customer." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
