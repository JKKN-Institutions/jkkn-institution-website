import type { Metadata } from 'next'
import { AcademicCalendarPage } from '@/components/cms-blocks/content/academic-calendar-page'
import { ACADEMIC_CALENDAR_DATA } from '@/lib/cms/templates/engineering/academic-calendar-data'
import { MainInstitutionPageSchema } from '@/components/seo/main-institution/main-institution-page-schema'

export const metadata: Metadata = {
  title: 'Academic Calendar 2024-2025 | JKKN College of Engineering',
  description:
    'View the complete academic calendar for JKKN College of Engineering including semester schedules, examination dates, holidays, important events, and deadlines for the academic year 2024-2025.',
  keywords: [
    'academic calendar',
    'JKKN calendar',
    'semester schedule',
    'examination dates',
    'college holidays',
    'academic year',
    'event calendar',
    'JKKN engineering',
    'academic planning',
    'important dates',
  ],
  openGraph: {
    title: 'Academic Calendar 2024-2025 | JKKN College of Engineering',
    description:
      'Stay updated with all important academic dates, events, examinations, and holidays. Complete academic calendar for JKKN College of Engineering.',
    type: 'website',
    siteName: 'JKKN College of Engineering',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academic Calendar 2024-2025 | JKKN Engineering',
    description:
      'Complete academic calendar with semester schedules, exam dates, holidays, and important events.',
  },
}

export default function AcademicCalendarRoutePage() {
  return (
    <main>
      {/* JSON-LD (main only): WebPage + BreadcrumbList */}
      <MainInstitutionPageSchema
        webpage={{
          path: '/others/academic-calendar',
          name: 'Academic Calendar | JKKN Institutions',
          description:
            'Academic calendar for JKKN Institutions — semester schedule, examinations, holidays, and important academic events across the 7 colleges.',
          keywords: [
            'academic calendar',
            'JKKN calendar',
            'semester schedule',
            'examination dates',
            'college holidays',
          ],
          speakableSelectors: ['h1'],
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Others', url: '/others' },
            { name: 'Academic Calendar', url: '/others/academic-calendar' },
          ],
        }}
      />
      <AcademicCalendarPage {...ACADEMIC_CALENDAR_DATA} />
    </main>
  )
}
