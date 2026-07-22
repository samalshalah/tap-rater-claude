import { AdminShell } from "@/components/admin/admin-shell";
import { CustomerStandsManager } from "@/components/admin/customer-stands-manager";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCustomerStands, isCustomerStandStoreConfigured } from "@/lib/customer-stands";
import { getAdminProducts } from "@/lib/admin-products";
import { getProductStandConfiguration } from "@/lib/stand-domain";

export default async function AdminCustomerStandsPage() {
  await requireAdmin();
  const configured = isCustomerStandStoreConfigured();
  const [stands, allProducts] = await Promise.all([configured ? getAdminCustomerStands() : [], getAdminProducts()]);
  const products = allProducts
    .filter((product) => product.isActive && getProductStandConfiguration(product).requiresCustomerSetup)
    .map((product) => ({ slug: product.slug, title: product.title }));

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-12">
        <p className="text-sm font-semibold uppercase text-brand">Operations</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Customer Stands</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">Assign permanent stand URLs, monitor customer setup, and manage print, NFC, QR, pause, and archive status.</p>
        <CustomerStandsManager initialStands={stands} products={products} configured={configured} siteUrl={process.env.NEXT_PUBLIC_SITE_URL || "https://taprater.com"} />
      </section>
    </AdminShell>
  );
}
