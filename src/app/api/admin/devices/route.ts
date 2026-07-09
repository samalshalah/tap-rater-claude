import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { createAdminDevice, getAdminDevices, isAdminDeviceStoreConfigured } from "@/lib/admin-devices";
import { adminDeviceCreateSchema } from "@/lib/validators";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!isAdminDeviceStoreConfigured()) {
    return NextResponse.json({ devices: [], configured: false });
  }

  return NextResponse.json({ devices: await getAdminDevices(), configured: true });
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const parsed = adminDeviceCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Device details are invalid." }, { status: 400 });
  }

  if (!isAdminDeviceStoreConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured yet. Devices cannot be saved." }, { status: 503 });
  }

  try {
    return NextResponse.json({ device: await createAdminDevice(parsed.data) });
  } catch {
    return NextResponse.json({ error: "Device could not be created." }, { status: 500 });
  }
}
