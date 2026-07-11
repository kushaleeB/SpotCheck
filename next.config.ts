import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    // Local: scripts/dev.mjs runs api/local_server.py on :8000
    // Production: Vercel serves api/predict.py
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/predict',
          destination: 'http://127.0.0.1:8000/api/predict',
        },
      ]
    }
    return []
  },
}

export default nextConfig
