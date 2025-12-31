'use client'

export interface HeroSectionProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  ctaButtons?: Array<{
    label: string
    link: string
    variant?: 'primary' | 'secondary'
  }>
}

export default function HeroSection({
  title = 'Welcome',
  subtitle,
  backgroundImage,
  ctaButtons = [],
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl md:text-2xl mb-8">{subtitle}</p>}
        {ctaButtons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {ctaButtons.map((btn, i) => (
              <a
                key={i}
                href={btn.link}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  btn.variant === 'secondary'
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
