import { AccountShell } from "@/components/account/account-shell";
import { requireCustomer } from "@/lib/customer-auth";
import { getCustomerPortal } from "@/lib/customer-portal";

export default async function AccountBusinessPage() {
  const session = await requireCustomer();
  const portal = await getCustomerPortal(session.email);

  return (
    <AccountShell>
      <div className="grid gap-5 md:grid-cols-2">
        {portal.businesses.map((business) => (
          <article key={business.id} className="rounded-md border border-line bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-brand">{business.status ?? "active"}</p>
            <h2 className="mt-2 text-2xl font-black text-ink">{business.businessName}</h2>
            <div className="mt-4 grid gap-2 text-sm text-muted">
              <BusinessLink label="Website" value={business.websiteUrl} />
              <BusinessLink label="Google review" value={business.googleReviewUrl} />
              <BusinessLink label="Facebook" value={business.facebookUrl} />
              <BusinessLink label="Yelp" value={business.yelpUrl} />
              <BusinessLink label="Booking" value={business.bookingUrl} />
            </div>
          </article>
        ))}
        {portal.businesses.length === 0 ? (
          <div className="rounded-md border border-line bg-white p-6 text-muted shadow-sm">No business profile found for this account yet.</div>
        ) : null}
      </div>
    </AccountShell>
  );
}

function BusinessLink({ label, value }: { label: string; value?: string }) {
  return (
    <p>
      <span className="font-bold text-ink">{label}:</span> {value ? <span className="break-all">{value}</span> : "-"}
    </p>
  );
}
