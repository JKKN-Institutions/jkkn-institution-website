'use client'

import { useEffect } from 'react'
import { registerWebMCPTools } from '@/lib/webmcp/register-tools'

/**
 * Client component that registers WebMCP tools on mount.
 * Renders nothing — purely a side-effect component.
 *
 * Only activates on the main website (jkkn.ac.in).
 * Other institution deployments render null with no side effects.
 */
export function WebMCPProvider() {
  useEffect(() => {
    registerWebMCPTools()
  }, [])

  return null
}
