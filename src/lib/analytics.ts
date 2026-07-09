import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";

export type AnalyticsDbClient = {
  from: (table: string) => any;
};

export type TapsByDay = {
  date: string;
  count: number;
};

export type DevicePerformance = {
  deviceId: string;
  deviceCode: string;
  status?: string;
  tapCount: number;
  destinationClicks: number;
};

export type DeviceTapSummary = {
  deviceId: string;
  totalTaps: number;
  tapsLast7Days: number;
  tapsLast30Days: number;
  destinationClicks: number;
  submissions: number;
  tapsByDay: TapsByDay[];
};

export type BusinessTapSummary = {
  businessId: string;
  totalTaps: number;
  tapsLast7Days: number;
  tapsLast30Days: number;
  destinationClicks: number;
  submissions: number;
  tapsByDay: TapsByDay[];
  topDevices: DevicePerformance[];
};

export type AdminPlatformSummary = {
  totalDevices: number;
  activeDevices: number;
  unactivatedDevices: number;
  tapsLast7Days: number;
  tapsLast30Days: number;
  destinationClicks: number;
  submissions: number;
  tapsByDay: TapsByDay[];
  topDevices: DevicePerformance[];
  topBusinesses: Array<{ businessId: string; tapCount: number; submissions: number }>;
};

type TapEventRow = {
  device_id?: string;
  business_id?: string;
  event_type?: string;
  destination_type?: string;
  created_at?: string;
};

type DeviceRow = {
  id?: string;
  device_code?: string;
  business_id?: string;
  status?: string;
};

type SubmissionRow = {
  device_id?: string;
  business_id?: string;
  created_at?: string;
};

export function isAnalyticsConfigured() {
  return hasSupabaseAdminConfig();
}

export async function getDeviceTapSummary(deviceId: string, now = new Date()): Promise<DeviceTapSummary> {
  if (!hasSupabaseAdminConfig()) {
    return emptyDeviceSummary(deviceId);
  }

  try {
    return await getDeviceTapSummaryFromClient(getSupabaseAdmin() as AnalyticsDbClient, deviceId, now);
  } catch {
    return emptyDeviceSummary(deviceId);
  }
}

export async function getBusinessTapSummary(businessId: string, now = new Date()): Promise<BusinessTapSummary> {
  if (!hasSupabaseAdminConfig()) {
    return emptyBusinessSummary(businessId);
  }

  try {
    return await getBusinessTapSummaryFromClient(getSupabaseAdmin() as AnalyticsDbClient, businessId, now);
  } catch {
    return emptyBusinessSummary(businessId);
  }
}

export async function getAdminPlatformSummary(now = new Date()): Promise<AdminPlatformSummary> {
  if (!hasSupabaseAdminConfig()) {
    return emptyAdminSummary();
  }

  try {
    return await getAdminPlatformSummaryFromClient(getSupabaseAdmin() as AnalyticsDbClient, now);
  } catch {
    return emptyAdminSummary();
  }
}

export async function getDeviceTapSummaryFromClient(client: AnalyticsDbClient, deviceId: string, now = new Date()): Promise<DeviceTapSummary> {
  const [{ data: eventRows }, { data: submissionRows }] = await Promise.all([
    client.from("tap_events").select("device_id,business_id,event_type,destination_type,created_at").eq("device_id", deviceId),
    client.from("form_submissions").select("device_id,business_id,created_at").eq("device_id", deviceId)
  ]);
  const events = normalizeEvents(eventRows);
  const submissions = normalizeSubmissions(submissionRows);

  return {
    deviceId,
    totalTaps: events.length,
    tapsLast7Days: countSince(events, now, 7),
    tapsLast30Days: countSince(events, now, 30),
    destinationClicks: events.filter((event) => event.event_type === "button_click").length,
    submissions: submissions.length,
    tapsByDay: buildTapsByDay(events, now, 7)
  };
}

export async function getBusinessTapSummaryFromClient(client: AnalyticsDbClient, businessId: string, now = new Date()): Promise<BusinessTapSummary> {
  const [{ data: deviceRows }, { data: eventRows }, { data: submissionRows }] = await Promise.all([
    client.from("devices").select("id,device_code,business_id,status").eq("business_id", businessId),
    client.from("tap_events").select("device_id,business_id,event_type,destination_type,created_at").eq("business_id", businessId),
    client.from("form_submissions").select("device_id,business_id,created_at").eq("business_id", businessId)
  ]);
  const devices = normalizeDevices(deviceRows);
  const events = normalizeEvents(eventRows);
  const submissions = normalizeSubmissions(submissionRows);

  return {
    businessId,
    totalTaps: events.length,
    tapsLast7Days: countSince(events, now, 7),
    tapsLast30Days: countSince(events, now, 30),
    destinationClicks: events.filter((event) => event.event_type === "button_click").length,
    submissions: submissions.length,
    tapsByDay: buildTapsByDay(events, now, 7),
    topDevices: buildDevicePerformance(devices, events).slice(0, 5)
  };
}

export async function getAdminPlatformSummaryFromClient(client: AnalyticsDbClient, now = new Date()): Promise<AdminPlatformSummary> {
  const [{ data: deviceRows }, { data: eventRows }, { data: submissionRows }] = await Promise.all([
    client.from("devices").select("id,device_code,business_id,status"),
    client.from("tap_events").select("device_id,business_id,event_type,destination_type,created_at"),
    client.from("form_submissions").select("device_id,business_id,created_at")
  ]);
  const devices = normalizeDevices(deviceRows);
  const events = normalizeEvents(eventRows);
  const submissions = normalizeSubmissions(submissionRows);

  return {
    totalDevices: devices.length,
    activeDevices: devices.filter((device) => device.status === "active").length,
    unactivatedDevices: devices.filter((device) => device.status === "unactivated").length,
    tapsLast7Days: countSince(events, now, 7),
    tapsLast30Days: countSince(events, now, 30),
    destinationClicks: events.filter((event) => event.event_type === "button_click").length,
    submissions: submissions.length,
    tapsByDay: buildTapsByDay(events, now, 7),
    topDevices: buildDevicePerformance(devices, events).slice(0, 10),
    topBusinesses: buildBusinessPerformance(events, submissions).slice(0, 10)
  };
}

function buildDevicePerformance(devices: DeviceRow[], events: TapEventRow[]): DevicePerformance[] {
  return devices
    .map((device) => {
      const deviceEvents = events.filter((event) => event.device_id === device.id);
      return {
        deviceId: device.id ?? "",
        deviceCode: device.device_code ?? "",
        status: device.status,
        tapCount: deviceEvents.length,
        destinationClicks: deviceEvents.filter((event) => event.event_type === "button_click").length
      };
    })
    .filter((device) => device.deviceId && device.deviceCode)
    .sort((a, b) => b.tapCount - a.tapCount);
}

function buildBusinessPerformance(events: TapEventRow[], submissions: SubmissionRow[]) {
  const businessIds = new Set<string>();
  for (const event of events) {
    if (event.business_id) businessIds.add(event.business_id);
  }
  for (const submission of submissions) {
    if (submission.business_id) businessIds.add(submission.business_id);
  }

  return Array.from(businessIds)
    .map((businessId) => ({
      businessId,
      tapCount: events.filter((event) => event.business_id === businessId).length,
      submissions: submissions.filter((submission) => submission.business_id === businessId).length
    }))
    .sort((a, b) => b.tapCount - a.tapCount);
}

function buildTapsByDay(events: TapEventRow[], now: Date, days: number): TapsByDay[] {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (days - 1 - index));
    const dateKey = date.toISOString().slice(0, 10);

    return {
      date: dateKey,
      count: events.filter((event) => event.created_at?.slice(0, 10) === dateKey).length
    };
  });
}

function countSince(events: TapEventRow[], now: Date, days: number) {
  const threshold = new Date(now);
  threshold.setUTCDate(threshold.getUTCDate() - days);

  return events.filter((event) => {
    if (!event.created_at) return false;
    const eventDate = new Date(event.created_at);
    return Number.isFinite(eventDate.getTime()) && eventDate >= threshold && eventDate <= now;
  }).length;
}

function normalizeEvents(value: unknown): TapEventRow[] {
  return Array.isArray(value) ? value.map(readRecord).map((row) => ({
    device_id: readString(row.device_id),
    business_id: readString(row.business_id),
    event_type: readString(row.event_type),
    destination_type: readString(row.destination_type),
    created_at: readString(row.created_at)
  })) : [];
}

function normalizeDevices(value: unknown): DeviceRow[] {
  return Array.isArray(value) ? value.map(readRecord).map((row) => ({
    id: readString(row.id),
    device_code: readString(row.device_code),
    business_id: readString(row.business_id),
    status: readString(row.status)
  })) : [];
}

function normalizeSubmissions(value: unknown): SubmissionRow[] {
  return Array.isArray(value) ? value.map(readRecord).map((row) => ({
    device_id: readString(row.device_id),
    business_id: readString(row.business_id),
    created_at: readString(row.created_at)
  })) : [];
}

function emptyDeviceSummary(deviceId: string): DeviceTapSummary {
  return {
    deviceId,
    totalTaps: 0,
    tapsLast7Days: 0,
    tapsLast30Days: 0,
    destinationClicks: 0,
    submissions: 0,
    tapsByDay: []
  };
}

function emptyBusinessSummary(businessId: string): BusinessTapSummary {
  return {
    businessId,
    totalTaps: 0,
    tapsLast7Days: 0,
    tapsLast30Days: 0,
    destinationClicks: 0,
    submissions: 0,
    tapsByDay: [],
    topDevices: []
  };
}

function emptyAdminSummary(): AdminPlatformSummary {
  return {
    totalDevices: 0,
    activeDevices: 0,
    unactivatedDevices: 0,
    tapsLast7Days: 0,
    tapsLast30Days: 0,
    destinationClicks: 0,
    submissions: 0,
    tapsByDay: [],
    topDevices: [],
    topBusinesses: []
  };
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}
