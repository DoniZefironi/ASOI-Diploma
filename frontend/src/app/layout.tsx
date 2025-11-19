import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import './globals.css';
import { Metadata } from 'next'
import { AuthProvider } from '@/shared/lib/auth-context';
import { DndProvider } from '@/features/Schematic/components/DndProvider'; // ✅ Добавьте этот импорт

export const metadata: Metadata = {
  title: 'EduTech',
  description: 'EduTech description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DndProvider> {/* ✅ Оберните всё в DndProvider */}
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </DndProvider>
        </AuthProvider>
      </body>
    </html>
  );
}