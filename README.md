# Cronograma de Estudos 9º Ano

Sistema completo (front + API REST) de cronograma de estudos para o 9º ano.
Node.js + Express + PostgreSQL (Neon), pronto para rodar local e na **Vercel**. Inclui:

- Login por aluno (JWT + senha criptografada)
- 40 tarefas padrão do cronograma (8 semanas), cada uma com **link de aula no YouTube**
- **Foto obrigatória para assistir cada aula** (câmera ou arquivo) → histórico de participação
- CRUD de tarefas e progresso por semana
- **Provas semanais por progressão**: cada semana é liberada somente após a aprovação na prova da semana anterior
- **Painel administrativo** (aba ADM): ver todos os alunos, evolução semanal, registros com foto e notas das provas
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

Abra `http://localhost:3000`. As tabelas (`users`, `tasks`, `sessions`, `provas`) são criadas
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

### Administrador (requer token de ADM)

Credenciais padrão: `ADMIN_USERNAME=adm` / `ADMIN_PASSWORD=dev123`
(em produção, defina essas duas variáveis na Vercel para não usar o padrão).

| Método | Rota                    | Descrição |
| ------ | ----------------------- | --------- |
| POST   | `/api/admin/login`      | Login `{username, password}` → token de ADM |
| GET    | `/api/admin/students`   | Todos os alunos com progresso (evolução por semana) |
| GET    | `/api/admin/students/:id` | Detalhe do aluno + evolução semanal + registros com foto + notas das provas |

### Provas semanais (requer `Authorization: Bearer <token>`)

Regras:

- **Progressão**: a semana 1 é sempre liberada. A semana `N` (N > 1) só é liberada
  se a prova da semana `N−1` foi **aprovada** (nota ≥ 50%). Enquanto uma semana
  estiver travada, marcar tarefa como feita ou assistir aula nela retorna `403`.
- **Como iniciar**: só é possível iniciar a prova se a semana está liberada, **todas
  as tarefas da semana foram concluídas** e foi enviada uma **foto** (JPEG/PNG/WebP,
  ≤ 4 MB) junto com o `week` (multipart). Repetir a prova de uma semana já aprovada
  retorna `409`.
- **Formato**: 15 questões por semana (5 alternativas, 1 correta) sorteadas do banco
  de questões (`src/data/provaQuestions.js`). A nota de corte para aprovação é **50%**:
  `required = ceil(15 × 0.5) = 8` acertos.
- **Anti-cola**: o front monitora `visibilitychange`/`blur`/`focus`; sair da página por
  mais de 2 s registra uma violação (`POST /:id/violation`). Com **3 violações** a prova
  é **cancelada** automaticamente.
- **Retomada**: uma prova em andamento pode ser retomada por `GET /:id` (sem pedir nova
  foto, mantém as mesmas questões). Provas abandonadas por mais de 40 min são canceladas.

| Método | Rota                    | Descrição |
| ------ | ----------------------- | --------- |
| GET    | `/api/provas`           | Status da semana (`gates`), provas do aluno e mínimo para passar |
| POST   | `/api/provas/start`     | **Multipart** `week` + `photo` → inicia/retoma a prova (devolve 15 questões) |
| GET    | `/api/provas/:id`       | Retoma a prova em andamento (mesmas questões, sem gabarito) |
| POST   | `/api/provas/:id/violation` | Registra uma saída da tela (3 cancela a prova) |
| POST   | `/api/provas/:id/submit` | Envia `{answers:[...]}` → corrige, grava resultado e libera a próxima semana se passar |
| POST   | `/api/provas/:id/cancel` | Cancela a prova em andamento |

A API devolve apenas o enunciado e as alternativas **embaralhadas**; o gabarito
(chave correta) fica somente no banco (coluna `questions` JSONB da tabela `provas`).

### Tarefas (requer `Authorization: Bearer <token>`)

| Método | Rota                    | Descrição                                        |
| ------ | ----------------------- | ------------------------------------------------ |
| GET    | `/api/tasks`            | Lista tarefas (com `video_url`) + progresso      |
| POST   | `/api/tasks`            | Cria tarefa `{week, day, subject, tag, topic, video_url}` |
| POST   | `/api/tasks/seed`       | Recria as 40 tarefas padrão (`reset: true` para apagar antes) |
| PATCH  | `/api/tasks/:id`        | Edita a tarefa                                   |
| PATCH  | `/api/tasks/:id/done`   | Alterna `done` (bloqueia com `403` se a semana ainda está travada) |
| DELETE | `/api/tasks/:id`        | Exclui a tarefa                                  |

### Aulas e histórico (requer token)

| Método | Rota                           | Descrição |
| ------ | ------------------------------ | --------- |
| POST   | `/api/sessions/tasks/:id/watch`| **Multipart** com `photo` (≤4 MB, JPG/PNG/WebP). Marca a tarefa concluída e registra a sessão (bloqueia com `403` se a semana está travada). |
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
5. Concluídas as aulas da semana, clica em **Iniciar Prova** (nova foto), responde as
   15 questões e recebe o resultado na hora.
6. Nota ≥ 50% libera a próxima semana; sair da tela mais de 2 s conta violação
   (3 violações cancelam a prova).
7. O histórico de participação mostra todas as fotos e datas.

## Estrutura

```
projetokauan/
├── public/
│   └── index.html            # Front-end (autenticação, cronograma, câmera, histórico)
├── src/
│   ├── app.js                # App Express (export default) — entrada detectada pela Vercel
│   ├── config.js             # PORT, JWT_SECRET, DATABASE_URL
│   ├── database.js           # Postgres/Neon (users, tasks, sessions, provas) e consultas
│   ├── middleware/auth.js    # Token JWT (header ou ?token=)
│   ├── routes/
│   │   ├── authRoutes.js     # register / login / me (com consentimento LGPD)
│   │   ├── taskRoutes.js     # CRUD de tarefas + progresso + controle de semanas travadas
│   │   ├── sessionRoutes.js  # upload de foto (memória) + histórico + imagem
│   │   ├── provaRoutes.js    # provas semanais (start, retomar, violação, submit)
│   │   └── adminRoutes.js    # painel administrativo (inclui notas das provas)
│   └── data/
│       ├── defaultTasks.js   # 40 tarefas padrão com links do YouTube
│       └── provaQuestions.js # 120 questões de prova (15 por semana) + embaralhamento
├── vercel.json               # Força o Framework Preset "express"
├── dev.js                    # Servidor local (app.listen) — só para desenvolvimento
└── .env                      # DATABASE_URL e JWT_SECRET (não versionado)
```
