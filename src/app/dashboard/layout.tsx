import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireCustomer } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireCustomer();
  return <DashboardShell>{children}</DashboardShell>;
}
