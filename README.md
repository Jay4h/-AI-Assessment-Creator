# VedaAI — AI Assessment Creator

Monorepo: teachers create assignments, AI generates structured question papers, results stream over WebSocket.

[Figma designs](https://www.figma.com/design/voWYBzUZg018Iy258LQT5H/Untitled)

## Quick start

```bash
pnpm install
cp .env.example .env   # set OPENAI_API_KEY for the worker
pnpm dev
```

- Web: http://localhost:3000  
- API: http://localhost:4001  

## Routes

| Route | Purpose |
|-------|---------|
| `/assignments` | Assignment list (SSR) |
| `/assignments/create` | Create assignment form |
| `/assignments/:id/output` | Generated question paper |

## Scripts

```bash
pnpm dev          # web + api + worker
pnpm dev:web      # web only
pnpm dev:api      # api only
pnpm dev:worker   # worker only
pnpm build
pnpm typecheck
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for folder layout, data flows, and conventions.

## Packages

| Package | Role |
|---------|------|
| `apps/web` | Next.js UI |
| `apps/api` | REST + Socket.IO + queue producer |
| `apps/worker` | AI generation jobs |
| `packages/ui` | Shared components (`QuestionPaperView`, layout) |
| `packages/types` | Shared models |
| `packages/content` | Nav and form constants |
| `packages/config` | Env helpers |
| `packages/validation` | API Zod schemas |
| `packages/websocket` | Socket event constants |
