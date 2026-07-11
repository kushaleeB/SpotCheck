import { GraduationCap, Sparkles, Zap } from 'lucide-react'
import { Card } from './ui/Card'

const features = [
  {
    icon: Sparkles,
    title: 'AI Classification',
    description:
      'Advanced natural language processing reads between the lines of messy Yelp and Google reviews.',
  },
  {
    icon: Zap,
    title: 'Instant Prediction',
    description:
      'Paste a review and get an immediate classification with confidence scoring in milliseconds.',
  },
  {
    icon: GraduationCap,
    title: 'Built for Students',
    description:
      'Designed specifically around the needs of students looking for outlets, WiFi, and quiet zones.',
  },
]

export function Features() {
  return (
    <section id="how-it-works" className="bg-white px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="border-outline bg-white p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-lavender text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-on-surface">{title}</h3>
            <p className="text-sm leading-relaxed text-on-surface-variant">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
