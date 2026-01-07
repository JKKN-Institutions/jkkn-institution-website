'use client'

import { useEffect } from 'react'
import { registerCustomComponents, type CustomComponentData } from '@/lib/cms/component-registry'

interface CustomComponentRegistrarProps {
  components: CustomComponentData[]
  children: React.ReactNode
}

/**
 * Custom Component Registrar
 *
 * This client component receives pre-fetched components from the server
 * and registers them in the component registry synchronously before rendering children.
 *
 * IMPORTANT:
 * - Components are passed as props (server-fetched) to avoid auth issues
 * - Registration happens synchronously (not in useEffect) to ensure components
 *   are available before PageRenderer tries to use them
 * - In development, registry may be cleared during Fast Refresh, so we
 *   register on every render to handle hot module replacement
 */
export function CustomComponentRegistrar({ components, children }: CustomComponentRegistrarProps) {
  // Register components synchronously BEFORE rendering children
  // This ensures they're available immediately, even after hot reload
  if (components.length > 0) {
    registerCustomComponents(components)
  }

  // Log registration in development (only once per mount)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && components.length > 0) {
      console.log(`[CustomComponentRegistrar] Registered ${components.length} custom components:`, components.map(c => c.name))
    }
  }, []) // Empty deps - log only on mount

  return <>{children}</>
}
