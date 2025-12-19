'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, FileText, BarChart3, Shield } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Manage Users',
    description: 'Roles, permissions & team members',
  },
  {
    icon: FileText,
    title: 'Publish Content',
    description: 'Pages, news & announcements',
  },
  {
    icon: BarChart3,
    title: 'View Analytics',
    description: 'Reports & performance insights',
  },
  {
    icon: Shield,
    title: 'Secure Access',
    description: 'Audit logs & access control',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

export function InstitutionPanel() {
  return (
    <motion.div
      className="h-full flex flex-col justify-center px-6 py-4 lg:px-10 lg:py-6 relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div variants={itemVariants} className="mb-3 lg:mb-4">
        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-white/80 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg p-2">
          <Image
            src="/Institution logo.png"
            alt="JKKN Logo"
            width={48}
            height={48}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={itemVariants}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight"
      >
        <span className="text-white">JKKN</span>
        <br />
        <span className="bg-gradient-to-r from-[#ffde59] to-[#ffc107] bg-clip-text text-transparent">
          Admin Portal
        </span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        variants={itemVariants}
        className="text-white/80 text-sm lg:text-base mb-4 lg:mb-5 max-w-md"
      >
        50+ Years of Excellence | Digital Administration
      </motion.p>

      {/* Features List */}
      <motion.div
        variants={itemVariants}
        className="space-y-2 lg:space-y-2.5 max-w-md"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2.5 lg:p-3 hover:bg-white/15 transition-colors duration-300"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
            whileHover={{ scale: 1.01, x: 3 }}
          >
            <div className="w-8 h-8 rounded-md bg-[#ffde59]/20 flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-4 h-4 text-[#ffde59]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm leading-tight">
                {feature.title}
              </h3>
              <p className="text-white/60 text-xs truncate">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust Badge */}
      <motion.div
        variants={itemVariants}
        className="mt-4 lg:mt-5 flex items-center gap-2"
      >
        <div className="flex -space-x-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0b6d41] to-[#0f8f56] border-2 border-white/30 flex items-center justify-center"
            >
              <span className="text-white text-[10px] font-medium">
                {String.fromCharCode(64 + i)}
              </span>
            </div>
          ))}
        </div>
        <p className="text-white/70 text-xs">
          Trusted by <span className="text-white font-semibold">500+</span> Staff
        </p>
      </motion.div>
    </motion.div>
  )
}
