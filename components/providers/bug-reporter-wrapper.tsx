'use client';

import { BugReporterProvider } from '@boobalan_jkkn/bug-reporter-sdk';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export function BugReporterWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Disable on auth pages
  const isAuthPage = pathname?.startsWith('/auth');

  // Defer initialization until after page is interactive
  useEffect(() => {
    // Use requestIdleCallback to defer until browser is idle, or fallback to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setMounted(true), { timeout: 2000 });
    } else {
      setTimeout(() => setMounted(true), 2000);
    }
  }, []);

  // Only initialize Supabase auth after mounted
  useEffect(() => {
    if (!mounted) return;

    // Lazy load Supabase client
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();

      // Get initial user
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
      });

      // Subscribe to auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    });
  }, [mounted]);

  return (
    <BugReporterProvider
      apiKey={process.env.NEXT_PUBLIC_BUG_REPORTER_API_KEY!}
      apiUrl={process.env.NEXT_PUBLIC_BUG_REPORTER_API_URL!}
      enabled={!isAuthPage}
      debug={process.env.NODE_ENV === 'development'}
      userContext={user ? {
        userId: user.id,
        name: user.user_metadata?.full_name || user.email,
        email: user.email
      } : undefined}
    >
      {children}
    </BugReporterProvider>
  );
}
