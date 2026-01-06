import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PageCreateForm } from './page-create-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Create New Page | JKKN Admin',
  description: 'Create a new website page',
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'cms:pages:create')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

async function getParentPages() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_pages')
    .select('id, title, slug')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching parent pages:', error)
    return []
  }

  return data || []
}

async function getTemplates() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_templates')
    .select('id, name, description, thumbnail_url, default_blocks, category')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }

  return data || []
}

export default async function NewPagePage() {
  await checkAccess()

  const [parentPages, templates] = await Promise.all([
    getParentPages(),
    getTemplates(),
  ])

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-9xl">
      {/* Professional Header with Gradient */}
      <div className="mb-8">
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative gradient background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Create New Page
              </h1>
              <p className="text-base text-muted-foreground">
                Set up a new page for your website. You'll be able to design it with our visual page builder after creation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl">Page Configuration</CardTitle>
          <CardDescription className="text-base">
            Configure basic page settings and options below
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 pb-8">
          <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading form...</div>}>
            <PageCreateForm parentPages={parentPages} templates={templates} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
