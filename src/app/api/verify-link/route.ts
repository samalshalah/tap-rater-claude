import { NextResponse } from "next/server";
import { verifyDestinationLink } from "@/lib/link-verification";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_url", message: "Missing link." }, { status: 400 });
  }

  const url = typeof (body as { url?: unknown })?.url === "string" ? (body as { url: string }).url.trim() : "";

  if (!url) {
    return NextResponse.json({ ok: false, reason: "invalid_url", message: "Paste a link first." }, { status: 400 });
  }

  const result = await verifyDestinationLink(url);
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
