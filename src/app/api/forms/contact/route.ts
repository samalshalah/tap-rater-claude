import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { saveContactRequest } from "@/lib/request-repository";
import { sendRequestNotification } from "@/lib/request-notifications";
import { contactFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = contactFormSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json({ error: "Request storage is not configured yet." }, { status: 503 });
  }

  try {
    await saveContactRequest(getSupabaseAdmin(), parsed.data);
    await sendRequestNotification({
      subject: "New Tap Rater contact request",
      rows: {
        Name: parsed.data.name,
        Email: parsed.data.email,
        Message: parsed.data.message
      }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Request could not be saved." }, { status: 500 });
  }
}
