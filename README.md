## InventoryOS — Multi-tenant Inventory Management System

This repo is a starter implementation based on `InventoryOS_Project_Document.docx`:
- Backend: FastAPI + SQLAlchemy + Alembic + PostgreSQL
- Frontend: React (Vite) + Tailwind + React Router + Zustand + React Query
- Docker Compose: PostgreSQL + API + Nginx-served SPA (with API proxy)

### Quick start (Docker)

1) Create env files:
- `cp backend/.env.example backend/.env`
- `cp frontend/.env.example frontend/.env`

2) Start services:
- `docker compose up --build`

3) Run migrations (first run):
- `docker compose exec backend alembic upgrade head`

4) Open:
- App: `http://localhost`
- API docs: `http://localhost/api/docs`

### Local dev (without Docker)

Backend:
- `cd backend`
- `python3 -m venv venv && source venv/bin/activate`
- `pip install -r requirements.txt`
- `cp .env.example .env` (point `DATABASE_URL` to your local Postgres)
- `alembic upgrade head`
- `uvicorn app.main:app --reload --port 8000`

Frontend:
- `cd frontend`
- `npm install`
- `cp .env.example .env`
- `npm run dev`

### Current implemented features (MVP)
- Tenant + admin registration (`/api/v1/auth/register`)
- Login + JWT access/refresh tokens (`/api/v1/auth/login`, `/api/v1/auth/refresh`)
- Product CRUD (tenant-scoped)
- Inventory transactions (stock_in/stock_out/adjustment) + basic stock endpoint
