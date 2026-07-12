# SpotCheck

**AI-powered café review analysis for students and remote workers.**

SpotCheck reads a café review and predicts whether the spot is a good place to work — classifying it as **Laptop-Friendly**, **Social Only**, or **Too Noisy**. Paste a review, get an instant label with confidence scores.

---

## Overview

Finding a café that actually works for studying is noisy and subjective: outlets, Wi‑Fi, volume, seating. SpotCheck turns unstructured review text into a clear workspace signal using a classical NLP pipeline (TF‑IDF + logistic regression) served entirely by Next.js.

| Layer | Role |
|--------|------|
| **Next.js UI** | Landing page, analyze flow, classification guide |
| **Next.js API** | `POST /api/predict` — TF‑IDF + logistic regression in TypeScript |
| **Vercel** | Hosts the Next.js app (no separate Python runtime required) |

Inference uses model weights exported to `lib/ml/artifacts.json` (from the original scikit-learn `.pkl` files). Python helpers under `python/` are optional for retraining / parity checks.

---

## Features

- **Instant classification** — paste a review and get a category plus confidence
- **Per-class probabilities** — see how the model scored all three labels
- **Home + Analyze flows** — quick try-on-home and a full analyze page with samples and breakdown
- **Classification guide** — human-readable definitions of each label

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
| Styling | Tailwind CSS v4 |
| Motion / icons | Framer Motion, Lucide React |
| ML (runtime) | TypeScript TF‑IDF + OvR logistic regression |
| Artifacts | `lib/ml/artifacts.json` (exported from `models/*.pkl`) |
| Hosting | Vercel (Next.js only) |

---

## Architecture

```text
Browser
  │  POST /api/predict  { "review": "..." }
  ▼
app/api/predict/route.ts
  │
  ▼
lib/ml/infer.ts  +  lib/ml/artifacts.json
```

1. Client sends review text via `lib/api/predict.ts`.
2. Route handler runs the same TF‑IDF + logistic regression pipeline in TypeScript.
3. Response includes the winning label and per-class probabilities (percentages).

---

## Project structure

```text
SpotCheck/
├── app/
│   ├── api/predict/route.ts    # Production POST /api/predict
│   ├── analyze/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
├── lib/
│   ├── api/predict.ts          # Frontend fetch helper
│   └── ml/
│       ├── infer.ts            # TF-IDF + classifier
│       └── artifacts.json      # Exported model weights
├── models/                     # Source .pkl files (for export / training)
├── python/                     # Optional local Python parity tools
├── scripts/
│   ├── export_model_json.py    # Rebuild artifacts.json from .pkl
│   └── dev.mjs                 # Optional Next + Python side-by-side
├── vercel.json
├── package.json
└── README.md
```

---

## Getting started

### Prerequisites

- **Node.js** 20+ and npm  
- **Python** 3.10+ (only if you retrain or re-export the model)

### Install

```bash
cd SpotCheck
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Analyze works with no Python process — inference is in the Next.js route.

### Other scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js (includes `/api/predict`) |
| `npm run export:model` | Rebuild `lib/ml/artifacts.json` from `models/*.pkl` |
| `npm run dev:api` | Optional Python ML server on `:8000` |
| `npm run dev:python` | Next + optional Python server together |
| `npm run build` | Production Next.js build |
| `npm run start` | Serve the production build |

After changing `models/*.pkl`:

```bash
pip install -r python/requirements.txt
npm run export:model
```

---

## API reference

### `POST /api/predict`

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

**Errors**

| Status | Body | When |
|--------|------|------|
| `400` | `{ "detail": "Review text cannot be empty." }` | Empty review |
| `405` | `{ "detail": "..." }` | Non-POST |
| `500` | `{ "detail": "Prediction failed: ..." }` | Inference failure |

```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d "{\"review\":\"Perfect place for studying with reliable wifi\"}"
```

---

## Machine learning

1. **Preprocess** — lowercase, trim, collapse whitespace  
2. **Vectorize** — TF‑IDF (English stop words, unigrams, L2 norm)  
3. **Classify** — OvR logistic regression (`liblinear`) with sigmoid + normalize  
4. **Export** — `scripts/export_model_json.py` writes portable weights to `artifacts.json`

| File | Role |
|------|------|
| `models/vectorizer.pkl` / `model.pkl` | Source sklearn artifacts |
| `lib/ml/artifacts.json` | Runtime weights used in production |

---

## Deployment (Vercel)

1. Set the Vercel project **root** to this `SpotCheck/` folder.  
2. Framework preset: **Next.js** (default).  
3. Connect the Git repo and deploy.  
4. `vercel.json` sets `maxDuration` / memory for `app/api/predict`.

No Python runtime, Services setup, or `includeFiles` for `.pkl` models is required — weights ship inside the Next.js bundle via `artifacts.json`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| **Prediction failed** on old deploys | Python `api/predict.py` conflicted with Next.js | Redeploy this version (Next.js route) |
| Stale predictions after retrain | Forgot to export JSON | Run `npm run export:model` and redeploy |
| sklearn pickle errors (local Python only) | Wrong scikit-learn version | `pip install -r python/requirements.txt` (1.6.x) |

---

## License

Private project — update this section if you open-source or redistribute SpotCheck.
