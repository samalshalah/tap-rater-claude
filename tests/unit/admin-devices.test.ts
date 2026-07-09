import { describe, expect, it, vi } from "vitest";
import {
  createAdminDeviceWithClient,
  generateActivationCode,
  generateDeviceCode,
  getAdminDevicesFromClient,
  updateAdminDeviceWithClient,
  type AdminDeviceDbClient
} from "@/lib/admin-devices";
import { validateActivationCode } from "@/lib/device-activation";

describe("admin devices", () => {
  it("generates device and activation codes", () => {
    expect(generateDeviceCode()).toMatch(/^TR-[A-Z0-9]{8}$/);
    expect(generateActivationCode()).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it("creates devices with hashed activation codes only", async () => {
    const db = createAdminDeviceDb();

    const created = await createAdminDeviceWithClient(db.client, {
      productType: "google_review",
      serviceMode: "basic_redirect",
      deviceCode: "TR-TEST123",
      activationCode: "PRIVATE-123",
      label: "Counter stand"
    });

    expect(created.deviceCode).toBe("TR-TEST123");
    expect(created.activationCode).toBe("PRIVATE-123");
    expect(db.inserted.devices[0]).toMatchObject({
      device_code: "TR-TEST123",
      product_type: "google_review",
      service_mode: "basic_redirect",
      status: "unactivated",
      label: "Counter stand"
    });
    expect(db.inserted.devices[0].activation_code_hash).not.toBe("PRIVATE-123");
    expect(validateActivationCode("PRIVATE-123", String(db.inserted.devices[0].activation_code_hash))).toBe(true);
  });

  it("loads devices with customer, business, and tap count data", async () => {
    const db = createAdminDeviceDb({
      devices: [
        {
          id: "device-1",
          device_code: "TR-TEST123",
          product_type: "google_review",
          service_mode: "basic_redirect",
          status: "active",
          destination_type: "google_review",
          destination_url: "https://example.com/review",
          activated_at: "2026-07-09T12:00:00.000Z",
          businesses: { business_name: "Local Shop" },
          customers: { email: "owner@example.com" }
        }
      ],
      tap_events: [{ device_id: "device-1" }, { device_id: "device-1" }]
    });

    const devices = await getAdminDevicesFromClient(db.client);

    expect(devices[0]).toMatchObject({
      id: "device-1",
      deviceCode: "TR-TEST123",
      businessName: "Local Shop",
      customerEmail: "owner@example.com",
      tapCount: 2
    });
  });

  it("updates editable device fields", async () => {
    const db = createAdminDeviceDb({
      devices: [
        {
          id: "device-1",
          device_code: "TR-TEST123",
          product_type: "google_review",
          service_mode: "basic_redirect",
          status: "active"
        }
      ]
    });

    await updateAdminDeviceWithClient(db.client, "device-1", {
      status: "paused",
      destinationType: "custom",
      destinationUrl: "https://example.com",
      label: "Paused stand"
    });

    expect(db.updated.devices[0]).toMatchObject({
      status: "paused",
      destination_type: "custom",
      destination_url: "https://example.com",
      label: "Paused stand"
    });
  });
});

type TableName = "devices" | "tap_events";

function createAdminDeviceDb(seed?: { devices?: Array<Record<string, unknown>>; tap_events?: Array<Record<string, unknown>> }) {
  const rows: Record<TableName, Array<Record<string, unknown>>> = {
    devices: seed?.devices ? [...seed.devices] : [],
    tap_events: seed?.tap_events ? [...seed.tap_events] : []
  };
  const inserted: Record<TableName, Array<Record<string, unknown>>> = {
    devices: [],
    tap_events: []
  };
  const updated: Record<TableName, Array<Record<string, unknown>>> = {
    devices: [],
    tap_events: []
  };

  const client = {
    from(table: TableName) {
      let filters: Array<{ column: string; value: unknown }> = [];
      const matchRows = () => rows[table].filter((row) => filters.every((filter) => row[filter.column] === filter.value));

      const builder = {
        select: vi.fn(() => builder),
        order: vi.fn(async () => ({ data: [...rows[table]], error: null })),
        insert: vi.fn((value: Record<string, unknown>) => {
          const row = { id: value.id ?? "device-created", ...value };
          inserted[table].push(row);
          rows[table].push(row);
          return builder;
        }),
        update: vi.fn((value: Record<string, unknown>) => {
          const matched = matchRows();
          for (const row of matched) {
            Object.assign(row, value);
            updated[table].push({ ...value });
          }
          return builder;
        }),
        eq: vi.fn((column: string, value: unknown) => {
          filters.push({ column, value });
          return builder;
        }),
        maybeSingle: vi.fn(async () => ({ data: matchRows()[0] ?? rows[table].at(-1) ?? null, error: null })),
        then(resolve: (value: { data: Array<Record<string, unknown>>; error: null }) => void) {
          resolve({ data: [...rows[table]], error: null });
        }
      };

      return builder;
    }
  };

  return { client: client as unknown as AdminDeviceDbClient, inserted, updated };
}
