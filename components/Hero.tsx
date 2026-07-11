'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Volume2, Wifi } from 'lucide-react'
import Link from 'next/link'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

export function Hero() {
  return (
    <section className="overflow-hidden bg-white px-6 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Badge variant="purple" className="mb-6 gap-1.5 bg-lavender text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Review Analysis
          </Badge>

          <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-on-surface sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
            Find the Perfect Café for Studying with AI.
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed text-on-surface-variant">
            Stop wasting time wandering. SpotCheck analyzes thousands of reviews instantly to
            predict if a café is laptop-friendly, social, or just too noisy.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/analyze">
              <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                Start Analyzing
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary">How it works</Button>
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-lavender shadow-[var(--shadow-lift)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home/hero.png"
              alt="Student working in a cafe with SpotCheck prediction overlays"
              className="h-auto w-full object-cover"
            />

            <motion.div
              initial={{ opacity: 0, y: 12, x: -8 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="absolute left-3 top-4 z-10 sm:left-5 sm:top-6"
            >
              <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-[var(--shadow-lift)] backdrop-blur-sm sm:px-4 sm:py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white sm:h-11 sm:w-11">
                  <Wifi className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-on-surface-variant sm:text-xs">
                    Prediction
                  </p>
                  <p className="text-sm font-bold text-on-surface sm:text-base">
                    Laptop-Friendly
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12, x: 8 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.55, delay: 0.45 }}
              className="absolute right-3 top-[42%] z-10 sm:right-5"
            >
              <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-[var(--shadow-lift)] backdrop-blur-sm sm:px-4 sm:py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white sm:h-11 sm:w-11">
                  <Volume2 className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-on-surface-variant sm:text-xs">
                    Noise Level
                  </p>
                  <p className="text-sm font-bold text-on-surface sm:text-base">Too Noisy</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
