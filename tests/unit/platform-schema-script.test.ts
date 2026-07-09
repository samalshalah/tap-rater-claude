import { describe, expect, it } from "vitest";

describe("platform schema check script", () => {
  it("lists the required platform tables", async () => {
    const { REQUIRED_PLATFORM_TABLES } = await import("../../scripts/check-platform-schema.mjs");

    expect(REQUIRED_PLATFORM_TABLES).toEqual([
      "customers",
      "businesses",
      "devices",
      "landing_pages",
      "tap_events",
      "form_submissions",
      "device_activation_attempts"
    ]);
  });

  it("reports missing platform tables from SQL text", async () => {
    const { checkSchemaText } = await import("../../scripts/check-platform-schema.mjs");
    const result = checkSchemaText(`
      create table if not exists customers (id uuid primary key);
      create table if not exists public.devices (id uuid primary key);
    `);

    expect(result.ok).toBe(false);
    expect(result.missingTables).toEqual([
      "businesses",
      "landing_pages",
      "tap_events",
      "form_submissions",
      "device_activation_attempts"
    ]);
  });

  it("passes when every platform table is present", async () => {
    const { checkSchemaText, REQUIRED_PLATFORM_TABLES } = await import("../../scripts/check-platform-schema.mjs");
    const sql = REQUIRED_PLATFORM_TABLES.map((tableName: string) => `create table if not exists public.${tableName} ();`).join("\n");

    expect(checkSchemaText(sql)).toEqual({
      ok: true,
      missingTables: []
    });
  });
});
