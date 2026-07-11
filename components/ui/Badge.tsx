import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'purple' | 'default'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success',
  purple: 'bg-violet-100 text-violet-700',
  default: 'bg-surface-dim text-on-surface-variant',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
