import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initDb, pool } from "./database.js";
import { DATABASE_URL } from "./config.js";
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
  res.sendFile(path.join(publicDir, "index.html"), (err) => {
    if (err && !res.headersSent) {
      res
        .status(200)
        .type("html")
        .send(
          '<!doctype html><meta charset="utf-8"><title>Cronograma 9º ano</title>' +
            "<p>API online. Interface em <a href=\"/index.html\">/index.html</a>.</p>",
        );
    }
  });
});

app.get("/api/health", async (_req, res) => {
  if (!DATABASE_URL) {
    return res.status(503).json({ status: "degraded", database: "not_configured" });
  }
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "cronograma-9ano-api", database: "up" });
  } catch {
    res.status(503).json({ status: "degraded", database: "down" });
  }
});

app.use((_req, res, next) => {
  if (!DATABASE_URL) {
    return res.status(503).json({
      error:
        "Banco de dados não configurado. Defina DATABASE_URL (Neon) nas variáveis de ambiente da Vercel.",
    });
  }
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
  if (err && (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.code === "ETIMEDOUT")) {
    return res.status(503).json({
      error:
        "Não foi possível conectar ao banco de dados. Confira a DATABASE_URL (use a conexão Pooled do Neon).",
    });
  }
  if (err && err.message) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
