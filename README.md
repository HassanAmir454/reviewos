# ReviewOS — AI Code Review Dashboard

> Production-grade, visually extraordinary AI-powered GitHub Pull Request review dashboard.

![ReviewOS](https://img.shields.io/badge/ReviewOS-v1.0-00FF88?style=flat-square&labelColor=0A0B0E)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![Claude](https://img.shields.io/badge/Claude-claude--sonnet--4-orange?style=flat-square)

---

## Features

| Feature | Description |
|---|---|
| 🤖 **AI Code Review** | Claude claude-sonnet-4-20250514 streams reviews token-by-token via WebSocket |
| 📊 **Analytics Dashboard** | Velocity charts, contribution heatmap, team leaderboard, merge histograms |
| 🔄 **Real-time Updates** | WebSocket push — new PRs appear instantly, no polling |
| 📁 **Diff Viewer** | Syntax-highlighted unified diff with file tree navigation |
| 🔐 **GitHub OAuth** | NextAuth v5 with GitHub OAuth — secure session management |
| 🪝 **Webhooks** | GitHub App webhooks with HMAC signature verification |
| ⌨️ **Keyboard Nav** | J/K to navigate PRs vim-style |
| 🧠 **Complexity Score** | Cyclomatic complexity per PR (supports Python, TS, JS, Go, Rust) |

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router, Server Components)
- **TypeScript** strict mode
- **Tailwind CSS** with custom design tokens
- **Framer Motion** animations
- **Recharts + D3** data visualizations
- **Zustand** global state
- **TanStack Query** data fetching

### Backend
- **FastAPI** async with Pydantic v2
- **Anthropic SDK** (Claude streaming)
- **SQLAlchemy** async ORM + PostgreSQL
- **Redis** caching & pub/sub
- **Celery** background workers
- **httpx** async GitHub API client

---

## Quick Start

### 1. Clone & configure environment

```bash
git clone <repo-url>
cd reviewos
cp .env.example .env
# Fill in all values in .env
```

### 2. Create GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. New OAuth App → set callback URL to `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID & Secret into `.env` as `GITHUB_ID` and `GITHUB_SECRET`

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

Services started:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 4. Run database migrations

```bash
docker-compose exec backend alembic upgrade head
```

---

## Environment Variables

See `.env.example` for the full list. Critical ones:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key for AI reviews |
| `GITHUB_TOKEN` | GitHub PAT (scopes: `repo`, `read:org`) |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub OAuth App credentials |
| `NEXTAUTH_SECRET` | Session signing key — generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_DEFAULT_REPO` | Default repo to show (e.g. `vercel/next.js`) |

---

## Development (Without Docker)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Architecture

```
reviewos/
├── frontend/          # Next.js 14 App
│   ├── app/           # App Router pages
│   ├── components/    # UI + feature components
│   ├── hooks/         # Data-fetching hooks
│   ├── store/         # Zustand stores
│   ├── lib/           # API client, WS singleton
│   └── types/         # TypeScript interfaces
│
└── backend/           # FastAPI Python API
    ├── app/
    │   ├── routers/   # HTTP + WebSocket routes
    │   ├── services/  # GitHub, AI, Analytics, Cache
    │   ├── models/    # SQLAlchemy ORM models
    │   ├── schemas/   # Pydantic v2 schemas
    │   ├── tasks/     # Celery background tasks
    │   └── utils/     # Diff parser, complexity calc
    └── alembic/       # DB migrations
```

---

## WebSocket Protocol

```jsonc
// Client receives these message types:
{ "type": "pr.opened",       "data": { ...PR } }
{ "type": "pr.updated",      "data": { ...PR } }
{ "type": "pr.closed",       "data": { "number": 123 } }
{ "type": "review.token",    "data": { "reviewId": "...", "token": "..." } }
{ "type": "review.complete", "data": { "reviewId": "...", "fullText": "..." } }
{ "type": "review.error",    "data": { "reviewId": "...", "message": "..." } }
{ "type": "sync.status",     "data": { "message": "...", "progress": 0.6 } }
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `J` | Next PR in list |
| `K` | Previous PR in list |
| `R` | Trigger AI Review (when PR selected) |

---

## License

MIT — built as a portfolio project.
