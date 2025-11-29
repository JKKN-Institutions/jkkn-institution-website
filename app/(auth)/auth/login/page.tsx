'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ShieldCheck, Mail, AlertCircle, Sparkles } from 'lucide-react'

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
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-white/60" />
          <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Welcome Back</span>
          <Sparkles className="w-5 h-5 text-white/60" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Sign in to Admin Portal
        </h2>
        <p className="mt-1.5 text-white/60 text-sm">
          Access your administrative dashboard
        </p>
      </motion.div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-3 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl"
        >
          <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{errorMessage}</p>
        </motion.div>
      )}

      {/* Google Sign In Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-2xl"
        >
          {/* Button shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

          {/* Button content */}
          <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-white/95 hover:bg-white border border-white/50 rounded-2xl text-[#0b6d41] font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                {/* Google Icon - Colored */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          </div>
        </button>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 text-white/50 bg-transparent backdrop-blur-sm">
            Secure authentication
          </span>
        </div>
      </motion.div>

      {/* Info Section - Glass Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-3"
      >
        {/* Domain restriction notice */}
        <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Mail className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Domain Restricted</p>
            <p className="text-white/50 text-xs">Only @jkkn.ac.in emails allowed</p>
          </div>
        </div>

        {/* Security notice */}
        <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Secure Access</p>
            <p className="text-white/50 text-xs">Protected by Google OAuth 2.0</p>
          </div>
        </div>
      </motion.div>

      {/* Terms */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <p className="text-center text-white/40 text-xs leading-relaxed">
          By signing in, you agree to our{' '}
          <a href="#" className="text-white/60 hover:text-white transition-colors underline underline-offset-2">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-white/60 hover:text-white transition-colors underline underline-offset-2">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  )
}
