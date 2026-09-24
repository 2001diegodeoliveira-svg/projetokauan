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
      recording_data BYTEA,
      recording_mime TEXT,
      recording_complete BOOLEAN NOT NULL DEFAULT FALSE,
      screen_recorded BOOLEAN NOT NULL DEFAULT FALSE,
      watched_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS photo_data BYTEA;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS photo_mime TEXT;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS recording_data BYTEA;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS recording_mime TEXT;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS recording_complete BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS screen_recorded BOOLEAN NOT NULL DEFAULT FALSE;

    CREATE TABLE IF NOT EXISTS provas (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      week TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress',
      passed BOOLEAN,
      score INTEGER,
      total INTEGER NOT NULL DEFAULT 15,
      questions JSONB NOT NULL DEFAULT '[]',
      photo_data BYTEA,
      photo_mime TEXT,
      violations INTEGER NOT NULL DEFAULT 0,
      started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      submitted_at TIMESTAMPTZ,
      canceled_at TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS idx_provas_user ON provas(user_id);
    CREATE INDEX IF NOT EXISTS idx_provas_user_week ON provas(user_id, week);
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
            (s.recording_data IS NOT NULL) AS has_recording,
            s.recording_mime, s.recording_complete, s.screen_recorded,
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
            (s.recording_data IS NOT NULL) AS has_recording,
            s.recording_mime, s.recording_complete, s.screen_recorded,
            t.week, t.day, t.subject, t.tag, t.topic
     FROM sessions s
     LEFT JOIN tasks t ON t.id = s.task_id
     WHERE s.user_id = $1
     ORDER BY s.watched_at DESC`,
    [userId]
  );
  return rows;
}

export async function getSessionRecordingData(sessionId) {
  const { rows } = await pool.query(
    `SELECT recording_data, recording_mime FROM sessions WHERE id = $1`,
    [sessionId]
  );
  return rows[0] || null;
}

export async function getSessionRecordingForUser(sessionId, userId) {
  const { rows } = await pool.query(
    `SELECT recording_data, recording_mime FROM sessions WHERE id = $1 AND user_id = $2`,
    [sessionId, userId]
  );
  return rows[0] || null;
}

export async function appendRecording(sessionId, userId, chunk, mime, final) {
  const { rows } = await pool.query(
    `UPDATE sessions
     SET recording_data = COALESCE(recording_data, ''::bytea) || $3,
         recording_mime = COALESCE(recording_mime, $4),
         screen_recorded = TRUE,
         recording_complete = CASE WHEN $5::boolean THEN TRUE ELSE recording_complete END
     WHERE id = $1 AND user_id = $2
     RETURNING id, recording_mime, recording_complete, screen_recorded,
               OCTET_LENGTH(COALESCE(recording_data, '')) AS recording_bytes`,
    [sessionId, userId, chunk, mime, Boolean(final)]
  );
  return rows[0] || null;
}

export async function listStudents() {
  const { rows } = await pool.query(
    `SELECT u.id, u.name, u.email, u.photo_consent, u.created_at,
            (SELECT COUNT(*)::int FROM tasks t WHERE t.user_id = u.id) AS total_tasks,
            (SELECT COUNT(*)::int FROM tasks t WHERE t.user_id = u.id AND t.done) AS done_tasks,
            (SELECT COUNT(*)::int FROM sessions s WHERE s.user_id = u.id) AS sessions_count,
            (SELECT COUNT(*)::int FROM provas p WHERE p.user_id = u.id AND p.passed) AS passed_provas,
            (SELECT COUNT(*)::int FROM provas p WHERE p.user_id = u.id) AS total_provas,
            (SELECT MAX(s.watched_at) FROM sessions s WHERE s.user_id = u.id) AS last_activity
     FROM users u
     ORDER BY u.created_at ASC`
  );
  return rows;
}

export const WEEK_ORDER = ["s1","s2","s3","s4","s5","s6","s7","s8"];
export const PROVA_QUESTION_COUNT = 15;
export const PROVA_PASS_PERCENT = 50;
export const PROVA_MINUTES = 40;
export const PROVA_MAX_VIOLATIONS = 3;

const weekIndex = (week) => WEEK_ORDER.indexOf(week);
const prevWeek = (week) => {
  const i = weekIndex(week);
  return i > 0 ? WEEK_ORDER[i - 1] : null;
};

export function requiredScore(total) {
  return Math.ceil(total * (PROVA_PASS_PERCENT / 100));
}

export function isValidWeek(week) {
  return weekIndex(week) >= 0;
}

async function isWeekCompleted(userId, week) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE done)::int AS done
     FROM tasks WHERE user_id = $1 AND week = $2`,
    [userId, week]
  );
  return rows[0] && rows[0].total > 0 && rows[0].done === rows[0].total;
}

export async function hasCompletedWeek(userId, week) {
  return isWeekCompleted(userId, week);
}

export async function isProvaPassedForWeek(userId, week) {
  const { rows } = await pool.query(
    `SELECT passed FROM provas
     WHERE user_id = $1 AND week = $2 AND status = 'submitted'
     ORDER BY id DESC LIMIT 1`,
    [userId, week]
  );
  return rows[0] ? rows[0].passed === true : false;
}

export async function isWeekUnlocked(userId, week) {
  const prev = prevWeek(week);
  if (!prev) return true;
  return isProvaPassedForWeek(userId, prev);
}

export async function getWeekGates(userId) {
  const gates = {};
  for (const wk of WEEK_ORDER) {
    gates[wk] = await isWeekUnlocked(userId, wk);
  }
  return gates;
}

async function expireStaleProvas(userId, week) {
  const cutoff = new Date(Date.now() - PROVA_MINUTES * 60 * 1000).toISOString();
  if (week) {
    await pool.query(
      `UPDATE provas
       SET status = 'canceled', canceled_at = COALESCE(canceled_at, now())
       WHERE user_id = $1 AND week = $2 AND status = 'in_progress' AND started_at < $3`,
      [userId, week, cutoff]
    );
  } else {
    await pool.query(
      `UPDATE provas
       SET status = 'canceled', canceled_at = COALESCE(canceled_at, now())
       WHERE user_id = $1 AND status = 'in_progress' AND started_at < $2`,
      [userId, cutoff]
    );
  }
}

function parseQuestions(questions) {
  if (typeof questions === "string") {
    try { return JSON.parse(questions); } catch { return []; }
  }
  return Array.isArray(questions) ? questions : [];
}

export function sanitizeProva(prova) {
  return {
    id: prova.id,
    week: prova.week,
    status: prova.status,
    passed: prova.passed,
    score: prova.score,
    total: prova.total,
    violations: prova.violations,
    started_at: prova.started_at,
    submitted_at: prova.submitted_at,
    canceled_at: prova.canceled_at
  };
}

export function publicProvaQuestions(stored) {
  return stored.map((q, i) => ({ id: q.id, q: q.q, o: q.o }));
}

export async function getUserProvas(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM provas
     WHERE user_id = $1 AND id IN (
       SELECT MAX(id) FROM provas WHERE user_id = $1 GROUP BY week
     ) ORDER BY week`,
    [userId]
  );
  return rows.map(sanitizeProva);
}

async function findInProgressProva(userId, week) {
  await expireStaleProvas(userId, week);
  const { rows } = await pool.query(
    `SELECT * FROM provas
     WHERE user_id = $1 AND week = $2 AND status = 'in_progress'
     ORDER BY id DESC LIMIT 1`,
    [userId, week]
  );
  return rows[0] || null;
}

export async function getInProgressProva(userId, provoId) {
  await expireStaleProvas(userId, null);
  const { rows } = await pool.query(
    `SELECT * FROM provas WHERE id = $1 AND user_id = $2 AND status = 'in_progress'`,
    [provoId, userId]
  );
  return rows[0] || null;
}

export async function getProvaById(provoId, userId) {
  const { rows } = await pool.query(
    "SELECT * FROM provas WHERE id = $1 AND user_id = $2",
    [provoId, userId]
  );
  return rows[0] || null;
}

export async function startOrResumeProva(userId, week, photo) {
  await expireStaleProvas(userId, week);

  const existing = await findInProgressProva(userId, week);
  if (existing) {
    return { prova: existing, resumed: true };
  }

  const { rows } = await pool.query(
    `INSERT INTO provas (user_id, week, questions, photo_data, photo_mime, total)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, week, "[]", photo.data, photo.mime, PROVA_QUESTION_COUNT]
  );
  return { prova: rows[0], resumed: false };
}

export async function saveProvaQuestions(provoId, userId, storedQuestions) {
  await pool.query(
    "UPDATE provas SET questions = $1 WHERE id = $2 AND user_id = $3",
    [JSON.stringify(storedQuestions), provoId, userId]
  );
}

export async function addProvaViolation(provoId, userId) {
  const { rows } = await pool.query(
    `UPDATE provas SET violations = violations + 1
     WHERE id = $1 AND user_id = $2 AND status = 'in_progress'
     RETURNING id, violations, status`,
    [provoId, userId]
  );
  const updated = rows[0] || null;
  if (updated && updated.violations >= PROVA_MAX_VIOLATIONS) {
    await cancelProva(provoId, userId);
    updated.status = "canceled";
  }
  return updated;
}

export async function cancelProva(provoId, userId) {
  await pool.query(
    `UPDATE provas SET status = 'canceled', canceled_at = now()
     WHERE id = $1 AND user_id = $2 AND status = 'in_progress'`,
    [provoId, userId]
  );
}

export async function submitProva(provoId, userId, answers) {
  const { rows } = await pool.query(
    "SELECT * FROM provas WHERE id = $1 AND user_id = $2",
    [provoId, userId]
  );
  const prova = rows[0];
  if (!prova) return { error: "not_found" };
  if (prova.status !== "in_progress") {
    return { error: prova.status === "submitted" ? "already_submitted" : "canceled" };
  }

  const questions = parseQuestions(prova.questions);
  let score = 0;
  const feedback = questions.map((q, i) => {
    const selNum = Number(Array.isArray(answers) ? answers[i] : null);
    const correct = Number.isInteger(selNum) && selNum >= 0 && selNum === q.c;
    if (correct) score += 1;
    return {
      index: i,
      q: q.q,
      correctIndex: q.c,
      selectedIndex: Number.isInteger(selNum) && selNum >= 0 ? selNum : null,
      correct,
      explanation: q.e || ""
    };
  });

  const required = requiredScore(prova.total);
  const passed = score >= required;
  await pool.query(
    `UPDATE provas SET status = 'submitted', score = $1, passed = $2, submitted_at = now()
     WHERE id = $3 AND user_id = $4`,
    [score, passed, provoId, userId]
  );

  return { score, total: prova.total, required, passed, feedback };
}

export async function listProvasForAdmin(userId) {
  const { rows } = await pool.query(
    `SELECT id, week, status, passed, score, total, violations, started_at, submitted_at
     FROM provas WHERE user_id = $1 ORDER BY id DESC`,
    [userId]
  );
  return rows;
}
