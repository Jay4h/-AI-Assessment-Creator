# VedaAI — Architecture

Monorepo for an AI assessment creator: teachers create assignments, a worker generates structured question papers, and the web app displays results with real-time progress.

## Repository layout

```
apps/
  web/          Next.js 15 App Router (SSR, SEO metadata)
  api/          Express + MongoDB + BullMQ producer + Socket.IO
  worker/       BullMQ consumer + OpenAI structured generation

packages/
  config/       Typed env (API vs worker)
  content/      Shared copy and nav constants
  types/        Domain TypeScript models
  ui/           Shared layout and QuestionPaperView
  validation/   Zod API contracts
  websocket/    Socket event names and room helpers
```

## Request flows

### Create assignment

1. User submits form → `apps/web` server action `submitAssignment`
2. `POST /api/assignments` → MongoDB + BullMQ job
3. Redirect to `/assignments/:id/output`

### Generate question paper

1. Worker picks job from Redis queue
2. OpenAI structured outputs per section + answer key (`apps/worker/src/llm/`)
3. Persist `QuestionPaper` JSON on assignment
4. Progress events → Redis → API `QueueEvents` → Socket.IO room

### View output

1. RSC prefetches `GET /api/assignments/:id/output` on first paint
2. Client subscribes via Socket.IO only while status ≠ completed
3. `QuestionPaperView` renders schema — never raw LLM text

## `apps/web` structure

```
src/
  app/                    Routes only (thin pages)
  components/
    layout/               Dashboard shell, nav
    assignments/          List, form, cards
    output/               Paper view + socket subscriber
  lib/
    api/                  Server-side fetch helpers
    actions/              Server actions
    stores/               Zustand (form draft, generation status)
    validation/           Form state types
```

**Conventions**

- Server Components by default; `"use client"` only at leaves (forms, socket, interactive UI).
- Data fetching for lists/output runs on the server (`lib/api/*`), not in `useEffect`.
- `prefetch={false}` on `/assignments` links to avoid redundant RSC prefetch in the shell.
- Zustand for ephemeral UI only (draft form, live generation status).

## `apps/api` structure

```
src/
  db/           Mongo connection and models
  queue/        Redis connection and BullMQ queues
  routes/       Express routers
  server.ts     App + Socket.IO + QueueEvents bridge
  index.ts      Bootstrap
```

## `apps/worker` structure

```
src/
  llm/          prompts, Zod schemas, OpenAI parse calls
  index.ts      Job processor loop
```

## Environment

| Process | Key vars |
|---------|----------|
| API | `MONGODB_URI`, `REDIS_URL`, `API_PORT`, `CORS_ORIGIN` |
| Worker | above + `OPENAI_API_KEY`, `OPENAI_MODEL` |
| Web | `API_URL` (server), `NEXT_PUBLIC_API_URL` (socket client) |

See `.env.example`.
