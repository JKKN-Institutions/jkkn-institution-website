import { Suspense } from 'react'
import { Metadata } from 'next'
import { getPublishedFaculty, getFacultyDepartments } from '@/app/actions/faculty'
import { FacultyListingClient } from '@/components/public/faculty/faculty-listing-client'
import { Skeleton } from '@/components/ui/skeleton'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'
import { FACULTY_FAQS } from '@/lib/seo/main-institution/page-content'

export const metadata: Metadata = {
  title: 'Our Faculty | JKKN College of Engineering & Technology',
  description: 'Meet our distinguished faculty members at JKKN College of Engineering & Technology. Experienced professors and researchers across all departments.',
  openGraph: {
    title: 'Our Faculty | JKKN College of Engineering & Technology',
    description: 'Meet our distinguished faculty members at JKKN College of Engineering & Technology.',
    type: 'website',
  },
}

function FacultyListingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[280px] rounded-2xl" />
      ))}
    </div>
  )
}

async function FacultyContent() {
  const [faculty, departments] = await Promise.all([
    getPublishedFaculty(),
    getFacultyDepartments(),
  ])

  return <FacultyListingClient faculty={faculty} departments={departments} />
}

export default function FacultyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#fbfbee' }}>
      {/* JSON-LD (main only): CollectionPage + BreadcrumbList + FAQ */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/faculty',
          name: 'Faculty Directory | JKKN Institutions',
          description:
            'Meet the distinguished faculty at JKKN Institutions — PhD-qualified professors, postgraduate specialists, and industry-experienced educators across dental, pharmacy, engineering, nursing, and arts & science disciplines.',
          pageType: 'CollectionPage',
          keywords: ['JKKN faculty', 'JKKN professors', 'JKKN teaching staff'],
          speakableSelectors: ['h1', '[data-speakable="faculty-intro"]'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Faculty', url: '/faculty' },
          ],
        }}
        faqs={FACULTY_FAQS}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[2.5px] text-[#0b6d41] mb-2">
            <span className="inline-block w-6 h-0.5 bg-[#0b6d41] mr-2 align-middle" />
            Our Faculty
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a2a1e]" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
            Meet Our Distinguished Faculty
          </h1>
          <p className="mt-3 text-[#3d5443] max-w-2xl mx-auto">
            Dedicated educators and researchers committed to academic excellence and innovation.
          </p>
        </div>

        <Suspense fallback={<FacultyListingSkeleton />}>
          <FacultyContent />
        </Suspense>
      </div>
    </div>
  )
}
