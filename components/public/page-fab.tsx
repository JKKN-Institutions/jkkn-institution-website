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

// Type for CMS FAB config from database
interface CMSFabConfig {
  is_enabled?: boolean | null
  position?: string | null
  primary_action?: string | null
  custom_action_label?: string | null
  custom_action_url?: string | null
  custom_action_icon?: string | null
  show_whatsapp?: boolean | null
  show_phone?: boolean | null
  show_email?: boolean | null
  show_directions?: boolean | null
  whatsapp_number?: string | null
  phone_number?: string | null
  email_address?: string | null
  directions_url?: string | null
  animation?: string | null
  delay_seconds?: number | null
  hide_on_scroll?: boolean | null
  theme?: string | null
  custom_css?: string | null
}

interface PageFabProps {
  config?: CMSFabConfig | null
}

type Position = 'bottom-right' | 'bottom-left'
type Animation = 'none' | 'bounce' | 'pulse' | 'shake'

interface FabConfig {
  isEnabled: boolean
  position: Position
  showPhone: boolean
  phoneNumber: string
  showWhatsapp: boolean
  whatsappNumber: string
  showEmail: boolean
  emailAddress: string
  showDirections: boolean
  directionsUrl: string
  delaySeconds: number
  hideOnScroll: boolean
  animation: Animation
}

const defaultConfig: FabConfig = {
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
  delaySeconds: 2,
  hideOnScroll: false,
  animation: 'none',
}

export function PageFab({ config: cmsConfig }: PageFabProps) {
  // If no config or not enabled, don't render (let layout's FAB show)
  if (!cmsConfig || cmsConfig.is_enabled === false) {
    return null
  }

  // Helper to validate position
  const getPosition = (pos: string | null | undefined): Position => {
    if (pos === 'bottom-left') return 'bottom-left'
    return 'bottom-right'
  }

  // Helper to validate animation
  const getAnimation = (anim: string | null | undefined): Animation => {
    if (anim === 'bounce' || anim === 'pulse' || anim === 'shake') return anim
    return 'none'
  }

  // Merge CMS config with defaults
  const config: FabConfig = {
    isEnabled: cmsConfig.is_enabled ?? defaultConfig.isEnabled,
    position: getPosition(cmsConfig.position),
    showPhone: cmsConfig.show_phone ?? defaultConfig.showPhone,
    phoneNumber: cmsConfig.phone_number ?? defaultConfig.phoneNumber,
    showWhatsapp: cmsConfig.show_whatsapp ?? defaultConfig.showWhatsapp,
    whatsappNumber: cmsConfig.whatsapp_number ?? defaultConfig.whatsappNumber,
    showEmail: cmsConfig.show_email ?? defaultConfig.showEmail,
    emailAddress: cmsConfig.email_address ?? defaultConfig.emailAddress,
    showDirections: cmsConfig.show_directions ?? defaultConfig.showDirections,
    directionsUrl: cmsConfig.directions_url ?? defaultConfig.directionsUrl,
    delaySeconds: cmsConfig.delay_seconds ?? defaultConfig.delaySeconds,
    hideOnScroll: cmsConfig.hide_on_scroll ?? defaultConfig.hideOnScroll,
    animation: getAnimation(cmsConfig.animation),
  }

  return <PageFabInner config={config} />
}

function PageFabInner({ config }: { config: FabConfig }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    // Show FAB after delay
    const timer = setTimeout(() => setIsVisible(true), config.delaySeconds * 1000)

    let lastScrollY = window.scrollY

    const handleScroll = () => {
      // Always show after scroll threshold
      if (window.scrollY > 200) {
        setIsVisible(true)
      }

      // Handle hide on scroll
      if (config.hideOnScroll) {
        if (window.scrollY > lastScrollY) {
          setIsHidden(true) // Scrolling down
        } else {
          setIsHidden(false) // Scrolling up
        }
        lastScrollY = window.scrollY
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [config.delaySeconds, config.hideOnScroll])

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

  const animationClasses = {
    none: '',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    shake: 'animate-[shake_0.5s_ease-in-out_infinite]',
  }

  return (
    <div
      className={cn(
        'fixed z-[60] flex flex-col-reverse items-end gap-3 transition-all duration-500',
        positionClasses[config.position],
        isVisible && !isHidden ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
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
          'focus:outline-none focus:ring-4 focus:ring-secondary/30',
          !isOpen && animationClasses[config.animation]
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
