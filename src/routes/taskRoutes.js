import { Router } from "express";
import {
  addTask,
  deleteTask,
  deleteUserTasks,
  getTaskById,
  getUserTasks,
  getWeekStats,
  seedUserTasks,
  updateTask
} from "../database.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const tasks = getUserTasks(req.user.id);
  const weeks = getWeekStats(req.user.id);
  const done = tasks.filter((t) => t.done).length;
  const progress = {
    total: tasks.length,
    done,
    percent: tasks.length ? Math.round((done / tasks.length) * 100) : 0
  };
  return res.json({ tasks, weeks, progress });
});

router.post("/", (req, res) => {
  const { topic } = req.body || {};
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: "O tópico da tarefa é obrigatório" });
  }
  const task = addTask(req.user.id, {
    ...req.body,
    topic: topic.trim(),
    video_url: req.body.video_url?.trim() || null
  });
  return res.status(201).json({ task });
});

router.post("/seed", (req, res) => {
  const { reset } = req.body || {};
  const { tasks: size } = getUserTasks(req.user.id);
  if (size > 0 && !reset) {
    return res
      .status(409)
      .json({ error: "Você já tem tarefas. Use reset=true para recriar as originais" });
  }
  deleteUserTasks(req.user.id);
  seedUserTasks(req.user.id);
  const tasks = getUserTasks(req.user.id);
  const weeks = getWeekStats(req.user.id);
  return res.json({ tasks, weeks });
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido" });

  const current = getTaskById(id, req.user.id);
  if (!current) return res.status(404).json({ error: "Tarefa não encontrada" });

  const { topic, week, day, subject, tag, video_url, done } = req.body || {};
  const mergedTopic = topic === undefined || topic.trim() === "" ? current.topic : topic.trim();

  const task = updateTask(id, req.user.id, {
    week: week ?? current.week,
    day: day ?? current.day,
    subject: subject ?? current.subject,
    tag: tag ?? current.tag,
    topic: mergedTopic,
    video_url: video_url === undefined ? current.video_url : (video_url || null),
    done: done === undefined ? current.done : Boolean(done)
  });
  return res.json({ task });
});

router.patch("/:id/done", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido" });

  const current = getTaskById(id, req.user.id);
  if (!current) return res.status(404).json({ error: "Tarefa não encontrada" });

  const done = (req.body && req.body.done !== undefined)
    ? Boolean(req.body.done)
    : !current.done;

  const task = updateTask(id, req.user.id, { ...current, done });
  return res.json({ task, progress: getWeekStats(req.user.id) });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "ID inválido" });
  const removed = deleteTask(id, req.user.id);
  if (!removed) return res.status(404).json({ error: "Tarefa não encontrada" });
  return res.json({ ok: true, removed });
});

export default router;