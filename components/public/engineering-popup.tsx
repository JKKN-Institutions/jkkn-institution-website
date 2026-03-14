'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useIsInstitution } from '@/lib/hooks/use-institution'

export function EngineeringPopup() {
  const isEngineering = useIsInstitution('engineering')
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isEngineering) return
    const timer = setTimeout(() => setOpen(true), 1000)
    return () => clearTimeout(timer)
  }, [isEngineering])

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

        {/* Popup Image */}
        <Image
          src="/images/engineering/popup-image-engineering.jpg"
          alt="JKKN Engineering College"
          width={600}
          height={400}
          style={{ width: '100%', height: 'auto', borderRadius: '10px', display: 'block', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          priority
        />
      </div>
    </div>,
    document.body
  )
}
