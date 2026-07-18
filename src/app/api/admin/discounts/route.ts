import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { saveDiscountCode } from "@/lib/discounts";
import { z } from "zod";

const discountInputSchema = z.object({
  code: z.string().trim().min(2).max(40),
  discountType: z.enum(["percent", "fixed_cents"]),
  value: z.number().int().positive(),
  isActive: z.boolean(),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().optional(),
  notes: z.string().max(500).optional()
});

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = discountInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Discount code data is invalid." }, { status: 400 });
  }

  const result = await saveDiscountCode(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Discount code could not be saved." }, { status: result.error?.includes("not configured") ? 503 : 500 });
  }

  return NextResponse.json({ ok: true });
}
