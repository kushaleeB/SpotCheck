import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-outline bg-white shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </div>
  )
}
