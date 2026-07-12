"""Export sklearn .pkl artifacts to lib/ml/artifacts.json for the Next.js API."""

from __future__ import annotations

import json
from pathlib import Path

import joblib

ROOT = Path(__file__).resolve().parent.parent
MODELS = ROOT / "models"
OUT = ROOT / "lib" / "ml" / "artifacts.json"


def main() -> None:
    model = joblib.load(MODELS / "model.pkl")
    vectorizer = joblib.load(MODELS / "vectorizer.pkl")
    stop = sorted(vectorizer.get_stop_words() or [])

    payload = {
        "classes": [str(c) for c in model.classes_],
        "intercept": [float(x) for x in model.intercept_],
        "coef": [[float(x) for x in row] for row in model.coef_],
        "vocabulary": {str(k): int(i) for k, i in vectorizer.vocabulary_.items()},
        "idf": [float(x) for x in vectorizer.idf_],
        "stop_words": stop,
        "token_pattern": r"(?u)\b\w\w+\b",
        "lowercase": True,
        "norm": "l2",
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
