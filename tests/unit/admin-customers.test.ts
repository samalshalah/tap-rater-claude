import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  hasSupabaseAdminConfig: () => true,
  getSupabaseAdmin: () => mockClient
}));

const tableData: Record<string, unknown[]> = {
  customers: [],
  orders: [],
  contact_requests: [],
  setup_requests: [],
  change_link_requests: []
};

const mockClient = {
  from(table: string) {
    return {
      select() {
        return Promise.resolve({ data: tableData[table] ?? [], error: null });
      }
    };
  }
};

// Imported after the mock so it picks up the mocked db module.
const { getAdminCustomers } = await import("@/lib/customers");

describe("admin customers", () => {
  it("aggregates order totals and open requests per customer by email", async () => {
    tableData.customers = [
      { id: "c1", email: "jane@example.com", name: "Jane Doe", phone: null, created_at: "2026-01-01T00:00:00Z" }
    ];
    tableData.orders = [
      { email: "jane@example.com", status: "paid", total_cents: 4900 },
      { email: "jane@example.com", status: "paid", total_cents: 4900 },
      { email: "jane@example.com", status: "pending_payment", total_cents: 9900 } // not counted, not paid
    ];
    tableData.contact_requests = [{ email: "jane@example.com", status: "new" }];
    tableData.setup_requests = [{ email: "jane@example.com", status: "resolved" }]; // not counted, not "new"
    tableData.change_link_requests = [];

    const { configured, customers } = await getAdminCustomers();

    expect(configured).toBe(true);
    expect(customers).toHaveLength(1);
    expect(customers[0]).toMatchObject({
      email: "jane@example.com",
      name: "Jane Doe",
      orderCount: 2,
      totalSpentCents: 9800,
      openRequestCount: 1
    });
  });

  it("includes a customer who has orders/requests but no saved customers row", async () => {
    tableData.customers = [];
    tableData.orders = [{ email: "guest@example.com", status: "paid", total_cents: 4900 }];
    tableData.contact_requests = [];
    tableData.setup_requests = [];
    tableData.change_link_requests = [];

    const { customers } = await getAdminCustomers();

    expect(customers.some((c) => c.email === "guest@example.com" && c.orderCount === 1)).toBe(true);
  });

  it("sorts customers by lifetime spend, highest first", async () => {
    tableData.customers = [
      { id: "c1", email: "small@example.com", name: "Small Spender" },
      { id: "c2", email: "big@example.com", name: "Big Spender" }
    ];
    tableData.orders = [
      { email: "small@example.com", status: "paid", total_cents: 4900 },
      { email: "big@example.com", status: "paid", total_cents: 49000 }
    ];
    tableData.contact_requests = [];
    tableData.setup_requests = [];
    tableData.change_link_requests = [];

    const { customers } = await getAdminCustomers();

    expect(customers[0].email).toBe("big@example.com");
    expect(customers[1].email).toBe("small@example.com");
  });
});
