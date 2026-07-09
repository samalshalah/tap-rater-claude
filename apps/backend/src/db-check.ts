import { checkDatabase } from "./db.js";

const result = await checkDatabase();

if (result.ok) {
  console.log("PASS backend database check");
  process.exit(0);
}

console.error(`FAIL backend database check: ${result.error}`);
process.exit(1);
