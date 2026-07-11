"""Local-only stdlib HTTP server so `npm run dev` can call the ML model.

Production uses api/predict.py on Vercel — this file is not deployed as a function.
"""

from __future__ import annotations

import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# Allow `from _ml import ...` when run as `python api/local_server.py`
sys.path.insert(0, str(Path(__file__).resolve().parent))

from _ml import predict_review  # noqa: E402

HOST = "127.0.0.1"
PORT = 8000


class PredictHandler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if status != 204:
            self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._send(204, {})

    def do_POST(self) -> None:
        if self.path.rstrip("/") not in ("/api/predict", "/predict"):
            self._send(404, {"detail": "Not found."})
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw.decode("utf-8") or "{}")
            review = (data.get("review") or "").strip()
            if not review:
                self._send(400, {"detail": "Review text cannot be empty."})
                return
            self._send(200, predict_review(review))
        except Exception as exc:
            self._send(500, {"detail": f"Prediction failed: {exc}"})

    def log_message(self, format: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), format % args))


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), PredictHandler)
    print(f"SpotCheck ML local server on http://{HOST}:{PORT}/api/predict", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
