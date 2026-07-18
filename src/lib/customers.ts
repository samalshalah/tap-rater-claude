import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";

export type AdminCustomerRow = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string | null;
  orderCount: number;
  totalSpentCents: number;
  openRequestCount: number;
};

type CustomersDbClient = {
  from: (table: string) => {
    select: (columns?: string) => {
      order?: (column: string, opts: { ascending: boolean }) => PromiseLike<{ data: unknown[] | null; error: null | { message: string } }>;
    } & PromiseLike<{ data: unknown[] | null; error: null | { message: string } }>;
  };
};

export async function getAdminCustomers(): Promise<{ configured: boolean; customers: AdminCustomerRow[] }> {
  if (!hasSupabaseAdminConfig()) {
    return { configured: false, customers: [] };
  }

  try {
    const client = getSupabaseAdmin() as CustomersDbClient;

    const [customersResult, ordersResult, contactResult, setupResult, changeLinkResult] = await Promise.all([
      client.from("customers").select("*"),
      client.from("orders").select("*"),
      client.from("contact_requests").select("*"),
      client.from("setup_requests").select("*"),
      client.from("change_link_requests").select("*")
    ]);

    const customerRows = Array.isArray(customersResult.data) ? customersResult.data : [];
    const orderRows = Array.isArray(ordersResult.data) ? ordersResult.data : [];
    const requestRows = [
      ...(Array.isArray(contactResult.data) ? contactResult.data : []),
      ...(Array.isArray(setupResult.data) ? setupResult.data : []),
      ...(Array.isArray(changeLinkResult.data) ? changeLinkResult.data : [])
    ];

    const ordersByEmail = new Map<string, { count: number; totalCents: number }>();
    for (const row of orderRows) {
      const record = row as Record<string, unknown>;
      const email = typeof record.email === "string" ? record.email.toLowerCase() : null;
      const status = typeof record.status === "string" ? record.status : "";
      if (!email || status !== "paid") continue;

      const existing = ordersByEmail.get(email) ?? { count: 0, totalCents: 0 };
      existing.count += 1;
      existing.totalCents += typeof record.total_cents === "number" ? record.total_cents : 0;
      ordersByEmail.set(email, existing);
    }

    const openRequestsByEmail = new Map<string, number>();
    for (const row of requestRows) {
      const record = row as Record<string, unknown>;
      const email = typeof record.email === "string" ? record.email.toLowerCase() : null;
      const status = typeof record.status === "string" ? record.status : "new";
      if (!email || status !== "new") continue;

      openRequestsByEmail.set(email, (openRequestsByEmail.get(email) ?? 0) + 1);
    }

    const customers: AdminCustomerRow[] = customerRows.map((row) => {
      const record = row as Record<string, unknown>;
      const email = typeof record.email === "string" ? record.email : "";
      const emailKey = email.toLowerCase();
      const orderStats = ordersByEmail.get(emailKey) ?? { count: 0, totalCents: 0 };

      return {
        id: typeof record.id === "string" ? record.id : email,
        email,
        name: typeof record.name === "string" ? record.name : null,
        phone: typeof record.phone === "string" ? record.phone : null,
        createdAt: typeof record.created_at === "string" ? record.created_at : null,
        orderCount: orderStats.count,
        totalSpentCents: orderStats.totalCents,
        openRequestCount: openRequestsByEmail.get(emailKey) ?? 0
      };
    });

    // Anyone who's placed an order or submitted a request but doesn't have a
    // `customers` row yet (e.g. Stripe test checkout without account creation)
    // still shows up here -- this is meant to be a real operational view, not
    // just a mirror of one table.
    const knownEmails = new Set(customers.map((c) => c.email.toLowerCase()));
    for (const [email, stats] of ordersByEmail) {
      if (!knownEmails.has(email)) {
        customers.push({
          id: email,
          email,
          name: null,
          phone: null,
          createdAt: null,
          orderCount: stats.count,
          totalSpentCents: stats.totalCents,
          openRequestCount: openRequestsByEmail.get(email) ?? 0
        });
        knownEmails.add(email);
      }
    }

    customers.sort((a, b) => b.totalSpentCents - a.totalSpentCents);

    return { configured: true, customers };
  } catch {
    return { configured: true, customers: [] };
  }
}
