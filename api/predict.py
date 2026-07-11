"""Vercel Python serverless function: POST /api/predict"""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler

from _ml import predict_review


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._send_json(204, {})

    def do_POST(self) -> None:
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw.decode("utf-8") or "{}")
            review = (data.get("review") or "").strip()

            if not review:
                self._send_json(400, {"detail": "Review text cannot be empty."})
                return

            result = predict_review(review)
            self._send_json(200, result)
        except Exception as exc:
            self._send_json(500, {"detail": f"Prediction failed: {exc}"})

    def do_GET(self) -> None:
        self._send_json(405, {"detail": "Use POST with JSON body { \"review\": \"...\" }."})

    def log_message(self, format: str, *args) -> None:
        return
