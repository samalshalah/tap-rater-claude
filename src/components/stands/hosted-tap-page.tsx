import Link from "next/link";
import { ArrowUpRight, CirclePause, Link2Off } from "lucide-react";
import type { CustomerStand, StandDestinationLink } from "@/lib/stand-domain";

export function HostedTapPage({ stand, links = stand.destinationLinks }: { stand: CustomerStand; links?: StandDestinationLink[] }) {
  const config = stand.hostedPageConfig;
  const businessName = stand.business?.businessName ?? stand.productName;
  const pageTitle = config?.pageTitle || businessName;
  const pageSubtitle = config?.pageSubtitle;
  const logoUrl = config?.businessLogoUrl || stand.business?.logoUrl;
  const primaryColor = /^#[0-9a-f]{6}$/i.test(config?.primaryColor ?? "") ? config?.primaryColor : "#0a6c64";

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-8 sm:py-12">
      <section className="mx-auto max-w-lg">
        <header className="text-center">
          {logoUrl ? (
            <img src={logoUrl} alt={`${businessName} logo`} className="mx-auto h-20 w-20 rounded-2xl bg-white object-contain p-2 shadow-sm" />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-2xl font-semibold text-ink shadow-sm" aria-hidden="true">
              {businessName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{pageTitle}</h1>
          {pageSubtitle ? <p className="mx-auto mt-3 max-w-md text-base leading-7 text-muted">{pageSubtitle}</p> : null}
        </header>

        <div className="mt-8 grid gap-3">
          {links.map((link, index) => (
            <a
              key={`${link.url}-${index}`}
              href={link.url}
              className="flex min-h-14 items-center justify-between gap-4 rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-sm transition hover:brightness-90"
              style={{ backgroundColor: primaryColor }}
            >
              <span>{link.label}</span>
              <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            </a>
          ))}
        </div>

        <footer className="mt-10 text-center">
          <Link href="https://taprater.com" className="text-xs font-medium text-muted hover:text-ink">
            Powered by Tap Rater
          </Link>
        </footer>
      </section>
    </main>
  );
}

export function StandNotConfigured({ businessName }: { businessName?: string }) {
  return (
    <StandMessage
      icon={<Link2Off className="h-6 w-6" aria-hidden="true" />}
      eyebrow={businessName ?? "Tap Rater"}
      title="This stand is not configured yet"
      body="The destination is still being prepared. Please check again soon."
    />
  );
}

export function StandUnavailable() {
  return (
    <StandMessage
      icon={<CirclePause className="h-6 w-6" aria-hidden="true" />}
      eyebrow="Tap Rater"
      title="This stand is unavailable"
      body="This destination is temporarily unavailable. Please contact the business directly."
    />
  );
}

export function StandMessage({ icon, eyebrow, title, body }: { icon: React.ReactNode; eyebrow: string; title: string; body: string }) {
  return (
    <main className="flex min-h-screen items-center bg-[#f5f5f7] px-4 py-12">
      <section className="mx-auto w-full max-w-lg rounded-3xl bg-white p-7 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f7] text-ink">{icon}</div>
        <p className="mt-5 text-xs font-semibold uppercase text-brand">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink">{title}</h1>
        <p className="mt-4 leading-7 text-muted">{body}</p>
        <p className="mt-8 text-xs font-medium text-muted">Powered by Tap Rater</p>
      </section>
    </main>
  );
}

export function RedirectStandPreview({ stand, destinationUrl }: { stand: CustomerStand; destinationUrl: string }) {
  return (
    <main className="flex min-h-[70vh] items-center bg-[#f5f5f7] px-4 py-12">
      <section className="mx-auto w-full max-w-lg rounded-3xl bg-white p-7 text-center shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase text-brand">Redirect stand preview</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink">{stand.business?.businessName ?? stand.productName}</h1>
        <p className="mt-4 leading-7 text-muted">Visitors are sent directly to this destination when they tap or scan the stand.</p>
        <a href={destinationUrl} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
          Open destination
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-5 break-all text-xs text-muted">{destinationUrl}</p>
      </section>
    </main>
  );
}
