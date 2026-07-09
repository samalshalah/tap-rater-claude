import { AdminSectionPage } from "@/components/admin/admin-section-page";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AdminSectionPage
        eyebrow="Growth"
        title="Analytics"
        description="Track revenue, product performance, conversion, traffic sources, review-platform interest, and setup request volume."
        primaryItems={["Revenue overview", "Product conversion", "Cart activity", "Request volume", "Traffic and SEO performance"]}
        nextItems={["Choose analytics provider.", "Add event tracking for product/cart/forms.", "Build dashboard once checkout and orders are live."]}
      />
    </AdminShell>
  );
}
