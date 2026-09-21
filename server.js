import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PORT } from "./src/config.js";
import authRoutes from "./src/routes/authRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import sessionRoutes from "./src/routes/sessionRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads/photos", express.static(path.join(__dirname, "data", "photos")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "cronograma-9ano.html"));
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cronograma-9ano-api" });
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
      ? "A foto deve ter no máximo 5 MB"
      : "Erro no envio da foto";
    return res.status(400).json({ error: message });
  }
  if (err && err.message) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});