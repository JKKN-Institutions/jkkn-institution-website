'use client'

import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  name?: string
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  // Get first name if full name is provided
  const firstName = name ? name.split(' ')[0] : 'Admin'

  return (
    <div
      className="relative overflow-hidden rounded-3xl min-h-[220px] flex items-center shadow-xl group animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Background Image with Parallax-like effect */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')`
        }}
      />

      {/* Glassmorphism Overlay - Gradient Mesh */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-zinc-900/95 dark:via-zinc-900/70" />

      {/* Decorative Blur Circles - Reduced blur for better INP */}
      <div className="absolute top-0 left-0 z-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-[20%] z-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />

      {/* Content Container */}
      <div className="relative z-20 w-full p-8 md:p-10">
        <div className="max-w-2xl flex flex-col gap-4">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md w-fit animate-in fade-in slide-in-from-left-4 duration-500 delay-150"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary motion-safe:animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Admin Dashboard
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{firstName}</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Welcome back to your command center. Here's what's happening across the institution today.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
