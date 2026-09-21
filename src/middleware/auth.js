import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d"
  });
}

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

function readToken(req) {
  const header = req.headers.authorization;
  return header && header.startsWith("Bearer ")
    ? header.slice(7)
    : typeof req.query.token === "string"
      ? req.query.token
      : "";
}

export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) {
    return res.status(401).json({ error: "Token não informado" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function requireAdmin(req, res, next) {
  const token = readToken(req);
  if (!token) {
    return res.status(401).json({ error: "Token não informado" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Acesso restrito ao administrador" });
    }
    req.admin = true;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}