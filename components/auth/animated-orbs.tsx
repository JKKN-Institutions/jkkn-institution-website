'use client'

import { motion } from 'framer-motion'

export function AnimatedOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary Green Orb - Top Left */}
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, #0f8f56 0%, #0b6d41 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary Yellow Orb - Bottom Right */}
      <motion.div
        className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle, #ffde59 0%, #ffc107 50%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Mixed Gradient Orb - Center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, #0b6d41 0%, #ffde59 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Small accent orb - Top Right */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, #0f8f56 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  )
}
