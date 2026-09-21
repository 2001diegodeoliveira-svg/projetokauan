import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  findUserById,
  seedUserTasks
} from "../database.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

function validEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/register", (req, res) => {
  const { name, email, password, photoConsent } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Informe o nome" });
  }
  if (!validEmail(email)) {
    return res.status(400).json({ error: "E-mail inválido" });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "A senha deve ter pelo menos 6 caracteres" });
  }
  if (!photoConsent) {
    return res
      .status(400)
      .json({ error: "Autorize o registro de imagem para criar a conta" });
  }
  if (findUserByEmail(email.toLowerCase())) {
    return res.status(409).json({ error: "E-mail já cadastrado" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const id = createUser(name.trim(), email.toLowerCase(), passwordHash, true);
  seedUserTasks(Number(id));

  const user = findUserById(Number(id));
  return res.status(201).json({ user, token: signToken(user) });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = validEmail(email) ? findUserByEmail(email.toLowerCase()) : null;

  if (!user || !password || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "E-mail ou senha incorretos" });
  }

  const safe = findUserById(user.id);
  return res.json({ user: safe, token: signToken(safe) });
});

router.get("/me", requireAuth, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  return res.json({ user });
});

export default router;