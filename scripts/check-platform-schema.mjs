#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REQUIRED_PLATFORM_TABLES = [
  "customers",
  "businesses",
  "devices",
  "landing_pages",
  "tap_events",
  "form_submissions",
  "device_activation_attempts"
];

export function checkSchemaText(sqlText) {
  const missingTables = REQUIRED_PLATFORM_TABLES.filter((tableName) => {
    const escapedTableName = tableName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tablePattern = new RegExp(`create\\s+table\\s+if\\s+not\\s+exists\\s+(public\\.)?${escapedTableName}\\b`, "i");
    return !tablePattern.test(sqlText);
  });

  return {
    ok: missingTables.length === 0,
    missingTables
  };
}

export function checkSchemaFile(schemaPath) {
  const sqlText = readFileSync(schemaPath, "utf8");
  return checkSchemaText(sqlText);
}

function printResult(schemaPath, result) {
  if (result.ok) {
    console.log(`PASS platform schema tables present in ${schemaPath}`);
    return;
  }

  console.error(`FAIL platform schema tables missing from ${schemaPath}:`);
  for (const tableName of result.missingTables) {
    console.error(`- ${tableName}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const schemaPath = resolve(process.argv[2] || "supabase/schema.sql");
  const result = checkSchemaFile(schemaPath);
  printResult(schemaPath, result);

  if (!result.ok) {
    process.exitCode = 1;
  }
}
