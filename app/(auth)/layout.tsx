'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-x-hidden overflow-y-auto">
      {/* Animated gradient background with JKKN brand colors */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0b6d41] via-[#085032] to-[#0b6d41]">
        {/* Animated mesh gradient overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-[#ffde59]/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#0f8f56]/40 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#ffde59]/20 rounded-full blur-[80px] animate-pulse delay-500" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-[#d4f1e4]/30 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-[#ffde59]/40 rounded-full"
          animate={{
            y: [0, 30, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-2 h-2 bg-white/20 rounded-full"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/3 left-20 w-1.5 h-1.5 bg-[#ffde59]/30 rounded-full"
          animate={{
            y: [0, 25, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-40 right-1/3 w-2.5 h-2.5 bg-white/25 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, -15, 0],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Logo and brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          {/* Logo container with glass effect */}
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-6 p-3">
            <Image
              src="https://jkkn.ac.in/wp-content/uploads/2023/04/Untitled-design-2023-03-13T105521.479.png"
              alt="JKKN Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            JKKN Institution
          </h1>
          <p className="mt-2 text-white/70 text-sm sm:text-base">
            Administrative Portal
          </p>
        </motion.div>

        {/* Glass card container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Glass card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ffde59]/30 via-white/10 to-[#0f8f56]/30 rounded-3xl blur-xl opacity-50" />

            {/* Main glass card */}
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl">
              {/* Inner subtle glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} JKKN Educational Institutions. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
