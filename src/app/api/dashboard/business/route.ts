import { NextResponse } from "next/server";
import { requireCustomerApi } from "@/lib/customer-auth";
import { saveOwnedBusinessProfile } from "@/lib/customer-stands";
import { dashboardBusinessSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const { response, session } = await requireCustomerApi();
  if (response || !session) return response ?? NextResponse.json({ error: "Customer authentication required." }, { status: 401 });

  const parsed = dashboardBusinessSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the business details and try again." }, { status: 400 });

  const result = await saveOwnedBusinessProfile(session.email, parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error.includes("not found") ? 404 : 422 });

  return NextResponse.json({ ok: true, business: result.business });
}
