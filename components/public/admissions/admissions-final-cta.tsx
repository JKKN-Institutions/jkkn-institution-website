import Link from 'next/link'
import { ExternalLink, Phone } from 'lucide-react'

interface AdmissionsFinalCtaProps {
  applyUrl: string
  phone: string
}

export function AdmissionsFinalCta({ applyUrl, phone }: AdmissionsFinalCtaProps) {
  return (
    <section id="contact" className="py-16 md:py-20 bg-[#fbfbee]">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <span className="inline-block bg-[#0b6d41]/10 text-[#0b6d41] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            Ready to Apply?
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Start Your Application on the{' '}
            <span className="text-[#0b6d41]">Official Portal</span>
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Complete your admission application online. The process takes
            approximately 10 minutes.
          </p>

          {/* Primary CTA */}
          <Link
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#ffde59] text-[#0b6d41] font-bold text-base px-8 py-4 rounded-full shadow-md hover:bg-[#f5c518] hover:shadow-lg transition-all"
          >
            Apply Online
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* Secondary contact */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-500">
            <span>Have questions?</span>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-1.5 font-semibold text-[#0b6d41] hover:underline"
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Mon – Sat, 9 AM to 5 PM
          </p>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-semibold text-gray-700 hover:text-[#0b6d41] transition-colors border-r border-border"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a
          href={`https://wa.me/91${phone.replace(/[^\d]/g, '').slice(-10)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-semibold text-gray-700 hover:text-[#0b6d41] transition-colors border-r border-border"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          WhatsApp
        </a>
        <Link
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-bold text-white bg-[#0b6d41] hover:bg-[#095c36] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Apply Online
        </Link>
      </div>
    </section>
  )
}
