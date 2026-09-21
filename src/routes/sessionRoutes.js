import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getTaskById,
  hasPhotoConsent,
  markTaskDone,
  createSession,
  listSessions
} from "../database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photoDir = path.join(__dirname, "..", "..", "data", "photos");
mkdirSync(photoDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, photoDir),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || ".jpg").toLowerCase();
    cb(null, `foto_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp)$/.test(file.mimetype);
    if (!ok) return cb(new Error("A foto deve ser JPEG, PNG ou WebP"));
    cb(null, true);
  }
});

const router = Router();

router.post("/tasks/:id/watch", requireAuth, upload.single("photo"), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Foto obrigatória para registrar a aula" });
  }
  if (!(await hasPhotoConsent(req.user.id))) {
    return res
      .status(403)
      .json({ error: "Você não autorizou o registro de imagem no cadastro" });
  }

  const id = Number(req.params.id);
  const task = await getTaskById(id, req.user.id);
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  await markTaskDone(id, req.user.id);
  const photoPath = `/uploads/photos/${req.file.filename}`;
  const session = await createSession(
    req.user.id,
    id,
    photoPath,
    task.video_url,
    typeof req.body.note === "string" ? req.body.note.trim() : undefined
  );

  return res.status(201).json({
    session,
    task: await getTaskById(id, req.user.id),
    video_url: task.video_url
  });
}));

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  return res.json({ sessions: await listSessions(req.user.id) });
}));

export default router;