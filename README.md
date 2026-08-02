<<<<<<< HEAD
﻿<div align="center">

<h1>🎓 Test Marks AI</h1>

<p><strong>AI-powered mock test &amp; analytics platform for NEET, JEE and CBSE students</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<p>
  <a href="#-features">Features</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-project-structure">Structure</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-environment-variables">Environment Variables</a> ·
  <a href="#-api-reference">API Reference</a>
</p>

</div>

---

## ✨ Overview

**Test Marks AI** is a full-stack educational SaaS that helps students preparing for India's most competitive exams — NEET, JEE Mains, JEE Advanced, and CBSE boards — through adaptive mock tests, AI-powered coaching, deep skill analytics, and personalised study plans.

> New users are shown rich **example data** on first sign-up. The moment they complete their first real test, the data resets and the platform works fully with their own results.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🧪 **Adaptive Mock Tests** | Stream-specific tests with configurable question count, subject focus, and difficulty |
| 🤖 **AI Study Coach** | Real-time coach messages powered by Gemini / OpenAI / Anthropic |
| 📊 **Brain-Map Analytics** | Radar chart showing per-subject mastery across 12 topics |
| 🔥 **Skill Heatmap** | Topic-level accuracy heatmap across all your attempts |
| 🎯 **Rank Predictor** | Estimates expected score vs stream maximum based on your recent accuracy |
| 📈 **Score Trend** | Line chart tracking your last 20 test attempts |
| 🏅 **XP & Badges** | Streak rewards, accuracy badges, and a level system |
| 🗺️ **Study Plan** | AI-generated focused practice tests for your weakest topics |
| 👤 **Auth & Profiles** | Firebase Auth with student / admin roles and Firestore profile storage |
| 💎 **Premium Tier** | Usage limits on the free tier with upgrade flow |
| 🌙 **Dark Mode** | System-aware dark/light theme with manual toggle |
| 📴 **Offline Fallback** | Full local analytics engine when the backend is unreachable |

---

## 🛠 Tech Stack

### Frontend — `/web`

| Library | Version | Purpose |
|---|---|---|
| Next.js | 16 | App router, SSR/SSG |
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | 12 | Animations & transitions |
| Recharts | 3 | Charts (area, radar, line, bar) |
| Lucide React | 1 | Icon set |
| Firebase | 12 | Auth + Firestore |

### Backend — `/api`

| Library | Version | Purpose |
|---|---|---|
| FastAPI | 0.110 | REST API framework |
| Uvicorn | 0.29 | ASGI server |
| Pydantic | 2.6 | Request/response validation |
| Python | 3.11+ | Runtime |

### AI Providers (configurable)

- Google Gemini
- OpenAI GPT-4
- Anthropic Claude

---

## 📁 Project Structure

```
Test-marks-main/
├── api/                          # FastAPI backend
│   ├── app/
│   │   ├── data/                 # Question banks & stream definitions
│   │   ├── models/               # Pydantic schemas
│   │   ├── routers/              # API route handlers
│   │   │   ├── analytics.py      # GET /api/analytics/{user_id}
│   │   │   ├── attempts.py       # POST /api/attempts
│   │   │   ├── plan.py           # POST /api/plan
│   │   │   ├── streams.py        # GET /api/streams
│   │   │   └── tests.py          # GET /api/diagnostic, POST /api/tests/generate
│   │   ├── services/
│   │   │   ├── ai_provider.py    # AI coach message generation
│   │   │   ├── engine.py         # Scoring, analytics & badge logic
│   │   │   └── store.py          # In-memory attempt storage
│   │   └── main.py               # FastAPI app entry point
│   └── requirements.txt
│
└── web/                          # Next.js frontend
    └── src/
        ├── app/                  # App router pages
        │   ├── page.tsx          # Landing page
        │   ├── dashboard/        # Home dashboard
        │   ├── analytics/        # Deep analytics hub
        │   ├── mock-test/        # Test configuration
        │   ├── diagnostic/       # Loading/diagnostic flow
        │   ├── report/           # Post-test results & AI plan
        │   ├── onboarding/       # New user stream selection
        │   ├── profile/          # User settings
        │   ├── premium/          # Upgrade page
        │   ├── admin/            # Admin dashboard
        │   └── signin/           # Auth page
        ├── components/           # Shared UI components
        │   ├── AppShell.tsx      # Sidebar layout wrapper
        │   ├── QuestionPlayer.tsx # In-test question interface
        │   ├── ScoreRing.tsx      # Circular score indicator
        │   └── Badge.tsx, StatCard.tsx, ChartCard.tsx ...
        └── lib/
            ├── api.ts            # Backend API client with mock fallback
            ├── auth.tsx          # Firebase Auth context
            ├── mock-data.ts      # Complete offline data engine
            ├── result-store.ts   # Local attempt history & offline analytics
            ├── tokens.ts         # Design tokens & chart colours
            ├── types.ts          # Shared TypeScript interfaces
            └── utils.ts          # Formatters, normalisation helpers
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** ≥ 18 and npm
- **Python** ≥ 3.11 and pip
- A **Firebase project** (Auth + Firestore enabled)

---

### 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/test-marks-ai.git
cd test-marks-ai
```

---

### 2 — Start the Backend API

```bash
cd api

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn app.main:app --reload --port 8000
```

API will be live at `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

> **No backend?** The frontend has a full mock/offline fallback — it works completely without the backend running.

---

### 3 — Start the Frontend

```bash
cd web

# Install dependencies
npm install

# Copy the environment file and fill in your values
cp .env.example .env.local

# Start the development server
npm run dev
```

Frontend will be live at `http://localhost:3000`

---

## 🔐 Environment Variables

Create `web/.env.local` with the following:

```env
# Backend API base URL (leave as-is for local development)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Firebase — get these from your Firebase project settings
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

For the **AI coach** feature, set in `api/`:

```env
# Pick one provider
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/streams` | List available exam streams |
| `GET` | `/api/diagnostic/{stream_id}` | Get a full diagnostic test |
| `POST` | `/api/tests/generate` | Generate a custom mock test |
| `POST` | `/api/attempts` | Submit answers and get scored result |
| `GET` | `/api/analytics/{user_id}` | Full analytics for a user |
| `POST` | `/api/plan` | Generate a personalised study plan |

Full interactive API docs available at `http://localhost:8000/docs` when the backend is running.

---

## 🎨 Design System

The app uses a custom warm-academic design identity:

| Token | Value | Use |
|---|---|---|
| Primary (Indigo) | `#3D3580` | Buttons, links, charts |
| Gold | `#C8952A` | Accents, streaks, highlights |
| Forest | `#2D6A4F` | Success, high mastery |
| Danger | `#B94040` | Errors, low mastery |
| Surface | `#FDFAF4` | Page background |
| Ink | `#1C1C1E` | Body text |

All tokens are defined in `web/src/lib/tokens.ts` and `web/src/app/globals.css`.

---

## 🧩 Key Design Decisions

- **Offline-first analytics** — When the backend is unreachable, `result-store.ts` maintains a local attempt history in `localStorage` and computes full analytics (heatmaps, brain maps, XP, badges) client-side.
- **Example data for new users** — Brand-new accounts see fully populated demo data so the app never feels empty. It resets automatically after the first real test is submitted.
- **Accuracy normalisation** — The backend returns accuracy at attempt-level as a percentage (`85`) and per-topic as a ratio (`0.85`). `normalizeMastery()` in `utils.ts` handles both forms transparently across all UI components.
- **Configurable AI** — The AI provider is decoupled. Swap between Gemini, OpenAI, or Anthropic in `api/app/services/ai_provider.py` with zero frontend changes.

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo and create your branch
git checkout -b feature/your-feature-name

# Make your changes, then commit
git commit -m "feat: describe your change"

# Push and open a Pull Request
git push origin feature/your-feature-name
```

Please follow the existing code style. Run `npm run lint` before submitting a PR.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>Built with ❤️ for India's exam warriors</p>
  <p><strong>NEET · JEE Mains · JEE Advanced · CBSE</strong></p>
</div>
=======
AI-powered mock test & analytics platform for NEET, JEE and CBSE students. Adaptive diagnostics, brain-map skill tracking, AI study coach, and personalised exam predictions. Built with Next.js 16, FastAPI, Firebase and Recharts.
>>>>>>> 2e2b2cb435074c94bfe35afc9740b9cebae0d1ba
