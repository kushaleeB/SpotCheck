import Link from 'next/link'

type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  size?: LogoSize
  showText?: boolean
  suffix?: string
  className?: string
}

const LOGO_SRC = '/images/SpotCheck%20Logo.png'

const iconSizes: Record<LogoSize, string> = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
}

const textSizes: Record<LogoSize, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
}

export function Logo({
  size = 'md',
  showText = true,
  suffix,
  className = '',
}: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="SpotCheck home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt="SpotCheck"
        className={`${iconSizes[size]} shrink-0 rounded-lg object-contain`}
      />
      {showText && (
        <span className={`font-bold tracking-tight text-on-surface ${textSizes[size]}`}>
          SpotCheck
          {suffix && (
            <span className="font-semibold text-on-surface-variant"> {suffix}</span>
          )}
        </span>
      )}
    </Link>
  )
}
