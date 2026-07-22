import { notFound } from "next/navigation";
import { CopyButton } from "@/components/dashboard/copy-button";
import { StandSetupEditor } from "@/components/dashboard/stand-setup-editor";
import { requireCustomer } from "@/lib/customer-auth";
import { getOwnedCustomerStand } from "@/lib/customer-stands";
import { getPermanentStandUrl } from "@/lib/stand-domain";

type StandPageProps = { params: Promise<{ shortCode: string }> };

export default async function DashboardStandPage({ params }: StandPageProps) {
  const session = await requireCustomer();
  const { shortCode } = await params;
  const stand = await getOwnedCustomerStand(session.email, shortCode);
  if (!stand) notFound();
  const permanentUrl = getPermanentStandUrl(stand.permanentUrlPath);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">{stand.business?.businessName ?? "Customer Stand"}</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">{stand.productName}</h1>
          <p className="mt-3 text-base text-muted">Status: {formatValue(stand.status)} · Print: {formatValue(stand.printStatus)}</p>
        </div>
        <CopyButton value={permanentUrl} label="Copy permanent URL" />
      </header>

      <div className="my-7 rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold text-muted">Permanent Stand URL</p>
        <p className="mt-1 break-all text-sm font-medium text-ink">{permanentUrl}</p>
      </div>

      <StandSetupEditor stand={stand} />
    </div>
  );
}

function formatValue(value: string) {
  return value.replaceAll("-", " ").replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase());
}
