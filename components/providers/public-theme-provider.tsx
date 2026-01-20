'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

interface PublicThemeProviderProps {
  children: ReactNode
}

export function PublicThemeProvider({ children }: PublicThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="public-theme"
      enableColorScheme={false}
    >
      {children}
    </ThemeProvider>
  )
}
