## InventoryOS — Multi-tenant Inventory Management System

This repo is a starter implementation based on `InventoryOS_Project_Document.docx`:
- Backend: FastAPI + SQLAlchemy + Alembic + PostgreSQL
- Frontend: React (Vite) + Tailwind + React Router + Zustand + React Query
- Docker Compose: PostgreSQL + API + Nginx-served SPA (with API proxy)

### Local dev (recommended)

1) Create env files:
- `cp backend/.env.example backend/.env`
- `cp frontend/.env.example frontend/.env`

2) Start Postgres locally
- Ensure PostgreSQL is running on `localhost:5432`
- Create DB + user matching `backend/.env` (`inventoryos` / `inventoryos_user`)

3) Backend
- `cd backend`
- Use Python **3.11** (Python 3.13 may fail to install `psycopg2-binary`)
- `python3.11 -m venv venv && source venv/bin/activate`
- `pip install -r requirements.txt`
- `alembic upgrade head`
- `uvicorn app.main:app --reload --port 8000`

4) Frontend
- `cd frontend`
- `npm install`
- `npm run dev`

5) Open:
- App: `http://localhost:5173`
- API docs: `http://localhost:8000/api/docs`

### Docker (optional)

If you prefer Docker Compose, update `backend/.env` to use `@db:5432` and follow the compose instructions.

### Current implemented features (MVP)
- Tenant + admin registration (`/api/v1/auth/register`)
- Login + JWT access/refresh tokens (`/api/v1/auth/login`, `/api/v1/auth/refresh`)
- Product CRUD (tenant-scoped)
- Inventory transactions (stock_in/stock_out/adjustment) + basic stock endpoint
