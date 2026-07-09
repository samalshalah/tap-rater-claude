import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isAdminDeviceStoreConfigured, updateAdminDevice } from "@/lib/admin-devices";
import { adminDeviceUpdateSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const parsed = adminDeviceUpdateSchema.safeParse(await request.json().catch(() => null));

  if (!id || !parsed.success) {
    return NextResponse.json({ error: "Device update is invalid." }, { status: 400 });
  }

  if (!isAdminDeviceStoreConfigured()) {
    return NextResponse.json({ error: "Database persistence is not configured yet. Devices cannot be saved." }, { status: 503 });
  }

  try {
    await updateAdminDevice(id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Device could not be updated." }, { status: 500 });
  }
}
