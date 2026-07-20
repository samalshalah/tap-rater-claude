import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
