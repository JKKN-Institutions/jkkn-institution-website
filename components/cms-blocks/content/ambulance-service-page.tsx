'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import {
  Phone,
  Ambulance,
  Clock,
  Shield,
  HeartPulse,
  Stethoscope,
  Siren,
  User,
} from 'lucide-react'

// Schema for the AmbulanceServicePage component
export const AmbulanceServicePageSchema = z.object({
  facilityTitle: z.string().default('AMBULANCE SERVICES'),
  contact: z.object({
    name: z.string(),
    designation: z.string().optional(),
    mobile: z.string(),
    alternateContact: z.string().optional(),
    email: z.string().optional(),
  }),
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string().optional(),
      })
    )
    .default([]),
  introduction: z.string().default(''),
  features: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .default([]),
  emergencyNote: z.string().optional(),
  conclusion: z.string().optional(),
  backgroundColor: z.string().default('#f8f8f8'),
  accentColor: z.string().default('#10b981'),
  textColor: z.string().default('#000000'),
})

export type AmbulanceServicePageProps = z.infer<typeof AmbulanceServicePageSchema>

// Map feature titles to icons
function getFeatureIcon(title: string) {
  const lower = title.toLowerCase()
  if (lower.includes('24') || lower.includes('round') || lower.includes('clock')) return Clock
  if (lower.includes('equip') || lower.includes('medical') || lower.includes('aid'))
    return Stethoscope
  if (lower.includes('train') || lower.includes('team members') || lower.includes('team'))
    return HeartPulse
  if (lower.includes('safe') || lower.includes('secur')) return Shield
  if (lower.includes('emergency') || lower.includes('rapid') || lower.includes('fast'))
    return Siren
  return Ambulance
}

// ─── Emergency Contact Banner ────────────────────────────
function EmergencyContactBanner({
  contact,
}: {
  contact: AmbulanceServicePageProps['contact']
}) {
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0b6d41] rounded-2xl p-6 md:p-8 text-white shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Emergency label */}
        <div className="flex items-center gap-4">
          <div
            className={`relative w-14 h-14 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-1000 ${pulse ? 'scale-110' : 'scale-100'}`}
          >
            <Siren className="w-7 h-7 text-white" />
            <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#ffde59]">
              24/7 Emergency
            </p>
            <h3 className="text-xl md:text-2xl font-bold">Ambulance Service</h3>
          </div>
        </div>

        {/* Center: Contact person */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-base">{contact.name}</p>
            {contact.designation && (
              <p className="text-white/70 text-sm">{contact.designation}</p>
            )}
          </div>
        </div>

        {/* Right: Call button */}
        <a
          href={`tel:${contact.mobile.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-3 bg-[#ffde59] text-[#0b6d41] font-bold text-lg md:text-xl px-6 py-3.5 rounded-xl hover:bg-[#ffe87a] transition-colors shadow-md hover:shadow-lg"
        >
          <Phone className="w-5 h-5" />
          {contact.mobile}
        </a>
      </div>

      {/* Alternate contact / email */}
      {(contact.alternateContact || contact.email) && (
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/20 text-sm text-white/70">
          {contact.alternateContact && (
            <a
              href={`tel:${contact.alternateContact.replace(/\s/g, '')}`}
              className="hover:text-white hover:underline"
            >
              Alt: {contact.alternateContact}
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="hover:text-white hover:underline">
              {contact.email}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Feature Card ────────────────────────────────────────
function FeatureCard({
  title,
  description,
  accentColor,
}: {
  title: string
  description: string
  accentColor: string
}) {
  const Icon = getFeatureIcon(title)

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <Icon className="w-6 h-6" style={{ color: accentColor }} />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <div
        className="text-sm md:text-[15px] leading-relaxed text-gray-600 prose max-w-none prose-p:text-gray-600"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────
export function AmbulanceServicePage({
  facilityTitle = 'AMBULANCE SERVICES',
  contact,
  images = [],
  introduction = '',
  features = [],
  emergencyNote,
  conclusion,
  accentColor = '#10b981',
}: AmbulanceServicePageProps) {
  const filteredImages = images.filter((img) => img.src)

  return (
    <div className="relative w-screen -ml-[calc((100vw-100%)/2)] bg-gray-50/50">
      {/* ─── Hero Banner ─────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0b6d41 0%, #064d2e 60%, #032818 100%)',
        }}
      >
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
            <Ambulance className="w-3.5 h-3.5" />
            Emergency Services
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#ffde59]">
            {facilityTitle}
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Round-the-clock ambulance service for learners, team members, and community
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
            <div className="w-2 h-2 rotate-45 bg-[#ffde59]" />
            <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 md:h-12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 48h1440V24C1200 0 960 0 720 24S240 48 0 24v24z"
              fill="#f9fafb"
              fillOpacity="0.5"
            />
            <path d="M0 48h1440V32C1200 8 960 8 720 32S240 56 0 32v16z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* ─── Content Area ────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
        {/* Image + Introduction — side by side on desktop */}
        {(filteredImages.length > 0 || introduction) && (
          <div className="max-w-5xl mx-auto mb-10 md:mb-14">
            <div
              className={`flex flex-col ${filteredImages.length > 0 && introduction ? 'md:flex-row' : ''} gap-6 md:gap-8`}
            >
              {/* Ambulance Image */}
              {filteredImages.length > 0 && (
                <div
                  className={`relative rounded-2xl overflow-hidden ${introduction ? 'w-full md:w-1/2' : 'w-full max-w-3xl mx-auto'} aspect-[4/3]`}
                >
                  <Image
                    src={filteredImages[0].src}
                    alt={filteredImages[0].alt || 'Ambulance service'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Introduction */}
              {introduction && (
                <div
                  className={`${filteredImages.length > 0 ? 'w-full md:w-1/2' : 'w-full'} bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex items-center`}
                >
                  <div
                    className="text-[15px] md:text-base leading-[1.8] text-gray-600 prose max-w-none prose-p:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: introduction }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Contact Banner */}
        <div className="max-w-5xl mx-auto mb-10 md:mb-14">
          <EmergencyContactBanner contact={contact} />
        </div>

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="max-w-5xl mx-auto mb-10 md:mb-14">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">
              Our Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* Emergency Note */}
        {emergencyNote && (
          <div className="max-w-5xl mx-auto mb-10 md:mb-14">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mt-0.5">
                  <Siren className="w-5 h-5 text-red-600" />
                </div>
                <div
                  className="text-sm md:text-[15px] leading-relaxed text-red-800 prose max-w-none prose-p:text-red-800"
                  dangerouslySetInnerHTML={{ __html: emergencyNote }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Conclusion */}
        {conclusion && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div
                className="text-[15px] md:text-base leading-[1.8] text-gray-600 prose max-w-none prose-p:text-gray-600"
                dangerouslySetInnerHTML={{ __html: conclusion }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AmbulanceServicePage
