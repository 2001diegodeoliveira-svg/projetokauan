import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getTaskById,
  hasPhotoConsent,
  isWeekUnlocked,
  markTaskDone,
  createSession,
  listSessions,
  getPhotoByPath,
  appendRecording,
  getSessionRecordingForUser
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

const recUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PHOTO_BYTES },
  fileFilter: (_req, file, cb) => {
    const ok = /^video\/webm$/.test(file.mimetype);
    if (!ok) return cb(new Error("A gravação de tela deve ser WebM (video/webm)"));
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

  if (!(await isWeekUnlocked(req.user.id, task.week))) {
    return res.status(403).json({
      error: "Esta semana ainda está bloqueada. Passe na prova da semana anterior para liberá-la."
    });
  }

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

router.post("/:id/record-chunk", requireAuth, recUpload.single("chunk"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Id de sessão inválido" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Trecho de gravação obrigatório" });
  }
  const final = req.body.final === "true" || req.body.final === "1";
  const updated = await appendRecording(id, req.user.id, req.file.buffer, req.file.mimetype, final);
  if (!updated) {
    return res.status(404).json({ error: "Sessão não encontrada" });
  }
  return res.json({ ok: true, session: updated });
}));

router.get("/:id/recording", requireAuth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const rec = await getSessionRecordingForUser(id, req.user.id);
  if (!rec) {
    return res.status(404).json({ error: "Gravação não encontrada" });
  }
  if (!rec.recording_data) {
    return res.status(404).json({ error: "Esta sessão não possui gravação de tela" });
  }
  res.set("Content-Type", rec.recording_mime || "video/webm");
  res.set("Cache-Control", "private, max-age=86400");
  return res.send(rec.recording_data);
}));

export { MAX_PHOTO_BYTES };
export default router;
