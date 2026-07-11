"""Shared ML helpers for SpotCheck serverless prediction."""

from __future__ import annotations

import re
from functools import lru_cache
from pathlib import Path

import joblib
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"


def preprocess_text(text: str) -> str:
    normalized = text.lower().strip()
    return re.sub(r"\s+", " ", normalized)


def _softmax(scores: np.ndarray) -> np.ndarray:
    shifted = scores - np.max(scores)
    exp_scores = np.exp(shifted)
    return exp_scores / exp_scores.sum()


def _scores_to_probabilities(model, features) -> np.ndarray:
    if hasattr(model, "predict_proba"):
        return model.predict_proba(features)[0]

    if hasattr(model, "decision_function"):
        raw_scores = model.decision_function(features)
        scores = np.atleast_1d(raw_scores)
        if scores.ndim > 1:
            scores = scores[0]
        return _softmax(scores)

    raise RuntimeError("Model does not support predict_proba() or decision_function().")


@lru_cache(maxsize=1)
def load_artifacts():
    """Load model + vectorizer once per warm serverless instance."""
    vectorizer = joblib.load(MODELS_DIR / "vectorizer.pkl")
    model = joblib.load(MODELS_DIR / "model.pkl")
    labels = list(getattr(model, "classes_", []))
    if not labels:
        raise RuntimeError("model.pkl has no class labels (classes_).")
    return model, vectorizer, labels


def predict_review(review: str) -> dict:
    model, vectorizer, labels = load_artifacts()
    cleaned = preprocess_text(review)
    features = vectorizer.transform([cleaned])
    prediction = str(model.predict(features)[0])
    probabilities = _scores_to_probabilities(model, features)
    prob_map = {
        label: round(float(prob) * 100, 2)
        for label, prob in zip(labels, probabilities, strict=True)
    }
    return {
        "prediction": prediction,
        "confidence": prob_map.get(prediction, 0.0),
        "probabilities": prob_map,
    }
