import { Hero } from '@/widgets/hero';
import { CoursesSection } from '@/features/courses';
import { CareerSection } from '@/features/career';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CoursesSection />
      <CareerSection />
    </main>
  );
}