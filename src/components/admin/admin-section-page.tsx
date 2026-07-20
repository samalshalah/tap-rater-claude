import Link from "next/link";
import { AdminConfigForm } from "@/components/admin/admin-config-form";

type AdminSectionPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  primaryItems: string[];
  nextItems: string[];
  primaryHref?: string;
  primaryLabel?: string;
  config?: {
    area: string;
    primaryLabel: string;
    secondaryLabel: string;
    notesLabel: string;
    primaryPlaceholder: string;
    secondaryPlaceholder: string;
    notesPlaceholder: string;
  };
  initialConfigValues?: {
    status?: string;
    settings?: { primary?: string; secondary?: string; notes?: string };
  } | null;
};

export function AdminSectionPage({
  title,
  eyebrow,
  description,
  primaryItems,
  nextItems,
  primaryHref,
  primaryLabel,
  config,
  initialConfigValues
}: AdminSectionPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">{title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-muted">{description}</p>
        </div>
        {primaryHref && primaryLabel ? (
          <Link href={primaryHref} className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-brand">
            {primaryLabel}
          </Link>
        ) : null}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        {config ? (
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-[20px] font-semibold tracking-tightest text-ink">Editable settings</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Save operational settings for this admin area. These records are stored in Postgres `site_content` when configured.
            </p>
            <div className="mt-5">
              <AdminConfigForm
                area={config.area}
                title={title}
                primaryLabel={config.primaryLabel}
                secondaryLabel={config.secondaryLabel}
                notesLabel={config.notesLabel}
                primaryPlaceholder={config.primaryPlaceholder}
                secondaryPlaceholder={config.secondaryPlaceholder}
                notesPlaceholder={config.notesPlaceholder}
                initialValues={initialConfigValues}
              />
            </div>
          </div>
        ) : null}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-[20px] font-semibold tracking-tightest text-ink">Controls included</h2>
          <div className="mt-4 grid gap-3">
            {primaryItems.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-surface p-4 text-sm font-semibold text-ink">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-[20px] font-semibold tracking-tightest text-ink">Next implementation steps</h2>
          <div className="mt-4 grid gap-3">
            {nextItems.map((item) => (
              <div key={item} className="rounded-2xl border border-line p-4 text-sm leading-6 text-muted">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
