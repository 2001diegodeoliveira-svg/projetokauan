import "dotenv/config";
import { pool, initDb } from "./src/database.js";

await initDb();
const { rows } = await pool.query(
  "SELECT id, name, email, created_at FROM users ORDER BY id",
);
for (const r of rows) {
  console.log(`${r.id} | ${r.name} | ${r.email} | ${r.created_at.toISOString()}`);
}
await pool.end();