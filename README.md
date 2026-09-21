# Cronograma de Estudos 9º Ano

Sistema completo (front + API REST) de cronograma de estudos para o 9º ano.
Node.js + Express + PostgreSQL (Neon), pronto para rodar local e na **Vercel**. Inclui:

- Login por aluno (JWT + senha criptografada)
- 40 tarefas padrão do cronograma (8 semanas), cada uma com **link de aula no YouTube**
- **Foto obrigatória para assistir cada aula** (câmera ou arquivo) → histórico de participação
- CRUD de tarefas e progresso por semana
- Termo de consentimento de imagem (LGPD) no cadastro

> Atenção (LGPD): o sistema guarda fotos de alunos (menores). Conteúdo sensível.
> Mantenha o banco protegido, use `JWT_SECRET` forte em produção e avalie a
> política de guarda/exclusão das imagens com a escola.

## Requisitos

- Node.js 18+ (na Vercel usa Node 22)
- Um banco PostgreSQL — recomendado o [Neon](https://neon.tech) (plano gratuito)

## Configuração (.env)

Copie `.env.example` para `.env` e preencha:

- `DATABASE_URL` → connection string do Neon (use a **Pooled connection**, com `-pooler`)
- `JWT_SECRET` → segredo dos tokens (use um valor forte em produção)
- `PORT` → porta local (padrão: `3000`)

## Como rodar

```bash
npm install
npm start        # ou: npm run dev (reinicia ao salvar)
```

Abra `http://localhost:3000`. As tabelas (`users`, `tasks`, `sessions`) são criadas
automaticamente na primeira execução. As **fotos ficam no próprio banco** (coluna
`BYTEA`), por isso o sistema funciona igual em disco ou em ambiente serverless.

## Deploy na Vercel

O projeto usa o **suporte a Express da Vercel (zero-config)**: a Vercel detecta o app
em `src/app.js` (export default) e o transforma em uma única função. Não é preciso a
pasta `api/`.

- `src/app.js` → app Express (export default) detectado pela Vercel
- `public/index.html` → front-end servido como arquivo estático pelo CDN
  (na Vercel, `express.static()` é ignorado; estáticos só valem em `public/**`)
- `vercel.json` → força `"framework": "express"` para garantir que a função seja
  construída mesmo que o preset do painel tenha ficado como "Other"
- Fotos gravadas no Postgres (não em disco, que é efêmero na Vercel)

Passos:

1. Crie o banco no Neon e copie a **Pooled connection string**.
2. Na Vercel, importe o repositório do GitHub (ou rode `npx vercel`).
   - **Framework Preset:** **Express** (o `vercel.json` já força isso).
   - **Root Directory:** a raiz do repositório.
3. Em **Settings → Environment Variables**, defina (para Production e Preview):
   - `DATABASE_URL` = connection string do Neon
   - `JWT_SECRET` = um segredo forte
4. Faça o deploy. Teste `https://SEU-PROJETO.vercel.app/api/health` (deve retornar `{"status":"ok","database":"up"}`).

Observações da Vercel:

- **Importante:** não use `app.listen()` no arquivo detectado (só no `dev.js`,
  que roda em desenvolvimento). Use `export default app`.
- Limite de corpo das funções serverless: ~4,5 MB. O upload de foto é limitado a **4 MB**
  (o front reduz a imagem automaticamente antes de enviar).
- A região da função deve ficar próxima do banco Neon para menor latência
  (ex.: Neon em `us-east-1` → região Vercel `iad1`).
- Se aparecer `FUNCTION_INVOCATION_FAILED`, veja os **Runtime Logs** da função na
  Vercel; normalmente é variável de ambiente faltando ou erro de importação.

## Acesso pelo celular (local)

1. Descubra o IP do computador na rede: `ipconfig` (ex.: `192.168.0.10`).
2. No celular (mesma rede Wi-Fi), acesse `http://192.168.0.10:3000`.

Observação sobre a câmera: navegadores só liberam a câmera em `localhost` ou em
conexões **HTTPS** (na Vercel é HTTPS, então funciona). Acessando pelo IP via
`http://`, use **"Enviar arquivo"**. Para câmera ao vivo fora do localhost, sirva
o app por HTTPS.

### Registro por foto (câmera)

Ao clicar em **▶ Assistir aula**, o app abre o modal e **pede permissão da câmera**
(`getUserMedia`). O fluxo:

1. Autorize a câmera no aviso do navegador (se negar, reautorize no cadeado).
2. Vídeo ao vivo → clique em **📷 Tirar foto**.
3. **🔄 Refazer** para outra foto e **🔁 Trocar câmera** (frontal/traseira).
4. Confirme para enviar, marcar o tópico como concluído e abrir a aula.

Sem câmera, o botão **📁 Enviar arquivo** faz o mesmo (a imagem é redimensionada
no navegador antes do envio).

## Rotas da API

### Autenticação

| Método | Rota                    | Descrição                                                        |
| ------ | ----------------------- | ---------------------------------------------------------------- |
| POST   | `/api/auth/register`    | Cadastro `{name, email, password, photoConsent}` (consentimento obrigatório) |
| POST   | `/api/auth/login`       | Login `{email, password}` → devolve token                        |
| GET    | `/api/auth/me`          | Dados do aluno logado (requer token)                             |

### Tarefas (requer `Authorization: Bearer <token>`)

| Método | Rota                    | Descrição                                        |
| ------ | ----------------------- | ------------------------------------------------ |
| GET    | `/api/tasks`            | Lista tarefas (com `video_url`) + progresso      |
| POST   | `/api/tasks`            | Cria tarefa `{week, day, subject, tag, topic, video_url}` |
| POST   | `/api/tasks/seed`       | Recria as 40 tarefas padrão (`reset: true` para apagar antes) |
| PATCH  | `/api/tasks/:id`        | Edita a tarefa                                   |
| PATCH  | `/api/tasks/:id/done`   | Alterna `done`                                   |
| DELETE | `/api/tasks/:id`        | Exclui a tarefa                                  |

### Aulas e histórico (requer token)

| Método | Rota                           | Descrição |
| ------ | ------------------------------ | --------- |
| POST   | `/api/sessions/tasks/:id/watch`| **Multipart** com `photo` (≤4 MB, JPG/PNG/WebP). Marca a tarefa concluída e registra a sessão. |
| GET    | `/api/sessions`                | Histórico de participação (foto, disciplina, data) |
| GET    | `/api/sessions/photo/:arquivo` | Foto registrada (lida do banco; aceita token via header ou `?token=`) |

O `video_url` das 40 tarefas padrão é gerado como busca no YouTube:
`https://www.youtube.com/results?search_query=<disciplina> <tópico> 9 ano`.
Professores podem trocar por vídeo específico via `PATCH /api/tasks/:id` com `video_url`.

## Fluxo do aluno (front-end)

1. Cadastro (precisa marcar a autorização de imagem) ou login.
2. No cronograma, clica em **▶ Assistir aula**.
3. Tira foto (câmera) ou envia arquivo → confirma.
4. O sistema registra a sessão, marca o tópico concluído e abre a aula no YouTube.
5. O histórico de participação mostra todas as fotos e datas.

## Estrutura

```
projetokauan/
├── public/
│   └── index.html            # Front-end (autenticação, cronograma, câmera, histórico)
├── src/
│   ├── app.js                # App Express (export default) — entrada detectada pela Vercel
│   ├── config.js             # PORT, JWT_SECRET, DATABASE_URL
│   ├── database.js           # Postgres/Neon (users, tasks, sessions) e consultas
│   ├── middleware/auth.js    # Token JWT (header ou ?token=)
│   ├── routes/
│   │   ├── authRoutes.js     # register / login / me (com consentimento LGPD)
│   │   ├── taskRoutes.js     # CRUD de tarefas + progresso
│   │   └── sessionRoutes.js  # upload de foto (memória) + histórico + imagem
│   └── data/
│       └── defaultTasks.js   # 40 tarefas padrão com links do YouTube
├── vercel.json               # Força o Framework Preset "express"
├── dev.js                    # Servidor local (app.listen) — só para desenvolvimento
└── .env                      # DATABASE_URL e JWT_SECRET (não versionado)
```
