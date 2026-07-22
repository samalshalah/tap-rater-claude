import { createHash, randomBytes } from "node:crypto";
import type { MigratedProduct, StandCategorySlug } from "@/data/migrated-products";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { hashIpAddress } from "@/lib/device-redirect";
import { isSafeExternalUrl } from "@/lib/link-verification";
import {
  defaultLinkLabel,
  defaultLinkTypeForProduct,
  generateStandShortCode,
  getPermanentStandPath,
  getProductStandConfiguration,
  normalizeStandShortCode,
  standLinkTypes,
  standModes,
  standPrintStatuses,
  standStatuses,
  validateStandSetup,
  type CustomerStand,
  type CustomerStandBusiness,
  type HostedTapPageConfig,
  type StandDestinationLink,
  type StandLinkType,
  type StandMode,
  type StandPrintStatus,
  type StandStatus
} from "@/lib/stand-domain";

export type CustomerStandsDbClient = {
  from: (table: string) => any;
};

export type CustomerDashboardData = {
  configured: boolean;
  customer: { id: string; email: string; name?: string } | null;
  businesses: CustomerStandBusiness[];
  stands: CustomerStand[];
};

export type BusinessProfileInput = {
  businessId?: string;
  businessName: string;
  logoUrl?: string;
  websiteUrl?: string;
  phone?: string;
  address?: string;
};

export type StandSetupInput = {
  links: Array<{
    label: string;
    type: StandLinkType;
    provider?: string;
    url: string;
    isActive: boolean;
  }>;
  hostedPageConfig?: HostedTapPageConfig;
  completeSetup: boolean;
};

export type CreateCustomerStandInput = {
  ownerUserId: string;
  businessId: string;
  product: MigratedProduct;
  productId?: string;
  initialDestinationUrl?: string;
  orderItemKey?: string;
};

export type AdminCustomerStand = CustomerStand & {
  customerEmail?: string;
};

export type AdminStandUpdateInput = {
  status: StandStatus;
  printStatus: StandPrintStatus;
  nfcProgrammed: boolean;
  qrGenerated: boolean;
};

const standCategoryValues: StandCategorySlug[] = [
  "review-stands",
  "social-media-stands",
  "appointment-stands",
  "feedback-stands",
  "menu-info-stands",
  "website-link-stands",
  "payment-tip-donation-stands",
  "loyalty-rewards-stands",
  "custom-stands",
  "hosted-tap-page-stands"
];

export function isCustomerStandStoreConfigured() {
  return hasSupabaseAdminConfig();
}

export async function getPublicCustomerStand(shortCode: string) {
  if (!hasSupabaseAdminConfig()) return null;

  try {
    return await getPublicCustomerStandFromClient(getSupabaseAdmin() as CustomerStandsDbClient, shortCode);
  } catch {
    return null;
  }
}

export async function getPublicCustomerStandFromClient(client: CustomerStandsDbClient, shortCode: string): Promise<CustomerStand | null> {
  const publicSlug = normalizeStandShortCode(shortCode);
  if (!publicSlug) return null;

  const { data, error } = await client.from("devices").select("*").eq("public_slug", publicSlug).maybeSingle();
  if (error || !data) return null;

  return loadCustomerStandDetails(client, data);
}

export async function getCustomerDashboard(email: string): Promise<CustomerDashboardData> {
  if (!hasSupabaseAdminConfig()) return emptyDashboard(false);

  try {
    return await getCustomerDashboardFromClient(getSupabaseAdmin() as CustomerStandsDbClient, email);
  } catch {
    return emptyDashboard(true);
  }
}

export async function getCustomerDashboardFromClient(client: CustomerStandsDbClient, email: string): Promise<CustomerDashboardData> {
  const customer = await findCustomerByEmail(client, email);
  if (!customer) return emptyDashboard(true);

  const [businessResult, standResult] = await Promise.all([
    client.from("businesses").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false }),
    client.from("devices").select("*").eq("customer_id", customer.id).order("created_at", { ascending: false })
  ]);

  const businessRows: unknown[] = Array.isArray(businessResult.data) ? businessResult.data : [];
  const businesses: CustomerStandBusiness[] = businessRows
    .map(normalizeBusiness)
    .filter((business): business is CustomerStandBusiness => Boolean(business));
  const businessById = new Map(businesses.map((business) => [business.id, business]));
  const standRows: unknown[] = Array.isArray(standResult.data) ? standResult.data : [];
  const eventResults = await Promise.all(
    standRows.map((row) => {
      const standId = readString(readRecord(row).id);
      return standId ? client.from("tap_events").select("id").eq("device_id", standId) : Promise.resolve({ data: [], error: null });
    })
  );
  const tapCounts = new Map<string, number>();
  standRows.forEach((row, index) => {
    const standId = readString(readRecord(row).id);
    if (standId) tapCounts.set(standId, Array.isArray(eventResults[index]?.data) ? eventResults[index].data.length : 0);
  });
  const stands = (
    await Promise.all(
      standRows.map((row) =>
        loadCustomerStandDetails(client, row, {
          business: businessById.get(readString(readRecord(row).business_id) ?? ""),
          tapCount: tapCounts.get(readString(readRecord(row).id) ?? "") ?? 0
        })
      )
    )
  ).filter((stand): stand is CustomerStand => Boolean(stand));

  return { configured: true, customer, businesses, stands };
}

export async function getOwnedCustomerStand(email: string, shortCode: string) {
  if (!hasSupabaseAdminConfig()) return null;

  try {
    return await getOwnedCustomerStandFromClient(getSupabaseAdmin() as CustomerStandsDbClient, email, shortCode);
  } catch {
    return null;
  }
}

export async function getOwnedCustomerStandFromClient(
  client: CustomerStandsDbClient,
  email: string,
  shortCode: string
): Promise<CustomerStand | null> {
  const customer = await findCustomerByEmail(client, email);
  const publicSlug = normalizeStandShortCode(shortCode);
  if (!customer || !publicSlug) return null;

  const { data, error } = await client
    .from("devices")
    .select("*")
    .eq("public_slug", publicSlug)
    .eq("customer_id", customer.id)
    .maybeSingle();
  if (error || !data) return null;

  return loadCustomerStandDetails(client, data);
}

export async function saveOwnedBusinessProfile(email: string, input: BusinessProfileInput) {
  if (!hasSupabaseAdminConfig()) return { ok: false as const, error: "Database persistence is not configured." };

  return saveOwnedBusinessProfileWithClient(getSupabaseAdmin() as CustomerStandsDbClient, email, input);
}

export async function saveOwnedBusinessProfileWithClient(
  client: CustomerStandsDbClient,
  email: string,
  input: BusinessProfileInput
): Promise<{ ok: true; business: CustomerStandBusiness } | { ok: false; error: string }> {
  const customer = await findCustomerByEmail(client, email);
  if (!customer) return { ok: false, error: "Customer account was not found." };

  if (input.logoUrl && !isSafeExternalUrl(input.logoUrl)) {
    return { ok: false, error: "Logo URL must be a public http or https address." };
  }
  if (input.websiteUrl && !isSafeExternalUrl(input.websiteUrl)) {
    return { ok: false, error: "Website URL must be a public http or https address." };
  }

  const values = {
    business_name: input.businessName.trim(),
    logo_url: input.logoUrl?.trim() || null,
    website_url: input.websiteUrl?.trim() || null,
    phone: input.phone?.trim() || null,
    address: input.address?.trim() || null,
    updated_at: new Date().toISOString()
  };

  if (input.businessId) {
    const { data: existing, error: lookupError } = await client
      .from("businesses")
      .select("*")
      .eq("id", input.businessId)
      .eq("customer_id", customer.id)
      .maybeSingle();
    if (lookupError || !existing) return { ok: false, error: "Business was not found for this account." };

    const { data, error } = await client.from("businesses").update(values).eq("id", input.businessId).select("*").maybeSingle();
    const business = normalizeBusiness(data ?? { ...readRecord(existing), ...values });
    return error || !business ? { ok: false, error: error?.message ?? "Business could not be updated." } : { ok: true, business };
  }

  const { data, error } = await client
    .from("businesses")
    .insert({ customer_id: customer.id, ...values, status: "active" })
    .select("*")
    .maybeSingle();
  const business = normalizeBusiness(data);
  return error || !business ? { ok: false, error: error?.message ?? "Business could not be created." } : { ok: true, business };
}

export async function saveOwnedStandSetup(email: string, shortCode: string, input: StandSetupInput) {
  if (!hasSupabaseAdminConfig()) return { ok: false as const, error: "Database persistence is not configured." };

  return saveOwnedStandSetupWithClient(getSupabaseAdmin() as CustomerStandsDbClient, email, shortCode, input);
}

export async function saveOwnedStandSetupWithClient(
  client: CustomerStandsDbClient,
  email: string,
  shortCode: string,
  input: StandSetupInput
): Promise<{ ok: true; status: StandStatus; printStatus: StandPrintStatus } | { ok: false; error: string }> {
  const stand = await getOwnedCustomerStandFromClient(client, email, shortCode);
  if (!stand) return { ok: false, error: "Stand was not found for this account." };

  const links: StandDestinationLink[] = input.links.map((link, index) => ({
    label: link.label.trim(),
    type: link.type,
    provider: link.provider?.trim().toLowerCase() || undefined,
    url: link.url.trim(),
    sortOrder: index,
    isActive: link.isActive
  }));
  if (links.some((link) => !link.label || !standLinkTypes.includes(link.type) || !isSafeExternalUrl(link.url))) {
    return { ok: false, error: "Every destination needs a label and a public http or https URL." };
  }

  const validation = validateStandSetup(stand, links);
  if (input.completeSetup && !validation.ok) return { ok: false, error: validation.message };

  if (input.hostedPageConfig?.businessLogoUrl && !isSafeExternalUrl(input.hostedPageConfig.businessLogoUrl)) {
    return { ok: false, error: "Hosted-page logo URL must be a public http or https address." };
  }

  const { data: oldLinkRows } = await client.from("stand_destination_links").select("*").eq("customer_stand_id", stand.id);
  if (links.length) {
    const now = new Date().toISOString();
    const { error: insertError } = await client.from("stand_destination_links").insert(
      links.map((link) => ({
        customer_stand_id: stand.id,
        label: link.label,
        type: link.type,
        provider: link.provider ?? null,
        url: link.url,
        sort_order: link.sortOrder,
        is_active: link.isActive,
        updated_at: now
      }))
    );
    if (insertError) return { ok: false, error: insertError.message };
  }

  for (const oldLink of Array.isArray(oldLinkRows) ? oldLinkRows : []) {
    const id = readString(readRecord(oldLink).id);
    if (id) {
      const { error } = await client
        .from("stand_destination_links")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("customer_stand_id", stand.id);
      if (error) return { ok: false, error: error.message };
    }
  }

  if (stand.mode === "hosted_page" && input.hostedPageConfig) {
    const config = input.hostedPageConfig;
    const { error } = await client.from("hosted_tap_page_configs").upsert(
      {
        customer_stand_id: stand.id,
        page_title: config.pageTitle.trim(),
        page_subtitle: config.pageSubtitle?.trim() || null,
        business_logo_url: config.businessLogoUrl?.trim() || null,
        theme: config.theme?.trim() || null,
        primary_color: config.primaryColor?.trim() || null,
        updated_at: new Date().toISOString()
      },
      { onConflict: "customer_stand_id" }
    );
    if (error) return { ok: false, error: error.message };
  }

  const nextStatus = nextCustomerStandStatus(stand.status, validation.ok, input.completeSetup);
  const nextPrintStatus = nextCustomerStandPrintStatus(stand.printStatus, nextStatus);
  const primaryLink = links.filter((link) => link.isActive).sort((left, right) => left.sortOrder - right.sortOrder)[0];
  const { error: standUpdateError } = await client
    .from("devices")
    .update({
      stand_status: nextStatus,
      print_status: nextPrintStatus,
      destination_type: primaryLink ? legacyDestinationType(primaryLink.type, primaryLink.provider) : null,
      destination_url: primaryLink?.url ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("id", stand.id)
    .eq("customer_id", stand.ownerUserId);
  if (standUpdateError) return { ok: false, error: standUpdateError.message };

  return { ok: true, status: nextStatus, printStatus: nextPrintStatus };
}

export async function createCustomerStandWithClient(
  client: CustomerStandsDbClient,
  input: CreateCustomerStandInput
): Promise<CustomerStand> {
  const configuration = getProductStandConfiguration(input.product);
  if (!configuration.requiresCustomerSetup) {
    throw new Error("This product is not configured to create a Customer Stand.");
  }
  if (input.initialDestinationUrl && !isSafeExternalUrl(input.initialDestinationUrl)) {
    throw new Error("Initial destination must be a public http or https URL.");
  }

  if (input.orderItemKey) {
    const { data: existing } = await client.from("devices").select("*").eq("order_item_key", input.orderItemKey).maybeSingle();
    if (existing) {
      const existingStand = await loadCustomerStandDetails(client, existing);
      if (existingStand) return existingStand;
    }
  }

  const initialLinkType = defaultLinkTypeForProduct(input.product);
  const initialLinks: StandDestinationLink[] = input.initialDestinationUrl
    ? [
        {
          label: defaultLinkLabel(initialLinkType, input.product.platformSlug),
          type: initialLinkType,
          provider: input.product.platformSlug,
          url: input.initialDestinationUrl,
          sortOrder: 0,
          isActive: true
        }
      ]
    : [];
  const setup = validateStandSetup(
    { mode: configuration.defaultStandMode, requiredLinkTypes: configuration.requiredLinkTypes },
    initialLinks
  );
  const standStatus: StandStatus = setup.ok ? "ready_for_print" : "setup_required";
  const printStatus: StandPrintStatus = setup.ok ? "ready" : "not_ready";

  let createdRow: unknown = null;
  let lastError = "Customer Stand could not be created.";
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const publicSlug = generateStandShortCode();
    const permanentUrlPath = getPermanentStandPath(publicSlug);
    const { data, error } = await client
      .from("devices")
      .insert({
        device_code: `TR-${publicSlug.toUpperCase()}`,
        activation_code_hash: createInactiveActivationHash(),
        product_type: legacyProductType(input.product),
        service_mode: configuration.defaultStandMode === "hosted_page" ? "premium_landing_page" : "basic_redirect",
        status: "active",
        customer_id: input.ownerUserId,
        business_id: input.businessId,
        destination_type: initialLinks[0] ? legacyDestinationType(initialLinks[0].type, initialLinks[0].provider) : null,
        destination_url: initialLinks[0]?.url ?? null,
        label: input.product.title,
        product_id: input.productId ?? null,
        product_slug: input.product.slug,
        product_name: input.product.title,
        stand_category: configuration.standCategory,
        public_slug: publicSlug,
        permanent_url_path: permanentUrlPath,
        stand_mode: configuration.defaultStandMode,
        stand_status: standStatus,
        print_status: printStatus,
        nfc_programmed: false,
        qr_generated: false,
        required_link_types: configuration.requiredLinkTypes,
        supported_providers: configuration.supportedProviders,
        order_item_key: input.orderItemKey ?? null
      })
      .select("*")
      .maybeSingle();

    if (!error && data) {
      createdRow = data;
      break;
    }

    lastError = error?.message ?? lastError;
    if (input.orderItemKey && isCollisionError(lastError)) {
      const { data: existing } = await client.from("devices").select("*").eq("order_item_key", input.orderItemKey).maybeSingle();
      if (existing) {
        const existingStand = await loadCustomerStandDetails(client, existing);
        if (existingStand) return existingStand;
      }
    }
    if (!isCollisionError(lastError)) break;
  }

  const standId = readString(readRecord(createdRow).id);
  if (!createdRow || !standId) throw new Error(lastError);

  if (initialLinks.length) {
    const { error } = await client.from("stand_destination_links").insert(
      initialLinks.map((link) => ({
        customer_stand_id: standId,
        label: link.label,
        type: link.type,
        provider: link.provider ?? null,
        url: link.url,
        sort_order: link.sortOrder,
        is_active: link.isActive
      }))
    );
    if (error) throw new Error(error.message);
  }

  if (configuration.defaultStandMode === "hosted_page") {
    const { error } = await client.from("hosted_tap_page_configs").insert({
      customer_stand_id: standId,
      page_title: input.product.title,
      page_subtitle: null,
      business_logo_url: null,
      theme: "light",
      primary_color: "#0a6c64"
    });
    if (error) throw new Error(error.message);
  }

  const stand = await loadCustomerStandDetails(client, createdRow);
  if (!stand) throw new Error("Created Customer Stand could not be loaded.");
  return stand;
}

export async function createAssignedCustomerStand(
  input: { customerEmail: string; businessName: string; product: MigratedProduct; initialDestinationUrl?: string }
) {
  if (!hasSupabaseAdminConfig()) throw new Error("Database persistence is not configured.");
  return createAssignedCustomerStandWithClient(getSupabaseAdmin() as CustomerStandsDbClient, input);
}

export async function createAssignedCustomerStandWithClient(
  client: CustomerStandsDbClient,
  input: { customerEmail: string; businessName: string; product: MigratedProduct; initialDestinationUrl?: string }
) {
  const email = input.customerEmail.trim().toLowerCase();
  let customer = await findCustomerByEmail(client, email);
  if (!customer) {
    const { data, error } = await client
      .from("customers")
      .insert({ email, role: "customer" })
      .select("id,email,name")
      .maybeSingle();
    customer = normalizeCustomer(data);
    if (error || !customer) throw new Error(error?.message ?? "Customer could not be created.");
  }

  const { data: existingBusiness } = await client
    .from("businesses")
    .select("*")
    .eq("customer_id", customer.id)
    .eq("business_name", input.businessName.trim())
    .maybeSingle();
  let business = normalizeBusiness(existingBusiness);
  if (!business) {
    const { data, error } = await client
      .from("businesses")
      .insert({ customer_id: customer.id, business_name: input.businessName.trim(), status: "active" })
      .select("*")
      .maybeSingle();
    business = normalizeBusiness(data);
    if (error || !business) throw new Error(error?.message ?? "Business could not be created.");
  }

  return createCustomerStandWithClient(client, {
    ownerUserId: customer.id,
    businessId: business.id,
    product: input.product,
    initialDestinationUrl: input.initialDestinationUrl
  });
}

export async function getAdminCustomerStands(): Promise<AdminCustomerStand[]> {
  if (!hasSupabaseAdminConfig()) return [];

  try {
    return await getAdminCustomerStandsFromClient(getSupabaseAdmin() as CustomerStandsDbClient);
  } catch {
    return [];
  }
}

export async function getAdminCustomerStandsFromClient(client: CustomerStandsDbClient): Promise<AdminCustomerStand[]> {
  const [{ data: rows }, { data: events }] = await Promise.all([
    client.from("devices").select("*, customers(email), businesses(business_name)").order("created_at", { ascending: false }),
    client.from("tap_events").select("device_id")
  ]);
  const tapCounts = countTapEvents(events);

  const adminRows: unknown[] = Array.isArray(rows) ? rows : [];
  const stands: Array<AdminCustomerStand | null> = await Promise.all(
      adminRows.map(async (row): Promise<AdminCustomerStand | null> => {
        const record = readRecord(row);
        const stand = await loadCustomerStandDetails(client, row, { tapCount: tapCounts.get(readString(record.id) ?? "") ?? 0 });
        if (!stand) return null;
        const customerEmail = readNestedString(record.customers, "email");
        return customerEmail ? { ...stand, customerEmail } : stand;
      })
    );
  return stands.filter((stand): stand is AdminCustomerStand => Boolean(stand));
}

export async function updateAdminCustomerStand(id: string, input: AdminStandUpdateInput) {
  if (!hasSupabaseAdminConfig()) throw new Error("Database persistence is not configured.");
  return updateAdminCustomerStandWithClient(getSupabaseAdmin() as CustomerStandsDbClient, id, input);
}

export async function updateAdminCustomerStandWithClient(client: CustomerStandsDbClient, id: string, input: AdminStandUpdateInput) {
  if (!standStatuses.includes(input.status) || !standPrintStatuses.includes(input.printStatus)) {
    throw new Error("Stand status is invalid.");
  }
  const legacyStatus = input.status === "paused" ? "paused" : input.status === "archived" ? "retired" : "active";
  const { error } = await client
    .from("devices")
    .update({
      stand_status: input.status,
      print_status: input.printStatus,
      nfc_programmed: input.nfcProgrammed,
      qr_generated: input.qrGenerated,
      status: legacyStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function logCustomerStandTap(
  stand: CustomerStand,
  context: { ipAddress?: string; userAgent?: string; referrer?: string; eventType?: "redirect" | "landing_page_view" }
) {
  if (!hasSupabaseAdminConfig()) return;

  try {
    await (getSupabaseAdmin() as CustomerStandsDbClient).from("tap_events").insert({
      device_id: stand.id,
      business_id: stand.businessId,
      event_type: context.eventType ?? (stand.mode === "redirect" ? "redirect" : "landing_page_view"),
      destination_type: stand.destinationLinks[0]?.type ?? null,
      ip_hash: hashIpAddress(context.ipAddress),
      user_agent: context.userAgent ?? null,
      referrer: context.referrer ?? null
    });
  } catch {
    // Public stand resolution must not depend on analytics durability.
  }
}

async function loadCustomerStandDetails(
  client: CustomerStandsDbClient,
  row: unknown,
  options: { business?: CustomerStandBusiness; tapCount?: number } = {}
): Promise<CustomerStand | null> {
  const base = normalizeCustomerStand(row, options.tapCount ?? 0);
  if (!base) return null;

  const [linkResult, configResult, businessResult] = await Promise.all([
    client.from("stand_destination_links").select("*").eq("customer_stand_id", base.id).order("sort_order", { ascending: true }),
    client.from("hosted_tap_page_configs").select("*").eq("customer_stand_id", base.id).maybeSingle(),
    options.business
      ? Promise.resolve({ data: null, error: null })
      : client.from("businesses").select("*").eq("id", base.businessId).maybeSingle()
  ]);

  return {
    ...base,
    destinationLinks: Array.isArray(linkResult.data)
      ? linkResult.data.map(normalizeDestinationLink).filter((link: StandDestinationLink | null): link is StandDestinationLink => Boolean(link))
      : legacyDestinationLinks(row),
    hostedPageConfig: normalizeHostedConfig(configResult.data) ?? undefined,
    business: options.business ?? normalizeBusiness(businessResult.data) ?? undefined
  };
}

function normalizeCustomerStand(row: unknown, tapCount: number): CustomerStand | null {
  const value = readRecord(row);
  const id = readString(value.id);
  const businessId = readString(value.business_id);
  const ownerUserId = readString(value.customer_id);
  const deviceCode = readString(value.device_code);
  const publicSlug = readString(value.public_slug) ?? (deviceCode ? normalizeStandShortCode(deviceCode) ?? undefined : undefined);
  const standCategory = readStandCategory(value.stand_category);
  const mode = readEnum(value.stand_mode, standModes) ?? (value.service_mode === "premium_landing_page" ? "hosted_page" : "redirect");
  const status = readEnum(value.stand_status, standStatuses) ?? legacyStandStatus(value.status);
  const printStatus = readEnum(value.print_status, standPrintStatuses) ?? "not_ready";

  if (!id || !businessId || !ownerUserId || !publicSlug || !standCategory || !mode || !status || !printStatus) return null;

  return {
    id,
    businessId,
    ownerUserId,
    productId: readString(value.product_id),
    productSlug: readString(value.product_slug) ?? readString(value.product_type) ?? "tap-rater-stand",
    productName: readString(value.product_name) ?? readString(value.label) ?? "Tap Rater Stand",
    standCategory,
    publicSlug,
    permanentUrlPath: readString(value.permanent_url_path) ?? getPermanentStandPath(publicSlug),
    mode,
    status,
    printStatus,
    nfcProgrammed: readBoolean(value.nfc_programmed),
    qrGenerated: readBoolean(value.qr_generated),
    requiredLinkTypes: readStringArray(value.required_link_types).filter((type): type is StandLinkType => standLinkTypes.includes(type as StandLinkType)),
    supportedProviders: readStringArray(value.supported_providers),
    destinationLinks: [],
    tapCount,
    createdAt: readString(value.created_at),
    updatedAt: readString(value.updated_at)
  };
}

function normalizeDestinationLink(row: unknown): StandDestinationLink | null {
  const value = readRecord(row);
  const label = readString(value.label);
  const url = readString(value.url);
  const type = readEnum(value.type, standLinkTypes);
  if (!label || !url || !type || !isSafeExternalUrl(url)) return null;

  return {
    id: readString(value.id),
    label,
    type,
    provider: readString(value.provider),
    url,
    sortOrder: readNumber(value.sort_order) ?? 0,
    isActive: value.is_active !== false
  };
}

function normalizeHostedConfig(row: unknown): HostedTapPageConfig | null {
  const value = readRecord(row);
  const pageTitle = readString(value.page_title);
  if (!pageTitle) return null;
  const businessLogoUrl = readString(value.business_logo_url);

  return {
    pageTitle,
    pageSubtitle: readString(value.page_subtitle),
    businessLogoUrl: businessLogoUrl && isSafeExternalUrl(businessLogoUrl) ? businessLogoUrl : undefined,
    theme: readString(value.theme),
    primaryColor: readString(value.primary_color)
  };
}

function normalizeBusiness(row: unknown): CustomerStandBusiness | null {
  const value = readRecord(row);
  const id = readString(value.id);
  const businessName = readString(value.business_name);
  if (!id || !businessName) return null;

  return {
    id,
    businessName,
    logoUrl: readString(value.logo_url),
    websiteUrl: readString(value.website_url),
    phone: readString(value.phone),
    address: readString(value.address)
  };
}

function normalizeCustomer(row: unknown) {
  const value = readRecord(row);
  const id = readString(value.id);
  const email = readString(value.email);
  return id && email ? { id, email, name: readString(value.name) } : null;
}

async function findCustomerByEmail(client: CustomerStandsDbClient, email: string) {
  const { data, error } = await client.from("customers").select("id,email,name").eq("email", email.trim().toLowerCase()).maybeSingle();
  return error ? null : normalizeCustomer(data);
}

function legacyDestinationLinks(row: unknown): StandDestinationLink[] {
  const value = readRecord(row);
  const url = readString(value.destination_url);
  if (!url || !isSafeExternalUrl(url)) return [];
  const type = legacyLinkType(value.destination_type);
  return [{ label: defaultLinkLabel(type), type, url, sortOrder: 0, isActive: true }];
}

function legacyLinkType(value: unknown): StandLinkType {
  if (value === "google_review" || value === "facebook_review" || value === "yelp_profile") return "review";
  if (value === "booking") return "booking";
  if (value === "social") return "social";
  if (value === "menu" || value === "wifi") return "menu";
  return "custom";
}

function legacyDestinationType(type: StandLinkType, provider?: string) {
  if (type === "review" && provider === "google") return "google_review";
  if (type === "review" && provider === "facebook") return "facebook_review";
  if (type === "review" && provider === "yelp") return "yelp_profile";
  if (type === "booking") return "booking";
  if (type === "social") return "social";
  if (type === "menu") return "menu";
  return "custom";
}

function legacyProductType(product: MigratedProduct) {
  if (product.destinationType === "review" && product.platformSlug === "google") return "google_review";
  if (product.destinationType === "review" && product.platformSlug === "facebook") return "facebook_review";
  if (product.destinationType === "review" && product.platformSlug === "yelp") return "yelp_profile";
  if (product.destinationType === "review") return "multi_platform_review";
  if (product.destinationType === "appointment") return "appointment_booking";
  if (product.destinationType === "social") return "social_follow";
  if (product.destinationType === "menu_info") return "wifi_menu";
  if (product.destinationType === "feedback") return "feedback_form";
  if (product.destinationType === "hosted_page") return "business_card";
  return "custom_url";
}

function legacyStandStatus(value: unknown): StandStatus {
  if (value === "paused") return "paused";
  if (value === "lost" || value === "retired") return "archived";
  if (value === "active") return "active";
  return "setup_required";
}

function nextCustomerStandStatus(current: StandStatus, setupIsValid: boolean, completeSetup: boolean): StandStatus {
  if (current === "paused" || current === "archived") return current;
  if (!setupIsValid) return "setup_required";
  if (current === "active") return "active";
  return completeSetup || current === "ready_for_print" ? "ready_for_print" : "setup_required";
}

function nextCustomerStandPrintStatus(current: StandPrintStatus, status: StandStatus): StandPrintStatus {
  if (current === "printed" || current === "shipped") return current;
  return status === "ready_for_print" || status === "active" ? "ready" : "not_ready";
}

function createInactiveActivationHash() {
  return createHash("sha256").update(randomBytes(32)).digest("hex");
}

function isCollisionError(message: string) {
  return /duplicate|unique|public_slug|device_code|order_item_key/i.test(message);
}

function countTapEvents(rows: unknown) {
  const counts = new Map<string, number>();
  for (const row of Array.isArray(rows) ? rows : []) {
    const id = readString(readRecord(row).device_id);
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

function emptyDashboard(configured: boolean): CustomerDashboardData {
  return { configured, customer: null, businesses: [], stands: [] };
}

function readStandCategory(value: unknown): StandCategorySlug | undefined {
  return standCategoryValues.includes(value as StandCategorySlug) ? (value as StandCategorySlug) : undefined;
}

function readEnum<const T extends readonly string[]>(value: unknown, values: T): T[number] | undefined {
  return typeof value === "string" && values.includes(value as T[number]) ? (value as T[number]) : undefined;
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readNestedString(value: unknown, key: string) {
  return readString(readRecord(value)[key]);
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readBoolean(value: unknown) {
  return value === true;
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
}
