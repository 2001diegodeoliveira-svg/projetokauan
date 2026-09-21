import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_TASKS } from "./data/defaultTasks.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });
mkdirSync(path.join(dataDir, "photos"), { recursive: true });

const db = new DatabaseSync(path.join(dataDir, "cronograma.db"));

db.exec("PRAGMA foreign_keys = ON");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    photo_consent INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week TEXT NOT NULL,
    day TEXT NOT NULL,
    subject TEXT NOT NULL,
    tag TEXT NOT NULL DEFAULT 'rev',
    topic TEXT NOT NULL,
    video_url TEXT,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
    photo_path TEXT NOT NULL,
    video_url TEXT,
    note TEXT,
    watched_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`);

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

ensureColumn("tasks", "video_url", "TEXT");
ensureColumn("users", "photo_consent", "INTEGER NOT NULL DEFAULT 0");

export function seedUserTasks(userId) {
  const insert = db.prepare(
    "INSERT INTO tasks (user_id, week, day, subject, tag, topic, video_url) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const task of DEFAULT_TASKS) {
    insert.run(userId, task.week, task.day, task.subject, task.tag, task.topic, task.video_url);
  }
}

export function findUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function findUserById(id) {
  return db.prepare(
    "SELECT id, name, email, photo_consent, created_at FROM users WHERE id = ?"
  ).get(id);
}

export function hasPhotoConsent(userId) {
  return db
    .prepare("SELECT photo_consent FROM users WHERE id = ?")
    .get(userId).photo_consent === 1;
}

export function createUser(name, email, passwordHash, photoConsent) {
  const result = db
    .prepare(
      "INSERT INTO users (name, email, password_hash, photo_consent) VALUES (?, ?, ?, ?)"
    )
    .run(name, email, passwordHash, photoConsent ? 1 : 0);
  return result.lastInsertRowid;
}

export function getUserTasks(userId) {
  return db
    .prepare("SELECT * FROM tasks WHERE user_id = ? ORDER BY id")
    .all(userId);
}

export function getTaskById(id, userId) {
  return db
    .prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?")
    .get(id, userId);
}

export function addTask(userId, task) {
  const result = db
    .prepare(
      "INSERT INTO tasks (user_id, week, day, subject, tag, topic, video_url, done) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      userId,
      task.week ?? "s1",
      task.day ?? "Segunda-feira",
      task.subject ?? "Revisão",
      task.tag ?? "rev",
      task.topic,
      task.video_url ?? null,
      task.done ? 1 : 0
    );
  return getTaskById(result.lastInsertRowid, userId);
}

export function updateTask(id, userId, changes) {
  const task = getTaskById(id, userId);
  if (!task) return null;
  const merged = { ...task, ...changes };
  db.prepare(
    "UPDATE tasks SET week = ?, day = ?, subject = ?, tag = ?, topic = ?, video_url = ?, done = ? WHERE id = ? AND user_id = ?"
  ).run(
    merged.week,
    merged.day,
    merged.subject,
    merged.tag,
    merged.topic,
    merged.video_url,
    merged.done ? 1 : 0,
    id,
    userId
  );
  return getTaskById(id, userId);
}

export function deleteTask(id, userId) {
  return db
    .prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?")
    .run(id, userId).changes;
}

export function deleteUserTasks(userId) {
  return db.prepare("DELETE FROM tasks WHERE user_id = ?").run(userId).changes;
}

export function getWeekStats(userId) {
  const rows = db
    .prepare(
      "SELECT week, COUNT(*) AS total, SUM(done) AS done FROM tasks WHERE user_id = ? GROUP BY week ORDER BY week"
    )
    .all(userId);
  const weeks = {};
  for (const row of rows) {
    weeks[row.week] = { total: row.total, done: row.done };
  }
  return weeks;
}

export function markTaskDone(id, userId) {
  db.prepare(
    "UPDATE tasks SET done = 1 WHERE id = ? AND user_id = ?"
  ).run(id, userId);
}

export function createSession(userId, taskId, photoPath, videoUrl, note) {
  const result = db
    .prepare(
      "INSERT INTO sessions (user_id, task_id, photo_path, video_url, note) VALUES (?, ?, ?, ?, ?)"
    )
    .run(userId, taskId, photoPath, videoUrl, note ?? null);
  return getSessionById(result.lastInsertRowid, userId);
}

export function getSessionById(id, userId) {
  return db
    .prepare(
      `SELECT s.id, s.user_id, s.task_id, s.photo_path, s.video_url, s.note, s.watched_at,
              t.week, t.day, t.subject, t.tag, t.topic
       FROM sessions s
       LEFT JOIN tasks t ON t.id = s.task_id
       WHERE s.id = ? AND s.user_id = ?`
    )
    .get(id, userId);
}

export function listSessions(userId) {
  return db
    .prepare(
      `SELECT s.id, s.task_id, s.photo_path, s.video_url, s.note, s.watched_at,
              t.week, t.day, t.subject, t.tag, t.topic
       FROM sessions s
       LEFT JOIN tasks t ON t.id = s.task_id
       WHERE s.user_id = ?
       ORDER BY s.watched_at DESC`
    )
    .all(userId);
}