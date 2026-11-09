import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { LeafWipeTransitionProvider } from '@/components/transitions/LeafWipeTransition';
import { AppShell } from '@/components/layout/AppShell';
import { PwaRegister } from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'Orbit by ByteCraft Studio | Academic Productivity & Attendance',
  description:
    'Calm, mobile-first college academic productivity suite with live attendance bunk calculators, RVCE SGPA/CGPA engine, and botanical leaf aesthetics.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FFFAF0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <LeafWipeTransitionProvider>
              <AppShell>{children}</AppShell>
              <PwaRegister />
            </LeafWipeTransitionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
