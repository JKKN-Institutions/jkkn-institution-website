'use client'

import { Phone, Mail, MapPin, ExternalLink, Send, Clock, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactCard {
  id: string
  type: 'phone' | 'email' | 'address' | 'hours' | 'website'
  title: string
  value: string
  link?: string
}

interface ContactPageProps {
  // Hero Section
  showHeader?: boolean
  headerTitle?: string
  headerSubtitle?: string
  headerPart1Color?: string
  headerPart2Color?: string

  // Contact Info
  contactIntro?: string
  contactCards?: ContactCard[]

  // Admission Form Section
  showAdmissionSection?: boolean
  admissionTitle?: string
  admissionSubtitle?: string
  admissionButtonText?: string
  admissionButtonLink?: string

  // Map Section
  showMap?: boolean
  mapEmbedUrl?: string

  // Styling
  variant?: 'modern-light' | 'modern-dark'
  cardStyle?: 'glass' | 'solid' | 'gradient'
  showDecorations?: boolean
}

const defaultContactCards: ContactCard[] = [
  {
    id: 'phone',
    type: 'phone',
    title: 'Phone',
    value: '+(91) 93458 55001',
    link: 'tel:+919345855001',
  },
  {
    id: 'email',
    type: 'email',
    title: 'Email',
    value: 'info@jkkn.ac.in',
    link: 'mailto:info@jkkn.ac.in',
  },
  {
    id: 'address',
    type: 'address',
    title: 'Address',
    value: 'Natarajapuram, NH-544 (Salem To Coimbatore National Highway), Kumarapalayam (TK), Namakkal (DT). Tamil Nadu. 638183.',
    link: 'https://maps.google.com/?q=JKKN+Educational+Institutions',
  },
]

const iconMap = {
  phone: Phone,
  email: Mail,
  address: MapPin,
  hours: Clock,
  website: Globe,
}

export default function ContactPage({
  showHeader = true,
  headerTitle = 'Contact Us',
  headerSubtitle = 'Welcome to our Website. We are glad to have you around.',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#ffde59',
  contactIntro = "Get in touch with us for any inquiries about admissions, programs, or general information. We're here to help you on your educational journey.",
  contactCards = defaultContactCards,
  showAdmissionSection = true,
  admissionTitle = 'Online Admission Form',
  admissionSubtitle = 'Ready to join JKKN? Start your application process today.',
  admissionButtonText = 'Apply Now',
  admissionButtonLink = '/admissions',
  showMap = true,
  mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.123456789!2d77.444444!3d11.444444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJKKN%20Educational%20Institutions!5e0!3m2!1sen!2sin!4v1234567890',
  variant = 'modern-light',
  cardStyle = 'glass',
  showDecorations = true,
}: ContactPageProps) {
  const isDark = variant === 'modern-dark'
  const cards = contactCards.length > 0 ? contactCards : defaultContactCards

  const getCardStyles = () => {
    if (cardStyle === 'glass') {
      return isDark
        ? 'bg-white/10 backdrop-blur-md border border-white/20'
        : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
    }
    if (cardStyle === 'gradient') {
      return isDark
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg'
    }
    return isDark
      ? 'bg-gray-800 border border-gray-700'
      : 'bg-white border border-gray-200 shadow-lg'
  }

  return (
    <div className={cn('min-h-screen', isDark ? 'bg-gray-900' : 'bg-[#fbfbee]')}>
      {/* Hero Section */}
      {showHeader && (
        <section
          className="relative py-20 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${headerPart1Color} 0%, ${headerPart1Color}dd 50%, ${headerPart1Color}bb 100%)`,
          }}
        >
          {/* Decorative Elements */}
          {showDecorations && (
            <>
              <div
                className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20"
                style={{ backgroundColor: headerPart2Color }}
              />
              <div
                className="absolute bottom-10 left-10 w-24 h-24 rounded-full opacity-15"
                style={{ backgroundColor: headerPart2Color }}
              />
              <div
                className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full opacity-10"
                style={{ backgroundColor: headerPart2Color }}
              />
            </>
          )}

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-6">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {headerTitle}
              </h1>
              {headerSubtitle && (
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  {headerSubtitle}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info Column */}
            <div>
              <div className="mb-8">
                <div
                  className="w-16 h-1 mb-4"
                  style={{ backgroundColor: headerPart1Color }}
                />
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: headerPart1Color }}
                >
                  Get In Touch
                </h2>
                {contactIntro && (
                  <p className={cn('text-lg', isDark ? 'text-gray-300' : 'text-gray-600')}>
                    {contactIntro}
                  </p>
                )}
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {cards.map((card) => {
                  const IconComponent = iconMap[card.type] || Phone
                  const isFullWidth = card.type === 'address'

                  return (
                    <div
                      key={card.id}
                      className={cn(
                        'rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]',
                        getCardStyles(),
                        isFullWidth ? 'col-span-2' : ''
                      )}
                    >
                      {card.link ? (
                        <a
                          href={card.link}
                          target={card.type === 'address' ? '_blank' : undefined}
                          rel={card.type === 'address' ? 'noopener noreferrer' : undefined}
                          className="flex items-start gap-4 group"
                        >
                          <div
                            className="p-3 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: `${headerPart1Color}15` }}
                          >
                            <IconComponent
                              className="w-6 h-6"
                              style={{ color: headerPart1Color }}
                            />
                          </div>
                          <div>
                            <h3
                              className={cn(
                                'font-semibold text-lg mb-1',
                                isDark ? 'text-white' : 'text-gray-900'
                              )}
                            >
                              {card.title}
                            </h3>
                            <p
                              className={cn(
                                'group-hover:underline',
                                isDark ? 'text-gray-300' : 'text-gray-600'
                              )}
                            >
                              {card.value}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-4">
                          <div
                            className="p-3 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: `${headerPart1Color}15` }}
                          >
                            <IconComponent
                              className="w-6 h-6"
                              style={{ color: headerPart1Color }}
                            />
                          </div>
                          <div>
                            <h3
                              className={cn(
                                'font-semibold text-lg mb-1',
                                isDark ? 'text-white' : 'text-gray-900'
                              )}
                            >
                              {card.title}
                            </h3>
                            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {card.value}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Admission Form Column */}
            {showAdmissionSection && (
              <div>
                <div className="mb-8">
                  <div
                    className="w-16 h-1 mb-4"
                    style={{ backgroundColor: headerPart1Color }}
                  />
                  <h2
                    className="text-3xl font-bold mb-4"
                    style={{ color: headerPart1Color }}
                  >
                    {admissionTitle}
                  </h2>
                  {admissionSubtitle && (
                    <p className={cn('text-lg', isDark ? 'text-gray-300' : 'text-gray-600')}>
                      {admissionSubtitle}
                    </p>
                  )}
                </div>

                {/* Admission CTA Card */}
                <div
                  className={cn(
                    'rounded-xl p-8 text-center',
                    getCardStyles()
                  )}
                >
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: `${headerPart1Color}15` }}
                  >
                    <Send
                      className="w-10 h-10"
                      style={{ color: headerPart1Color }}
                    />
                  </div>
                  <h3
                    className={cn(
                      'text-xl font-semibold mb-4',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    Start Your Journey Today
                  </h3>
                  <p
                    className={cn(
                      'mb-6',
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    )}
                  >
                    Fill out our online admission form to begin your application process. Our team will guide you through every step.
                  </p>
                  <a
                    href={admissionButtonLink}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: headerPart1Color }}
                  >
                    {admissionButtonText}
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                {/* Additional Info Card */}
                <div
                  className={cn(
                    'rounded-xl p-6 mt-4',
                    getCardStyles()
                  )}
                >
                  <h4
                    className={cn(
                      'font-semibold mb-3',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    Office Hours
                  </h4>
                  <div className={cn('space-y-2', isDark ? 'text-gray-300' : 'text-gray-600')}>
                    <p className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 5:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">9:00 AM - 1:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      {showMap && mapEmbedUrl && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div
              className={cn(
                'rounded-xl overflow-hidden',
                getCardStyles()
              )}
            >
              <div className="p-4 border-b border-gray-200">
                <h3
                  className={cn(
                    'text-xl font-semibold flex items-center gap-2',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}
                >
                  <MapPin className="w-5 h-5" style={{ color: headerPart1Color }} />
                  Our Location
                </h3>
              </div>
              <div className="aspect-video">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JKKN Location Map"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Section */}
      <section
        className="py-16"
        style={{
          background: `linear-gradient(135deg, ${headerPart1Color}10 0%, ${headerPart2Color}10 100%)`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: headerPart1Color }}
          >
            Have Questions?
          </h2>
          <p className={cn('text-lg mb-6 max-w-2xl mx-auto', isDark ? 'text-gray-300' : 'text-gray-600')}>
            Our dedicated team is ready to assist you with any inquiries about our programs, facilities, or admission process.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919345855001"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: headerPart1Color }}
            >
              <Phone className="w-5 h-5" />
              Call Us Now
            </a>
            <a
              href="mailto:info@jkkn.ac.in"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2"
              style={{
                borderColor: headerPart1Color,
                color: headerPart1Color,
              }}
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
