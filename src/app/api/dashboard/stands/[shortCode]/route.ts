import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireCustomerApi } from "@/lib/customer-auth";
import { saveOwnedStandSetup } from "@/lib/customer-stands";
import { dashboardStandSetupSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ shortCode: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { response, session } = await requireCustomerApi();
  if (response || !session) return response ?? NextResponse.json({ error: "Customer authentication required." }, { status: 401 });

  const { shortCode } = await context.params;
  const parsed = dashboardStandSetupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the stand links and try again." }, { status: 400 });

  const result = await saveOwnedStandSetup(session.email, shortCode, parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error.includes("not found") ? 404 : 422 });

  revalidatePath(`/dashboard/stands/${shortCode}`);
  revalidatePath(`/dashboard/stands/${shortCode}/preview`);
  revalidatePath(`/t/${shortCode}`);
  return NextResponse.json({ ok: true, status: result.status, printStatus: result.printStatus });
}
