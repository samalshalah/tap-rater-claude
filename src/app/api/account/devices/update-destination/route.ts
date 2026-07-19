import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCustomerApi } from "@/lib/customer-auth";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { updateOwnedDeviceDestination, type CustomerPortalDbClient } from "@/lib/customer-portal";
import { isSafeExternalUrl } from "@/lib/link-verification";

const updateSchema = z.object({
  deviceId: z.string().trim().min(1),
  destinationUrl: z.string().trim().url().max(2048),
  destinationType: z.string().trim().min(1).max(40)
});

export async function POST(request: Request) {
  const { response, session } = await requireCustomerApi();
  if (response || !session) return response ?? NextResponse.json({ error: "Customer authentication required." }, { status: 401 });

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Destination link is invalid." }, { status: 400 });
  }

  if (!isSafeExternalUrl(parsed.data.destinationUrl)) {
    return NextResponse.json({ error: "That link isn't allowed. Use a public http:// or https:// web address." }, { status: 422 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Database persistence is not configured yet." }, { status: 503 });
  }

  const result = await updateOwnedDeviceDestination(getSupabaseAdmin() as CustomerPortalDbClient, {
    deviceId: parsed.data.deviceId,
    customerEmail: session.email,
    destinationUrl: parsed.data.destinationUrl,
    destinationType: parsed.data.destinationType
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Could not update destination." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
