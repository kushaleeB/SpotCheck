import { NextResponse } from 'next/server'
import { predictReviewText } from '@/lib/ml/infer'

export const runtime = 'nodejs'
export const maxDuration = 10

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { review?: unknown } | null
    const review = typeof body?.review === 'string' ? body.review.trim() : ''

    if (!review) {
      return NextResponse.json({ detail: 'Review text cannot be empty.' }, { status: 400 })
    }

    return NextResponse.json(predictReviewText(review))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ detail: `Prediction failed: ${message}` }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(
    { detail: 'Use POST with JSON body { "review": "..." }.' },
    { status: 405 },
  )
}
