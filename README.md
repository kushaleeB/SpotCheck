# SpotCheck

**AI-powered café review analysis for students and remote workers.**

SpotCheck reads a café review and predicts whether the spot is a good place to work — classifying it as **Laptop-Friendly**, **Social Only**, or **Too Noisy**. Paste a review, get an instant label with confidence scores.

---

## Overview

Finding a café that actually works for studying is noisy and subjective: outlets, Wi‑Fi, volume, seating. SpotCheck turns unstructured review text into a clear workspace signal using a classical NLP pipeline (TF‑IDF + logistic regression) served next to a modern Next.js UI.

| Layer | Role |
|--------|------|
| **Next.js UI** | Landing page, analyze flow, classification guide |
| **Python ML** | Preprocess → vectorize → predict from `.pkl` artifacts |
| **Vercel** | Hosts the frontend and a Python serverless function together — no separate API server |

There is **no standalone FastAPI backend**. Inference runs as a Vercel Python serverless function (`api/predict.py`). Locally, `npm run dev` starts a small stdlib HTTP helper that uses the same ML code.

---

## Features

- **Instant classification** — paste a review and get a category plus confidence
- **Per-class probabilities** — see how the model scored all three labels
- **Home + Analyze flows** — quick try-on-home and a full analyze page with samples and breakdown
- **Classification guide** — human-readable definitions of each label
- **Hybrid deploy** — Next.js + Python on one Vercel project

### Prediction labels

| Label | Meaning |
|--------|---------|
| **Laptop-Friendly** | Outlets, Wi‑Fi, seating, quieter vibe for focused work |
| **Social Only** | Fine for meetups; limited workspace amenities or laptop-unfriendly cues |
| **Too Noisy** | Loud music, chatter, or high ambient noise that hurts concentration |

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Inter |
| Motion / icons | Framer Motion, Lucide React |
| ML | scikit-learn, joblib, NumPy |
| Artifacts | `models/model.pkl`, `models/vectorizer.pkl` |
| Hosting | Vercel (Next.js + Python serverless) |

---

## Architecture

```text
Browser
  │  POST /api/predict  { "review": "..." }
  ▼
Next.js (dev rewrite → :8000)     Vercel (production)
  │                                 │
  ▼                                 ▼
api/local_server.py               api/predict.py
  │                                 │
  └──────────► api/_ml.py ◄─────────┘
                    │
                    ▼
           models/*.pkl  (TF-IDF + classifier)
```

1. Client sends review text via `lib/api/predict.ts`.
2. Server loads cached model + vectorizer (warm instances reuse memory).
3. Text is lowercased and whitespace-normalized.
4. TF‑IDF transforms the text; the classifier returns a label and probabilities (as percentages).

---

## Project structure

```text
SpotCheck/
├── app/
│   ├── layout.tsx              # Root layout, Inter font, metadata
│   ├── page.tsx                # Landing: hero, features, home analyze, guide
│   ├── analyze/page.tsx        # Full analyze experience
│   └── globals.css             # Design tokens (primary indigo, surfaces)
├── components/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HomeAnalyze.tsx
│   ├── ClassificationGuide.tsx
│   ├── AnalyzePage.tsx
│   ├── Navbar.tsx / Footer.tsx / Logo.tsx
│   └── ui/                     # Button, Badge, Card
├── api/
│   ├── predict.py              # Vercel serverless: POST /api/predict
│   ├── _ml.py                  # Shared preprocess + inference (not a public route)
│   ├── local_server.py         # Local-only ML HTTP server for npm run dev
│   └── requirements.txt        # Python deps for serverless + local
├── models/
│   ├── model.pkl               # Trained classifier
│   └── vectorizer.pkl          # Fitted TF-IDF vectorizer
├── lib/api/predict.ts          # Frontend fetch helper
├── scripts/dev.mjs             # Starts Next + local ML server together
├── public/images/              # Hero art, logo
├── next.config.ts              # Dev rewrite /api/predict → localhost:8000
├── vercel.json                 # Bundle models/** into the Python function
├── package.json
└── README.md
```

---

## Getting started

### Prerequisites

- **Node.js** 20+ and npm  
- **Python** 3.10+ with pip  
- scikit-learn **1.6.x** (pinned in `api/requirements.txt` to match the pickled model)

### Install

```bash
cd SpotCheck
npm install
pip install -r api/requirements.txt
```

If you already have the older `spotcheck-backend/.venv`, `scripts/dev.mjs` will prefer that interpreter on Windows when present.

### Run (UI + ML)

```bash
npm run dev
```

This runs:

1. Next.js (usually [http://localhost:3000](http://localhost:3000))  
2. Local ML server on [http://127.0.0.1:8000/api/predict](http://127.0.0.1:8000/api/predict)

In development, Next rewrites `/api/predict` to the local Python server.

### Other scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js + local ML server |
| `npm run dev:web` | Next.js only (Analyze will fail without ML) |
| `npm run dev:api` | ML server only |
| `npm run build` | Production Next.js build |
| `npm run start` | Serve the Next.js production build |
| `npx vercel dev` | Closest to production (Vercel Python runtime locally) |

---

## API reference

### `POST /api/predict`

Classify a café review.

**Request**

```http
POST /api/predict
Content-Type: application/json

{
  "review": "Quiet café with fast Wi-Fi and lots of outlets."
}
```

**Success — `200`**

```json
{
  "prediction": "Laptop-Friendly",
  "confidence": 87.5,
  "probabilities": {
    "Laptop-Friendly": 87.5,
    "Social Only": 8.2,
    "Too Noisy": 4.3
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `prediction` | string | Winning class label |
| `confidence` | number | Probability of the winning class (0–100) |
| `probabilities` | object | All class scores as percentages |

**Errors**

| Status | Body | When |
|--------|------|------|
| `400` | `{ "detail": "Review text cannot be empty." }` | Empty / whitespace-only review |
| `405` | `{ "detail": "..." }` | Non-POST to the serverless handler |
| `500` | `{ "detail": "Prediction failed: ..." }` | Load or inference failure |

### Example (curl)

```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d "{\"review\":\"Perfect place for studying with reliable wifi\"}"
```

---

## Machine learning

### Pipeline

1. **Preprocess** — lowercase, trim, collapse repeated whitespace (`api/_ml.py`)  
2. **Vectorize** — fitted `TfidfVectorizer` from `vectorizer.pkl`  
3. **Classify** — scikit-learn model from `model.pkl` (logistic regression)  
4. **Scores** — `predict_proba` when available; otherwise softmax over `decision_function`

Artifacts are loaded once per warm serverless (or local server) process via `lru_cache`.

### Model files

| File | Role |
|------|------|
| `models/vectorizer.pkl` | Text → sparse TF‑IDF features |
| `models/model.pkl` | Features → class label + probabilities |

Keep **scikit-learn 1.6.x** when loading these pickles. A major version mismatch can warn or break unpickling.

### Training data (repo root, outside this app)

Labeled café reviews used for training live at the monorepo root as `clean_labeled_reviews.csv` (sibling of this `SpotCheck/` app folder). Retrain and replace the `.pkl` files under `models/` when you update the dataset.

---

## UI routes

| Route | Description |
|-------|-------------|
| `/` | Hero, feature cards, inline analyzer, classification guide |
| `/analyze` | Dedicated analyzer with quick samples, confidence ring, model breakdown |

Design tokens (indigo primary `#4F46E5`, lavender surfaces, soft shadows) live in `app/globals.css`.

---

## Deployment (Vercel)

1. Set the Vercel project **root** to this `SpotCheck/` folder.  
2. Connect the Git repo and deploy.  
3. Vercel builds the Next.js app and the Python function `api/predict.py`.  
4. `vercel.json` includes `models/**` in the function bundle and sets runtime limits (`maxDuration: 30`, `memory: 1024`).

No separate backend service, Docker host, or Uvicorn process is required in production.

Optional: set `PYTHON` locally if `python` is not on your PATH when using `npm run dev`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| **Prediction failed** / `404` on `/api/predict` | Only Next.js is running (`dev:web`) | Use `npm run dev` so the ML server starts |
| Port already in use | Old `next` / Python process still bound | Stop processes on `3000` / `8000`, then restart |
| sklearn pickle / version warnings | Wrong scikit-learn major version | `pip install -r api/requirements.txt` (1.6.x) |
| Model file missing | `models/` not present or not bundled | Ensure both `.pkl` files exist; check `vercel.json` `includeFiles` |
| Analyze works on curl `:8000` but not in browser | Dev rewrite not active | Confirm `next.config.ts` rewrites and that you use `npm run dev` |

---

## Related folders (monorepo)

This app lives under `d:\Projects\SpotCheck\SpotCheck`. Older Vite + FastAPI trees may still exist beside it for reference:

| Path | Notes |
|------|--------|
| `spotcheck-frontend/` | Previous Vite React UI (legacy) |
| `spotcheck-backend/` | Previous FastAPI service + venv (legacy) |

The **canonical** product path going forward is this Next.js + Python serverless app.

---

## License

Private project — update this section if you open-source or redistribute SpotCheck.
