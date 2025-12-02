'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  X,
  Plus,
} from 'lucide-react'

interface FABConfig {
  isEnabled: boolean
  position: 'bottom-right' | 'bottom-left'
  showPhone: boolean
  phoneNumber: string
  showWhatsapp: boolean
  whatsappNumber: string
  showEmail: boolean
  emailAddress: string
  showDirections: boolean
  directionsUrl: string
}

interface FloatingActionButtonProps {
  config?: Partial<FABConfig>
}

const defaultConfig: FABConfig = {
  isEnabled: true,
  position: 'bottom-right',
  showPhone: true,
  phoneNumber: '+914222661100',
  showWhatsapp: true,
  whatsappNumber: '+914222661100',
  showEmail: true,
  emailAddress: 'info@jkkn.ac.in',
  showDirections: true,
  directionsUrl: 'https://maps.google.com/?q=JKKN+Komarapalayam',
}

export function FloatingActionButton({ config: propConfig }: FloatingActionButtonProps) {
  const config = { ...defaultConfig, ...propConfig }
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show FAB after scroll or delay
    const timer = setTimeout(() => setIsVisible(true), 2000)

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!config.isEnabled) return null

  const actions = [
    {
      id: 'phone',
      icon: Phone,
      label: 'Call Us',
      href: `tel:${config.phoneNumber}`,
      color: 'bg-blue-500 hover:bg-blue-600',
      show: config.showPhone,
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      href: `https://wa.me/${config.whatsappNumber.replace(/\+/g, '')}`,
      color: 'bg-green-500 hover:bg-green-600',
      show: config.showWhatsapp,
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email Us',
      href: `mailto:${config.emailAddress}`,
      color: 'bg-orange-500 hover:bg-orange-600',
      show: config.showEmail,
    },
    {
      id: 'directions',
      icon: MapPin,
      label: 'Get Directions',
      href: config.directionsUrl,
      color: 'bg-purple-500 hover:bg-purple-600',
      show: config.showDirections,
    },
  ].filter((action) => action.show)

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  }

  return (
    <div
      className={cn(
        'absolute z-50 flex flex-col-reverse items-end gap-3 transition-all duration-500',
        positionClasses[config.position],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
    >
      {/* Action Buttons */}
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
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-8 pointer-events-none'
          )}
          style={{
            transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
          }}
          onClick={() => setIsOpen(false)}
        >
          <action.icon className="h-5 w-5" />
          <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
        </a>
      ))}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-4 rounded-full text-white shadow-2xl transition-all duration-300',
          isOpen
            ? 'bg-gray-800 rotate-45'
            : 'bg-secondary hover:bg-secondary/90 hover:scale-110',
          'focus:outline-none focus:ring-4 focus:ring-secondary/30'
        )}
        aria-label={isOpen ? 'Close menu' : 'Open contact menu'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </button>
    </div>
  )
}
