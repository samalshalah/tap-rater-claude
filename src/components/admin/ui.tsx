import type { ReactNode } from "react";
import Link from "next/link";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">{eyebrow}</p>
        <h1 className="mt-2 text-[32px] font-semibold tracking-tightest text-ink sm:text-[38px]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-[14px] leading-6 text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminCard({ title, description, children, className }: { title?: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-white p-6 shadow-sm ${className ?? ""}`}>
      {title ? (
        <div className="mb-5">
          <h2 className="text-[17px] font-semibold tracking-tightest text-ink">{title}</h2>
          {description ? <p className="mt-1 text-[13px] leading-5 text-muted">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function AdminSummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted">{label}</p>
      <p className="mt-2 text-[26px] font-semibold tracking-tightest text-ink">{value}</p>
    </div>
  );
}

export function AdminNotice({ tone = "warning", children }: { tone?: "warning" | "success"; children: ReactNode }) {
  const styles =
    tone === "warning" ? "border-amber-200 bg-amber-50 text-ink" : "border-teal-100 bg-teal-50 text-brand-dark";
  return <div className={`rounded-2xl border p-4 text-[13px] font-medium leading-5 ${styles}`}>{children}</div>;
}

export function AdminStatusBadge({ active, activeLabel = "Active", inactiveLabel = "Inactive" }: { active: boolean; activeLabel?: string; inactiveLabel?: string }) {
  return (
    <span
      className={
        active
          ? "rounded-full bg-teal-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-brand-dark"
          : "rounded-full bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted"
      }
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

export function AdminPrimaryButton({
  children,
  disabled,
  type = "submit",
  onClick
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
    >
      {children}
    </button>
  );
}

export function AdminSecondaryButton({ children, href, onClick, type = "button" }: { children: ReactNode; href?: string; onClick?: () => void; type?: "button" | "submit" }) {
  const className =
    "inline-flex items-center justify-center rounded-full border border-line px-4 py-2.5 text-[13px] font-medium text-ink transition hover:border-ink";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export const adminInputClassName =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] text-ink outline-none transition focus:border-ink";

export const adminTableWrapperClassName = "overflow-x-auto rounded-2xl border border-line bg-white shadow-sm";

export const adminTableHeadRowClassName = "border-b border-line bg-surface text-[11px] font-medium uppercase tracking-[0.04em] text-muted";

export const adminTableRowClassName = "border-b border-line last:border-b-0";
