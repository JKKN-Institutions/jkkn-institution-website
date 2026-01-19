'use client'

interface FooterMapEmbedProps {
  embedUrl: string
  linkUrl?: string
}

export default function FooterMapEmbed({ embedUrl, linkUrl }: FooterMapEmbedProps) {
  return (
    <>
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
        <iframe
          src={embedUrl}
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="JKKN Institutions Location"
          className="transition-all duration-500"
        />
      </div>
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-sm text-white/70 hover:text-secondary transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          View on Google Maps
        </a>
      )}
    </>
  )
}
