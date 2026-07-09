import { unstable_noStore as noStore } from "next/cache";
import { migratedProducts, type MigratedProduct } from "@/data/migrated-products";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { getCategoryBySlug, getProductBySlug } from "@/lib/products";

type ProductQueryResult = PromiseLike<{ data: unknown[] | null; error: null | { message: string } }>;

export type ProductRepositoryClient = {
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: boolean) => ProductQueryResult;
    };
  };
};

type ProductRow = Record<string, unknown>;

export function staticStorefrontProducts(): MigratedProduct[] {
  return migratedProducts.filter((product) => product.isActive);
}

export async function getStorefrontProducts(): Promise<MigratedProduct[]> {
  noStore();

  if (!hasSupabaseAdminConfig()) {
    return staticStorefrontProducts();
  }

  try {
    return await getStorefrontProductsFromClient(getSupabaseAdmin() as ProductRepositoryClient);
  } catch {
    return staticStorefrontProducts();
  }
}

export async function getStorefrontProductBySlug(slug: string): Promise<MigratedProduct | undefined> {
  const products = await getStorefrontProducts();

  return products.find((product) => product.slug === slug && product.isActive);
}

export async function getStorefrontProductsByCategory(slug: string): Promise<MigratedProduct[]> {
  const products = await getStorefrontProducts();
  const categorySlug = getCategoryBySlug(slug)?.slug ?? slug;

  return products.filter((product) => product.categorySlug === categorySlug && product.isActive);
}

export function getStorefrontRelatedProducts(product: MigratedProduct, products: MigratedProduct[], limit = 3): MigratedProduct[] {
  const sameCategory = products.filter((item) => item.slug !== product.slug && item.categorySlug === product.categorySlug);
  const fallback = products.filter((item) => item.slug !== product.slug && item.categorySlug !== product.categorySlug);

  return [...sameCategory, ...fallback].slice(0, limit);
}

export async function getStorefrontProductsFromClient(client: ProductRepositoryClient): Promise<MigratedProduct[]> {
  const { data, error } = await client.from("products").select("*").eq("is_active", true);

  if (error || !data) {
    return staticStorefrontProducts();
  }

  const products = data
    .map((row) => normalizeStorefrontProductRow(row))
    .filter((product): product is MigratedProduct => Boolean(product?.isActive));

  return products.length > 0 ? products : staticStorefrontProducts();
}

export function normalizeStorefrontProductRow(row: unknown): MigratedProduct | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const productRow = row as ProductRow;
  const slug = readString(productRow.slug);
  const staticProduct = slug ? getProductBySlug(slug) : undefined;
  const title = readString(productRow.title) ?? staticProduct?.title;
  const sku = readString(productRow.sku) ?? staticProduct?.sku;
  const categorySlug = readString(productRow.category_slug) ?? readString(productRow.categorySlug) ?? staticProduct?.categorySlug;
  const basePriceCents = readNumber(productRow.base_price_cents) ?? readNumber(productRow.basePriceCents) ?? staticProduct?.basePriceCents;
  const stockStatus = readStockStatus(productRow.stock_status) ?? readStockStatus(productRow.stockStatus) ?? staticProduct?.stockStatus;
  const shortDescription =
    readString(productRow.short_description) ?? readString(productRow.shortDescription) ?? staticProduct?.shortDescription;
  const description = readString(productRow.description) ?? staticProduct?.description;
  const productType =
    readProductType(productRow.product_type) ?? readProductType(productRow.productType) ?? staticProduct?.productType ?? "physical_redirect";
  const serviceMode = readServiceMode(productRow.service_mode) ?? readServiceMode(productRow.serviceMode) ?? staticProduct?.serviceMode;
  const checkoutMode = readCheckoutMode(productRow.checkout_mode) ?? readCheckoutMode(productRow.checkoutMode) ?? staticProduct?.checkoutMode ?? "buy_now";
  const requiresAccount =
    readBoolean(productRow.requires_account) ?? readBoolean(productRow.requiresAccount) ?? staticProduct?.requiresAccount ?? false;
  const requiresSubscription =
    readBoolean(productRow.requires_subscription) ?? readBoolean(productRow.requiresSubscription) ?? staticProduct?.requiresSubscription;
  const requiresLandingPage =
    readBoolean(productRow.requires_landing_page) ?? readBoolean(productRow.requiresLandingPage) ?? staticProduct?.requiresLandingPage;
  const supportedDestinations =
    readSupportedDestinations(productRow.supported_destinations) ??
    readSupportedDestinations(productRow.supportedDestinations) ??
    staticProduct?.supportedDestinations ??
    ["custom"];
  const activationType =
    readActivationType(productRow.activation_type) ?? readActivationType(productRow.activationType) ?? staticProduct?.activationType;
  const includedServiceLabel =
    readString(productRow.included_service_label) ?? readString(productRow.includedServiceLabel) ?? staticProduct?.includedServiceLabel;

  if (
    !slug ||
    !title ||
    !sku ||
    !categorySlug ||
    basePriceCents === undefined ||
    !stockStatus ||
    !shortDescription ||
    !description ||
    !productType ||
    !serviceMode ||
    !checkoutMode ||
    requiresAccount === undefined ||
    requiresSubscription === undefined ||
    requiresLandingPage === undefined ||
    !activationType ||
    !includedServiceLabel
  ) {
    return null;
  }

  return {
    slug,
    title,
    sku,
    categorySlug: categorySlug as MigratedProduct["categorySlug"],
    basePriceCents,
    salePriceCents: readNumber(productRow.sale_price_cents) ?? readNumber(productRow.salePriceCents),
    stockStatus,
    shortDescription,
    description,
    productType,
    serviceMode,
    checkoutMode,
    requiresAccount,
    requiresSubscription,
    requiresLandingPage,
    supportedDestinations,
    activationType,
    includedServiceLabel,
    images: readImages(productRow.images) ?? staticProduct?.images ?? [],
    variants: readVariants(productRow.variants) ?? staticProduct?.variants ?? [],
    isActive: readBoolean(productRow.is_active) ?? readBoolean(productRow.isActive) ?? true,
    seoTitle: readString(productRow.seo_title) ?? readString(productRow.seoTitle) ?? staticProduct?.seoTitle,
    seoDescription: readString(productRow.seo_description) ?? readString(productRow.seoDescription) ?? staticProduct?.seoDescription,
    searchKeywords:
      readStringArray(productRow.search_keywords) ?? readStringArray(productRow.searchKeywords) ?? staticProduct?.searchKeywords
  };
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function readStockStatus(value: unknown): MigratedProduct["stockStatus"] | undefined {
  return value === "instock" || value === "outofstock" ? value : undefined;
}

function readServiceMode(value: unknown): MigratedProduct["serviceMode"] | undefined {
  if (value === "premium_landing_page") {
    return "hosted_landing_page";
  }

  return value === "basic_redirect" || value === "managed_redirect" || value === "hosted_landing_page" || value === "multi_location_platform"
    ? value
    : undefined;
}

function readProductType(value: unknown): MigratedProduct["productType"] | undefined {
  return value === "physical_redirect" || value === "physical_managed" || value === "platform_landing_page" || value === "bundle"
    ? value
    : undefined;
}

function readCheckoutMode(value: unknown): MigratedProduct["checkoutMode"] | undefined {
  return value === "buy_now" || value === "request_quote" || value === "subscription" || value === "contact_sales" ? value : undefined;
}

function readSupportedDestinations(value: unknown): MigratedProduct["supportedDestinations"] | undefined {
  const destinations: MigratedProduct["supportedDestinations"][number][] = [
    "google",
    "facebook",
    "yelp",
    "tripadvisor",
    "instagram",
    "tiktok",
    "booking",
    "website",
    "menu",
    "wifi",
    "feedback",
    "referral",
    "custom"
  ];

  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value.filter((item): item is MigratedProduct["supportedDestinations"][number] => {
    return destinations.includes(item as MigratedProduct["supportedDestinations"][number]);
  });
  return normalized.length > 0 ? normalized : undefined;
}

function readActivationType(value: unknown): MigratedProduct["activationType"] | undefined {
  return value === "free_basic_activation" || value === "managed_setup" || value === "premium_hosted_activation" ? value : undefined;
}

function readStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : undefined;
}

function readImages(value: unknown): MigratedProduct["images"] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const images = value.filter((item): item is { src: string; alt: string } => {
    return Boolean(
      item &&
        typeof item === "object" &&
        typeof (item as { src?: unknown }).src === "string" &&
        typeof (item as { alt?: unknown }).alt === "string"
    );
  });

  return images.length > 0 ? images : undefined;
}

function readVariants(value: unknown): MigratedProduct["variants"] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const variants = value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const variant = item as { id?: unknown; label?: unknown; sku?: unknown; stockStatus?: unknown; stock_status?: unknown };
    const id = readString(variant.id);
    const label = readString(variant.label);
    const sku = readString(variant.sku);
    const stockStatus = readStockStatus(variant.stockStatus ?? variant.stock_status);

    return id && label && sku && stockStatus ? [{ id, label, sku, stockStatus }] : [];
  });

  return variants.length > 0 ? variants : undefined;
}
