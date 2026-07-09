import { describe, expect, it, vi } from "vitest";
import {
  getAdminPlatformSummaryFromClient,
  getBusinessTapSummaryFromClient,
  getDeviceTapSummaryFromClient,
  type AnalyticsDbClient
} from "@/lib/analytics";

const now = new Date("2026-07-09T12:00:00.000Z");

describe("analytics repository", () => {
  it("summarizes taps and submissions for a device", async () => {
    const db = createAnalyticsDb({
      devices: [{ id: "device-1", device_code: "TR-ONE", status: "active" }],
      tap_events: [
        { device_id: "device-1", event_type: "redirect", destination_type: "google_review", created_at: "2026-07-09T10:00:00.000Z" },
        { device_id: "device-1", event_type: "button_click", destination_type: "booking", created_at: "2026-07-01T10:00:00.000Z" },
        { device_id: "device-1", event_type: "redirect", destination_type: "google_review", created_at: "2026-06-01T10:00:00.000Z" }
      ],
      form_submissions: [{ device_id: "device-1", created_at: "2026-07-09T10:00:00.000Z" }]
    });

    const summary = await getDeviceTapSummaryFromClient(db.client, "device-1", now);

    expect(summary.totalTaps).toBe(3);
    expect(summary.tapsLast7Days).toBe(1);
    expect(summary.tapsLast30Days).toBe(2);
    expect(summary.destinationClicks).toBe(1);
    expect(summary.submissions).toBe(1);
    expect(summary.tapsByDay.find((day) => day.date === "2026-07-09")?.count).toBe(1);
    expect(db.selects.join(" ")).not.toContain("ip_hash");
  });

  it("summarizes taps and device performance for a business", async () => {
    const db = createAnalyticsDb({
      devices: [
        { id: "device-1", business_id: "business-1", device_code: "TR-ONE", status: "active" },
        { id: "device-2", business_id: "business-1", device_code: "TR-TWO", status: "paused" }
      ],
      tap_events: [
        { device_id: "device-1", business_id: "business-1", event_type: "redirect", created_at: "2026-07-09T10:00:00.000Z" },
        { device_id: "device-1", business_id: "business-1", event_type: "button_click", created_at: "2026-07-08T10:00:00.000Z" },
        { device_id: "device-2", business_id: "business-1", event_type: "redirect", created_at: "2026-06-20T10:00:00.000Z" }
      ],
      form_submissions: [{ business_id: "business-1", created_at: "2026-07-09T10:00:00.000Z" }]
    });

    const summary = await getBusinessTapSummaryFromClient(db.client, "business-1", now);

    expect(summary.totalTaps).toBe(3);
    expect(summary.tapsLast7Days).toBe(2);
    expect(summary.tapsLast30Days).toBe(3);
    expect(summary.submissions).toBe(1);
    expect(summary.topDevices[0]).toMatchObject({ deviceId: "device-1", deviceCode: "TR-ONE", tapCount: 2 });
  });

  it("builds admin platform summary", async () => {
    const db = createAnalyticsDb({
      devices: [
        { id: "device-1", business_id: "business-1", device_code: "TR-ONE", status: "active" },
        { id: "device-2", business_id: "business-1", device_code: "TR-TWO", status: "unactivated" },
        { id: "device-3", business_id: "business-2", device_code: "TR-THREE", status: "active" }
      ],
      tap_events: [
        { device_id: "device-1", business_id: "business-1", event_type: "redirect", created_at: "2026-07-09T10:00:00.000Z" },
        { device_id: "device-1", business_id: "business-1", event_type: "button_click", created_at: "2026-07-08T10:00:00.000Z" },
        { device_id: "device-3", business_id: "business-2", event_type: "redirect", created_at: "2026-06-01T10:00:00.000Z" }
      ],
      form_submissions: [
        { business_id: "business-1", created_at: "2026-07-09T10:00:00.000Z" },
        { business_id: "business-2", created_at: "2026-07-01T10:00:00.000Z" }
      ]
    });

    const summary = await getAdminPlatformSummaryFromClient(db.client, now);

    expect(summary.totalDevices).toBe(3);
    expect(summary.activeDevices).toBe(2);
    expect(summary.unactivatedDevices).toBe(1);
    expect(summary.tapsLast7Days).toBe(2);
    expect(summary.tapsLast30Days).toBe(2);
    expect(summary.submissions).toBe(2);
    expect(summary.topDevices[0]).toMatchObject({ deviceCode: "TR-ONE", tapCount: 2 });
  });
});

type TableName = "devices" | "tap_events" | "form_submissions";

function createAnalyticsDb(seed: Partial<Record<TableName, Array<Record<string, unknown>>>>) {
  const rows: Record<TableName, Array<Record<string, unknown>>> = {
    devices: seed.devices ?? [],
    tap_events: seed.tap_events ?? [],
    form_submissions: seed.form_submissions ?? []
  };
  const selects: string[] = [];

  const client = {
    from(table: TableName) {
      let filters: Array<{ column: string; value: unknown }> = [];
      const matchRows = () => rows[table].filter((row) => filters.every((filter) => row[filter.column] === filter.value));

      const builder = {
        select: vi.fn((columns?: string) => {
          selects.push(columns ?? "*");
          return builder;
        }),
        eq: vi.fn((column: string, value: unknown) => {
          filters.push({ column, value });
          return builder;
        }),
        order: vi.fn(async () => ({ data: matchRows(), error: null })),
        then(resolve: (value: { data: Array<Record<string, unknown>>; error: null }) => void) {
          resolve({ data: matchRows(), error: null });
        }
      };

      return builder;
    }
  };

  return { client: client as unknown as AnalyticsDbClient, selects };
}
