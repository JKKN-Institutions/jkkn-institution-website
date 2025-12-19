'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin'
  const error = searchParams.get('error')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    error === 'unauthorized'
      ? 'Unauthorized. Only @jkkn.ac.in emails are allowed.'
      : null
  )

  const handleGoogleLogin = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: 'jkkn.ac.in', // Restrict to jkkn.ac.in domain
          },
        },
      })

      if (error) {
        setErrorMessage(error.message)
        setLoading(false)
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Logo with gradient background - Hidden on mobile since left panel shows it */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-4 hidden lg:block"
      >
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b6d41] to-[#0f8f56] flex items-center justify-center shadow-lg shadow-[#0b6d41]/20 p-2">
          <Image
            src="/Institution logo.png"
            alt="JKKN Logo"
            width={48}
            height={48}
            className="w-full h-full object-contain brightness-0 invert"
            priority
          />
        </div>
      </motion.div>

      {/* Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-center mb-5"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm">
          Sign in to access your JKKN Admin dashboard
        </p>
      </motion.div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-100 rounded-xl"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </motion.div>
      )}

      {/* Google Sign In Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full"
      >
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium transition-all duration-300 hover:border-[#0b6d41]/30 hover:bg-[#0b6d41]/5 hover:shadow-lg hover:shadow-[#0b6d41]/10 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#0b6d41]" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              {/* Google Icon - Colored */}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Domain notice with shield icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-4 flex items-center justify-center gap-2 text-gray-400"
      >
        <Shield className="w-4 h-4" />
        <p className="text-xs">
          Only <span className="font-medium text-gray-500">@jkkn.ac.in</span> emails are allowed
        </p>
      </motion.div>

      {/* Create Account Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-5 pt-4 border-t border-gray-100 w-full text-center"
      >
        <p className="text-gray-500 text-sm">
          New to JKKN Admin?{' '}
          <Link
            href="/auth/register"
            className="text-[#0b6d41] font-semibold hover:text-[#0a5c36] transition-colors hover:underline underline-offset-2"
          >
            Request Access
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
