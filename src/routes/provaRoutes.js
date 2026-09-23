import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getProvaQuestions } from "../data/provaQuestions.js";
import {
  addProvaViolation,
  cancelProva,
  getInProgressProva,
  getProvaById,
  getUserProvas,
  getWeekGates,
  hasCompletedWeek,
  isProvaPassedForWeek,
  isWeekUnlocked,
  isValidWeek,
  PROVA_MAX_VIOLATIONS,
  PROVA_QUESTION_COUNT,
  publicProvaQuestions,
  requiredScore,
  saveProvaQuestions,
  sanitizeProva,
  startOrResumeProva,
  submitProva,
  hasPhotoConsent
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

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildStoredQuestions(week) {
  const raw = getProvaQuestions(week).slice(0, PROVA_QUESTION_COUNT);
  const shuffledQ = shuffle(raw);
  return shuffledQ.map((question) => {
    const indexed = question.o.map((text, idx) => ({ text, idx }));
    const shuffledOptions = shuffle(indexed);
    return {
      id: question.id,
      q: question.q,
      o: shuffledOptions.map((x) => x.text),
      c: shuffledOptions.findIndex((x) => x.idx === question.c),
      e: question.e
    };
  });
}

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  const [provas, gates] = await Promise.all([
    getUserProvas(req.user.id),
    getWeekGates(req.user.id)
  ]);
  return res.json({ provas, gates });
}));

router.post("/start", requireAuth, upload.single("photo"), asyncHandler(async (req, res) => {
  const week = String(req.body.week || "").trim();

  if (!isValidWeek(week)) {
    return res.status(400).json({ error: "Semana inválida" });
  }

  if (!(await isWeekUnlocked(req.user.id, week))) {
    return res.status(403).json({
      error: "Você ainda não passou na prova da semana anterior. Conclua e aprove a semana anterior para liberar esta."
    });
  }

  if (await isProvaPassedForWeek(req.user.id, week)) {
    return res.status(409).json({ error: "Você já passou na prova desta semana." });
  }

  if (!(await hasCompletedWeek(req.user.id, week))) {
    return res.status(403).json({ error: "Conclua todas as aulas da semana para fazer a prova." });
  }

  let photo;
  if (req.file) {
    if (!(await hasPhotoConsent(req.user.id))) {
      return res.status(403).json({ error: "Você não autorizou o registro de imagem no cadastro." });
    }
    photo = { data: req.file.buffer, mime: req.file.mimetype };
  } else {
    return res.status(400).json({ error: "Foto obrigatória para iniciar a prova." });
  }

  const { prova, resumed } = await startOrResumeProva(req.user.id, week, photo);

  let stored;
  if (Array.isArray(prova.questions) && prova.questions.length) {
    stored = prova.questions;
  } else if (typeof prova.questions === "string" && prova.questions.trim() && prova.questions.trim() !== "[]") {
    stored = JSON.parse(prova.questions);
  } else {
    stored = buildStoredQuestions(week);
    await saveProvaQuestions(prova.id, req.user.id, stored);
  }

  return res.status(200).json({
    resumed,
    prova: sanitizeProva(prova),
    questions: publicProvaQuestions(stored),
    required: requiredScore(prova.total),
    maxViolations: PROVA_MAX_VIOLATIONS
  });
}));

router.get("/:id", requireAuth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }
  const prova = await getInProgressProva(req.user.id, id);
  if (!prova) {
    return res.status(409).json({ error: "Esta prova não está em andamento." });
  }
  const stored = typeof prova.questions === "string"
    ? JSON.parse(prova.questions)
    : prova.questions || [];
  return res.json({
    prova: sanitizeProva(prova),
    questions: publicProvaQuestions(stored),
    required: requiredScore(prova.total),
    maxViolations: PROVA_MAX_VIOLATIONS
  });
}));

router.post("/:id/violation", requireAuth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }
  const updated = await addProvaViolation(id, req.user.id);
  if (!updated) {
    return res.status(409).json({ error: "Prova não está em andamento." });
  }
  return res.json({
    violations: updated.violations,
    max: PROVA_MAX_VIOLATIONS,
    canceled: updated.status === "canceled"
  });
}));

router.post("/:id/submit", requireAuth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }
  const { answers } = req.body || {};
  if (!Array.isArray(answers) || answers.length !== PROVA_QUESTION_COUNT) {
    return res.status(400).json({ error: `A prova deve ter ${PROVA_QUESTION_COUNT} respostas.` });
  }

  const result = await submitProva(id, req.user.id, answers);
  if (result.error === "not_found") {
    return res.status(404).json({ error: "Prova não encontrada" });
  }
  if (result.error === "already_submitted") {
    return res.status(409).json({ error: "Esta prova já foi concluída." });
  }
  if (result.error === "canceled") {
    return res.status(409).json({ error: "Esta prova foi cancelada. Inicie uma nova tentativa." });
  }
  return res.json(result);
}));

router.post("/:id/cancel", requireAuth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }
  const prova = await getProvaById(id, req.user.id);
  if (!prova) return res.status(404).json({ error: "Prova não encontrada" });
  await cancelProva(id, req.user.id);
  return res.json({ ok: true });
}));

export default router;