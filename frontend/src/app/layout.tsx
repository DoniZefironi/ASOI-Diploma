import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import './globals.css';
import { Metadata } from 'next'
import { AuthProvider } from '@/shared/lib/auth-context';
import { ProtectedRoute } from '@/shared/lib/protected-route';

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
    <html lang="en">
      <body>
        <AuthProvider>
          <ProtectedRoute>
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
