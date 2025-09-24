# 🔐 Crack the Code

Crack the Code is a fun logic-based number guessing game built with a **FastAPI backend** and a **React (Vite) frontend**.  
Your goal? **Guess the secret 4-digit code** (with no repeating digits) using logic and deduction before your attempts run out.

---

## 🎮 How to Play
1. Start a new game.
2. Enter a **4-digit guess** (digits must be unique).
3. After each guess you’ll get feedback:
   - **Digits Correct** → how many digits exist in the secret code.
   - **Positions Correct** → how many are in the exact right spot.
4. Use the feedback to refine your guesses and **crack the code** before attempts run out.

---

## ✨ Features
- 🧩 Classic code-breaking gameplay
- ⏳ Configurable attempt limits (10, 15, 20, or unlimited)
- 📜 Past guesses history for strategy tracking
- ⚡ Fast backend powered by **FastAPI**
- 🎨 Interactive UI with **React + Vite**
- 📦 Single deployment: React build is served directly from the backend

---

## 🛠 Tech Stack
- **Backend:** FastAPI (Python 3.11+)
- **Frontend:** React + Vite (Node.js 18+)
- **Server:** Uvicorn
- **Dev Tools:** Axios, ngrok (for quick sharing)

---

## 📂 Project Structure
```

backend/
main.py
requirements.txt
frontend/
src/
vite.config.js
package.json

````

---

## ⚙️ Setup

### 1) Backend
```bash
python -m venv venv
./venv/Scripts/pip install -r backend/requirements.txt
````

### 2) Frontend

```bash
cd frontend
npm install
```

---

## 🌍 Environment

Optional `.env` files for dev configuration:

* **backend/.env**

  * `ALLOWED_ORIGINS` → e.g. `http://localhost:5173` for local dev

* **frontend/.env**

  * `VITE_API_BASE` → defaults to `/api` in dev and same-origin in production

---

## 🚀 Development

Run backend (port 8000):

```bash
./venv/Scripts/uvicorn.exe backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Run frontend dev server (port 5173):

```bash
cd frontend
npm run dev
```

* The Vite dev server proxies `/api` → `http://127.0.0.1:8000`.

---

## 📦 Production Build

1. Build frontend:

```bash
cd frontend
npm run build
```

2. Serve with backend:

```bash
./venv/Scripts/uvicorn.exe backend.main:app --host 127.0.0.1 --port 8000
```

3. Open: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🔗 API Endpoints

* `POST /start` → start a game (`limit=10|15|20|0` for attempts)
* `POST /guess?guess=1234` → submit a guess
* `GET /past_guesses` → list all previous guesses

---

## 🚧 Future Ideas

* 🎚 Difficulty levels (3–6 digits)
* 🌐 Online multiplayer
* 🏆 Scoring & leaderboard
* 🎨 UI themes (dark mode, retro, hacker style)
