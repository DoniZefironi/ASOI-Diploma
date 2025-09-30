import { VideoBackground } from '@/widgets/video-background/VideoBackground';
import { CoursesSection } from '@/features/courses';
import { CareerSection } from '@/features/career';

export default function Home() {
  return (
    <main className="min-h-screen">
      <VideoBackground />
      <div className="relative z-10">
        <CoursesSection />
        <CareerSection />
      </div>
    </main>
  );
}