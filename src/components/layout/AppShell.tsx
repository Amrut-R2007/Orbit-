'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DesktopSidebar, MobileBottomBar } from './AppNavigation';
import { AppHeader } from './AppHeader';
import { AmbientBackgroundLayer } from '../ambient/AmbientBackgroundLayer';
import { useAuth } from '@/context/AuthContext';
import { MonsteraLeaf } from '../leaves/MonsteraLeaf';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Pages that don't need the application sidebar & bottom navigation
  const isPublicPage = pathname === '/' || pathname === '/onboarding';

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicPage) {
        router.push('/');
      } else if (user && !user.isOnboarded && pathname !== '/onboarding') {
        router.push('/onboarding');
      }
    }
  }, [user, loading, isPublicPage, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center">
        <div className="w-12 h-12 text-[var(--primary)] animate-pulse">
          <MonsteraLeaf className="w-full h-full" />
        </div>
        <p className="text-xs font-semibold text-[var(--muted-foreground)] mt-3">Loading Orbit...</p>
      </div>
    );
  }

  if (isPublicPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] transition-colors duration-300 relative">
      {/* Ambient non-interactive background layer */}
      <AmbientBackgroundLayer />

      {/* Desktop Left Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <AppHeader />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileBottomBar />
    </div>
  );
};
