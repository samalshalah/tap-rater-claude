import { notFound } from "next/navigation";
import { HostedTapPage, RedirectStandPreview, StandNotConfigured, StandUnavailable } from "@/components/stands/hosted-tap-page";
import { requireCustomer } from "@/lib/customer-auth";
import { getOwnedCustomerStand } from "@/lib/customer-stands";
import { resolvePublicStand } from "@/lib/stand-domain";

type PreviewPageProps = { params: Promise<{ shortCode: string }> };

export default async function DashboardStandPreviewPage({ params }: PreviewPageProps) {
  const session = await requireCustomer();
  const { shortCode } = await params;
  const stand = await getOwnedCustomerStand(session.email, shortCode);
  const action = resolvePublicStand(stand);
  if (!stand || action.type === "not_found") notFound();

  if (action.type === "unavailable") return <StandUnavailable />;
  if (action.type === "not_configured") return <StandNotConfigured businessName={stand.business?.businessName} />;
  if (action.type === "redirect") return <RedirectStandPreview stand={stand} destinationUrl={action.destinationUrl} />;
  return <HostedTapPage stand={stand} links={action.links} />;
}
