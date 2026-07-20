import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/customer-password";

type PasswordDbClient = {
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: <T>() => Promise<{ data: T | null; error: null | { message: string } }>;
      };
    };
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ error: null | { message: string } }>;
    };
  };
};

export async function setCustomerPassword(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabaseAdminConfig()) {
    return { ok: false, error: "Database persistence is not configured yet." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const client = getSupabaseAdmin() as PasswordDbClient;

  const { data: customer } = await client
    .from("customers")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle<{ id: string }>();

  if (!customer) {
    return { ok: false, error: "No account found for that email." };
  }

  const passwordHash = await hashPassword(password);
  const { error } = await client.from("customers").update({ password_hash: passwordHash }).eq("email", normalizedEmail);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function verifyCustomerPassword(email: string, password: string): Promise<boolean> {
  if (!hasSupabaseAdminConfig()) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const client = getSupabaseAdmin() as PasswordDbClient;

  const { data: customer } = await client
    .from("customers")
    .select("password_hash")
    .eq("email", normalizedEmail)
    .maybeSingle<{ password_hash: string | null }>();

  if (!customer?.password_hash) {
    return false;
  }

  return verifyPassword(password, customer.password_hash);
}
