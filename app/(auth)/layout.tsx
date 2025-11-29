'use client'

import { motion } from 'framer-motion'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Light gray background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        {/* Card container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* White card with shadow */}
          <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden">
            {/* Content */}
            <div className="p-8 sm:p-10">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
