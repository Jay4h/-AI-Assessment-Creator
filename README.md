# VedaAI — AI Assessment Creator

Monorepo frontend for the **AI Assessment Creator** tool, implemented from the [Figma design file](https://www.figma.com/design/voWYBzUZg018Iy258LQT5H/Untitled).

## Architecture

| Package | Role |
|---------|------|
| `apps/web` | Next.js 15 App Router (SSR, SEO metadata) |
| `packages/ui` | Shared layout & JSON-driven `ContentRenderer` |
| `packages/content` | Page copy JSON + mock question paper data |
| `packages/types` | Shared TypeScript models |

### Conventions (from project overview)

- **SSR-first**: Pages are Server Components; interactivity is isolated to leaf client components.
- **No `useEffect`**: Data and navigation use server actions, `redirect`, and Zustand (`useSyncExternalStore`).
- **JSON content mapping**: Copy and structured text render via `ContentRenderer` + `*.json` under `packages/content`.
- **Zustand**: Assignment form draft state (steppers, rows) without generic hook sprawl.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

API server runs on [http://localhost:4001](http://localhost:4001).

## Routes

| Route | Figma screen |
|-------|----------------|
| `/assignments` | 0 State — empty assignments |
| `/assignments/create` | Upload Material / Create Assignment form |
| `/assignments/demo/output` | Assignment Output — structured question paper |

## Backend (Phase 3)

- `apps/api` (Express + MongoDB + BullMQ queue producer + Socket.IO server)
- `apps/worker` (BullMQ worker for generation jobs + persistence)
- `packages/config` (typed env + queue names)
- `packages/validation` (zod API contracts)
- `packages/websocket` (shared socket event names)

### API endpoints

- `GET /health`
- `POST /api/assignments`
- `GET /api/assignments/:assignmentId`
- `GET /api/assignments/:assignmentId/output`
- `POST /api/assignments/:assignmentId/regenerate`

## Scripts

```bash
pnpm dev        # Start web + api + worker in parallel
pnpm dev:web    # Start web only
pnpm dev:api    # Start api only
pnpm dev:worker # Start worker only
pnpm build      # Build all packages
pnpm typecheck  # Typecheck workspace
```

## Next steps

- Wire Express + MongoDB + BullMQ + WebSocket backend
- Replace `mockQuestionPaper` with parsed AI output (never render raw LLM text)
- PDF export on output page

AI Assessment Creator - End-to-End Architecture & Execution Plan
Generated on: 2026-05-27 05:35 UTC
Project Vision
Build an AI-powered Assessment Creator platform where teachers can:
- Create assignments
- Upload optional source material
- Generate structured AI-based question papers
- Stream real-time generation updates
- Export professionally formatted PDFs

Core engineering goals:
- Server-first rendering
- SEO optimized
- Monorepo architecture
- Minimal client hydration
- Deterministic JSON rendering
- No raw LLM rendering
- No unnecessary useEffect usage
Recommended Tech Stack
Frontend:
- Next.js App Router
- TypeScript
- Zustand
- TailwindCSS
- React Server Components
- Socket.IO Client
- React Hook Form + Zod

Backend:
- Node.js
- Express.js
- TypeScript
- MongoDB
- Redis
- BullMQ
- Socket.IO

AI:
- OpenAI / Claude
- Structured prompt pipelines
- Zod schema validation

Infrastructure:
- Turborepo
- Docker
- Nginx
- GitHub Actions
Monorepo Architecture
apps/
├── web/
├── api/
├── worker/

packages/
├── ai-core/
├── prompts/
├── render-engine/
├── validation/
├── websocket/
├── shared-types/
├── ui/
└── config/
Frontend Architecture
Principles:
- 90% Server Components
- 10% Client Components
- Avoid generic hooks
- Avoid unnecessary hydration
- No client-side fetching for primary content

Client Components:
- File uploads
- Live websocket updates
- Interactive controls

Server Components:
- Assignment pages
- Output pages
- SEO metadata
- PDF preview pages
State Management Strategy
Use Zustand only for:
- Temporary UI state
- Websocket state
- Generation progress
- Modal visibility
- Interactive actions

Do NOT use Zustand for:
- Persistent database state
- API caching
- SSR data hydration
Backend Flow
1. User submits assignment
2. API validates payload
3. Assignment stored in MongoDB
4. BullMQ job created
5. Worker consumes generation job
6. AI prompt pipeline executes
7. Structured JSON generated
8. Validation layer checks schema
9. Result stored in MongoDB
10. Redis updates progress
11. Socket.IO notifies frontend
12. Frontend streams live updates
Structured Rendering Strategy
Never render raw AI responses.

Use JSON schema driven rendering.

Example:
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "question": "Explain REST architecture.",
          "difficulty": "medium",
          "marks": 5
        }
      ]
    }
  ]
}
Render Engine Design
Renderer Pattern:

const componentMap = {
  section: SectionRenderer,
  question: QuestionRenderer
}

blocks.map(block => {
  const Component = componentMap[block.type]
  return <Component {...block} />
})

Benefits:
- Deterministic UI
- PDF compatibility
- Regeneration support
- Security
- Extensibility
SEO Optimization
SEO Strategy:
- SSR-first rendering
- Semantic HTML
- generateMetadata()
- Minimal hydration
- Structured headings
- Fast TTFB
- Server-side fetching
- Streaming support
Websocket Strategy
Socket Events:
- queued
- processing
- generating_section_A
- generating_section_B
- completed
- failed

Frontend listens through isolated client boundaries only.
BullMQ Queue Design
Queues:
- generation-queue
- pdf-queue
- regeneration-queue

Workers:
- AI worker
- PDF worker
- Validation worker
MongoDB Collections
Collections:
- assignments
- generatedPapers
- jobStates
- promptLogs
- regenerationHistory
Redis Usage
Redis stores:
- Job status
- Progress updates
- Cache layers
- Rate limits
- Session coordination
Prompt Pipeline Architecture
Prompt layers:
1. System Prompt
2. Generation Prompt
3. Formatting Prompt
4. Validation Prompt
5. Regeneration Prompt
6. Difficulty Balancing Prompt
System Prompt
You are an academic assessment generation engine.

Rules:
- Generate strict JSON only
- No markdown
- No explanations
- Follow schema exactly
- Group questions into sections
- Include marks and difficulty
- Maintain educational formatting
- Avoid duplicate questions
Generation Prompt Template
Generate a structured assessment paper using:

Inputs:
- Subject
- Topics
- Uploaded content
- Number of questions
- Difficulty distribution
- Marks
- Additional instructions

Output:
- Structured JSON only
Validation Prompt
Validate:
- Marks consistency
- Difficulty balance
- Question uniqueness
- Proper section grouping
- Academic correctness
Regeneration Prompt
Regenerate only:
- Section B
OR
- Question 5

Maintain:
- Existing structure
- Marks consistency
- Difficulty consistency
Difficulty Rules
Easy:
- Recall
- Definitions
- Basics

Medium:
- Explanation
- Application
- Comparison

Hard:
- Analysis
- Design
- Critical thinking
Task Breakdown - Phase 1
Setup:
1. Initialize Turborepo
2. Configure Next.js
3. Configure Express API
4. Setup TypeScript
5. Setup ESLint + Prettier
6. Configure TailwindCSS
7. Setup MongoDB
8. Setup Redis
9. Setup BullMQ
10. Configure Docker
Task Breakdown - Phase 2
Frontend:
1. Assignment form
2. Validation layer
3. File upload
4. Zustand stores
5. Socket provider
6. Generation progress UI
7. Output renderer
8. Difficulty badges
9. Responsive layouts
10. SEO metadata
Task Breakdown - Phase 3
Backend:
1. Assignment APIs
2. Validation middleware
3. Queue integration
4. Worker setup
5. AI orchestration
6. Result persistence
7. Socket.IO integration
8. Regeneration APIs
9. PDF generation
10. Error handling
Task Breakdown - Phase 4
AI Layer:
1. Prompt templates
2. JSON schema definitions
3. Zod validation
4. Structured parsing
5. Retry strategy
6. Token optimization
7. Regeneration flows
8. Difficulty balancing
Task Breakdown - Phase 5
Deployment:
1. Dockerize services
2. Configure CI/CD
3. Setup Nginx
4. Configure HTTPS
5. Monitoring
6. Logging
7. Redis persistence
8. Mongo backups
Key Engineering Principles
- Renderer owns the UI
- AI only generates structured content
- Server-first rendering
- Deterministic output
- Minimal client hydration
- No raw LLM rendering
- Event-driven backend
- Shared typ