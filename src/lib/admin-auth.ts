import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const adminCookieName = "taprater_admin";

function getAdminSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getAdminSecret()).update(value).digest("hex");
}

export function createAdminSessionValue(email: string) {
  const payload = `${email}:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(value: string | undefined) {
  if (!value) {
    return false;
  }

  const separatorIndex = value.lastIndexOf(".");
  if (separatorIndex === -1) {
    return false;
  }

  const payload = value.slice(0, separatorIndex);
  const signature = value.slice(separatorIndex + 1);
  const expected = sign(payload);

  if (signature.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(adminCookieName)?.value;

  if (!isValidAdminSession(session)) {
    redirect("/admin/login");
  }
}
