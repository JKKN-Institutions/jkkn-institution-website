'use client'

import { useState } from 'react'
import { Check, Link2, Linkedin, Mail, MessageCircle } from 'lucide-react'
import { trackCareersEvent } from '@/lib/analytics/careers-events'

interface ShareJobProps {
  jobId: string
  title: string
  institution: string
  /** Canonical job URL — the only link that is ever shared (spec §5.4). */
  url: string
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Clipboard API needs a secure context and permission; fall back to a selection copy.
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    el.remove()
    return ok
  }
}

export function ShareJob({ jobId, title, institution, url }: ShareJobProps) {
  const [copied, setCopied] = useState(false)
  const text = `${title} at ${institution}`
  const track = (method: string) => trackCareersEvent('share', { method, content_type: 'job', item_id: jobId })

  const links = [
    { method: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { method: 'linkedin', label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { method: 'email', label: 'Email', icon: Mail, href: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n${url}`)}` },
  ]
  const item = 'inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

  async function onCopy() {
    if (!(await copyText(url))) return
    track('copy_link')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-foreground" id="share-job-heading">Share this job</h2>
      <ul aria-labelledby="share-job-heading" className="flex flex-wrap gap-2">
        {links.map(({ method, label, icon: Icon, href }) => (
          <li key={method}>
            <a
              href={href}
              target={method === 'email' ? undefined : '_blank'}
              rel="noopener noreferrer"
              onClick={() => track(method)}
              className={item}
            >
              <Icon className="h-4 w-4" aria-hidden="true" /> {label}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={onCopy} className={item}>
            {copied ? <Check className="h-4 w-4 text-primary" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
            {copied ? 'Link copied' : 'Copy link'}
          </button>
        </li>
      </ul>
      <span role="status" aria-live="polite" className="sr-only">{copied ? 'Job link copied to clipboard' : ''}</span>
    </div>
  )
}
