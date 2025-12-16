'use client'

import { Button } from '@/components/ui/button'
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const buttonClasses = cn(
    'h-9 w-9 rounded-xl transition-all duration-300',
    'bg-white/10 backdrop-blur-sm border border-white/20',
    'hover:bg-secondary/20 hover:border-secondary/30 hover:text-secondary',
    'hover:shadow-md hover:scale-105 text-white/70'
  )

  return (
    <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
      <span className="text-sm text-white/70 flex items-center gap-1.5 pr-2 border-r border-white/20">
        <Share2 className="h-4 w-4" />
        Share
      </span>
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" asChild className={buttonClasses}>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild className={buttonClasses}>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild className={buttonClasses}>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            buttonClasses,
            copied && 'bg-green-500/20 border-green-500/30 text-green-400'
          )}
          onClick={handleCopyLink}
          title={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
