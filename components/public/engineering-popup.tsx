'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useIsInstitution } from '@/lib/hooks/use-institution'

export function EngineeringPopup() {
  const isEngineering = useIsInstitution('engineering')
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isEngineering || !mounted || !isHomePage) {
      setOpen(false)
      return
    }
    const timer = setTimeout(() => setOpen(true), 1000)
    return () => clearTimeout(timer)
  }, [isEngineering, isHomePage, mounted])

  if (!isEngineering || !open || !mounted) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{ position: 'relative', maxWidth: '580px', width: '100%', margin: '0 16px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute',
            top: '-14px',
            right: '-14px',
            zIndex: 100000,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
          aria-label="Close popup"
        >
          <X size={18} color="#111" />
        </button>

        {/* Popup Image — clicking opens the JKKN online application form in a new tab */}
        <a
          href="https://www.jkkn.ai/apply/jkkn-admission-2026"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          aria-label="Apply for JKKN Engineering admissions 2026-27"
          style={{ display: 'block', cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          <Image
            src="/images/engineering/campaign-2026.jpg"
            alt="JKKN Engineering — Admissions Open 2026-27. Click to apply online."
            width={1080}
            height={1080}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority
          />
        </a>
      </div>
    </div>,
    document.body
  )
}
