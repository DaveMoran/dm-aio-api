# dm-aio-api

Personal all-in-one API for morning/evening routines, workouts, nutrition, and bootcamp tracking. Built with [Bun](https://bun.sh) + [Hono](https://hono.dev), backed by [Supabase](https://supabase.com).

---

## Prerequisites

- [Bun](https://bun.sh) v1.0+ — `curl -fsSL https://bun.sh/install | bash`
- A [Supabase](https://supabase.com) project with the `tasks` table

---

## Local setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> Find these in your Supabase dashboard under **Project Settings → API**.
> Use the `service_role` secret key — this API is server-side only and bypasses RLS.

### 3. Start the dev server

```bash
bun run dev
```

The server starts at `http://localhost:3000` with hot-reload enabled.

---

## Verify it's working

```bash
# Health check
curl http://localhost:3000/health

# Morning + evening routines
curl http://localhost:3000/api/v1/checklist
```

---

## API reference

### Checklist (morning/evening routines)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/checklist` | Returns all tasks grouped into `morning` (AM) and `evening` (PM) lists, ordered by `sort_order`. Accepts optional `?date=YYYY-MM-DD` (defaults to today UTC) |
| `POST` | `/api/v1/checklist` | Create a new routine task |
| `PATCH` | `/api/v1/checklist/:id` | Update a task's completion status for a given date. Server rejects updates to any date other than today |
| `DELETE` | `/api/v1/checklist/:id` | Soft-delete a routine task |

#### POST body

```json
{
  "name": "Meditate",
  "period": "AM",
  "sort_order": 7
}
```

#### PATCH body

```json
{
  "completed": true,
  "date": "2026-05-31"
}
```

---

## Docs

The `docs/` folder contains machine-readable API documentation:

- [`docs/openapi.yaml`](./docs/openapi.yaml) — OpenAPI 3.1 contract for all endpoints
- [`docs/insomnia-collection.json`](./docs/insomnia-collection.json) — Insomnia v4 collection (File → Import to load)

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot-reload |
| `bun run start` | Start production server |
| `bun test` | Run all tests |
| `bun run typecheck` | TypeScript type check (no emit) |
| `bun run lint` | ESLint |

---

## Deployment

Deployed on [Railway](https://railway.app). See [`railway.toml`](./railway.toml) for config.

Required env vars in the Railway dashboard:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
