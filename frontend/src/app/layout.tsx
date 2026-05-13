import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import './globals.css';
import { Metadata } from 'next'
import { AuthProvider } from '@/shared/lib/auth-context';
import { ProtectedRoute } from '@/shared/lib/protected-route';
import { AnalyticsTracker } from '@/shared/lib/AnalyticsTracker';
import { themeInitScript } from '@/shared/lib/theme';

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
    <html lang="ru">
      {/* Anti-flash: применяем тему до рендера */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body style={{ background: 'var(--color-canvas-default)', color: 'var(--color-fg-default)' }}>
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
