import { ClassificationGuide } from '@/components/ClassificationGuide'
import { Features } from '@/components/Features'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { HomeAnalyze } from '@/components/HomeAnalyze'
import { Navbar } from '@/components/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HomeAnalyze />
        <ClassificationGuide />
      </main>
      <Footer />
    </div>
  )
}
