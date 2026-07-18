import { unstable_noStore as noStore } from "next/cache";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import type {
  AdminConfigInput,
  HomepageContentInput,
  PageContentInput,
  ProductContentInput,
  ShippingConfigInput,
  TaxConfigInput
} from "@/lib/validators";

type UpsertResult = PromiseLike<{ error: null | { message: string } }>;
type SelectSingleResult<T> = PromiseLike<{ data: T | null; error: null | { message: string } }>;

export type CmsDbClient = {
  from: (table: string) => {
    upsert: (values: Record<string, unknown>) => UpsertResult;
    select: (columns?: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: <T = { payload?: unknown }>() => SelectSingleResult<T>;
      };
    };
  };
};

export function getDefaultHomepageContent(): HomepageContentInput {
  return {
    eyebrow: "Tap Rater for local businesses",
    heroTitle: "NFC review stands and smart reputation pages for local businesses.",
    heroDescription:
      "Help customers tap or scan to open reviews, social links, menus, booking pages, feedback forms, or hosted Tap Rater pages with setup and tracking options built in.",
    primaryButtonLabel: "Shop NFC Products",
    primaryButtonHref: "/shop",
    secondaryButtonLabel: "Explore Platform Options",
    secondaryButtonHref: "#platform-preview",
    featuredBadge: "Phase 1 products",
    featuredLabel: "Stands and plates"
  };
}

export async function getHomepageContent(): Promise<HomepageContentInput> {
  noStore();

  if (!hasSupabaseAdminConfig()) {
    return getDefaultHomepageContent();
  }

  const result = await (getSupabaseAdmin() as CmsDbClient)
    .from("site_content")
    .select("payload")
    .eq("key", "homepage")
    .maybeSingle<{ payload?: HomepageContentInput }>();

  return result.data?.payload ?? getDefaultHomepageContent();
}

export async function saveHomepageContent(client: CmsDbClient, input: HomepageContentInput) {
  await upsertOrThrow(client, "site_content", {
    key: "homepage",
    type: "homepage",
    status: "published",
    payload: input
  });
}

export async function savePageContent(client: CmsDbClient, input: PageContentInput) {
  await upsertOrThrow(client, "site_content", {
    key: `page:${input.slug}`,
    type: "page",
    status: input.status,
    payload: input
  });
}

export async function saveAdminConfig(client: CmsDbClient, input: AdminConfigInput) {
  await upsertOrThrow(client, "site_content", {
    key: `admin:${input.area}`,
    type: "section",
    status: input.status,
    payload: input
  });
}

export async function getAdminConfig(area: string): Promise<AdminConfigInput | null> {
  noStore();

  if (!hasSupabaseAdminConfig()) {
    return null;
  }

  try {
    const result = await (getSupabaseAdmin() as CmsDbClient)
      .from("site_content")
      .select("payload")
      .eq("key", `admin:${area}`)
      .maybeSingle<{ payload?: AdminConfigInput }>();

    return result.data?.payload ?? null;
  } catch {
    return null;
  }
}

export async function saveShippingConfig(client: CmsDbClient, input: ShippingConfigInput) {
  await upsertOrThrow(client, "site_content", {
    key: "shipping_config",
    type: "section",
    status: "published",
    payload: input
  });
}

export async function getShippingConfig(): Promise<ShippingConfigInput | null> {
  noStore();

  if (!hasSupabaseAdminConfig()) {
    return null;
  }

  try {
    const result = await (getSupabaseAdmin() as CmsDbClient)
      .from("site_content")
      .select("payload")
      .eq("key", "shipping_config")
      .maybeSingle<{ payload?: ShippingConfigInput }>();

    return result.data?.payload ?? null;
  } catch {
    return null;
  }
}

export async function saveTaxConfig(client: CmsDbClient, input: TaxConfigInput) {
  await upsertOrThrow(client, "site_content", {
    key: "tax_config",
    type: "section",
    status: "published",
    payload: input
  });
}

export function getDefaultTaxConfig(): TaxConfigInput {
  return {
    provider: "manual",
    // Company registered in Virginia -- 6% is the starting rate. Structured as
    // a list (not a hardcoded constant) specifically so more states can be
    // added later with their own rate, without a code change.
    stateRates: [{ state: "VA", ratePercent: 6 }],
    pricesIncludeTax: false,
    notes: "Company registered in Virginia. Add more states here as nexus is established elsewhere."
  };
}

export async function getTaxConfig(): Promise<TaxConfigInput> {
  noStore();

  if (!hasSupabaseAdminConfig()) {
    return getDefaultTaxConfig();
  }

  try {
    const result = await (getSupabaseAdmin() as CmsDbClient)
      .from("site_content")
      .select("payload")
      .eq("key", "tax_config")
      .maybeSingle<{ payload?: TaxConfigInput }>();

    return result.data?.payload ?? getDefaultTaxConfig();
  } catch {
    return getDefaultTaxConfig();
  }
}

export async function saveProductContent(client: CmsDbClient, input: ProductContentInput) {
  await upsertOrThrow(client, "products", {
    slug: input.slug,
    title: input.title,
    sku: input.sku,
    category_slug: input.categorySlug,
    base_price_cents: input.basePriceCents,
    sale_price_cents: input.salePriceCents ?? null,
    stock_status: input.stockStatus,
    short_description: input.shortDescription,
    description: input.description,
    product_type: input.productType,
    service_mode: input.serviceMode,
    checkout_mode: input.checkoutMode,
    requires_account: input.requiresAccount,
    requires_subscription: input.requiresSubscription,
    requires_landing_page: input.requiresLandingPage,
    supported_destinations: input.supportedDestinations,
    activation_type: input.activationType,
    included_service_label: input.includedServiceLabel,
    customization_options: input.customizationOptions,
    allows_logo_upload: input.allowsLogoUpload,
    allows_custom_design: input.allowsCustomDesign,
    design_mode: input.designMode,
    seo_title: input.seoTitle ?? null,
    seo_description: input.seoDescription ?? null,
    is_active: input.isActive,
    stand_category_slug: input.standCategorySlug ?? null,
    destination_type: input.destinationType ?? null,
    platform_slug: input.platformSlug ?? null,
    tags: input.tags,
    supports_logo: input.supportsLogo,
    supports_business_name: input.supportsBusinessName,
    supports_custom_headline: input.supportsCustomHeadline,
    supports_multiple_links: input.supportsMultipleLinks
  });
}

async function upsertOrThrow(client: CmsDbClient, table: string, values: Record<string, unknown>) {
  const { error } = await client.from(table).upsert(values);

  if (error) {
    throw new Error(error.message);
  }
}
