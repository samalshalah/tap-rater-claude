import type { MigratedProduct, StandCategorySlug, SupportedDestination } from "@/data/migrated-products";
import { isSafeExternalUrl } from "@/lib/link-verification";

export const standModes = ["redirect", "hosted_page"] as const;
export const standStatuses = ["setup_required", "ready_for_print", "active", "paused", "archived"] as const;
export const standPrintStatuses = ["not_ready", "ready", "printed", "shipped"] as const;
export const standLinkTypes = ["review", "social", "booking", "menu", "website", "phone", "email", "map", "survey", "custom"] as const;

export type StandMode = (typeof standModes)[number];
export type StandStatus = (typeof standStatuses)[number];
export type StandPrintStatus = (typeof standPrintStatuses)[number];
export type StandLinkType = (typeof standLinkTypes)[number];

export type StandDestinationLink = {
  id?: string;
  label: string;
  type: StandLinkType;
  provider?: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
};

export type HostedTapPageConfig = {
  pageTitle: string;
  pageSubtitle?: string;
  businessLogoUrl?: string;
  theme?: string;
  primaryColor?: string;
};

export type CustomerStandBusiness = {
  id: string;
  businessName: string;
  logoUrl?: string;
  websiteUrl?: string;
  phone?: string;
  address?: string;
};

export type CustomerStand = {
  id: string;
  businessId: string;
  ownerUserId: string;
  productId?: string;
  productSlug: string;
  productName: string;
  standCategory: StandCategorySlug;
  publicSlug: string;
  permanentUrlPath: string;
  mode: StandMode;
  status: StandStatus;
  printStatus: StandPrintStatus;
  nfcProgrammed: boolean;
  qrGenerated: boolean;
  requiredLinkTypes: StandLinkType[];
  supportedProviders: string[];
  destinationLinks: StandDestinationLink[];
  hostedPageConfig?: HostedTapPageConfig;
  business?: CustomerStandBusiness;
  tapCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductStandConfiguration = {
  requiresCustomerSetup: boolean;
  defaultStandMode: StandMode;
  standCategory: StandCategorySlug;
  requiredLinkTypes: StandLinkType[];
  supportedProviders: string[];
};

export type StandSetupValidation =
  | { ok: true }
  | { ok: false; missingLinkTypes: StandLinkType[]; message: string };

export type PublicStandAction =
  | { type: "not_found" }
  | { type: "unavailable"; reason: "paused" | "archived" }
  | { type: "not_configured" }
  | { type: "redirect"; destinationUrl: string }
  | { type: "hosted_page"; links: StandDestinationLink[] };

const shortCodeAlphabet = "abcdefghjkmnpqrstuvwxyz23456789";
const shortCodePattern = /^[a-z0-9-]{6,32}$/;

export function generateStandShortCode(length = 10, bytes?: Uint8Array) {
  if (!Number.isInteger(length) || length < 6 || length > 32) {
    throw new Error("Stand short-code generation requires between 6 and 32 random bytes.");
  }
  const entropy = bytes ?? crypto.getRandomValues(new Uint8Array(length));
  if (entropy.length < length) throw new Error("Stand short-code generation did not receive enough random bytes.");

  return Array.from(entropy.slice(0, length), (byte) => shortCodeAlphabet[byte % shortCodeAlphabet.length]).join("");
}

export function normalizeStandShortCode(value: string) {
  const normalized = value.trim().toLowerCase();
  return shortCodePattern.test(normalized) ? normalized : null;
}

export function getPermanentStandPath(shortCode: string) {
  const normalized = normalizeStandShortCode(shortCode);
  if (!normalized) {
    throw new Error("Stand short code is invalid.");
  }
  return `/t/${normalized}`;
}

export function getPermanentStandUrl(path: string, siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taprater.com") {
  return `${siteUrl.replace(/\/$/, "")}${path}`;
}

export function getProductStandConfiguration(product: MigratedProduct): ProductStandConfiguration {
  const standCategory = product.standCategorySlug ?? categoryToStandCategory(product.categorySlug);
  const defaultStandMode: StandMode =
    product.serviceMode === "hosted_landing_page" || product.supportsMultipleLinks || product.destinationType === "hosted_page"
      ? "hosted_page"
      : "redirect";

  return {
    requiresCustomerSetup: Boolean(product.standCategorySlug || product.requiresAccount || product.requiresLandingPage),
    defaultStandMode,
    standCategory,
    requiredLinkTypes: requiredLinkTypesForCategory(standCategory, defaultStandMode),
    supportedProviders: supportedProvidersForProduct(product)
  };
}

export function validateStandSetup(
  stand: Pick<CustomerStand, "mode" | "requiredLinkTypes">,
  links: StandDestinationLink[]
): StandSetupValidation {
  const activeLinks = links.filter((link) => link.isActive && isSafeExternalUrl(link.url));
  const activeTypes = new Set(activeLinks.map((link) => link.type));
  const missingLinkTypes = stand.requiredLinkTypes.filter((type) => !activeTypes.has(type));

  if (missingLinkTypes.length) {
    return {
      ok: false,
      missingLinkTypes,
      message: `Add an active ${missingLinkTypes.map(formatLinkType).join(" and ")} link before marking setup complete.`
    };
  }

  if (stand.mode === "hosted_page" && activeLinks.length === 0) {
    return { ok: false, missingLinkTypes: [], message: "Add at least one active link before marking setup complete." };
  }

  if (stand.mode === "redirect" && activeLinks.length === 0) {
    return { ok: false, missingLinkTypes: [], message: "Add an active destination link before marking setup complete." };
  }

  return { ok: true };
}

export function resolvePublicStand(stand: CustomerStand | null): PublicStandAction {
  if (!stand) {
    return { type: "not_found" };
  }

  if (stand.status === "paused" || stand.status === "archived") {
    return { type: "unavailable", reason: stand.status };
  }

  const links = stand.destinationLinks
    .filter((link) => link.isActive && isSafeExternalUrl(link.url))
    .sort((left, right) => left.sortOrder - right.sortOrder);

  if (stand.mode === "redirect") {
    return links[0] ? { type: "redirect", destinationUrl: links[0].url } : { type: "not_configured" };
  }

  return links.length ? { type: "hosted_page", links } : { type: "not_configured" };
}

export function defaultLinkTypeForProduct(product: MigratedProduct): StandLinkType {
  const configuration = getProductStandConfiguration(product);
  return configuration.requiredLinkTypes[0] ?? destinationToLinkType(product.destinationType);
}

export function defaultLinkLabel(type: StandLinkType, provider?: string) {
  if (provider) {
    const providerLabel = provider
      .split("-")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(" ");
    if (type === "review") return `Review us on ${providerLabel}`;
    if (type === "social") return `Follow us on ${providerLabel}`;
    if (type === "booking") return `Book with ${providerLabel}`;
  }

  const labels: Record<StandLinkType, string> = {
    review: "Leave a review",
    social: "Follow us",
    booking: "Book an appointment",
    menu: "View our menu",
    website: "Visit our website",
    phone: "Contact us",
    email: "Email us",
    map: "Get directions",
    survey: "Share feedback",
    custom: "Open link"
  };
  return labels[type];
}

function categoryToStandCategory(category: MigratedProduct["categorySlug"]): StandCategorySlug {
  const categories: Record<MigratedProduct["categorySlug"], StandCategorySlug> = {
    reviews: "review-stands",
    "social-media": "social-media-stands",
    appointments: "appointment-stands",
    menu: "menu-info-stands",
    feedback: "feedback-stands",
    "business-bundles": "custom-stands",
    "website-links": "website-link-stands",
    "payments-donations": "payment-tip-donation-stands",
    "loyalty-rewards": "website-link-stands"
  };
  return categories[category];
}

function requiredLinkTypesForCategory(category: StandCategorySlug, mode: StandMode): StandLinkType[] {
  if (mode === "hosted_page") return [];

  const required: Partial<Record<StandCategorySlug, StandLinkType>> = {
    "review-stands": "review",
    "social-media-stands": "social",
    "appointment-stands": "booking",
    "feedback-stands": "survey",
    "menu-info-stands": "menu",
    "website-link-stands": "website",
    "payment-tip-donation-stands": "custom",
    "loyalty-rewards-stands": "custom",
    "custom-stands": "custom"
  };
  return required[category] ? [required[category]] : [];
}

function supportedProvidersForProduct(product: MigratedProduct) {
  const providers = new Set<string>();
  if (product.platformSlug) providers.add(product.platformSlug);
  for (const destination of product.supportedDestinations) {
    providers.add(providerFromSupportedDestination(destination));
  }
  return Array.from(providers);
}

function providerFromSupportedDestination(destination: SupportedDestination) {
  return destination === "custom" ? "website" : destination;
}

function destinationToLinkType(destination: MigratedProduct["destinationType"]): StandLinkType {
  const types: Partial<Record<NonNullable<MigratedProduct["destinationType"]>, StandLinkType>> = {
    review: "review",
    social: "social",
    appointment: "booking",
    feedback: "survey",
    menu_info: "menu",
    website: "website",
    payment: "custom",
    custom: "custom"
  };
  return destination ? types[destination] ?? "custom" : "custom";
}

function formatLinkType(type: StandLinkType) {
  return type === "booking" ? "booking" : type === "survey" ? "feedback" : type;
}
