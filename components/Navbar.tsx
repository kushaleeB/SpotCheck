'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Moon, UserRound } from 'lucide-react'
import { Button } from './ui/Button'
import { Logo } from './Logo'

const navLinks = [
  { label: 'Home', href: '/', match: '/' },
  { label: 'Analyze', href: '/analyze', match: '/analyze' },
  { label: 'GitHub', href: 'https://github.com', external: true },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isAnalyze = pathname === '/analyze'

  return (
    <header className="sticky top-0 z-50 border-b border-outline/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = 'match' in link && link.match ? pathname === link.match : false
            const external = 'external' in link && link.external

            if (external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  {link.label}
                </a>
              )
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary underline decoration-primary decoration-2 underline-offset-8'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {isAnalyze ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-dim hover:text-on-surface"
              aria-label="Toggle theme"
            >
              <Moon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender text-primary transition hover:bg-lavender/80"
              aria-label="Account"
            >
              <UserRound className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Button variant="primary" onClick={() => router.push('/analyze')}>
            Get Started
          </Button>
        )}
      </div>
    </header>
  )
}
