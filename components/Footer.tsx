import { Logo } from './Logo'

const footerLinks = [
  { label: 'Documentation', href: '#how-it-works' },
  { label: 'Privacy', href: '#' },
  { label: 'GitHub', href: 'https://github.com', external: true },
  { label: 'Status', href: '#analyze' },
]

export function Footer() {
  return (
    <footer className="border-t border-outline bg-[#f8fafc] px-6 py-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <Logo size="sm" />
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-on-surface-variant transition hover:text-primary"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-on-surface-variant transition hover:text-primary"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
        <p className="text-center text-xs text-on-surface-variant md:text-right">
          © 2024 SpotCheck AI. Precision Engineering for Review Analysis.
        </p>
      </div>
    </footer>
  )
}
