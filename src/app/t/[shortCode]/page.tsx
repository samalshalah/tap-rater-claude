import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { HostedTapPage, StandNotConfigured, StandUnavailable } from "@/components/stands/hosted-tap-page";
import { getPublicCustomerStand, logCustomerStandTap } from "@/lib/customer-stands";
import { resolvePublicStand } from "@/lib/stand-domain";

export const dynamic = "force-dynamic";

type PublicStandPageProps = {
  params: Promise<{ shortCode: string }>;
};

export default async function PublicStandPage({ params }: PublicStandPageProps) {
  const { shortCode } = await params;
  const stand = await getPublicCustomerStand(shortCode);
  const action = resolvePublicStand(stand);

  if (action.type === "not_found") notFound();
  if (!stand) notFound();

  if (action.type === "unavailable") {
    return <StandUnavailable />;
  }

  if (action.type === "not_configured") {
    return <StandNotConfigured businessName={stand.business?.businessName} />;
  }

  const requestHeaders = await headers();
  const ipAddress =
    requestHeaders.get("cf-connecting-ip") ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? requestHeaders.get("x-real-ip") ?? undefined;
  await logCustomerStandTap(stand, {
    ipAddress,
    userAgent: requestHeaders.get("user-agent") ?? undefined,
    referrer: requestHeaders.get("referer") ?? undefined,
    eventType: action.type === "redirect" ? "redirect" : "landing_page_view"
  });

  if (action.type === "redirect") {
    redirect(action.destinationUrl);
  }

  return <HostedTapPage stand={stand} links={action.links} />;
}
