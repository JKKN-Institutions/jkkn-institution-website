'use client'

import {
  Shield,
  Database,
  Eye,
  Lock,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react'

interface PolicySectionProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}

function PolicySection({ icon: Icon, title, children }: PolicySectionProps) {
  return (
    <section className="mb-12 bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 lg:p-10 border border-white/40 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b6d41] to-[#0a5c37] flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#0b6d41]">
          {title}
        </h2>
      </div>
      <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

interface ContactInfoCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href?: string
}

function ContactInfoCard({
  icon: Icon,
  label,
  value,
  href,
}: ContactInfoCardProps) {
  const Content = (
    <>
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#ffde59]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/60 text-sm mb-1">{label}</p>
        <p className="text-white text-sm break-words">{value}</p>
      </div>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-3 hover:bg-white/5 p-3 rounded-lg transition-colors"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {Content}
      </a>
    )
  }

  return <div className="flex items-center gap-3 p-3">{Content}</div>
}

interface PrivacyPolicyContentProps {
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
}

export function PrivacyPolicyContent({
  contactEmail = 'info@jkkn.ac.in',
  contactPhone = '+91 93458 55001',
  contactAddress = 'JKKN College of Engineering and Technology, Kumarapalayam, Namakkal District, Tamil Nadu - 638183, India',
}: PrivacyPolicyContentProps = {}) {
  const lastUpdated = 'January 21, 2026'

  return (
    <main className="min-h-screen bg-[#faf8f0]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0b6d41] via-[#0a5c37] to-[#084d2d] py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 text-[#ffde59]" />
              <span className="text-white/90 text-sm font-medium">
                Legal Information
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-6">
              JKKN College of Engineering and Technology
            </p>
            <div className="inline-flex items-center gap-2 text-white/60 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 max-w-5xl">
        {/* Introduction */}
        <div className="mb-12 bg-gradient-to-br from-[#0b6d41]/5 to-[#ffde59]/5 backdrop-blur-md rounded-2xl p-6 md:p-8 lg:p-10 border border-[#0b6d41]/20">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
            At JKKN College of Engineering and Technology, we are committed to
            protecting the privacy and security of personal information provided
            to us by our students, staff, alumni, and visitors. This Privacy
            Policy outlines how we collect, use, disclose, and protect personal
            information in accordance with applicable privacy laws and
            regulations.
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            By using our website and services, you consent to the collection and
            use of your personal information as described in this policy.
          </p>
        </div>

        {/* Collection of Personal Information */}
        <PolicySection icon={Database} title="Collection of Personal Information">
          <p className="mb-4">
            We collect personal information that you voluntarily provide to us
            when you:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Apply for admission to our institution</li>
            <li>Register for courses or programs</li>
            <li>Subscribe to our newsletters or communications</li>
            <li>Participate in surveys, events, or activities</li>
            <li>Contact us through our website or other channels</li>
            <li>Use our online services and portals</li>
          </ul>
          <p className="mb-4">
            The types of personal information we may collect include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Contact Information:</strong> Name, email address, phone
              number, mailing address
            </li>
            <li>
              <strong>Academic Information:</strong> Educational background,
              transcripts, test scores, certificates
            </li>
            <li>
              <strong>Identification Information:</strong> Date of birth,
              government-issued ID numbers, photographs
            </li>
            <li>
              <strong>Financial Information:</strong> Payment details for fees
              and transactions
            </li>
            <li>
              <strong>Technical Information:</strong> IP address, browser type,
              device information, cookies
            </li>
          </ul>
        </PolicySection>

        {/* Use of Personal Information */}
        <PolicySection icon={Eye} title="Use of Personal Information">
          <p className="mb-4">
            We use the personal information we collect for the following
            purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Educational Services:</strong> Processing admissions,
              enrollment, course registration, and academic administration
            </li>
            <li>
              <strong>Communication:</strong> Sending important notifications,
              updates, newsletters, and marketing communications
            </li>
            <li>
              <strong>Service Improvement:</strong> Analyzing usage patterns to
              enhance our website, services, and educational programs
            </li>
            <li>
              <strong>Research and Analytics:</strong> Conducting institutional
              research, surveys, and statistical analysis
            </li>
            <li>
              <strong>Safety and Security:</strong> Maintaining campus security,
              preventing fraud, and ensuring compliance
            </li>
            <li>
              <strong>Legal Compliance:</strong> Meeting regulatory requirements
              and responding to legal requests
            </li>
            <li>
              <strong>Alumni Relations:</strong> Maintaining connections with
              graduates and organizing alumni events
            </li>
          </ul>
        </PolicySection>

        {/* Disclosure of Personal Information */}
        <PolicySection
          icon={UserCheck}
          title="Disclosure of Personal Information"
        >
          <p className="mb-4">
            We may share your personal information with third parties in the
            following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Service Providers:</strong> Third-party vendors who assist
              us in operating our website, conducting business, or providing
              services (e.g., payment processors, cloud storage providers, email
              service providers)
            </li>
            <li>
              <strong>Educational Partners:</strong> Universities, institutions,
              and organizations with whom we have academic collaborations or
              articulation agreements
            </li>
            <li>
              <strong>Government Authorities:</strong> Regulatory bodies,
              accreditation agencies, and law enforcement when required by law
            </li>
            <li>
              <strong>Professional Bodies:</strong> Professional organizations
              and certification bodies relevant to your field of study
            </li>
            <li>
              <strong>Research Collaborators:</strong> Research partners for
              academic studies and projects (with anonymization when
              appropriate)
            </li>
          </ul>
          <p>
            We ensure that all third parties are contractually obligated to
            maintain the confidentiality and security of your personal
            information.
          </p>
        </PolicySection>

        {/* Protection of Personal Information */}
        <PolicySection
          icon={Lock}
          title="Protection of Personal Information"
        >
          <p className="mb-4">
            We implement comprehensive security measures to protect your
            personal information from unauthorized access, use, disclosure,
            alteration, or destruction:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Technical Safeguards:</strong> Encryption of data in
              transit and at rest, secure socket layer (SSL) technology, and
              firewall protection
            </li>
            <li>
              <strong>Access Controls:</strong> Role-based access restrictions,
              multi-factor authentication, and regular access audits
            </li>
            <li>
              <strong>Physical Security:</strong> Secured data centers,
              restricted access to facilities, and surveillance systems
            </li>
            <li>
              <strong>Administrative Measures:</strong> Employee training on
              data privacy, confidentiality agreements, and incident response
              procedures
            </li>
            <li>
              <strong>Regular Monitoring:</strong> Continuous security
              monitoring, vulnerability assessments, and penetration testing
            </li>
            <li>
              <strong>Data Backup:</strong> Regular backups and disaster
              recovery plans to ensure data availability
            </li>
          </ul>
        </PolicySection>

        {/* Retention of Personal Information */}
        <PolicySection icon={Database} title="Retention of Personal Information">
          <p className="mb-4">
            We retain personal information for as long as necessary to fulfill
            the purposes for which it was collected, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Student Records:</strong> Academic records are retained
              indefinitely to provide transcripts and verify credentials
            </li>
            <li>
              <strong>Admission Applications:</strong> Application materials are
              retained for 5 years after the admission cycle
            </li>
            <li>
              <strong>Financial Records:</strong> Payment and financial
              information is retained for 7 years as required by accounting
              regulations
            </li>
            <li>
              <strong>Email Communications:</strong> General correspondence is
              retained for 2 years unless required for longer periods
            </li>
            <li>
              <strong>Website Analytics:</strong> Technical data is typically
              retained for 26 months
            </li>
          </ul>
          <p>
            When personal information is no longer needed, we securely delete or
            anonymize it in accordance with our data retention policy and
            applicable legal requirements.
          </p>
        </PolicySection>

        {/* Your Rights */}
        <PolicySection icon={Shield} title="Your Rights">
          <p className="mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Right to Access:</strong> You may request access to the
              personal information we hold about you
            </li>
            <li>
              <strong>Right to Correction:</strong> You may request correction
              of inaccurate or incomplete personal information
            </li>
            <li>
              <strong>Right to Deletion:</strong> You may request deletion of
              your personal information, subject to legal and contractual
              obligations
            </li>
            <li>
              <strong>Right to Object:</strong> You may object to certain types
              of processing, such as direct marketing
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You may request a copy
              of your personal information in a portable format
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Where processing is
              based on consent, you may withdraw it at any time
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the
            information provided below. We will respond to your request within a
            reasonable timeframe and in accordance with applicable privacy laws.
          </p>
        </PolicySection>

        {/* Updates to Privacy Policy */}
        <PolicySection icon={Shield} title="Updates to Privacy Policy">
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technologies, legal requirements, or other
            factors. When we make changes, we will:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Update the "Last Updated" date at the top of this policy</li>
            <li>
              Notify you of significant changes through our website or via email
            </li>
            <li>
              Provide a clear summary of the changes in our communications
            </li>
          </ul>
          <p>
            We encourage you to review this Privacy Policy periodically to stay
            informed about how we protect your personal information. Your
            continued use of our services after any changes indicates your
            acceptance of the updated policy.
          </p>
        </PolicySection>

        {/* Contact Us */}
        <div className="mt-16 bg-gradient-to-br from-[#0b6d41] to-[#084d2d] rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-[#ffde59]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Contact Us
            </h2>
          </div>

          <p className="text-white/80 mb-8 text-sm md:text-base leading-relaxed">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ContactInfoCard
              icon={Mail}
              label="Email Address"
              value={contactEmail}
              href={`mailto:${contactEmail}`}
            />
            <ContactInfoCard
              icon={Phone}
              label="Phone Number"
              value={contactPhone}
              href={`tel:${contactPhone.replace(/\s/g, '')}`}
            />
            <ContactInfoCard
              icon={MapPin}
              label="Mailing Address"
              value={contactAddress}
            />
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-white/60 text-xs md:text-sm text-center">
              We are committed to addressing your privacy concerns promptly and
              professionally. Please allow up to 5 business days for a response
              to your inquiry.
            </p>
          </div>
        </div>

        {/* Additional Legal Notice */}
        <div className="mt-8 p-4 md:p-6 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-xs md:text-sm text-gray-600 text-center leading-relaxed">
            This Privacy Policy is governed by the laws of India and the
            Information Technology Act, 2000. JKKN College of Engineering and
            Technology reserves the right to modify this policy at any time
            without prior notice. Your continued use of our services constitutes
            acceptance of any changes.
          </p>
        </div>
      </div>
    </main>
  )
}
