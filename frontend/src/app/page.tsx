import { VideoBackground } from '@/widgets/video-background/VideoBackground';
import { CareerSection } from '@/features/career';
import { Hero } from '@/widgets/hero';

export default function Home() {
  return (
    <main className="min-h-screen">
      <VideoBackground />

      {/* Hero — поверх кубов */}
      <div className="relative h-screen flex items-center justify-center" style={{ zIndex: 2 }}>
        <Hero />
      </div>

      {/* CareerSection — со своим фоном, перекрывает кубы при скролле */}
      <div className="relative" style={{ zIndex: 2, background: 'var(--color-canvas-default)' }}>
        <CareerSection />
      </div>
    </main>
  );
}
