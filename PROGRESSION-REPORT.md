# Test Marks AI — Progression Report & Handoff

> **Purpose:** This document lets ANY AI agent (or human) continue work on this project with ZERO prior context. Read this file first, then follow the "How to Resume" section.

---

## 1. What Is This Project

**Test Marks AI** — an AI-tutored mock-test platform for Indian students:
- **Streams:** NEET, JEE Mains, JEE Advanced, CBSE Class 10, CBSE Class 11, CBSE Class 12
- **Core loop:** Student takes a mock test (50-question diagnostic on first entry, AI-generated thereafter) → AI scores it → weak areas detected → personalized report + improvement plan → next targeted test
- **Premium model:** 2 free mock tests/day, unlimited for premium (payment NOT implemented — stub only)
- **Monetization/SaaS:** admin dashboard exists (users, tests, analytics)

**Stack (NON-NEGOTIABLE, decided by client):**
| Layer | Technology | Where it runs |
|-------|-----------|---------------|
| Frontend | Next.js 16 (App Router, TypeScript, Tailwind v4, Framer Motion, lucide-react, recharts) | **web/** folder, Netlify later |
| Backend | FastAPI (Python 3.12) | **api/** folder, Firebase Cloud Run later |
| Auth | **Firebase Auth** (real, wired) | `web/src/lib/firebase.ts` |
| DB | Firebase Firestore (used for user roles/premium) | — |
| AI | **opencode Zen** LLM, model **`mimo-v2.5-free`** | called from backend + build tooling |
| Hosting targets | Netlify (web) + Firebase (api/auth) | NOT deployed yet |

**Design system (strict):** Crimson `#DC143C` primary, deep crimson `#A30D2E`, white `#FFFFFF`, surface `#F6F6F8`, near-black `#0B0B0F`. Editorial typography: Space Grotesk headings + Inter body (via `next/font/google`). 16–20px radii, soft shadows, Framer Motion animations. Mobile-first responsive. Dark + light theme (theme context in `web/src/lib/theme.tsx`).

---

## 2. Repository Layout

```
D:\projects\test-mark\
├── PROGRESSION-REPORT.md     ← YOU ARE HERE
├── TestMarksAI-Product-Spec.md   (product spec v2.0, keep in sync)
├── AdaptiLearn-HeadCon-Concept.md (earlier concept doc, mostly superseded)
├── web/                      ← Next.js frontend
│   └── src/
│       ├── app/              ← pages: page(landing) signin onboarding diagnostic
│       │                         report dashboard mock-test analytics premium
│       │                         admin profile + layout.tsx globals.css
│       ├── components/       ← Navbar Footer AppShell QuestionPlayer QuestionPalette
│       │                         Timer ScoreRing Confetti CountUp Typewriter StatCard
│       │                         ChartCard PremiumBanner Badge Logo
│       └── lib/              ← api.ts types.ts mock-data.ts auth.tsx firebase.ts
│                               theme.tsx result-store.ts utils.ts
├── api/                      ← FastAPI backend
│   ├── .env                  ← 🔑 OPENCODE_API_KEY + BASE_URL + MODEL (SECRET — never commit)
│   ├── requirements.txt      ← fastapi, uvicorn, pydantic
│   ├── .venv/                ← Python virtualenv (created)
│   ├── app/
│   │   ├── main.py           ← FastAPI app, CORS *, mounts routers
│   │   ├── data/
│   │   │   ├── streams.py    ← the 6 streams + difficultyMix + maxMarks
│   │   │   ├── questions.py  ← BANKS dict aggregating all bank files
│   │   │   └── banks/        ← cbse_10.py cbse_11.py cbse_12.py jee_mains.py
│   │   │                       jee_advanced.py neet.py  (+ STALE cbse-10.py — DELETE)
│   │   ├── models/schemas.py ← Pydantic request models
│   │   ├── services/
│   │   │   ├── ai_provider.py← opencode/mimo-v2.5-free provider + fallback templates
│   │   │   ├── engine.py     ← test builder, scoring, weak areas, analytics, streak, XP
│   │   │   └── store.py      ← in-memory attempts/tests store (no DB)
│   │   └── routers/          ← streams diagnostic attempts tests analytics plan
│   └── tools/
│       ├── extract_all.py     ← PDF text extraction (Python, done — all 40 PDFs)
│       └── extract_missing.py ← parallel extractor for the remaining PDFs (done)
├── texts/                     ← 📖 EXTRACTED BOOK TEXT (40 files: c10/ 28, c11/ 6, c12/ 6)
├── books/                     ← 📚 NCERT Class 11 & 12 PDFs (subfolders drive-download-…)
│                              Class 11: Physics P1+P2, Chemistry P1+P2, Maths, Biology
│                              Class 12: Physics P1+P2, Chemistry P1+P2, Maths P1, Biology
│                              (+ Class 10 Economics/Geography/History/Pol-Science, unused)
└── tools/
    ├── gen_banks.mjs         ← 🟢 Node.js bank generator (LLM) — MAIN BUILD TOOL
    ├── gen.log / gen.err.log ← generation logs
    └── partial/              ← checkpoint files (per-call results) — resume-safe
```

**NCERT Class 10 chapter PDFs** (source for cbse-10 bank) live in `D:\Downloads\jemh1dd\` (Math, jemh101–114) and `D:\Downloads\jesc1dd\` (Science, jesc101–113). They are NOT in the repo.

---

## 3. How to Run (both servers are CURRENTLY RUNNING)

| Server | Command | URL |
|--------|---------|-----|
| Web (Next.js dev) | `cd web; npm run dev` | http://localhost:3000 |
| API (FastAPI) | `cd api; .venv\Scripts\python -m uvicorn app.main:app --port 8000` | http://localhost:8000 |

- API health: `GET http://localhost:8000/health` → `{"status":"ok","provider":"opencode","model":"mimo-v2.5-free"}`
- Frontend calls API at `http://localhost:8000` (`NEXT_PUBLIC_API_URL` env, defaults in `web/src/lib/api.ts`); **if the API is down or slow (>1.5s timeout), the UI silently falls back to rich mock data** in `web/src/lib/mock-data.ts` — the demo never breaks.
- PowerShell note: `cmd1; if ($?) { cmd2 }` for chaining (no `&&`). Use `Start-Process` for long-running background jobs (log to a file and poll it — do NOT run long LLM loops in the foreground shell).
- **npm 12 quirk:** install scripts are blocked by default; `.npmrc` in `web/` has `allow-scripts=true` and `npm install-scripts approve <pkg>` was used.

---

## 4. API Contract (backend ↔ frontend)

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/health` | — | status/provider/model |
| GET | `/api/streams` | — | `[{id,name,description,subjects,difficultyMix:{easy,medium,hard},maxMarks}]` — 6 streams, no cbse-8/9 |
| GET | `/api/diagnostic/{stream_id}` | — | `{test_id,title,stream,questions:[50]}` each q: `{id,subject,topic,difficulty,question,options[4],correct:0-3,explanation}` |
| POST | `/api/attempts` | `{user_id,test_id,answers:[{question_id,chosen}],time_taken_sec}` | `{score,total,accuracy,per_topic[],weak_areas[],strong_areas[],percentile_est,coach_message}` |
| POST | `/api/tests/generate` | `{user_id,stream,focus_topics?,difficulty?,count}` | test object (same shape as diagnostic) |
| GET | `/api/analytics/{user_id}` | — | `{attempts,avg_score,trend[],heatmap{},brain_map[],predictor{expected,max},streak,xp,level,badges[],recent_attempts[]}` |
| POST | `/api/plan` | `{user_id}` | `{recommendations:[{topic,reason,advice,tests[]}]}` |

TypeScript mirror in `web/src/lib/types.ts`. Unknown stream → 404. Scoring: chosen == correct index.

---

## 5. Current Status (what works right now)

### ✅ Done & verified
1. **Web app** — all 14 routes build clean (`npm run build` + `npm run lint` pass). Landing, sign-in/sign-up, onboarding (3 slides + stream select), 50-question diagnostic player (timer, palette, flag, drag-reorder, keyboard shortcuts, swipe), report page (score ring, topic bars, typewriter coach, confetti), dashboard (stat cards, recharts trend, heatmap, recent attempts), mock-test generator UI, analytics hub (brain-map radar, predictor gauge, badges), premium (stub paywall), admin dashboard (users/tests/platform stats), profile.
2. **Real Firebase Auth** — `web/src/lib/firebase.ts` (project `test-marks-ai`) + `auth.tsx` rewrite: email/password sign up/in/out, `onAuthStateChanged`, role from Firestore doc `users/{uid}` (admin requires code `ADMIN2026`), premium flag from same doc. `user_id` in all API calls is the real Firebase uid. NO demo login remains.
3. **FastAPI backend** — all endpoints verified via TestClient. 6 streams. Scoring, weak-area detection (threshold 60%), coach message, analytics (streak/XP/badges/predictor), plan generator, focus-weighted test generation (70% focus topics with same-subject fallback).
4. **Live AI** — `api/.env` has the opencode Zen key; coach messages are generated by the REAL `mimo-v2.5-free` model (verified: real personalized message referencing weak topics). Provider: POST `https://opencode.ai/zen/v1/chat/completions`, `max_tokens` high (1024+), response text may be in `message.content` OR `message.reasoning` (reasoning model!), needs `User-Agent: TestMarksAI/1.0` header (Cloudflare blocks default urllib UA).

### ⏳ In progress (STOPPED — resume per Section 7)
5. **Question banks are being rebuilt from the actual NCERT books** via LLM (this was mid-flight when stopped):
   - Extraction status: `api/tools/txt/` — **c10/ ALL 27 chapter files done**; **c11/ done: physics-p1, physics-p2, chemistry-p1, chemistry-p2, maths** (biology pending); **c12/ NOTHING extracted yet**.
   - Generation: `tools/gen_banks.mjs` (Node, concurrency 3, checkpointed to `tools/partial/`) — **partial folder currently EMPTY** (was cleared before last run; last run produced nothing before being stopped).

### ⚠️ Known issues / TODOs
- **Firestore rules not set** — must be configured in Firebase Console (rules below) or role/premium persistence fails (app falls back to defaults, still works). Also enable Email/Password provider in Firebase Console.
- **`api/app/data/banks/cbse-10.py` (dash) is STALE** — leftover from an aborted agent; not imported by `questions.py`; DELETE it.
- **`api/app/data/banks/cbse_10.py` is still the OLD hand-written bank** (50 Qs, contains mojibake "Â/�" in some questions) — being replaced by the LLM book-based bank.
- **JEE Mains composition rule:** 25% Class 11 + 75% Class 12 (PCM) — handled by bank generation (not by test builder).
- **JEE Advanced:** PCM from Class 11+12, harder (40% medium / 60% hard).
- **NEET:** PCB (Physics, Chemistry, Biology) from Class 11 + 12, ~50/50 easy/medium.
- Payment: `PaymentConnector` stub only; `PAYMENT_API_KEY` slot exists in `ai_provider.py` — gateway to be provided later by client.
- Books for future: Class 10 SST PDFs exist in `books/` but cbse-10 stream intentionally = Mathematics + Science only.
- The dev servers (web :3000, api :8000) are running with the OLD banks — after regenerating banks, restart the API (kill the python uvicorn process and relaunch).

---

## 6. How the Bank Generation Works (read before resuming)

**Goal:** every question in every bank must come from the REAL NCERT book text via the LLM, so mock papers are level-true and syllabus-accurate.

1. **Extract** PDFs → plain text (`api/tools/txt/`): Python script `api/tools/extract_all.py` (pypdf installed in `api/.venv`). Big books take minutes each; runs fine in background with log file.
2. **Generate** (`tools/gen_banks.mjs`):
   - Reads `api/.env` (never prints the key).
   - `runPool`: 3 concurrent LLM calls; each call = 1 chapter or 1 subject-slice, returns strict JSON `{"questions":[...]}`; **robust parser scans brace-balanced JSON objects** (mimo sometimes wraps JSON in prose).
   - `max_tokens: 4096`, `AbortSignal.timeout(180000)`, 3 attempts with backoff (429 → 10s sleep).
   - **Checkpointing:** every successful call is saved to `tools/partial/<stream>__<key>.json`; reruns SKIP existing partials (resume-safe).
   - Jobs with missing book text log `WAIT` and are skipped (rerun after extraction).
   - Each bank's `.py` file is written to `api/app/data/banks/<stream>.py` with header `from typing import Any, Dict, List` and `BANK: List[Dict[str, Any]] = [...]`.
3. **Job specs per stream:**
   - `cbse-10`: 27 chapters (14 math `jemh10x` + 13 science `jesc10x`), 6 Qs per chapter (4–5 easy, 1–2 medium), ids `c10-mXX-N` / `c10-sXX-N`, subjects Mathematics/Science.
   - `cbse-11` / `cbse-12`: 4 subjects (Physics, Chemistry, Mathematics, Biology) × 2 calls × 10 Qs = ~80, mix ~4 easy/5 medium/1 hard per call, ids `cb11-ph-N` etc.
   - `jee_mains`: 3 subjects × 2 calls (4 Qs from Class 11 = 25%, 12 Qs from Class 12 = 75%), ids `jm-ph-N`.
   - `jee_advanced`: 3 subjects × 10 Qs (4 medium/6 hard, both classes), ids `ja-ph-N`.
   - `neet`: 3 subjects (PCB) × 2 calls (8 Qs each from 11 + 12), ids `neet-ph-N`.
   - Total ≈ 45 LLM calls ≈ 15–30 min with 3-way concurrency.
4. **Run:** `node tools/gen_banks.mjs [stream]` (optional filter, e.g. `node tools/gen_banks.mjs cbse-10`). Log: `tools/gen.log`.

---

## 7. How to Resume (exact next steps for an agent)

1. **Finish extraction** (background): `.venv\Scripts\python tools\extract_all.py` in `api/` (already ran once; it skips existing files — remaining: `c11/biology.txt`, all `c12/*`). Poll `api/tools/extract.log` until all 40 files OK (27 c10 + 6 c11 + 6 c12 + 1 answers).
2. **Generate all banks**: `node tools\gen_banks.mjs` in `tools/` (background, poll `tools/gen.log`). Re-run until no `WAIT`/`FAIL` lines. Expected totals ≈ cbse-10 ≥150, cbse-11 ~80, cbse-12 ~80, jee_mains 48, jee_advanced 30, neet 48.
3. **Verify banks** (from `api/`): `.venv\Scripts\python -c "from app.data.questions import BANKS; print({k: len(v) for k,v in BANKS.items()})"` — every stream ≥ 28, and no "Â"/"�" in any bank (`compileall` + import check).
4. **Delete stale** `api/app/data/banks/cbse-10.py`.
5. **Restart API** so new banks load: kill the python uvicorn process (PID of `uvicorn app.main:app`), relaunch `cd api; Start-Process .venv\Scripts\python.exe -ArgumentList "-m uvicorn app.main:app --port 8000"`, then `Invoke-RestMethod http://localhost:8000/health`.
6. **Smoke-test** endpoints: diagnostic per stream (50 Qs), attempts, analytics, plan (see contract above). Verify jee_mains bank topic mix shows ~75% class-12 topics.
7. **Ask the user before launching/restarting the API server** — the client explicitly requires being asked first. (Web server is fine to restart freely.)
8. **Optional polish:** sync `TestMarksAI-Product-Spec.md` (still says "CBSE 8/9/10" in a couple of spots — streams are now 10/11/12), delete `api/tools/extract_all.py` + `txt/` when done, remove `AdaptiLearn-HeadCon-Concept.md` or keep as archive.

---

## 8. Firebase Setup Remaining (user action)

In Firebase Console (project `test-marks-ai`):
1. Enable **Authentication → Sign-in method → Email/Password**.
2. Set **Firestore rules** to (at minimum):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
(Web config is already embedded in `web/src/lib/firebase.ts`.)

---

## 9. Secrets & Key Locations

| Secret | Location |
|--------|----------|
| opencode Zen API key | `api/.env` → `OPENCODE_API_KEY` (base URL `https://opencode.ai/zen/v1`, model `mimo-v2.5-free`) |
| Firebase web config | `web/src/lib/firebase.ts` (public by design) |
| Admin secret code | `ADMIN2026` in `web/src/lib/auth.tsx` |
| Payment key | NOT provided yet — stub `PAYMENT_API_KEY` in `api/app/services/ai_provider.py` |

⚠️ Never echo the API key into chat/logs; `api/.gitignore` excludes `.env`.

---

## 10. Key Files Cheat-Sheet

- `web/src/lib/api.ts` — typed API client + 1.5s timeout + mock fallback
- `web/src/lib/mock-data.ts` — offline mocks (streams, 50-Q generators, analytics) — MUST stay in sync with backend stream list
- `web/src/lib/auth.tsx` — Firebase auth context (`useAuth`, `RequireAuth`)
- `web/src/components/QuestionPlayer.tsx` — the shared test-taking UI
- `api/app/services/engine.py` — scoring/analytics/test-building core (`FOCUS_WEIGHT=0.7`)
- `api/app/services/ai_provider.py` — LLM provider + templates
- `api/app/data/streams.py` — the 6 streams (source of truth for stream ids)

**Stream ids (exact):** `neet`, `jee-mains`, `jee-advanced`, `cbse-10`, `cbse-11`, `cbse-12`.
