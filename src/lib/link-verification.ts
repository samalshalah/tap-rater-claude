const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "metadata.google.internal"]);

function isPrivateOrLoopbackIp(hostname: string): boolean {
  // IPv4 literal checks
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 127) return true; // loopback
    if (a === 10) return true; // private
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 168) return true; // private
    if (a === 0) return true;
    return false;
  }

  // IPv6 loopback / unique-local / link-local
  const normalized = hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
  if (normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("fe80")) return true;

  return false;
}

export type LinkVerificationResult =
  | { ok: true; status: number; note?: string }
  | { ok: false; reason: "invalid_url" | "blocked_host" | "not_found" | "unreachable"; message: string };

export function isSafeExternalUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    const hostname = url.hostname.toLowerCase();
    if (BLOCKED_HOSTNAMES.has(hostname)) {
      return false;
    }
    if (isPrivateOrLoopbackIp(hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function verifyDestinationLink(rawUrl: string, fetchImpl: typeof fetch = fetch): Promise<LinkVerificationResult> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "invalid_url", message: "That doesn't look like a valid web link." };
  }

  if (!isSafeExternalUrl(rawUrl)) {
    return { ok: false, reason: "blocked_host", message: "That link isn't allowed. Use a public http:// or https:// web address." };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    let response = await fetchImpl(url.toString(), {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "TapRaterLinkCheck/1.0" }
    });

    // Some sites reject HEAD; retry with GET before giving up.
    if (response.status === 405 || response.status === 501) {
      response = await fetchImpl(url.toString(), {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "TapRaterLinkCheck/1.0" }
      });
    }

    if (response.status === 404 || response.status === 410) {
      return { ok: false, reason: "not_found", message: "That page couldn't be found. Double-check the link and try again." };
    }

    if (!response.ok) {
      return {
        ok: true,
        status: response.status,
        note: "The site responded but some pages block automated checks — worth opening the link yourself to confirm it's the right one."
      };
    }

    return { ok: true, status: response.status };
  } catch {
    return { ok: false, reason: "unreachable", message: "We couldn't reach that link. Check the URL and try again." };
  } finally {
    clearTimeout(timeout);
  }
}
