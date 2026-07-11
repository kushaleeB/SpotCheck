'use client'

import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { predictReview, type PredictionResult } from '@/lib/api/predict'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

const chipStyles: Record<string, string> = {
  'Laptop-Friendly': 'bg-emerald-100 text-emerald-800',
  'Social Only': 'bg-indigo-100 text-indigo-800',
  'Too Noisy': 'bg-red-100 text-red-800',
}

export function HomeAnalyze() {
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)

  async function handleAnalyze() {
    const text = review.trim()
    if (!text) {
      setError('Please paste a review first.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const prediction = await predictReview(text)
      setResult(prediction)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setReview('')
    setResult(null)
    setError(null)
  }

  return (
    <section id="analyze" className="bg-gradient-to-b from-lavender-soft to-surface-muted px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-on-surface">
          Analyze a Café Review
        </h2>
        <p className="mb-8 text-base text-on-surface-variant">
          Paste a recent review below to discover if this spot matches your vibe.
        </p>

        <Card className="border-outline bg-white p-6 text-left shadow-[var(--shadow-lift)] sm:p-8">
          <label htmlFor="home-review" className="mb-2 block text-sm font-semibold text-on-surface">
            Customer Review
          </label>
          <textarea
            id="home-review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="The coffee was great, but they cover all the outlets and play loud music..."
            className="mb-5 min-h-[140px] w-full resize-none rounded-xl border border-outline bg-white p-4 text-sm leading-relaxed text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              onClick={handleAnalyze}
              disabled={loading}
              icon={
                loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )
              }
              className="disabled:opacity-60"
            >
              {loading ? 'Analyzing…' : 'Analyze Review'}
            </Button>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-semibold text-on-surface-variant transition hover:text-on-surface"
            >
              Clear
            </button>
          </div>

          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

          {result && (
            <div className="mt-6 rounded-xl border border-outline bg-lavender-soft/60 p-4">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    chipStyles[result.prediction] ?? 'bg-surface-dim text-on-surface'
                  }`}
                >
                  {result.prediction}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {result.confidence.toFixed(1)}% confidence
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(result.probabilities)
                  .sort((a, b) => b[1] - a[1])
                  .map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs text-on-surface-variant">
                        <span>{label}</span>
                        <span>{value.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.min(value, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
