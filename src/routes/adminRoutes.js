import { Router } from "express";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "../config.js";
import { requireAdmin, signAdminToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  findUserById,
  getWeekStats,
  listProvasForAdmin,
  listSessions,
  listStudents
} from "../database.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res
      .status(401)
      .json({ error: "Usuário ou senha de administrador incorretos" });
  }
  return res.json({ token: signAdminToken() });
});

router.get("/students", requireAdmin, asyncHandler(async (_req, res) => {
  const students = await listStudents();
  const enriched = await Promise.all(
    students.map(async (s) => {
      const weeks = await getWeekStats(s.id);
      return { ...s, weeks };
    })
  );
  return res.json({ students: enriched });
}));

router.get("/students/:id", requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Id de aluno inválido" });
  }
  const student = await findUserById(id);
  if (!student) {
    return res.status(404).json({ error: "Aluno não encontrado" });
  }
  const weeks = await getWeekStats(id);
  const sessions = await listSessions(id);
  const provas = await listProvasForAdmin(id);
  return res.json({ student, weeks, sessions, provas });
}));

export default router;