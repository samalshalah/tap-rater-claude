import { NextResponse } from "next/server";
import { requireCustomerApi } from "@/lib/customer-auth";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { sendRequestNotification } from "@/lib/request-notifications";
import { saveChangeLinkRequest } from "@/lib/request-repository";
import { accountChangeRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const { response, session } = await requireCustomerApi();
  if (response) return response;

  const parsed = accountChangeRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the destination change details." }, { status: 400 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Change requests are not configured yet." }, { status: 503 });
  }

  try {
    await saveChangeLinkRequest(getSupabaseAdmin(), {
      name: session.email,
      email: session.email,
      tapraterId: parsed.data.tapraterId,
      newReviewUrl: parsed.data.newReviewUrl,
      notes: parsed.data.notes
    });
    await sendRequestNotification({
      subject: "New Tap Rater account change request",
      rows: {
        Email: session.email,
        "Tap Rater ID": parsed.data.tapraterId,
        "New review URL": parsed.data.newReviewUrl,
        Notes: parsed.data.notes
      }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Change request could not be saved." }, { status: 500 });
  }
}
