export interface PredictionResult {
  prediction: string
  confidence: number
  probabilities: Record<string, number>
}

/** Calls the Vercel Python serverless function at /api/predict */
export async function predictReview(review: string): Promise<PredictionResult> {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Prediction failed.' }))
    throw new Error(typeof error.detail === 'string' ? error.detail : 'Prediction failed.')
  }

  return response.json()
}
