'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState, Suspense } from 'react'
import { ToasterProvider } from '@/components/providers/toaster-provider'
import { AuthCodeHandler } from '@/components/auth/auth-code-handler'
import { BugReporterWrapper } from '@/components/providers/bug-reporter-wrapper'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <BugReporterWrapper>
          <Suspense fallback={null}>
            <AuthCodeHandler />
          </Suspense>
          {children}
          <ToasterProvider />
        </BugReporterWrapper>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
