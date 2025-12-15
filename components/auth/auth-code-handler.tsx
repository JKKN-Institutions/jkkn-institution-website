'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * This component handles auth codes that arrive at the root URL
 * instead of the /auth/callback route.
 *
 * This happens when Supabase redirects to the Site URL with the code
 * parameter instead of the full redirectTo path.
 */
export function AuthCodeHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')

    // If there's an auth code in the URL, redirect to the callback handler
    if (code && !isProcessing) {
      setIsProcessing(true)

      // Redirect to the auth callback with the code
      // The callback handler will exchange the code and redirect to admin
      router.replace(`/auth/callback?code=${code}&redirectTo=/admin`)
    }
  }, [searchParams, router, isProcessing])

  // This component doesn't render anything
  return null
}
