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
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Page</h1>
            <p className="text-muted-foreground">
              Set up a new page for your website
            </p>
          </div>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
          <CardDescription>
            Configure basic page settings. You can add content after creating the page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading form...</div>}>
            <PageCreateForm parentPages={parentPages} templates={templates} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
