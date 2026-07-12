import artifacts from './artifacts.json'

export interface PredictionResult {
  prediction: string
  confidence: number
  probabilities: Record<string, number>
}

const TOKEN_RE = /\b\w\w+\b/gu
const stopWords = new Set(artifacts.stop_words)
const vocabulary = artifacts.vocabulary as Record<string, number>
const idf = artifacts.idf
const coef = artifacts.coef
const intercept = artifacts.intercept
const classes = artifacts.classes

function preprocess(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ')
}

function tokenize(text: string): string[] {
  const matches = text.match(TOKEN_RE) ?? []
  return matches.filter((token) => !stopWords.has(token))
}

/** Sparse TF-IDF vector matching sklearn TfidfVectorizer (l2, use_idf). */
function transform(text: string): Map<number, number> {
  const tokens = tokenize(preprocess(text))
  const counts = new Map<number, number>()

  for (const token of tokens) {
    const index = vocabulary[token]
    if (index === undefined) continue
    counts.set(index, (counts.get(index) ?? 0) + 1)
  }

  const features = new Map<number, number>()
  let sumSq = 0

  for (const [index, tf] of counts) {
    const value = tf * idf[index]
    features.set(index, value)
    sumSq += value * value
  }

  const norm = Math.sqrt(sumSq)
  if (norm > 0) {
    for (const [index, value] of features) {
      features.set(index, value / norm)
    }
  }

  return features
}

function sigmoid(x: number): number {
  if (x >= 0) {
    const z = Math.exp(-x)
    return 1 / (1 + z)
  }
  const z = Math.exp(x)
  return z / (1 + z)
}

/**
 * OvR LogisticRegression (liblinear) probabilities — matches sklearn
 * `_predict_proba_lr`: sigmoid per class, then L1-normalize.
 */
function predictProba(features: Map<number, number>): number[] {
  const scores = coef.map((weights, classIndex) => {
    let score = intercept[classIndex]
    for (const [index, value] of features) {
      score += weights[index] * value
    }
    return score
  })

  const raw = scores.map(sigmoid)
  const total = raw.reduce((sum, p) => sum + p, 0) || 1
  return raw.map((p) => p / total)
}

export function predictReviewText(review: string): PredictionResult {
  const features = transform(review)
  const probabilities = predictProba(features)

  let bestIndex = 0
  for (let i = 1; i < probabilities.length; i += 1) {
    if (probabilities[i] > probabilities[bestIndex]) bestIndex = i
  }

  const probMap: Record<string, number> = {}
  for (let i = 0; i < classes.length; i += 1) {
    probMap[classes[i]] = Math.round(probabilities[i] * 10000) / 100
  }

  const prediction = classes[bestIndex]
  return {
    prediction,
    confidence: probMap[prediction],
    probabilities: probMap,
  }
}
