import { BusinessProfileEditor } from "@/components/dashboard/business-profile-editor";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerDashboard } from "@/lib/customer-stands";

export default async function DashboardBusinessPage() {
  const session = await requireCustomer();
  const dashboard = await getCustomerDashboard(session.email);

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <p className="text-sm font-semibold text-brand">Business</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Business profiles</h1>
        <p className="mt-3 text-base text-muted">Identity and contact details shared across your stands.</p>
      </header>
      <div className="mt-8 grid gap-5">
        {dashboard.businesses.map((business) => <BusinessProfileEditor key={business.id} business={business} />)}
        <BusinessProfileEditor />
      </div>
    </div>
  );
}
