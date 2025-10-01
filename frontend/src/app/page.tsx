import { VideoBackground } from '@/widgets/video-background/VideoBackground';
import { CoursesSection } from '@/features/courses';
import { CareerSection } from '@/features/career';
import { Hero } from '@/widgets/hero';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative h-screen flex items-center justify-center">
        <VideoBackground />
        <Hero />
      </div>
      <div className="relative z-10">
        <CoursesSection />
        <CareerSection />
      </div>
    </main>
  );
}