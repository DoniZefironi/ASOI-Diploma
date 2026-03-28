import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import './globals.css';
import { Metadata } from 'next'
import { AuthProvider } from '@/shared/lib/auth-context';
import { ProtectedRoute } from '@/shared/lib/protected-route';
import { AnalyticsTracker } from '@/shared/lib/AnalyticsTracker';

export const metadata: Metadata = {
  title: 'EduTech',
  description: 'EduTech описание',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <body style={{ background: '#0d1117' }}>
        <AuthProvider>
          <ProtectedRoute>
            <AnalyticsTracker />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
