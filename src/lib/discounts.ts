import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";

export type DiscountCode = {
  id: string;
  code: string;
  discountType: "percent" | "fixed_cents";
  value: number;
  isActive: boolean;
  usageLimit: number | null;
  timesUsed: number;
  expiresAt: string | null;
  notes: string;
  createdAt: string | null;
};

type DiscountsDbClient = {
  from: (table: string) => {
    select: (columns?: string) => PromiseLike<{ data: unknown[] | null; error: null | { message: string } }>;
    upsert: (values: Record<string, unknown>, opts?: { onConflict: string }) => PromiseLike<{ error: null | { message: string } }>;
    delete: () => { eq: (column: string, value: string) => PromiseLike<{ error: null | { message: string } }> };
  };
};

function normalizeDiscountRow(row: unknown): DiscountCode | null {
  if (!row || typeof row !== "object") return null;
  const record = row as Record<string, unknown>;

  const code = typeof record.code === "string" ? record.code : null;
  const discountType = record.discount_type === "percent" || record.discount_type === "fixed_cents" ? record.discount_type : null;
  const value = typeof record.value === "number" ? record.value : null;

  if (!code || !discountType || value === null) return null;

  return {
    id: typeof record.id === "string" ? record.id : code,
    code,
    discountType,
    value,
    isActive: typeof record.is_active === "boolean" ? record.is_active : true,
    usageLimit: typeof record.usage_limit === "number" ? record.usage_limit : null,
    timesUsed: typeof record.times_used === "number" ? record.times_used : 0,
    expiresAt: typeof record.expires_at === "string" ? record.expires_at : null,
    notes: typeof record.notes === "string" ? record.notes : "",
    createdAt: typeof record.created_at === "string" ? record.created_at : null
  };
}

export async function getAdminDiscountCodes(): Promise<{ configured: boolean; discounts: DiscountCode[] }> {
  if (!hasSupabaseAdminConfig()) {
    return { configured: false, discounts: [] };
  }

  try {
    const { data, error } = await (getSupabaseAdmin() as DiscountsDbClient).from("discount_codes").select("*");

    if (error || !Array.isArray(data)) {
      return { configured: true, discounts: [] };
    }

    const discounts = data.flatMap((row) => {
      const normalized = normalizeDiscountRow(row);
      return normalized ? [normalized] : [];
    });
    discounts.sort((a, b) => (a.createdAt && b.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0));

    return { configured: true, discounts };
  } catch {
    return { configured: true, discounts: [] };
  }
}

export async function saveDiscountCode(input: {
  code: string;
  discountType: "percent" | "fixed_cents";
  value: number;
  isActive: boolean;
  usageLimit?: number;
  expiresAt?: string;
  notes?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabaseAdminConfig()) {
    return { ok: false, error: "Database persistence is not configured yet." };
  }

  try {
    const { error } = await (getSupabaseAdmin() as DiscountsDbClient).from("discount_codes").upsert(
      {
        code: input.code.trim().toUpperCase(),
        discount_type: input.discountType,
        value: input.value,
        is_active: input.isActive,
        usage_limit: input.usageLimit ?? null,
        expires_at: input.expiresAt ?? null,
        notes: input.notes ?? "",
        updated_at: new Date().toISOString()
      },
      { onConflict: "code" }
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Discount code could not be saved." };
  }
}

export type DiscountValidationResult =
  | { ok: true; discount: DiscountCode }
  | { ok: false; reason: "not_found" | "inactive" | "expired" | "usage_limit_reached"; message: string };

// Validates whether a code can currently be used. Does NOT apply it to a
// price -- that step is intentionally bundled with the live-Stripe work,
// since it means real payment amounts are affected. This is ready to plug
// into checkout.ts once that happens.
export function validateDiscountCode(discount: DiscountCode | undefined, now: Date = new Date()): DiscountValidationResult {
  if (!discount) {
    return { ok: false, reason: "not_found", message: "That code isn't valid." };
  }
  if (!discount.isActive) {
    return { ok: false, reason: "inactive", message: "That code is no longer active." };
  }
  if (discount.expiresAt && new Date(discount.expiresAt) < now) {
    return { ok: false, reason: "expired", message: "That code has expired." };
  }
  if (discount.usageLimit !== null && discount.timesUsed >= discount.usageLimit) {
    return { ok: false, reason: "usage_limit_reached", message: "That code has reached its usage limit." };
  }
  return { ok: true, discount };
}
