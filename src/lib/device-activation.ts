import { createHash, timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";

export type ActivationDestinationType =
  | "google_review_url"
  | "direct_url"
  | "facebook_url"
  | "yelp_url"
  | "booking_url"
  | "social_url";

export type PlatformDestinationType = "google_review" | "custom" | "facebook_review" | "yelp_profile" | "booking" | "social";

export type ActivationInput = {
  deviceCode: string;
  activationCode: string;
  email: string;
  name: string;
  businessName: string;
  destinationType: ActivationDestinationType;
  destinationUrl: string;
};

export type ActivationContext = {
  ipHash?: string;
};

export type ActivationResult =
  | { ok: true; deviceCode: string; redirectPath: string }
  | { ok: false; reason: ActivationFailureReason; message: string };

export type ActivationFailureReason =
  | "configuration_missing"
  | "invalid_device_code"
  | "invalid_destination_url"
  | "invalid_device"
  | "invalid_activation_code"
  | "already_active"
  | "device_unavailable"
  | "rate_limited"
  | "save_failed";

export type ActivationDbClient = {
  from: (table: string) => any;
};

type DeviceRow = {
  id: string;
  device_code: string;
  activation_code_hash: string;
  status: string;
};

type CustomerRow = {
  id: string;
  email: string;
  name?: string | null;
};

type BusinessRow = {
  id: string;
  customer_id: string;
  business_name?: string | null;
};

const deviceCodePattern = /^[A-Z0-9-]{3,80}$/;
const hashPattern = /^[a-f0-9]{64}$/;
const maxFailedAttempts = 10;
const rateLimitWindowMs = 15 * 60 * 1000;

export function validateDeviceCode(deviceCode: string) {
  return normalizeDeviceCode(deviceCode) !== null;
}

export function normalizeDeviceCode(deviceCode: string) {
  const normalized = deviceCode.trim().toUpperCase();
  return deviceCodePattern.test(normalized) ? normalized : null;
}

export function hashActivationCode(activationCode: string) {
  return createHash("sha256").update(canonicalActivationCode(activationCode)).digest("hex");
}

export function validateActivationCode(activationCode: string, storedHash: string) {
  if (!hashPattern.test(storedHash)) {
    return false;
  }

  const provided = Buffer.from(hashActivationCode(activationCode), "hex");
  const stored = Buffer.from(storedHash, "hex");

  return provided.length === stored.length && timingSafeEqual(provided, stored);
}

export function validateActivationDestinationUrl(destinationUrl: string) {
  try {
    const url = new URL(destinationUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeDestinationType(destinationType: ActivationDestinationType): PlatformDestinationType {
  const types: Record<ActivationDestinationType, PlatformDestinationType> = {
    google_review_url: "google_review",
    direct_url: "custom",
    facebook_url: "facebook_review",
    yelp_url: "yelp_profile",
    booking_url: "booking",
    social_url: "social"
  };

  return types[destinationType];
}

export async function activateDevice(input: ActivationInput, context: ActivationContext = {}): Promise<ActivationResult> {
  if (!hasSupabaseAdminConfig()) {
    return failure("configuration_missing", "Device activation is not configured yet. Please contact Tap Rater support.");
  }

  try {
    return await activateDeviceWithClient(getSupabaseAdmin() as ActivationDbClient, input, context);
  } catch {
    return failure("save_failed", "We could not activate this Tap Rater right now. Please try again or contact support.");
  }
}

export async function activateDeviceWithClient(
  client: ActivationDbClient,
  input: ActivationInput,
  context: ActivationContext = {}
): Promise<ActivationResult> {
  const deviceCode = normalizeDeviceCode(input.deviceCode);
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const businessName = input.businessName.trim();
  const destinationUrl = input.destinationUrl.trim();

  if (!deviceCode) {
    return failure("invalid_device_code", "Please enter a valid Tap Rater device code.");
  }

  if (!validateActivationDestinationUrl(destinationUrl)) {
    await logActivationAttempt(client, { deviceCode, email, ipHash: context.ipHash, success: false, reason: "invalid_destination_url" });
    return failure("invalid_destination_url", "Please enter a valid http or https destination URL.");
  }

  if (await isActivationRateLimited(client, deviceCode, context.ipHash)) {
    await logActivationAttempt(client, { deviceCode, email, ipHash: context.ipHash, success: false, reason: "rate_limited" });
    return failure("rate_limited", "Too many activation attempts. Please wait a few minutes and try again.");
  }

  const device = await findDeviceByCode(client, deviceCode);

  if (!device) {
    await logActivationAttempt(client, { deviceCode, email, ipHash: context.ipHash, success: false, reason: "invalid_device" });
    return failure("invalid_device", "We could not find that Tap Rater device.");
  }

  if (device.status !== "unactivated") {
    const reason = device.status === "active" ? "already_active" : "device_unavailable";
    await logActivationAttempt(client, { deviceCode, email, ipHash: context.ipHash, success: false, reason });
    return failure(reason, device.status === "active" ? "This Tap Rater is already activated." : "This Tap Rater is not available for activation.");
  }

  if (!validateActivationCode(input.activationCode, device.activation_code_hash)) {
    await logActivationAttempt(client, { deviceCode, email, ipHash: context.ipHash, success: false, reason: "invalid_activation_code" });
    return failure("invalid_activation_code", "The private activation code does not match this Tap Rater.");
  }

  const customer = await createOrFindCustomerByEmail(client, email, name);
  const business = await createOrFindBusiness(client, customer.id, businessName, input.destinationType, destinationUrl);
  const platformDestinationType = normalizeDestinationType(input.destinationType);

  const { error: deviceUpdateError } = await client
    .from("devices")
    .update({
      status: "active",
      customer_id: customer.id,
      business_id: business.id,
      destination_type: platformDestinationType,
      destination_url: destinationUrl,
      activated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", device.id);

  if (deviceUpdateError) {
    throw new Error("Device could not be activated.");
  }

  await logActivationAttempt(client, { deviceCode, email, ipHash: context.ipHash, success: true, reason: "activated" });

  return { ok: true, deviceCode, redirectPath: `/r/${encodeURIComponent(deviceCode)}` };
}

export async function createOrFindCustomerByEmail(client: ActivationDbClient, email: string, name: string): Promise<CustomerRow> {
  const { data: existing } = await client.from("customers").select("*").eq("email", email).maybeSingle();

  if (existing?.id) {
    if (name && existing.name !== name) {
      const { error } = await client.from("customers").update({ name, updated_at: new Date().toISOString() }).eq("id", existing.id);
      if (error) {
        throw new Error("Customer could not be updated.");
      }
    }
    return existing as CustomerRow;
  }

  const { data, error } = await client.from("customers").insert({ email, name }).select("*").maybeSingle();

  if (error || !data?.id) {
    throw new Error("Customer could not be created.");
  }

  return data as CustomerRow;
}

export async function createOrFindBusiness(
  client: ActivationDbClient,
  customerId: string,
  businessName: string,
  destinationType: ActivationDestinationType,
  destinationUrl: string
): Promise<BusinessRow> {
  const { data: existing } = await client
    .from("businesses")
    .select("*")
    .eq("customer_id", customerId)
    .eq("business_name", businessName)
    .maybeSingle();
  const destinationColumn = businessDestinationColumn(destinationType);

  if (existing?.id) {
    const { error } = await client
      .from("businesses")
      .update({ [destinationColumn]: destinationUrl, status: "active", updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) {
      throw new Error("Business could not be updated.");
    }
    return existing as BusinessRow;
  }

  const { data, error } = await client
    .from("businesses")
    .insert({
      customer_id: customerId,
      business_name: businessName,
      [destinationColumn]: destinationUrl,
      status: "active"
    })
    .select("*")
    .maybeSingle();

  if (error || !data?.id) {
    throw new Error("Business could not be created.");
  }

  return data as BusinessRow;
}

async function findDeviceByCode(client: ActivationDbClient, deviceCode: string): Promise<DeviceRow | null> {
  const { data, error } = await client.from("devices").select("*").eq("device_code", deviceCode).maybeSingle();

  if (error || !data?.id || !data.device_code || !data.activation_code_hash || !data.status) {
    return null;
  }

  return data as DeviceRow;
}

async function logActivationAttempt(
  client: ActivationDbClient,
  input: { deviceCode: string; email?: string; ipHash?: string; success: boolean; reason: string }
) {
  await client.from("device_activation_attempts").insert({
    device_code: input.deviceCode,
    email: input.email ?? null,
    ip_hash: input.ipHash ?? null,
    success: input.success,
    reason: input.reason
  });
}

async function isActivationRateLimited(client: ActivationDbClient, deviceCode: string, ipHash?: string) {
  if (!ipHash) {
    return false;
  }

  const since = new Date(Date.now() - rateLimitWindowMs).toISOString();
  const { data, error } = await client
    .from("device_activation_attempts")
    .select("id")
    .eq("device_code", deviceCode)
    .eq("ip_hash", ipHash)
    .eq("success", false)
    .gte("created_at", since)
    .limit(maxFailedAttempts);

  if (error || !Array.isArray(data)) {
    return false;
  }

  return data.length >= maxFailedAttempts;
}

function businessDestinationColumn(destinationType: ActivationDestinationType) {
  const columns: Record<ActivationDestinationType, string> = {
    google_review_url: "google_review_url",
    direct_url: "website_url",
    facebook_url: "facebook_url",
    yelp_url: "yelp_url",
    booking_url: "booking_url",
    social_url: "instagram_url"
  };

  return columns[destinationType];
}

function canonicalActivationCode(activationCode: string) {
  return activationCode.trim().toUpperCase();
}

function failure(reason: ActivationFailureReason, message: string): ActivationResult {
  return { ok: false, reason, message };
}
