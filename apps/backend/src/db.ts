import { neon } from "@neondatabase/serverless";

export type DatabaseCheckResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    };

export async function checkDatabase(databaseUrl = process.env.DATABASE_URL): Promise<DatabaseCheckResult> {
  if (!databaseUrl) {
    return { ok: false, error: "DATABASE_URL is not configured" };
  }

  try {
    const sql = neon(databaseUrl);
    const rows = await sql`select 1 as ok`;
    return rows[0]?.ok === 1 ? { ok: true } : { ok: false, error: "unexpected database response" };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "database check failed" };
  }
}
