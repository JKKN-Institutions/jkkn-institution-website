import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { getFacultyBySlug, getRelatedFaculty } from '@/app/actions/faculty'
import { FacultyProfileView } from '@/components/public/faculty/faculty-profile-view'
import { Skeleton } from '@/components/ui/skeleton'
import type { FacultyRow } from '@/lib/schemas/faculty'

interface FacultyDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: FacultyDetailProps): Promise<Metadata> {
  const { slug } = await params
  const faculty = await getFacultyBySlug(slug)

  if (!faculty) {
    return { title: 'Senior Learners Not Found' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://engg.jkkn.ac.in'
  const title = `${faculty.full_name} — ${faculty.designation}, ${faculty.department.replace('Department of ', '')} | JKKN Engineering`
  const description = `${faculty.full_name} is a ${faculty.designation} at JKKN College of Engineering & Technology. ${faculty.experience_years}+ years experience in ${faculty.department.replace('Department of ', '')}. View qualifications & research.`

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description: `${faculty.designation} at JKKN College of Engineering & Technology. ${faculty.experience_years}+ years in ${faculty.department.replace('Department of ', '')}.`,
      images: faculty.photo_url ? [{ url: faculty.photo_url, width: 400, height: 400 }] : [],
      type: 'profile',
      url: `${siteUrl}/faculty/${slug}`,
      locale: 'en_IN',
    },
    alternates: {
      canonical: `${siteUrl}/faculty/${slug}`,
    },
  }
}

export default async function FacultyDetailPage({ params }: FacultyDetailProps) {
  const { slug } = await params
  const faculty = await getFacultyBySlug(slug)

  if (!faculty) {
    notFound()
  }

  const relatedFaculty = await getRelatedFaculty(faculty.department, slug, 4)

  // Build structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://engg.jkkn.ac.in'
  const qualifications = (faculty.qualifications as Array<{ degree: string; specialisation: string; university: string }>) || []
  const specialisations = (faculty.specialisations as string[]) || []
  const memberships = (faculty.memberships as Array<{ organisation: string }>) || []
  const faqs = (faculty.faqs as Array<{ question: string; answer: string }>) || []

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: faculty.full_name,
    jobTitle: faculty.designation,
    description: faculty.professional_summary || `${faculty.designation} at JKKN College of Engineering & Technology`,
    image: faculty.photo_url || undefined,
    url: `${siteUrl}/faculty/${slug}`,
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'JKKN College of Engineering & Technology',
      url: siteUrl,
    },
    alumniOf: qualifications.map(q => ({
      '@type': 'EducationalOrganization',
      name: q.university,
    })),
    knowsAbout: specialisations,
    memberOf: memberships.map(m => ({
      '@type': 'Organization',
      name: m.organisation,
    })),
    sameAs: [
      faculty.google_scholar_url,
      faculty.researchgate_url,
      faculty.orcid_url,
    ].filter(Boolean),
  }

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Senior Learners', item: `${siteUrl}/faculty` },
      { '@type': 'ListItem', position: 3, name: faculty.full_name, item: `${siteUrl}/faculty/${slug}` },
    ],
  }

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <FacultyProfileView faculty={faculty} relatedFaculty={relatedFaculty} />
    </>
  )
}
