# Backend — Cronograma de Estudos 9º Ano

Sistema completo (front + API REST) de cronograma de estudos para o 9º ano.
Node.js + Express + SQLite. Inclui:

- Login por aluno (JWT + senha criptografada)
- 40 tarefas padrão do cronograma (8 semanas), cada uma com **link de aula no YouTube**
- **Foto obrigatória para assistir cada aula** (câmera ou arquivo) → histórico de participação
- CRUD de tarefas e progresso por semana
- Termo de consentimento de imagem (LGPD) no cadastro

> Atenção (LGPD): o sistema guarda fotos de alunos (menores). Conteúdo sensível.
> Mantenha o banco/`data/photos` protegidos, use `JWT_SECRET` forte em produção e
> avalie a política de guarda/exclusão das imagens com a escola.

## Requisitos

- Node.js 23.4+ (usa o módulo nativo `node:sqlite`)

## Como rodar

```bash
npm install
npm start        # ou: npm run dev (reinicia ao salvar)
```

Abra `http://localhost:3000`. O banco e as fotos ficam em `data/` (criado na 1ª execução).

Configuração por variáveis de ambiente (`.env`):

- `PORT` → porta do servidor (padrão: `3000`)
- `JWT_SECRET` → segredo dos tokens (padrão: valor de desenvolvimento)

## Acesso pelo celular (mobile)

O front-end é responsivo (celular, tablet e desktop). Para abrir no celular:

1. Descubra o IP do computador na rede: `ipconfig` (ex.: `192.168.0.10`).
2. No celular (mesma rede Wi-Fi), acesse `http://192.168.0.10:3000`.
3. Se o firewall bloquear, libere a porta 3000 para a rede privada.

Observação sobre a câmera: navegadores só liberam a câmera em `localhost` ou em
conexões **HTTPS**. Acessando pelo IP da rede via `http://`, o botão da câmera
pode não funcionar — nesse caso use **"Enviar arquivo"** (tira a foto pela câmera
do celular e envia). Para usar a câmera ao vivo fora do localhost, sirva o app
por HTTPS (ex.: proxy reverso com certificado, ou túnel tipo ngrok/Cloudflare).


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
| POST   | `/api/sessions/tasks/:id/watch`| **Multipart** com `photo` (≤5MB, JPG/PNG/WebP). Marca a tarefa concluída e registra a sessão. |
| GET    | `/api/sessions`                | Histórico de participação (foto, disciplina, data) |
| GET    | `/uploads/photos/:arquivo`     | Foto registrada (servida estaticamente) |

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
├── server.js                 # App Express, rotas, uploads estáticos e multer errors
├── cronograma-9ano.html      # Front-end (autenticação, cronograma, câmera, histórico)
├── src/
│   ├── config.js             # PORT e JWT_SECRET
│   ├── database.js           # SQLite (users, tasks, sessions), migrações e consultas
│   ├── middleware/auth.js    # Token JWT
│   ├── routes/
│   │   ├── authRoutes.js     # register / login / me (com consentimento LGPD)
│   │   ├── taskRoutes.js     # CRUD de tarefas + progresso
│   │   └── sessionRoutes.js  # upload de foto + histórico (multer)
│   └── data/
│       └── defaultTasks.js   # 40 tarefas padrão com links do YouTube
└── data/                     # cronograma.db e photos/ (gerados na execução)
```