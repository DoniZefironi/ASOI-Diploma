import { VideoBackground } from '@/widgets/video-background/VideoBackground';
import { CareerSection } from '@/features/career';
import { Hero } from '@/widgets/hero';
import { StatsSection, FeaturesSection } from '@/features/home';

export default function Home() {
  return (
    <main>
      <VideoBackground />

      {/* Hero — поверх кубов */}
      <div className="relative h-screen flex items-center justify-center" style={{ zIndex: 2 }}>
        <Hero />
      </div>

      {/* Секции — со своим фоном, перекрывают кубы при скролле */}
      <div className="relative" style={{ zIndex: 2, background: 'var(--color-canvas-default)' }}>
        <StatsSection />
      </div>

      <div className="relative" style={{ zIndex: 2, background: 'var(--color-canvas-subtle)' }}>
        <FeaturesSection />
      </div>

      <div className="relative" style={{ zIndex: 2, background: 'var(--color-canvas-default)' }}>
        <CareerSection />
      </div>
    </main>
  );
}
