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
  Edit2,
  RefreshCw,
  Settings,
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
  // Admin actions
  show_add?: boolean | null
  add_label?: string | null
  add_url?: string | null
  show_edit?: boolean | null
  edit_label?: string | null
  show_update?: boolean | null
  update_label?: string | null
  show_settings?: boolean | null
  settings_label?: string | null
  settings_url?: string | null
}

interface PageFabProps {
  config?: CMSFabConfig | null
}

type Position = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' | 'top-center'
type PrimaryAction = 'contact' | 'whatsapp' | 'phone' | 'email' | 'custom' | 'admin-menu'
type Animation = 'none' | 'bounce' | 'pulse' | 'shake'

interface FabConfig {
  isEnabled: boolean
  position: Position
  primaryAction: PrimaryAction
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
  // Admin actions
  showAdd: boolean
  addLabel: string
  addUrl: string
  showEdit: boolean
  editLabel: string
  showUpdate: boolean
  updateLabel: string
  showSettings: boolean
  settingsLabel: string
  settingsUrl: string
}

const defaultConfig: FabConfig = {
  isEnabled: true,
  position: 'bottom-right',
  primaryAction: 'contact',
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
  // Admin actions
  showAdd: false,
  addLabel: 'Add New',
  addUrl: '',
  showEdit: false,
  editLabel: 'Edit',
  showUpdate: false,
  updateLabel: 'Update',
  showSettings: false,
  settingsLabel: 'Settings',
  settingsUrl: '',
}

export function PageFab({ config: cmsConfig }: PageFabProps) {
  // If no config or not enabled, don't render (let layout's FAB show)
  if (!cmsConfig || cmsConfig.is_enabled === false) {
    return null
  }

  // Helper to validate position
  const getPosition = (pos: string | null | undefined): Position => {
    const validPositions: Position[] = ['bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left', 'top-center']
    if (pos && validPositions.includes(pos as Position)) return pos as Position
    return 'bottom-right'
  }

  // Helper to validate primary action
  const getPrimaryAction = (action: string | null | undefined): PrimaryAction => {
    const validActions: PrimaryAction[] = ['contact', 'whatsapp', 'phone', 'email', 'custom', 'admin-menu']
    if (action && validActions.includes(action as PrimaryAction)) return action as PrimaryAction
    return 'contact'
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
    primaryAction: getPrimaryAction(cmsConfig.primary_action),
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
    // Admin actions
    showAdd: cmsConfig.show_add ?? defaultConfig.showAdd,
    addLabel: cmsConfig.add_label ?? defaultConfig.addLabel,
    addUrl: cmsConfig.add_url ?? defaultConfig.addUrl,
    showEdit: cmsConfig.show_edit ?? defaultConfig.showEdit,
    editLabel: cmsConfig.edit_label ?? defaultConfig.editLabel,
    showUpdate: cmsConfig.show_update ?? defaultConfig.showUpdate,
    updateLabel: cmsConfig.update_label ?? defaultConfig.updateLabel,
    showSettings: cmsConfig.show_settings ?? defaultConfig.showSettings,
    settingsLabel: cmsConfig.settings_label ?? defaultConfig.settingsLabel,
    settingsUrl: cmsConfig.settings_url ?? defaultConfig.settingsUrl,
  }

  return <PageFabInner config={config} />
}

function PageFabInner({ config }: { config: FabConfig }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const lastScrollYRef = useRef(0)

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    // Show FAB after delay
    const timer = setTimeout(() => setIsVisible(true), config.delaySeconds * 1000)

    const handleScroll = throttleRAF(() => {
      const scrollY = window.scrollY

      // Always show after scroll threshold
      if (scrollY > 200) {
        setIsVisible(true)
      }

      // Handle hide on scroll
      if (config.hideOnScroll) {
        setIsHidden(scrollY > lastScrollYRef.current) // true = down, false = up
        lastScrollYRef.current = scrollY
      }
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [config.delaySeconds, config.hideOnScroll])

  if (!config.isEnabled) return null

  // Contact actions (for contact menu)
  const contactActions = [
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

  // Admin actions (for admin-menu)
  const adminActions = [
    {
      id: 'add',
      icon: Plus,
      label: config.addLabel,
      href: config.addUrl,
      color: 'bg-green-500 hover:bg-green-600',
      show: config.showAdd,
    },
    {
      id: 'edit',
      icon: Edit2,
      label: config.editLabel,
      href: '#',
      color: 'bg-blue-500 hover:bg-blue-600',
      show: config.showEdit,
    },
    {
      id: 'update',
      icon: RefreshCw,
      label: config.updateLabel,
      href: '#',
      color: 'bg-orange-500 hover:bg-orange-600',
      show: config.showUpdate,
    },
    {
      id: 'settings',
      icon: Settings,
      label: config.settingsLabel,
      href: config.settingsUrl,
      color: 'bg-purple-500 hover:bg-purple-600',
      show: config.showSettings,
    },
  ].filter((action) => action.show)

  // Select actions based on primary action type
  const actions = config.primaryAction === 'admin-menu' ? adminActions : contactActions

  // Check if position is at top
  const isTopPosition = config.position.startsWith('top')

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'top-center': 'top-6 left-1/2 -translate-x-1/2',
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
        'fixed z-[60] flex items-end gap-3 transition-all duration-500',
        // For top positions, expand downward (flex-col); for bottom, expand upward (flex-col-reverse)
        isTopPosition ? 'flex-col' : 'flex-col-reverse',
        positionClasses[config.position],
        isVisible && !isHidden
          ? 'opacity-100 translate-y-0'
          : isTopPosition
            ? 'opacity-0 -translate-y-10 pointer-events-none'
            : 'opacity-0 translate-y-10 pointer-events-none'
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
