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
      enableSystem
      disableTransitionOnChange
      storageKey="public-theme"
    >
      {children}
    </ThemeProvider>
  )
}
