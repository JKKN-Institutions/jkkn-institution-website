'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GraduationCap, Loader2, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function FacultyLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      router.push('/faculty-admin/manage')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] relative overflow-hidden flex-col justify-between p-10" style={{ background: 'linear-gradient(160deg, #f0faf4 0%, #e1f5ea 40%, #d4f1e4 100%)' }}>
        {/* Soft decorative shapes */}
        <div className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(11,109,65,0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 -left-16 w-[250px] h-[250px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(11,109,65,0.04) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-10 w-[180px] h-[180px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,222,89,0.08) 0%, transparent 70%)' }} />

        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0b6d41 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b6d41]/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#0b6d41]" />
            </div>
            <span className="text-sm font-bold text-[#0b6d41] tracking-wide">JKKN Engineering</span>
          </div>
        </div>

        {/* Center — Message */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-[2rem] font-bold text-[#1a2a1e] leading-tight">
            Faculty<br />Management<br />Portal
          </h2>
          <p className="text-sm text-[#5a7a63] leading-relaxed max-w-xs">
            Create and manage faculty profiles, qualifications, publications, and more — all from one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Profile Builder', '7-Tab Editor', 'Photo Upload', 'Live Preview'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-[0.7rem] font-medium bg-white/70 text-[#3d5443] border border-[#0b6d41]/8 backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom — Attribution */}
        <div className="relative z-10">
          <p className="text-[0.7rem] text-[#7a8f80]">
            JKKN College of Engineering & Technology
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#0b6d41]/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#0b6d41]" />
            </div>
            <span className="text-sm font-bold text-[#0b6d41]">JKKN Engineering</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[1.65rem] font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-400 mt-1">Sign in to manage faculty profiles</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[0.8rem] font-semibold text-gray-600">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@jkkn.ac.in"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-[#0b6d41]/30 focus:ring-2 focus:ring-[#0b6d41]/8 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[0.8rem] font-semibold text-gray-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-300" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-[#0b6d41]/30 focus:ring-2 focus:ring-[#0b6d41]/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading ? '#7ab896' : 'linear-gradient(135deg, #0b6d41 0%, #0e8a52 100%)',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(11,109,65,0.2), 0 1px 3px rgba(11,109,65,0.1)',
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-50">
            <p className="text-center text-[0.7rem] text-gray-300">
              Authorized access only &middot; Faculty Management Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
