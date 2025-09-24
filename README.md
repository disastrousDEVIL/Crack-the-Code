# Which Number Am I?

A small number-guessing game with a FastAPI backend and a React (Vite) frontend.

## Tech
- Backend: FastAPI (Python)
- Frontend: React + Vite
- Build: Vite build serves static assets from the backend in production

## Requirements
- Python 3.11+
- Node.js 18+

## Setup
1) Backend
```
python -m venv venv
./venv/Scripts/pip install -r backend/requirements.txt
```

2) Frontend
```
cd frontend
npm install
```

## Environment
- `backend/env.example` → copy to `backend/.env` (optional) and set:
  - `ALLOWED_ORIGINS` (comma-separated) for local development CORS, e.g. `http://localhost:5173`
- `frontend/env.example` → copy to `frontend/.env` (optional) and set:
  - `VITE_API_BASE` (optional). Defaults to `/api` in dev and same-origin in production.

## Development
Run backend API (port 8000):
```
./venv/Scripts/uvicorn.exe backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Run frontend dev server (port 5173):
```
cd frontend
npm run dev
```
- Dev API Requests: The Vite dev server proxies `/api` → `http://127.0.0.1:8000`.

## Production build
Build frontend assets and serve them from the backend:
```
cd frontend
npm run build
```
Then start the backend:
```
./venv/Scripts/uvicorn.exe backend.main:app --host 127.0.0.1 --port 8000
```
Open `http://127.0.0.1:8000`.

## API
- `POST /start` → start a game (query: `limit=10|15|20|0`)
- `POST /guess?guess=1234` → submit a guess
- `GET /past_guesses` → list past guesses

## Project structure
```
backend/
  main.py
  requirements.txt
frontend/
  src/
  vite.config.js
  package.json
```
