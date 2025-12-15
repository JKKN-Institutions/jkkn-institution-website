'use client'

import { motion } from 'framer-motion'
import { AnimatedOrbs } from '@/components/auth/animated-orbs'
import { InstitutionPanel } from '@/components/auth/institution-panel'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row">
      {/* Left Panel - Institution Showcase */}
      <div className="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0b6d41] via-[#085032] to-[#063d26] h-[35vh] lg:h-full">
        {/* Animated background orbs */}
        <AnimatedOrbs />

        {/* Decorative pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Institution content */}
        <InstitutionPanel />
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#fbfbee] via-white to-gray-50 h-[65vh] lg:h-full">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, #0b6d41 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.25, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, #ffde59 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </div>

        {/* Login content wrapper */}
        <div className="relative z-10 h-full w-full flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Glassmorphism card */}
            <div className="relative bg-white/75 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
              {/* Gradient accent line at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0b6d41] via-[#0f8f56] to-[#ffde59]" />

              {/* Content */}
              <div className="p-6 sm:p-8">
                {children}
              </div>
            </div>

            {/* Footer text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center text-gray-400 text-xs"
            >
              JKKN Group of Institutions - Empowering Excellence
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
