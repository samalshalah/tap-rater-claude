import { NextResponse } from "next/server";
import { createCustomerSessionValue, customerCookieName, parseCustomerLoginToken } from "@/lib/customer-auth";
import { accountLoginVerifySchema } from "@/lib/validators";

const customerSessionMaxAgeSeconds = 30 * 24 * 60 * 60;

export async function POST(request: Request) {
  const parsed = accountLoginVerifySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Login link is invalid." }, { status: 400 });
  }

  const token = parseCustomerLoginToken(parsed.data.token);
  if (!token) {
    return NextResponse.json({ error: "Login link is invalid or expired." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, redirectTo: "/account" });
  response.cookies.set(customerCookieName, createCustomerSessionValue(token.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: customerSessionMaxAgeSeconds
  });
  return response;
}
