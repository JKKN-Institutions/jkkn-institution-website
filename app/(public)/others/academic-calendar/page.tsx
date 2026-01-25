import type { Metadata } from 'next'
import { AcademicCalendarPage } from '@/components/cms-blocks/content/academic-calendar-page'
import { ACADEMIC_CALENDAR_DATA } from '@/lib/cms/templates/engineering/academic-calendar-data'

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
      <AcademicCalendarPage {...ACADEMIC_CALENDAR_DATA} />
    </main>
  )
}
