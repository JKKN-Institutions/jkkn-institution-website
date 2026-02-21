'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { throttleRAF } from '@/lib/utils/dom-performance'
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  X,
  Plus,
} from 'lucide-react'
import type { GlobalFabConfig } from '@/app/actions/cms/fab'

interface FloatingActionButtonProps {
  config?: GlobalFabConfig | null
}

// Default config used when no props provided
const defaultConfig = {
  is_enabled: true,
  show_phone: true,
  phone_number: '+914222661100',
  show_whatsapp: true,
  whatsapp_number: '+914222661100',
  show_email: true,
  email_address: 'info@jkkn.ac.in',
  show_directions: true,
  directions_url: 'https://maps.google.com/?q=JKKN+Komarapalayam',
  delay_ms: 2000,
}

export function FloatingActionButton({ config: propConfig }: FloatingActionButtonProps) {
  // Merge props with defaults
  const config = {
    ...defaultConfig,
    ...propConfig,
  }

  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const isVisibleRef = useRef(false)

  useEffect(() => {
    // Show FAB after delay or scroll
    const delayMs = config.delay_ms ?? 2000
    const timer = setTimeout(() => {
      isVisibleRef.current = true
      setIsVisible(true)
    }, delayMs)

    const handleScroll = throttleRAF(() => {
      // Once visible, stop checking — no more reflows needed
      if (isVisibleRef.current) return
      if (window.scrollY > 200) {
        isVisibleRef.current = true
        setIsVisible(true)
      }
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [config.delay_ms])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (!config.is_enabled) return null

  const actions = [
    {
      id: 'phone',
      icon: Phone,
      label: 'Call Us',
      href: `tel:${config.phone_number}`,
      color: 'bg-blue-500 hover:bg-blue-600',
      show: config.show_phone,
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      href: `https://wa.me/${(config.whatsapp_number || '').replace(/\+/g, '')}`,
      color: 'bg-green-500 hover:bg-green-600',
      show: config.show_whatsapp,
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email Us',
      href: `mailto:${config.email_address}`,
      color: 'bg-orange-500 hover:bg-orange-600',
      show: config.show_email,
    },
    {
      id: 'directions',
      icon: MapPin,
      label: 'Get Directions',
      href: config.directions_url || '',
      color: 'bg-purple-500 hover:bg-purple-600',
      show: config.show_directions,
    },
  ].filter((action) => action.show)

  return (
    <>
      {/* Backdrop overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container - BOTTOM RIGHT (positioned above mobile bottom nav) */}
      <div
        className={cn(
          'fixed bottom-20 right-6 md:bottom-6 z-50 flex flex-col items-end gap-3 transition-all duration-500',
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10 pointer-events-none'
        )}
      >
        {/* Contact Options - Expand ABOVE the toggle button */}
        <div className="flex flex-col gap-3">
          {actions.map((action, index) => (
            <a
              key={action.id}
              href={action.href}
              target={action.id === 'directions' ? '_blank' : undefined}
              rel={action.id === 'directions' ? 'noopener noreferrer' : undefined}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full text-white shadow-lg transition-all duration-300',
                action.color,
                isOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              )}
              style={{
                transitionDelay: isOpen ? `${(actions.length - 1 - index) * 75}ms` : '0ms',
              }}
              onClick={() => setIsOpen(false)}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </a>
          ))}
        </div>

        {/* Main FAB Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'p-4 rounded-full text-white shadow-2xl transition-all duration-300',
            isOpen
              ? 'bg-gray-800 rotate-45'
              : 'bg-secondary hover:bg-secondary/90 hover:scale-110',
            'focus:outline-none focus:ring-4 focus:ring-secondary/30'
          )}
          aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  )
}
