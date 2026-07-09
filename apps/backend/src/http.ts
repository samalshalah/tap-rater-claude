import { createHash, timingSafeEqual } from "node:crypto";

export function healthPayload() {
  return { ok: true, service: "tap-rater-backend" } as const;
}

export function isCronAuthorized(authorization: string | null | undefined, cronSecret: string | undefined) {
  if (!authorization || !cronSecret) {
    return false;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return false;
  }

  return timingSafeTokenEqual(token, cronSecret);
}

export function timingSafeTokenEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function jsonBody(payload: unknown) {
  return JSON.stringify(payload);
}
