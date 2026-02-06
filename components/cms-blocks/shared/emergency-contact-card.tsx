import { Phone } from 'lucide-react'

export interface EmergencyContactCardProps {
  title: string
  name: string
  designation?: string
  mobile: string
  alternateContact?: string
  email?: string
  accentColor?: string
}

export function EmergencyContactCard({
  title,
  name,
  designation,
  mobile,
  alternateContact,
  email,
  accentColor = '#ffde59',
}: EmergencyContactCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 bg-white border border-gray-200"
      >
        {/* Decorative accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: accentColor }}
        />

        {/* Title */}
        <h3
          className="text-2xl md:text-3xl font-bold text-center mb-6"
          style={{ color: accentColor }}
        >
          {title}
        </h3>

        {/* Contact Person */}
        <div className="text-center mb-6">
          <p className="text-black text-xl md:text-2xl font-bold mb-1">
            {name}
          </p>
          {designation && (
            <p className="text-gray-700 text-base md:text-lg">
              {designation}
            </p>
          )}
        </div>

        {/* Primary Phone Number */}
        <a
          href={`tel:${mobile.replace(/\s/g, '')}`}
          className="flex items-center justify-center gap-3 mb-4 group"
        >
          <div
            className="p-3 rounded-full transition-transform group-hover:scale-110"
            style={{ backgroundColor: accentColor }}
          >
            <Phone className="w-6 h-6 text-gray-900" />
          </div>
          <span className="text-black text-xl md:text-2xl font-semibold group-hover:underline">
            {mobile}
          </span>
        </a>

        {/* Alternate Contact */}
        {alternateContact && (
          <a
            href={`tel:${alternateContact.replace(/\s/g, '')}`}
            className="flex items-center justify-center gap-3 mb-4 group"
          >
            <div
              className="p-2 rounded-full transition-transform group-hover:scale-110 bg-gray-100"
            >
              <Phone className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-black text-lg md:text-xl font-medium group-hover:underline">
              {alternateContact}
            </span>
          </a>
        )}

        {/* Email */}
        {email && (
          <div className="text-center mt-4">
            <a
              href={`mailto:${email}`}
              className="text-gray-700 hover:text-black text-sm md:text-base underline"
            >
              {email}
            </a>
          </div>
        )}

        {/* Emergency Note */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-700 text-center text-sm md:text-base">
            Available 24/7 for emergency services
          </p>
        </div>
      </div>
    </div>
  )
}
