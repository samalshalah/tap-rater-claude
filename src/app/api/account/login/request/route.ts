import { NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { isDevelopmentAdminLoginAllowed, sendCustomerLoginEmail } from "@/lib/customer-login";
import { accountLoginRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = accountLoginRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  if (!hasSupabaseAdminConfig()) {
    if (isDevelopmentAdminLoginAllowed(email)) {
      const login = await sendCustomerLoginEmail(email);
      return NextResponse.json({
        ok: true,
        message: "Development login link generated for the admin email.",
        devMagicLink: login.loginUrl
      });
    }
    return NextResponse.json({ error: "Customer login is not configured yet." }, { status: 503 });
  }

  const { data: customer } = await getSupabaseAdmin().from("customers").select("id,email").eq("email", email).maybeSingle();

  if (!customer?.id) {
    return NextResponse.json({ ok: true, message: "If this email has an account, a login link will be sent." });
  }

  const login = await sendCustomerLoginEmail(email);
  if (!login.sent && login.loginUrl) {
    return NextResponse.json({
      ok: true,
      message: "Development login link generated for the admin email.",
      devMagicLink: login.loginUrl
    });
  }

  if (!login.sent) {
    return NextResponse.json({ error: "Email login is not configured yet. Please contact Tap Rater support." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, message: "If this email has an account, a login link will be sent." });
}
