import Link from "next/link";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDeviceRedirectAction, hashIpAddress, type PlatformDevice } from "@/lib/device-redirect";
import { getDeviceByCode, isDeviceRepositoryConfigured, logTapEvent } from "@/lib/device-repository";

type DeviceRedirectPageProps = {
  params: Promise<{ deviceCode: string }>;
};

export default async function DeviceRedirectPage({ params }: DeviceRedirectPageProps) {
  const { deviceCode } = await params;
  const device = await getDeviceByCode(deviceCode);
  const action = getDeviceRedirectAction(device);
  const context = await getRequestContext();

  if (device && (action.type === "redirect" || action.type === "landing_page")) {
    await logTapEvent({
      device,
      eventType: action.type === "redirect" ? "redirect" : "landing_page_view",
      ...context
    });
  }

  if (action.type === "redirect") {
    redirect(action.destinationUrl);
  }

  if (action.type === "activation") {
    return <DeviceNeedsActivation deviceCode={action.deviceCode} />;
  }

  if (action.type === "landing_page") {
    return <PremiumLandingPlaceholder device={device} landingPageId={action.landingPageId} />;
  }

  if (action.type === "unavailable") {
    return <DeviceUnavailable reason={action.reason} />;
  }

  return <DeviceNotFound deviceCode={deviceCode} isConfigured={isDeviceRepositoryConfigured()} />;
}

async function getRequestContext() {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headerStore.get("x-real-ip") ?? undefined;

  return {
    ipHash: hashIpAddress(forwardedFor ?? realIp),
    userAgent: headerStore.get("user-agent") ?? undefined,
    referrer: headerStore.get("referer") ?? headerStore.get("referrer") ?? undefined
  };
}

function DeviceShell({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children?: ReactNode }) {
  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
      <section className="mx-auto max-w-2xl rounded-md border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-black uppercase text-brand">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black text-ink">{title}</h1>
        <p className="mt-4 leading-7 text-muted">{body}</p>
        {children ? <div className="mt-7">{children}</div> : null}
      </section>
    </main>
  );
}

function DeviceNotFound({ deviceCode, isConfigured }: { deviceCode: string; isConfigured: boolean }) {
  return (
    <DeviceShell
      eyebrow="Device lookup"
      title="Device not found"
      body={
        isConfigured
          ? `We could not find a Tap Rater device for ${deviceCode}. Check the code or contact Tap Rater support.`
          : `Device lookup is not connected in this environment. Demo code TR-DEMO-GOOGLE is available for local testing.`
      }
    >
      <Link href="/contact-us" className="inline-block rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
        Contact support
      </Link>
    </DeviceShell>
  );
}

function DeviceNeedsActivation({ deviceCode }: { deviceCode: string }) {
  return (
    <DeviceShell
      eyebrow="Activation required"
      title="Activate this Tap Rater"
      body="This NFC or QR device is ready to be connected to a business destination. Use the private activation code included with the product."
    >
      <Link href={`/activate?device=${encodeURIComponent(deviceCode)}`} className="inline-block rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
        Activate device
      </Link>
    </DeviceShell>
  );
}

function DeviceUnavailable({ reason }: { reason: string }) {
  return (
    <DeviceShell
      eyebrow="Device unavailable"
      title="This Tap Rater is not available"
      body={`This device cannot be opened right now. Status: ${reason.replaceAll("_", " ")}.`}
    >
      <Link href="/contact-us" className="inline-block rounded-md border border-line px-5 py-3 text-sm font-bold text-ink">
        Get help
      </Link>
    </DeviceShell>
  );
}

function PremiumLandingPlaceholder({ device, landingPageId }: { device: PlatformDevice | null; landingPageId?: string }) {
  return (
    <DeviceShell
      eyebrow="Hosted page"
      title={device?.label ?? "Tap Rater hosted page"}
      body="This premium Tap Rater device is connected to a hosted landing page. The landing page renderer will be added in the next platform phase."
    >
      <p className="rounded-md bg-gray-50 p-4 text-sm text-muted">Landing page ID: {landingPageId ?? "not assigned yet"}</p>
    </DeviceShell>
  );
}
