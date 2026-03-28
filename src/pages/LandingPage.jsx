import HeroSection from '../components/sections/HeroSection'
import PerspectiveGrid from '../components/sections/PerspectiveGrid'
import AgentShowcase from '../components/sections/AgentShowcase'
import FeatureZPattern from '../components/sections/FeatureZPattern'
import PanicIntercept from '../components/sections/PanicIntercept'
import BehavioralFinale from '../components/sections/BehavioralFinale'
import Navbar from '../components/layout/Navbar'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-void w-full overflow-hidden">
      {/* Galactic Space Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle moving grid base */}
        <div 
          className="absolute inset-0 opacity-[0.06]" 
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Deep radial gradient vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0C10_100%)] opacity-80" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full">
        <Navbar />
        <HeroSection />

        {/* Architecture grid separator */}
        <PerspectiveGrid />

        <AgentShowcase />

        {/* Core Engines grid separator */}
        <PerspectiveGrid
          badge="Core Engines"
          title="Three Engines."
          highlightWord="Zero Guesswork."
          titleSuffix=""
          subtitle="Deterministic math, traceable logic, and zero hallucinated numbers."
        />

        <FeatureZPattern />

        {/* Behavioral Finale — scroll-driven panic intercept */}
        <BehavioralFinale />
      </div>
    </main>
  )
}
