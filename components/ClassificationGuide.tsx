import { Laptop, Users, Volume2 } from 'lucide-react'

const guides = [
  {
    icon: Laptop,
    title: 'Laptop-Friendly',
    description:
      'Mentions of plentiful outlets, reliable WiFi, ample seating, and a quiet atmosphere conducive to focused work.',
    gradient: 'from-[#eef2ff] via-[#f8fafc] to-white',
    watermark: 'text-indigo-200/80',
    badge: 'bg-indigo-600 text-white',
  },
  {
    icon: Users,
    title: 'Social Only',
    description:
      'Great for catching up, but features small tables, dim lighting, no outlets, or explicit laptop bans during weekends.',
    gradient: 'from-[#f1f5f9] via-[#f8fafc] to-white',
    watermark: 'text-slate-300/90',
    badge: 'bg-slate-700 text-white',
  },
  {
    icon: Volume2,
    title: 'Too Noisy',
    description:
      'Reviewers frequently complain about blaring music, acoustics that amplify chatter, or a nightclub-like environment.',
    gradient: 'from-[#fee2e2] via-[#fff5f5] to-white',
    watermark: 'text-red-200/90',
    badge: 'bg-red-500 text-white',
  },
]

export function ClassificationGuide() {
  return (
    <section className="bg-white px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-on-surface">
            Classification Guide
          </h2>
          <p className="mx-auto max-w-2xl text-base text-on-surface-variant">
            How our model categorizes spaces based on reviewer sentiment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {guides.map(({ icon: Icon, title, description, gradient, watermark, badge }) => (
            <div
              key={title}
              className={`relative overflow-hidden rounded-2xl border border-outline bg-gradient-to-b ${gradient} p-6 pt-8 shadow-[var(--shadow-soft)]`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center" aria-hidden="true">
                <Icon className={`h-28 w-28 ${watermark}`} strokeWidth={1.15} />
              </div>

              <div className="relative mt-24">
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${badge}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-on-surface">{title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
