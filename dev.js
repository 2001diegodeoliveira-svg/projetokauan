import "dotenv/config";
import app, { ensureDb } from "./src/app.js";
import { PORT, DATABASE_URL } from "./src/config.js";

if (!DATABASE_URL) {
  console.error("DATABASE_URL não definida. Configure o .env com a connection string do Neon.");
  process.exit(1);
}

try {
  await ensureDb();
  console.log("Banco de dados (Neon/Postgres) conectado e tabelas verificadas.");
} catch (err) {
  console.error("Falha ao conectar/inicializar o banco:", err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
