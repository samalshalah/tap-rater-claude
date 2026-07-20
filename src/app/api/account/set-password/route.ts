import { NextResponse } from "next/server";
import { z } from "zod";
import { parsePasswordSetupToken } from "@/lib/customer-auth";
import { setCustomerPassword } from "@/lib/customer-password-db";
import { isPasswordStrongEnough } from "@/lib/customer-password";

const setPasswordSchema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = setPasswordSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing token or password." }, { status: 400 });
  }

  const session = parsePasswordSetupToken(parsed.data.token);
  if (!session) {
    return NextResponse.json({ error: "This link has expired or is invalid. Ask for a new one." }, { status: 401 });
  }

  if (!isPasswordStrongEnough(parsed.data.password)) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const result = await setCustomerPassword(session.email, parsed.data.password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Could not set password." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
