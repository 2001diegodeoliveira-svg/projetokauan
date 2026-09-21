import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initDb, pool } from "./database.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const app = express();

app.use(express.json());
app.use(express.static(publicDir));

let dbReady = null;
export function ensureDb() {
  if (!dbReady) {
    dbReady = initDb().catch((err) => {
      dbReady = null;
      throw err;
    });
  }
  return dbReady;
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "cronograma-9ano-api", database: "up" });
  } catch {
    res.status(503).json({ status: "degraded", database: "down" });
  }
});

app.use((_req, _res, next) => {
  ensureDb().then(() => next()).catch(next);
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "A foto deve ter no máximo 4 MB"
      : "Erro no envio da foto";
    return res.status(400).json({ error: message });
  }
  if (err && err.message) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
