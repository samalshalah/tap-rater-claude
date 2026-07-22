import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isCustomerStandStoreConfigured, updateAdminCustomerStand } from "@/lib/customer-stands";
import { adminCustomerStandUpdateSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const parsed = adminCustomerStandUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!id || !parsed.success) return NextResponse.json({ error: "Customer Stand update is invalid." }, { status: 400 });
  if (!isCustomerStandStoreConfigured()) return NextResponse.json({ error: "Database persistence is not configured." }, { status: 503 });

  try {
    await updateAdminCustomerStand(id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Customer Stand could not be updated." }, { status: 422 });
  }
}
