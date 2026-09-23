import { Router } from "express";
import {
  addTask,
  deleteTask,
  deleteUserTasks,
  getTaskById,
  getUserTasks,
  getWeekGates,
  getWeekStats,
  getUserProvas,
  isWeekUnlocked,
  seedUserTasks,
  updateTask
} from "../database.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(async (req, res) => {
  const tasks = await getUserTasks(req.user.id);
  const weeks = await getWeekStats(req.user.id);
  const gates = await getWeekGates(req.user.id);
  const provas = await getUserProvas(req.user.id);
  const done = tasks.filter((t) => t.done).length;
  const progress = {
    total: tasks.length,
    done,
    percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0
  };
  return res.json({ tasks, weeks, progress, gates, provas });
}));

router.post("/", asyncHandler(async (req, res) => {
  const { topic } = req.body || {};
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: "O tópico da tarefa é obrigatório" });
  }
  const task = await addTask(req.user.id, {
    ...req.body,
    topic: topic.trim(),
    video_url: req.body.video_url?.trim() || null
  });
  return res.status(201).json({ task });
}));

router.post("/seed", asyncHandler(async (req, res) => {
  const { reset } = req.body || {};
  const existing = await getUserTasks(req.user.id);
  if (existing.length > 0 && !reset) {
    return res
      .status(409)
      .json({ error: "Você já tem tarefas. Use reset=true para recriar as originais" });
  }
  await deleteUserTasks(req.user.id);
  await seedUserTasks(req.user.id);
  const tasks = await getUserTasks(req.user.id);
  const weeks = await getWeekStats(req.user.id);
  return res.json({ tasks, weeks });
}));

router.patch("/:id", asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido" });

  const current = await getTaskById(id, req.user.id);
  if (!current) return res.status(404).json({ error: "Tarefa não encontrada" });

  const { topic, week, day, subject, tag, video_url, done } = req.body || {};
  const mergedTopic = topic === undefined || topic.trim() === "" ? current.topic : topic.trim();

  const task = await updateTask(id, req.user.id, {
    week: week ?? current.week,
    day: day ?? current.day,
    subject: subject ?? current.subject,
    tag: tag ?? current.tag,
    topic: mergedTopic,
    video_url: video_url === undefined ? current.video_url : (video_url || null),
    done: done === undefined ? current.done : Boolean(done)
  });
  return res.json({ task });
}));

router.patch("/:id/done", asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido" });

  const current = await getTaskById(id, req.user.id);
  if (!current) return res.status(404).json({ error: "Tarefa não encontrada" });

  if (!(await isWeekUnlocked(req.user.id, current.week))) {
    return res.status(403).json({
      error: "Esta semana ainda está bloqueada. Passe na prova da semana anterior para liberá-la."
    });
  }

  const done = (req.body && req.body.done !== undefined)
    ? Boolean(req.body.done)
    : !current.done;

  const task = await updateTask(id, req.user.id, { ...current, done });
  return res.json({ task, progress: await getWeekStats(req.user.id) });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido" });
  const removed = await deleteTask(id, req.user.id);
  if (!removed) return res.status(404).json({ error: "Tarefa não encontrada" });
  return res.json({ ok: true, removed });
}));

export default router;