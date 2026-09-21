import pg from "pg";
import { DATABASE_URL } from "./config.js";
import { DEFAULT_TASKS } from "./data/defaultTasks.js";

const { Pool } = pg;

const useSsl = DATABASE_URL && !/localhost|127\.0\.0\.1/.test(DATABASE_URL);

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 5
});

pool.on("error", (err) => {
  console.error("Erro inesperado no pool do Postgres:", err.message);
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      photo_consent BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      week TEXT NOT NULL,
      day TEXT NOT NULL,
      subject TEXT NOT NULL,
      tag TEXT NOT NULL DEFAULT 'rev',
      topic TEXT NOT NULL,
      video_url TEXT,
      done BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);

    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
      photo_path TEXT NOT NULL,
      photo_data BYTEA,
      photo_mime TEXT,
      video_url TEXT,
      note TEXT,
      watched_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS photo_data BYTEA;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS photo_mime TEXT;
  `);
}

export async function seedUserTasks(userId) {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM tasks WHERE user_id = $1", [userId]);
  if (rows[0].n > 0) return;

  const values = [];
  const params = [];
  DEFAULT_TASKS.forEach((task, i) => {
    const base = i * 7;
    values.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`);
    params.push(userId, task.week, task.day, task.subject, task.tag, task.topic, task.video_url);
  });
  await pool.query(
    `INSERT INTO tasks (user_id, week, day, subject, tag, topic, video_url) VALUES ${values.join(", ")}`,
    params
  );
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    "SELECT id, name, email, photo_consent, created_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

export async function hasPhotoConsent(userId) {
  const { rows } = await pool.query("SELECT photo_consent FROM users WHERE id = $1", [userId]);
  return rows[0] ? rows[0].photo_consent === true : false;
}

export async function createUser(name, email, passwordHash, photoConsent) {
  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password_hash, photo_consent) VALUES ($1, $2, $3, $4) RETURNING id",
    [name, email, passwordHash, Boolean(photoConsent)]
  );
  return rows[0].id;
}

export async function getUserTasks(userId) {
  const { rows } = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY id", [userId]);
  return rows;
}

export async function getTaskById(id, userId) {
  const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, userId]);
  return rows[0] || null;
}

export async function addTask(userId, task) {
  const { rows } = await pool.query(
    `INSERT INTO tasks (user_id, week, day, subject, tag, topic, video_url, done)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      userId,
      task.week ?? "s1",
      task.day ?? "Segunda-feira",
      task.subject ?? "Revisão",
      task.tag ?? "rev",
      task.topic,
      task.video_url ?? null,
      Boolean(task.done)
    ]
  );
  return rows[0];
}

export async function updateTask(id, userId, changes) {
  const task = await getTaskById(id, userId);
  if (!task) return null;
  const merged = { ...task, ...changes };
  const { rows } = await pool.query(
    `UPDATE tasks SET week = $1, day = $2, subject = $3, tag = $4, topic = $5, video_url = $6, done = $7
     WHERE id = $8 AND user_id = $9 RETURNING *`,
    [
      merged.week,
      merged.day,
      merged.subject,
      merged.tag,
      merged.topic,
      merged.video_url,
      Boolean(merged.done),
      id,
      userId
    ]
  );
  return rows[0] || null;
}

export async function deleteTask(id, userId) {
  const { rowCount } = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, userId]);
  return rowCount;
}

export async function deleteUserTasks(userId) {
  const { rowCount } = await pool.query("DELETE FROM tasks WHERE user_id = $1", [userId]);
  return rowCount;
}

export async function getWeekStats(userId) {
  const { rows } = await pool.query(
    `SELECT week, COUNT(*)::int AS total, COUNT(*) FILTER (WHERE done)::int AS done
     FROM tasks WHERE user_id = $1 GROUP BY week ORDER BY week`,
    [userId]
  );
  const weeks = {};
  for (const row of rows) {
    weeks[row.week] = { total: row.total, done: row.done };
  }
  return weeks;
}

export async function markTaskDone(id, userId) {
  await pool.query("UPDATE tasks SET done = TRUE WHERE id = $1 AND user_id = $2", [id, userId]);
}

function mimeExt(mime) {
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return ".jpg";
}

export async function createSession(userId, taskId, photo, videoUrl, note) {
  const filename = `foto_${Date.now()}_${Math.round(Math.random() * 1e9)}${mimeExt(photo.mime)}`;
  const photoPath = `/api/sessions/photo/${filename}`;
  const { rows } = await pool.query(
    `INSERT INTO sessions (user_id, task_id, photo_path, photo_data, photo_mime, video_url, note)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [userId, taskId, photoPath, photo.data, photo.mime, videoUrl ?? null, note ?? null]
  );
  return getSessionById(rows[0].id, userId);
}

export async function getPhotoByPath(photoPath) {
  const { rows } = await pool.query(
    "SELECT photo_mime, photo_data FROM sessions WHERE photo_path = $1",
    [photoPath]
  );
  return rows[0] || null;
}

export async function getSessionById(id, userId) {
  const { rows } = await pool.query(
    `SELECT s.id, s.user_id, s.task_id, s.photo_path, s.video_url, s.note, s.watched_at,
            t.week, t.day, t.subject, t.tag, t.topic
     FROM sessions s
     LEFT JOIN tasks t ON t.id = s.task_id
     WHERE s.id = $1 AND s.user_id = $2`,
    [id, userId]
  );
  return rows[0] || null;
}

export async function listSessions(userId) {
  const { rows } = await pool.query(
    `SELECT s.id, s.task_id, s.photo_path, s.video_url, s.note, s.watched_at,
            t.week, t.day, t.subject, t.tag, t.topic
     FROM sessions s
     LEFT JOIN tasks t ON t.id = s.task_id
     WHERE s.user_id = $1
     ORDER BY s.watched_at DESC`,
    [userId]
  );
  return rows;
}
