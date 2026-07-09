import { unstable_noStore as noStore } from "next/cache";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import type { HomepageContentInput, PageContentInput, ProductContentInput } from "@/lib/validators";

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
    eyebrow: "Google Review NFC Stands",
    heroTitle: "Get more Google reviews with one tap.",
    heroDescription:
      "Tap Rater NFC review stands and plates help customers open your Google review, Facebook review, Yelp review, or feedback link instantly.",
    primaryButtonLabel: "Shop products",
    primaryButtonHref: "/shop",
    secondaryButtonLabel: "Setup TapRater",
    secondaryButtonHref: "/setup-new-taprater",
    featuredBadge: "Best seller",
    featuredLabel: "Featured Google Review Stand"
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
    seo_title: input.seoTitle ?? null,
    seo_description: input.seoDescription ?? null,
    is_active: input.isActive
  });
}

async function upsertOrThrow(client: CmsDbClient, table: string, values: Record<string, unknown>) {
  const { error } = await client.from(table).upsert(values);

  if (error) {
    throw new Error(error.message);
  }
}
