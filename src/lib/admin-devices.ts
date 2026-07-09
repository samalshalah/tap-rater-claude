import { randomBytes } from "node:crypto";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { hashActivationCode, validateActivationDestinationUrl } from "@/lib/device-activation";

export type DeviceProductType =
  | "google_review"
  | "facebook_review"
  | "yelp_profile"
  | "appointment_booking"
  | "social_follow"
  | "wifi_menu"
  | "multi_platform_review"
  | "feedback_form"
  | "referral_form"
  | "business_card"
  | "custom_url";

export type DeviceServiceMode = "basic_redirect" | "managed_redirect" | "premium_landing_page";
export type DeviceStatus = "unactivated" | "active" | "paused" | "lost" | "retired";
export type DeviceDestinationType = "google_review" | "facebook_review" | "yelp_profile" | "booking" | "social" | "menu" | "wifi" | "custom" | "landing_page";

export type AdminDevice = {
  id: string;
  deviceCode: string;
  productType: DeviceProductType;
  serviceMode: DeviceServiceMode;
  status: DeviceStatus;
  businessName?: string;
  customerEmail?: string;
  destinationType?: DeviceDestinationType;
  destinationUrl?: string;
  tapCount: number;
  label?: string;
  activatedAt?: string;
};

export type CreateAdminDeviceInput = {
  productType: DeviceProductType;
  serviceMode: DeviceServiceMode;
  deviceCode?: string;
  activationCode?: string;
  label?: string;
};

export type UpdateAdminDeviceInput = {
  status: DeviceStatus;
  destinationType?: DeviceDestinationType | "";
  destinationUrl?: string;
  label?: string;
};

export type CreatedAdminDevice = {
  id: string;
  deviceCode: string;
  activationCode: string;
  deviceUrl: string;
};

export type AdminDeviceDbClient = {
  from: (table: string) => any;
};

export function isAdminDeviceStoreConfigured() {
  return hasSupabaseAdminConfig();
}

export function generateDeviceCode() {
  return `TR-${randomCode(8)}`;
}

export function generateActivationCode() {
  return `${randomCode(4)}-${randomCode(4)}-${randomCode(4)}`;
}

export function getDeviceUrl(deviceCode: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taprater.com";
  return `${siteUrl.replace(/\/$/, "")}/r/${encodeURIComponent(deviceCode)}`;
}

export async function getAdminDevices() {
  if (!hasSupabaseAdminConfig()) {
    return [];
  }

  try {
    return await getAdminDevicesFromClient(getSupabaseAdmin() as AdminDeviceDbClient);
  } catch {
    return [];
  }
}

export async function getAdminDevicesFromClient(client: AdminDeviceDbClient): Promise<AdminDevice[]> {
  const [{ data: deviceRows, error: deviceError }, { data: eventRows, error: eventError }] = await Promise.all([
    client
      .from("devices")
      .select("*, customers(email), businesses(business_name)")
      .order("created_at", { ascending: false }),
    client.from("tap_events").select("device_id")
  ]);

  if (deviceError || eventError || !Array.isArray(deviceRows)) {
    return [];
  }

  const tapCounts = new Map<string, number>();
  if (Array.isArray(eventRows)) {
    for (const event of eventRows) {
      const deviceId = readString((event as Record<string, unknown>).device_id);
      if (deviceId) {
        tapCounts.set(deviceId, (tapCounts.get(deviceId) ?? 0) + 1);
      }
    }
  }

  return deviceRows.map((row) => normalizeAdminDevice(row, tapCounts)).filter((device): device is AdminDevice => Boolean(device));
}

export async function createAdminDevice(input: CreateAdminDeviceInput) {
  return createAdminDeviceWithClient(getSupabaseAdmin() as AdminDeviceDbClient, input);
}

export async function createAdminDeviceWithClient(client: AdminDeviceDbClient, input: CreateAdminDeviceInput): Promise<CreatedAdminDevice> {
  const deviceCode = (input.deviceCode?.trim().toUpperCase() || generateDeviceCode()).replace(/\s+/g, "");
  const activationCode = input.activationCode?.trim() || generateActivationCode();
  const activationCodeHash = hashActivationCode(activationCode);
  const { data, error } = await client
    .from("devices")
    .insert({
      device_code: deviceCode,
      activation_code_hash: activationCodeHash,
      product_type: input.productType,
      service_mode: input.serviceMode,
      status: "unactivated",
      label: input.label?.trim() || null
    })
    .select("id,device_code")
    .maybeSingle();

  if (error || !data?.id) {
    throw new Error("Device could not be created.");
  }

  return {
    id: String(data.id),
    deviceCode,
    activationCode,
    deviceUrl: getDeviceUrl(deviceCode)
  };
}

export async function updateAdminDevice(id: string, input: UpdateAdminDeviceInput) {
  return updateAdminDeviceWithClient(getSupabaseAdmin() as AdminDeviceDbClient, id, input);
}

export async function updateAdminDeviceWithClient(client: AdminDeviceDbClient, id: string, input: UpdateAdminDeviceInput) {
  const destinationUrl = input.destinationUrl?.trim() || "";
  if (destinationUrl && !validateActivationDestinationUrl(destinationUrl)) {
    throw new Error("Destination URL must start with http or https.");
  }

  const { error } = await client
    .from("devices")
    .update({
      status: input.status,
      destination_type: input.destinationType || null,
      destination_url: destinationUrl || null,
      label: input.label?.trim() || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    throw new Error("Device could not be updated.");
  }

  return { ok: true };
}

function normalizeAdminDevice(row: unknown, tapCounts: Map<string, number>): AdminDevice | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const value = row as Record<string, unknown>;
  const id = readString(value.id);
  const deviceCode = readString(value.device_code);
  const productType = readProductType(value.product_type);
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
    businessName: readNestedString(value.businesses, "business_name"),
    customerEmail: readNestedString(value.customers, "email"),
    destinationType: readDestinationType(value.destination_type),
    destinationUrl: readString(value.destination_url),
    tapCount: tapCounts.get(id) ?? 0,
    label: readString(value.label),
    activatedAt: readString(value.activated_at)
  };
}

function randomCode(length: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(length);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readNestedString(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  return readString((value as Record<string, unknown>)[key]);
}

function readProductType(value: unknown): DeviceProductType | undefined {
  const types: DeviceProductType[] = [
    "google_review",
    "facebook_review",
    "yelp_profile",
    "appointment_booking",
    "social_follow",
    "wifi_menu",
    "multi_platform_review",
    "feedback_form",
    "referral_form",
    "business_card",
    "custom_url"
  ];
  return types.includes(value as DeviceProductType) ? (value as DeviceProductType) : undefined;
}

function readServiceMode(value: unknown): DeviceServiceMode | undefined {
  return value === "basic_redirect" || value === "managed_redirect" || value === "premium_landing_page" ? value : undefined;
}

function readStatus(value: unknown): DeviceStatus | undefined {
  return value === "unactivated" || value === "active" || value === "paused" || value === "lost" || value === "retired" ? value : undefined;
}

function readDestinationType(value: unknown): DeviceDestinationType | undefined {
  const types: DeviceDestinationType[] = ["google_review", "facebook_review", "yelp_profile", "booking", "social", "menu", "wifi", "custom", "landing_page"];
  return types.includes(value as DeviceDestinationType) ? (value as DeviceDestinationType) : undefined;
}
