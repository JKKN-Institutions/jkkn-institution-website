import { notFound } from 'next/navigation'
import { getFacultyById } from '@/app/actions/faculty'
import { FacultyForm } from '@/app/(admin)/admin/faculty/faculty-form'

interface EditFacultyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditFacultyPage({ params }: EditFacultyPageProps) {
  const { id } = await params
  const faculty = await getFacultyById(id)

  if (!faculty) {
    notFound()
  }

  return <FacultyForm faculty={faculty} basePath="/faculty-admin/manage" />
}
