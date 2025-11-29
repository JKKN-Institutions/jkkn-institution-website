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
      {/* Beautiful green gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a5c36] via-[#0b6d41] to-[#0f8f56]">
        {/* Mesh gradient overlays for depth */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#0f8f56]/40 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#0a5c36]/50 rounded-full blur-[150px] translate-x-1/3" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#14a860]/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#085032]/40 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />
        </div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Noise texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-[10%] w-3 h-3 bg-white/20 rounded-full backdrop-blur-sm"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-[15%] w-4 h-4 bg-white/15 rounded-full backdrop-blur-sm"
          animate={{
            y: [0, 40, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-[20%] w-2 h-2 bg-white/25 rounded-full"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[30%] left-[5%] w-2 h-2 bg-white/20 rounded-full"
          animate={{
            y: [0, 35, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-[25%] right-[10%] w-3 h-3 bg-white/15 rounded-full backdrop-blur-sm"
          animate={{
            y: [0, -25, 0],
            x: [0, -20, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Larger floating glass shapes */}
        <motion.div
          className="absolute top-[15%] right-[25%] w-20 h-20 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 rotate-12"
          animate={{
            y: [0, 20, 0],
            rotate: [12, 18, 12],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[8%] w-16 h-16 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 -rotate-6"
          animate={{
            y: [0, -15, 0],
            rotate: [-6, -12, -6],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Main content - scrollable */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        {/* Logo and brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 text-center"
        >
          {/* Glassmorphism logo container */}
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-4 p-3">
            <Image
              src="https://jkkn.ac.in/wp-content/uploads/2023/04/Untitled-design-2023-03-13T105521.479.png"
              alt="JKKN Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain drop-shadow-lg"
              unoptimized
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-lg">
            JKKN Institution
          </h1>
          <p className="mt-1 text-white/70 text-sm">
            Administrative Portal
          </p>
        </motion.div>

        {/* Glassmorphism card container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Main glassmorphism card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-white/10 rounded-3xl blur-xl" />

            {/* Glass card */}
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
              {/* Top accent line - gradient */}
              <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-white/40 via-white/60 to-white/40 rounded-b-full" />

              {/* Inner subtle glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

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
          className="mt-6 text-center"
        >
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} JKKN Educational Institutions. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
