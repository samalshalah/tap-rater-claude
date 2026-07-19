import { describe, expect, it, vi } from "vitest";
import { getCustomerPortalFromClient, updateOwnedDeviceDestination, type CustomerPortalDbClient } from "@/lib/customer-portal";

describe("customer portal repository", () => {
  it("loads businesses, devices, destinations, and tap counts for a customer email", async () => {
    const db = createCustomerPortalDb({
      customers: [{ id: "customer-1", email: "owner@example.com", name: "Owner" }],
      businesses: [{ id: "business-1", customer_id: "customer-1", business_name: "Local Shop", google_review_url: "https://example.com/review" }],
      devices: [
        {
          id: "device-1",
          device_code: "TR-TEST123",
          customer_id: "customer-1",
          business_id: "business-1",
          product_type: "google_review",
          service_mode: "basic_redirect",
          status: "active",
          destination_type: "google_review",
          destination_url: "https://example.com/review"
        }
      ],
      tap_events: [{ device_id: "device-1" }, { device_id: "device-1" }]
    });

    const portal = await getCustomerPortalFromClient(db.client, "owner@example.com");

    expect(portal.customer).toMatchObject({ id: "customer-1", email: "owner@example.com" });
    expect(portal.businesses[0]).toMatchObject({ businessName: "Local Shop", googleReviewUrl: "https://example.com/review" });
    expect(portal.devices[0]).toMatchObject({
      deviceCode: "TR-TEST123",
      status: "active",
      destinationUrl: "https://example.com/review",
      tapCount: 2
    });
  });

  it("returns empty portal data when customer is not found", async () => {
    const db = createCustomerPortalDb({ customers: [], businesses: [], devices: [], tap_events: [] });

    const portal = await getCustomerPortalFromClient(db.client, "missing@example.com");

    expect(portal.customer).toBeNull();
    expect(portal.businesses).toEqual([]);
    expect(portal.devices).toEqual([]);
  });

  it("lets a customer update the destination link on their own device", async () => {
    const db = createCustomerPortalDb({
      customers: [{ id: "customer-1", email: "owner@example.com" }],
      businesses: [],
      devices: [{ id: "device-1", customer_id: "customer-1" }],
      tap_events: []
    });

    const result = await updateOwnedDeviceDestination(db.client, {
      deviceId: "device-1",
      customerEmail: "owner@example.com",
      destinationUrl: "https://g.page/r/example/review",
      destinationType: "google_review"
    });

    expect(result.ok).toBe(true);
    expect(db.rows.devices[0]).toMatchObject({
      destination_url: "https://g.page/r/example/review",
      destination_type: "google_review",
      status: "active"
    });
  });

  it("refuses to update a device that belongs to a different customer (security check)", async () => {
    const db = createCustomerPortalDb({
      customers: [
        { id: "customer-1", email: "owner@example.com" },
        { id: "customer-2", email: "someone-else@example.com" }
      ],
      businesses: [],
      devices: [{ id: "device-1", customer_id: "customer-2" }], // owned by someone-else, not owner@example.com
      tap_events: []
    });

    const result = await updateOwnedDeviceDestination(db.client, {
      deviceId: "device-1",
      customerEmail: "owner@example.com",
      destinationUrl: "https://malicious.example.com/hijack",
      destinationType: "custom"
    });

    expect(result.ok).toBe(false);
    // The device row must remain untouched -- no destination_url was ever set on it.
    expect(db.rows.devices[0].destination_url).toBeUndefined();
  });

  it("refuses to update a device that doesn't exist", async () => {
    const db = createCustomerPortalDb({
      customers: [{ id: "customer-1", email: "owner@example.com" }],
      businesses: [],
      devices: [],
      tap_events: []
    });

    const result = await updateOwnedDeviceDestination(db.client, {
      deviceId: "does-not-exist",
      customerEmail: "owner@example.com",
      destinationUrl: "https://example.com",
      destinationType: "custom"
    });

    expect(result.ok).toBe(false);
  });
});

type TableName = "customers" | "businesses" | "devices" | "tap_events";

function createCustomerPortalDb(seed: Record<TableName, Array<Record<string, unknown>>>) {
  const rows = {
    customers: [...seed.customers],
    businesses: [...seed.businesses],
    devices: [...seed.devices],
    tap_events: [...seed.tap_events]
  };

  const client = {
    from(table: TableName) {
      let filters: Array<{ column: string; value: unknown }> = [];
      const matchRows = () => rows[table].filter((row) => filters.every((filter) => row[filter.column] === filter.value));

      const builder = {
        select: vi.fn(() => builder),
        eq: vi.fn((column: string, value: unknown) => {
          filters.push({ column, value });
          return builder;
        }),
        maybeSingle: vi.fn(async () => ({ data: matchRows()[0] ?? null, error: null })),
        order: vi.fn(async () => ({ data: matchRows(), error: null })),
        update: vi.fn((values: Record<string, unknown>) => ({
          eq: vi.fn(async (column: string, value: unknown) => {
            const target = rows[table].find((row) => row[column] === value);
            if (target) {
              Object.assign(target, values);
            }
            return { error: null };
          })
        })),
        then(resolve: (value: { data: Array<Record<string, unknown>>; error: null }) => void) {
          resolve({ data: matchRows(), error: null });
        }
      };

      return builder;
    }
  };

  return { client: client as unknown as CustomerPortalDbClient, rows };
}
