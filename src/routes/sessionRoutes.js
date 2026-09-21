import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getTaskById,
  hasPhotoConsent,
  markTaskDone,
  createSession,
  listSessions,
  getPhotoByPath
} from "../database.js";

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PHOTO_BYTES },
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
  const session = await createSession(
    req.user.id,
    id,
    { data: req.file.buffer, mime: req.file.mimetype },
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

router.get("/photo/:file", requireAuth, asyncHandler(async (req, res) => {
  const photoPath = `/api/sessions/photo/${req.params.file}`;
  const photo = await getPhotoByPath(photoPath);
  if (!photo || !photo.photo_data) {
    return res.status(404).json({ error: "Foto não encontrada" });
  }
  res.set("Content-Type", photo.photo_mime || "image/jpeg");
  res.set("Cache-Control", "private, max-age=86400");
  return res.send(photo.photo_data);
}));

export { MAX_PHOTO_BYTES };
export default router;
