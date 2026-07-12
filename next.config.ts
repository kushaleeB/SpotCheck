import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Prediction runs in app/api/predict (TypeScript + bundled model artifacts).
  // No Python rewrite needed in production or local Next.js.
}

export default nextConfig
