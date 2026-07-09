import Link from "next/link";

type AdminSectionPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  primaryItems: string[];
  nextItems: string[];
  primaryHref?: string;
  primaryLabel?: string;
};

export function AdminSectionPage({
  title,
  eyebrow,
  description,
  primaryItems,
  nextItems,
  primaryHref,
  primaryLabel
}: AdminSectionPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-brand">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-black text-ink">{title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-muted">{description}</p>
        </div>
        {primaryHref && primaryLabel ? (
          <Link href={primaryHref} className="rounded-md bg-brand px-5 py-3 text-sm font-bold text-white">
            {primaryLabel}
          </Link>
        ) : null}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">Controls to build</h2>
          <div className="mt-4 grid gap-3">
            {primaryItems.map((item) => (
              <div key={item} className="rounded-md border border-line bg-gray-50 p-4 text-sm font-semibold text-ink">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-ink">Next implementation steps</h2>
          <div className="mt-4 grid gap-3">
            {nextItems.map((item) => (
              <div key={item} className="rounded-md border border-line p-4 text-sm leading-6 text-muted">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
