"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { LandingPage, LandingPageButton } from "@/lib/landing-pages";

type LandingPageRendererProps = {
  page: LandingPage;
};

export function LandingPageRenderer({ page }: LandingPageRendererProps) {
  switch (page.templateType) {
    case "feedback_form":
      return <FeedbackFormTemplate page={page} />;
    case "referral_form":
      return <ReferralFormTemplate page={page} />;
    case "appointment_booking":
      return <AppointmentBookingTemplate page={page} />;
    case "social_links":
      return <SocialLinksTemplate page={page} />;
    case "digital_business_card":
      return <DigitalBusinessCardTemplate page={page} />;
    case "multi_platform_review":
    default:
      return <MultiPlatformReviewTemplate page={page} />;
  }
}

export function MultiPlatformReviewTemplate({ page }: LandingPageRendererProps) {
  return (
    <LandingShell page={page} eyebrow="Choose a platform">
      <ButtonList page={page} buttons={page.buttons} />
    </LandingShell>
  );
}

export function FeedbackFormTemplate({ page }: LandingPageRendererProps) {
  return (
    <LandingShell page={page} eyebrow="Private feedback">
      <LandingForm page={page} defaultFields={["name", "email", "message"]} />
      {page.buttons.length ? <ButtonList page={page} buttons={page.buttons} compact /> : null}
    </LandingShell>
  );
}

export function ReferralFormTemplate({ page }: LandingPageRendererProps) {
  return (
    <LandingShell page={page} eyebrow="Send a referral">
      <LandingForm page={page} defaultFields={["name", "email", "phone", "referralName", "referralEmail", "message"]} />
    </LandingShell>
  );
}

export function AppointmentBookingTemplate({ page }: LandingPageRendererProps) {
  return (
    <LandingShell page={page} eyebrow="Book an appointment">
      <ButtonList page={page} buttons={page.buttons} />
    </LandingShell>
  );
}

export function SocialLinksTemplate({ page }: LandingPageRendererProps) {
  return (
    <LandingShell page={page} eyebrow="Connect with us">
      <ButtonList page={page} buttons={page.buttons} />
    </LandingShell>
  );
}

export function DigitalBusinessCardTemplate({ page }: LandingPageRendererProps) {
  return (
    <LandingShell page={page} eyebrow="Digital business card">
      <ButtonList page={page} buttons={page.buttons} />
      <div className="mt-6 rounded-2xl border border-line bg-white p-4 text-sm leading-6 text-muted">
        Save this page or share it with someone who needs our contact details.
      </div>
    </LandingShell>
  );
}

function LandingShell({ page, eyebrow, children }: LandingPageRendererProps & { eyebrow: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-soft px-4 py-10">
      <section className="mx-auto max-w-xl">
        <div className="rounded-lg border border-line bg-white p-6 text-center shadow-sm md:p-8">
          {page.logoUrl ? <img src={page.logoUrl} alt="" className="mx-auto mb-5 h-16 w-16 rounded-xl object-contain" /> : null}
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
          <h1 className="mt-3 text-[28px] font-semibold tracking-tightest leading-tight text-ink md:text-4xl">{page.headline}</h1>
          {page.description ? <p className="mt-4 leading-7 text-muted">{page.description}</p> : null}
        </div>
        <div className="mt-5">{children}</div>
        <p className="mt-6 text-center text-xs font-semibold text-muted">Powered by Tap Rater</p>
      </section>
    </main>
  );
}

function ButtonList({ page, buttons, compact = false }: { page: LandingPage; buttons: LandingPageButton[]; compact?: boolean }) {
  if (!buttons.length) {
    return <div className="rounded-2xl border border-line bg-white p-5 text-center text-sm text-muted shadow-sm">No buttons are configured for this page yet.</div>;
  }

  return (
    <div className={compact ? "mt-5 grid gap-3" : "grid gap-3"}>
      {buttons.map((button) => (
        <a
          key={`${button.label}-${button.url}`}
          href={button.url}
          onClick={() => logButtonClick(page.slug, button)}
          className="block rounded-full bg-brand px-5 py-4 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-ink"
        >
          {button.label}
          {button.platform ? <span className="mt-1 block text-xs font-semibold opacity-80">{button.platform}</span> : null}
        </a>
      ))}
    </div>
  );
}

function LandingForm({ page, defaultFields }: { page: LandingPage; defaultFields: string[] }) {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fields = page.formConfig.fields?.length ? page.formConfig.fields : defaultFields;

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/landing-pages/${encodeURIComponent(page.slug)}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(body?.error ?? "Submission could not be sent.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage(page.formConfig.successMessage ?? "Thanks. Your submission was sent.");
  }

  return (
    <form onSubmit={submitForm} className="grid gap-3 rounded-2xl border border-line bg-white p-5 shadow-sm">
      {fields.map((field) => (
        <FormField key={field} field={field} />
      ))}
      <button disabled={status === "saving"} className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:bg-muted">
        {status === "saving" ? "Sending..." : page.formConfig.submitLabel ?? "Submit"}
      </button>
      {message ? (
        <p className={`rounded-xl px-3 py-2 text-sm font-semibold ${status === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

function FormField({ field }: { field: string }) {
  const label = field.replace(/([A-Z])/g, " $1").replaceAll("_", " ").replace(/^./, (value) => value.toUpperCase());
  const isMessage = field === "message" || field === "notes";
  const type = field.toLowerCase().includes("email") ? "email" : field.toLowerCase().includes("phone") ? "tel" : "text";

  if (isMessage) {
    return <textarea name={field} placeholder={label} className="min-h-28 rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand" />;
  }

  return <input name={field} type={type} placeholder={label} className="rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand" />;
}

function logButtonClick(slug: string, button: LandingPageButton) {
  const payload = JSON.stringify({
    label: button.label,
    url: button.url,
    destinationType: button.destinationType
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(`/api/landing-pages/${encodeURIComponent(slug)}/click`, new Blob([payload], { type: "application/json" }));
    return;
  }

  void fetch(`/api/landing-pages/${encodeURIComponent(slug)}/click`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true
  });
}
