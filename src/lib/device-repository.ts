import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import type { PlatformDevice } from "@/lib/device-redirect";

type MaybeSingleResult = PromiseLike<{ data: unknown | null; error: null | { message: string } }>;
type InsertResult = PromiseLike<{ error: null | { message: string } }>;

type DeviceDbClient = {
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => MaybeSingleResult;
      };
    };
    insert: (values: Record<string, unknown>) => InsertResult;
  };
};

export type TapEventInput = {
  device: PlatformDevice;
  eventType: "scan" | "redirect" | "landing_page_view";
  ipHash?: string;
  userAgent?: string;
  referrer?: string;
};

const demoDevice: PlatformDevice = {
  id: "demo-google",
  deviceCode: "TR-DEMO-GOOGLE",
  productType: "google_review",
  serviceMode: "basic_redirect",
  status: "unactivated",
  destinationType: "google_review",
  label: "Demo Google Review Device"
};

export function isDeviceRepositoryConfigured() {
  return hasSupabaseAdminConfig();
}

export async function getDeviceByCode(deviceCode: string): Promise<PlatformDevice | null> {
  if (!hasSupabaseAdminConfig()) {
    return deviceCode === demoDevice.deviceCode ? demoDevice : null;
  }

  try {
    return await getDeviceByCodeFromClient(getSupabaseAdmin() as DeviceDbClient, deviceCode);
  } catch {
    return deviceCode === demoDevice.deviceCode ? demoDevice : null;
  }
}

export async function getDeviceByCodeFromClient(client: DeviceDbClient, deviceCode: string): Promise<PlatformDevice | null> {
  const { data, error } = await client.from("devices").select("*").eq("device_code", deviceCode).maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeDeviceRow(data);
}

export async function logTapEvent(input: TapEventInput) {
  if (!hasSupabaseAdminConfig()) {
    return;
  }

  try {
    await logTapEventWithClient(getSupabaseAdmin() as DeviceDbClient, input);
  } catch {
    // Redirect performance is more important than analytics durability.
  }
}

export async function logTapEventWithClient(client: DeviceDbClient, input: TapEventInput) {
  await client.from("tap_events").insert({
    device_id: input.device.id,
    business_id: input.device.businessId ?? null,
    event_type: input.eventType,
    destination_type: input.device.destinationType ?? null,
    ip_hash: input.ipHash ?? null,
    user_agent: input.userAgent ?? null,
    referrer: input.referrer ?? null
  });
}

function normalizeDeviceRow(row: unknown): PlatformDevice | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const value = row as Record<string, unknown>;
  const id = readString(value.id);
  const deviceCode = readString(value.device_code);
  const productType = readString(value.product_type);
  const serviceMode = readServiceMode(value.service_mode);
  const status = readStatus(value.status);

  if (!id || !deviceCode || !productType || !serviceMode || !status) {
    return null;
  }

  return {
    id,
    deviceCode,
    productType,
    serviceMode,
    status,
    customerId: readString(value.customer_id),
    businessId: readString(value.business_id),
    destinationType: readString(value.destination_type),
    destinationUrl: readString(value.destination_url),
    landingPageId: readString(value.landing_page_id),
    label: readString(value.label)
  };
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readServiceMode(value: unknown): PlatformDevice["serviceMode"] | undefined {
  return value === "basic_redirect" || value === "managed_redirect" || value === "premium_landing_page" ? value : undefined;
}

function readStatus(value: unknown): PlatformDevice["status"] | undefined {
  return value === "unactivated" || value === "active" || value === "paused" || value === "lost" || value === "retired" ? value : undefined;
}
