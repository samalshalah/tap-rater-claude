import { NextResponse } from "next/server";
import { z } from "zod";
import { createCustomerSessionValue, customerCookieName } from "@/lib/customer-auth";
import { verifyCustomerPassword } from "@/lib/customer-password-db";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const isValid = await verifyCustomerPassword(parsed.data.email, parsed.data.password);
  if (!isValid) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(customerCookieName, createCustomerSessionValue(parsed.data.email), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60
  });

  return response;
}
