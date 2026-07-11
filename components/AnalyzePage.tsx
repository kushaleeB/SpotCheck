'use client'

import { useMemo, useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Laptop,
  Loader2,
  Users,
  Volume2,
} from 'lucide-react'
import { predictReview, type PredictionResult } from '@/lib/api/predict'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const MAX_CHARS = 500

const QUICK_SAMPLES = [
  'Quiet café with fast Wi-Fi',
  'Busy place with loud music',
  'Perfect place for studying',
]

const RESULT_COPY: Record<
  string,
  { headline: string; why: string; icon: typeof Laptop; badgeClass: string }
> = {
  'Laptop-Friendly': {
    headline: 'Highly suitable for remote work',
    why: 'The review highlights productivity cues such as reliable Wi-Fi, available outlets, seating comfort, and a quieter atmosphere that supports focused work.',
    icon: Laptop,
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  'Social Only': {
    headline: 'Better for social meetups than deep work',
    why: 'Signals point to a lively social vibe—smaller tables, ambient energy, or limited workspace amenities—making it better for catching up than long study sessions.',
    icon: Users,
    badgeClass: 'bg-slate-200 text-slate-700',
  },
  'Too Noisy': {
    headline: 'Likely too distracting for focused work',
    why: 'Language around loud music, chatter, or high ambient noise suggests this space may disrupt concentration and calls.',
    icon: Volume2,
    badgeClass: 'bg-red-100 text-red-700',
  },
}

function ConfidenceRing({ value }: { value: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(value, 100) / 100) * circumference

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-on-surface">{value.toFixed(0)}%</span>
      </div>
    </div>
  )
}

export function AnalyzePage() {
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const meta = result ? RESULT_COPY[result.prediction] : null
  const confidenceLabel = useMemo(() => {
    if (!result) return ''
    if (result.confidence >= 70) return 'High Confidence'
    if (result.confidence >= 45) return 'Medium Confidence'
    return 'Low Confidence'
  }, [result])

  async function handleAnalyze() {
    const text = review.trim()
    if (!text) {
      setError('Please paste a review first.')
      return
    }

    setLoading(true)
    setError(null)
    setDetailsOpen(false)

    try {
      const prediction = await predictReview(text)
      setResult(prediction)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : 'Prediction failed.')
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setReview('')
    setResult(null)
    setError(null)
    setDetailsOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              Analyze a Café Review
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant">
              Use our advanced ML model to instantly classify cafe environments. Determine if a
              spot is ideal for deep focus, a quick meeting, or just grabbing coffee.
            </p>
          </div>

          <Card className="mb-6 border-outline bg-white p-5 shadow-[var(--shadow-lift)] sm:p-6">
            <div className="relative mb-4">
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Paste a review here to analyze its suitability for work..."
                className="min-h-[160px] w-full resize-none rounded-xl border border-outline bg-white p-4 pb-10 text-sm leading-relaxed text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-on-surface-variant">
                {review.length} / {MAX_CHARS}
              </span>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-sm font-medium text-on-surface-variant">Quick Samples</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SAMPLES.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setReview(sample.slice(0, MAX_CHARS))
                      setError(null)
                    }}
                    className="rounded-full bg-lavender px-3.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-lavender/80"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button variant="secondary" onClick={handleClear}>
                Clear
              </Button>
              <Button
                variant="primary"
                onClick={handleAnalyze}
                disabled={loading || !review.trim()}
                icon={
                  loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BarChart3 className="h-4 w-4" />
                  )
                }
                className="disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Analyzing…' : 'Analyze Review'}
              </Button>
            </div>

            {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
          </Card>

          {result && meta && (
            <Card className="border-outline bg-white p-5 shadow-[var(--shadow-lift)] sm:p-6">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <span
                    className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}
                  >
                    <meta.icon className="h-3.5 w-3.5" />
                    {result.prediction}
                  </span>

                  <h2 className="mb-6 text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
                    {meta.headline}
                  </h2>

                  <p className="mb-2 text-xs font-bold tracking-wider text-on-surface-variant">
                    WHY THIS PREDICTION?
                  </p>
                  <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                    {meta.why}
                  </p>

                  <button
                    type="button"
                    onClick={() => setDetailsOpen((open) => !open)}
                    className="flex w-full items-center justify-between rounded-xl border border-outline px-4 py-3 text-left text-sm font-semibold text-on-surface transition hover:bg-surface-dim/50"
                  >
                    Model Details & Breakdown
                    {detailsOpen ? (
                      <ChevronUp className="h-4 w-4 text-on-surface-variant" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-on-surface-variant" />
                    )}
                  </button>

                  {detailsOpen && (
                    <div className="mt-3 space-y-3 rounded-xl border border-outline bg-[#f8fafc] p-4">
                      {Object.entries(result.probabilities)
                        .sort((a, b) => b[1] - a[1])
                        .map(([label, value]) => (
                          <div key={label}>
                            <div className="mb-1 flex justify-between text-xs text-on-surface-variant">
                              <span>{label}</span>
                              <span className="font-semibold">{value.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${Math.min(value, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-[#eef2ff] p-5 text-center sm:p-6">
                  <p className="mb-4 text-xs font-bold tracking-wider text-on-surface-variant">
                    CONFIDENCE SCORE
                  </p>
                  <ConfidenceRing value={result.confidence} />
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-[11px] text-on-surface-variant">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${Math.min(result.confidence, 100)}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-primary">{confidenceLabel}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
