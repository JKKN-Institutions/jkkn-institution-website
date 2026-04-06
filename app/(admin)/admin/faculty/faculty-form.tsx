'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Save, Loader2, Plus, X, ArrowLeft, Eye, Upload,
  User, GraduationCap, Briefcase, BookOpen, Award, Users, HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { createFaculty, updateFaculty, uploadFacultyPhoto } from '@/app/actions/faculty'
import {
  DESIGNATION_OPTIONS,
  generateSlug,
  type FacultyFormData,
  type FacultyRow,
  type Qualification,
  type ExperienceEntry,
  type Publication,
  type FundedProject,
  type Certification,
  type Award as AwardType,
  type Membership,
  type PhdScholar,
  type Faq,
} from '@/lib/schemas/faculty'

interface FacultyFormProps {
  faculty?: FacultyRow
  basePath?: string
}

// ============================================
// Tag Input Component
// ============================================
function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim()
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
      setInput('')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
          placeholder={placeholder || 'Type and press Enter'}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Repeatable Group Component
// ============================================
function RepeatableGroup<T extends Record<string, unknown>>({
  items,
  onChange,
  renderItem,
  defaultItem,
  addLabel,
}: {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, index: number, update: (field: string, value: unknown) => void) => React.ReactNode
  defaultItem: T
  addLabel: string
}) {
  const addItem = () => onChange([...items, { ...defaultItem }])
  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index))
  const updateItem = (index: number, field: string, value: unknown) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="relative border rounded-lg p-4 bg-muted/30">
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </button>
          {renderItem(item, i, (field, value) => updateItem(i, field, value))}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
        <Plus className="w-3 h-3" /> {addLabel}
      </Button>
    </div>
  )
}

// ============================================
// Main Form
// ============================================
export function FacultyForm({ faculty, basePath = '/admin/faculty' }: FacultyFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const isEdit = !!faculty

  // Form state
  const [form, setForm] = useState<FacultyFormData>({
    full_name: faculty?.full_name || '',
    slug: faculty?.slug || '',
    designation: faculty?.designation || 'Assistant Professor',
    department: faculty?.department || '',
    qualification: faculty?.qualification || '',
    email: faculty?.email || '',
    photo_url: faculty?.photo_url || null,
    experience_years: faculty?.experience_years || 0,
    research_papers: faculty?.research_papers || 0,
    phd_scholars: faculty?.phd_scholars || 0,
    awards_won: faculty?.awards_won || 0,
    display_order: faculty?.display_order || 0,
    is_active: faculty?.is_active ?? true,
    badges: (faculty?.badges as string[]) || [],
    professional_summary: faculty?.professional_summary || '',
    qualifications: (faculty?.qualifications as Qualification[]) || [],
    specialisations: (faculty?.specialisations as string[]) || [],
    experience_entries: (faculty?.experience_entries as ExperienceEntry[]) || [],
    research_focus_areas: (faculty?.research_focus_areas as string[]) || [],
    publications: (faculty?.publications as Publication[]) || [],
    funded_projects: (faculty?.funded_projects as FundedProject[]) || [],
    google_scholar_url: faculty?.google_scholar_url || '',
    researchgate_url: faculty?.researchgate_url || '',
    orcid_url: faculty?.orcid_url || '',
    certifications: (faculty?.certifications as Certification[]) || [],
    awards: (faculty?.awards as AwardType[]) || [],
    memberships: (faculty?.memberships as Membership[]) || [],
    mentoring_description: faculty?.mentoring_description || '',
    phd_scholars_list: (faculty?.phd_scholars_list as PhdScholar[]) || [],
    pg_dissertations_guided: faculty?.pg_dissertations_guided || 0,
    ug_projects_guided: faculty?.ug_projects_guided || 0,
    faqs: (faculty?.faqs as Faq[]) || [],
  })

  const updateField = useCallback(<K extends keyof FacultyFormData>(field: K, value: FacultyFormData[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // Auto-generate slug from name (only on create)
  const handleNameChange = (name: string) => {
    updateField('full_name', name)
    if (!isEdit) {
      updateField('slug', generateSlug(name))
    }
  }

  // Photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !faculty?.id) return

    const fd = new FormData()
    fd.append('photo', file)

    startTransition(async () => {
      const result = await uploadFacultyPhoto(faculty.id, fd)
      if (result.success && result.url) {
        updateField('photo_url', result.url)
        setSuccess('Photo uploaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Failed to upload photo')
      }
    })
  }

  // Submit
  const handleSubmit = (status: 'draft' | 'published') => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      const result = isEdit
        ? await updateFaculty(faculty.id, form)
        : await createFaculty(form)

      if (result.success) {
        // If publishing, also toggle status
        if (status === 'published' && result.data) {
          const { toggleFacultyStatus } = await import('@/app/actions/faculty')
          await toggleFacultyStatus(result.data.id, 'published')
        }
        setSuccess(isEdit ? 'Faculty updated successfully!' : 'Faculty created successfully!')
        if (!isEdit && result.data) {
          router.push(`${basePath}/${result.data.id}`)
        } else {
          router.refresh()
        }
      } else {
        setError(result.error || 'Something went wrong')
      }
    })
  }

  const tabIcons = {
    basic: User,
    academic: GraduationCap,
    experience: Briefcase,
    research: BookOpen,
    achievements: Award,
    mentoring: Users,
    faqs: HelpCircle,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={basePath}><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{isEdit ? 'Edit Faculty' : 'Add Faculty'}</h1>
              <p className="text-sm text-muted-foreground">
                {isEdit ? `Editing ${faculty.full_name}` : 'Create a new faculty profile'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button onClick={() => handleSubmit('published')} disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              Save & Publish
            </Button>
          </div>
        </div>

        {error && <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        {success && <div className="mt-4 p-3 rounded-lg bg-green-500/10 text-green-700 text-sm">{success}</div>}
      </div>

      {/* Tabbed Form */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7 h-auto">
          {Object.entries(tabIcons).map(([key, Icon]) => (
            <TabsTrigger key={key} value={key} className="flex flex-col sm:flex-row items-center gap-1 py-2 text-xs sm:text-sm capitalize">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{key === 'faqs' ? 'FAQs' : key}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* TAB 1: Basic Info */}
        <TabsContent value="basic">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-bold overflow-hidden">
                    {form.photo_url ? (
                      <img src={form.photo_url} alt={form.full_name} className="w-full h-full object-cover" />
                    ) : (
                      form.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'FP'
                    )}
                  </div>
                  {isEdit ? (
                    <div>
                      <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} className="max-w-xs" />
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WebP up to 5MB. Square photos work best.</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Save as draft first, then upload photo.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input id="full_name" value={form.full_name} onChange={e => handleNameChange(e.target.value)} placeholder="Dr. Firstname Lastname" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input id="slug" value={form.slug} onChange={e => updateField('slug', e.target.value)} placeholder="dr-firstname-lastname" />
                  <p className="text-xs text-muted-foreground">Used for /faculty/{form.slug || 'slug'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Designation *</Label>
                  <Select value={form.designation} onValueChange={v => updateField('designation', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DESIGNATION_OPTIONS.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input id="department" value={form.department} onChange={e => updateField('department', e.target.value)} placeholder="Department of Computer Science" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Input id="qualification" value={form.qualification} onChange={e => updateField('qualification', e.target.value)} placeholder="M.D.S., Ph.D." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="name@jkkn.ac.in" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience_years">Experience (years)</Label>
                  <Input id="experience_years" type="number" min={0} value={form.experience_years} onChange={e => updateField('experience_years', parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="research_papers">Research Papers</Label>
                  <Input id="research_papers" type="number" min={0} value={form.research_papers} onChange={e => updateField('research_papers', parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phd_scholars">PhD Scholars</Label>
                  <Input id="phd_scholars" type="number" min={0} value={form.phd_scholars} onChange={e => updateField('phd_scholars', parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awards_won">Awards Won</Label>
                  <Input id="awards_won" type="number" min={0} value={form.awards_won} onChange={e => updateField('awards_won', parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input id="display_order" type="number" min={0} value={form.display_order} onChange={e => updateField('display_order', parseInt(e.target.value) || 0)} />
                  <p className="text-xs text-muted-foreground">Lower number = appears first</p>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.is_active} onCheckedChange={v => updateField('is_active', v)} />
                  <Label>Active (visible on faculty page)</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Badges / Chips</Label>
                <TagInput value={form.badges} onChange={v => updateField('badges', v)} placeholder="e.g. Ph.D. in Orthodontics" />
                <p className="text-xs text-muted-foreground">Shown as chips in the hero section</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Academic */}
        <TabsContent value="academic">
          <Card>
            <CardHeader><CardTitle>Academic Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Professional Summary *</Label>
                <Textarea
                  value={form.professional_summary}
                  onChange={e => updateField('professional_summary', e.target.value)}
                  placeholder="Professional summary paragraph..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Academic Qualifications</Label>
                <RepeatableGroup<Qualification>
                  items={form.qualifications}
                  onChange={v => updateField('qualifications', v)}
                  defaultItem={{ degree: '', specialisation: '', university: '', year: '' }}
                  addLabel="Add Qualification"
                  renderItem={(item, _i, update) => (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pr-6">
                      <Input placeholder="Degree" value={item.degree} onChange={e => update('degree', e.target.value)} />
                      <Input placeholder="Specialisation" value={item.specialisation} onChange={e => update('specialisation', e.target.value)} />
                      <Input placeholder="University" value={item.university} onChange={e => update('university', e.target.value)} />
                      <Input placeholder="Year" value={item.year} onChange={e => update('year', e.target.value)} />
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Areas of Specialisation</Label>
                <TagInput value={form.specialisations} onChange={v => updateField('specialisations', v)} placeholder="e.g. Orthodontic biomechanics" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Experience */}
        <TabsContent value="experience">
          <Card>
            <CardHeader><CardTitle>Experience</CardTitle></CardHeader>
            <CardContent>
              <RepeatableGroup<ExperienceEntry>
                items={form.experience_entries}
                onChange={v => updateField('experience_entries', v)}
                defaultItem={{ type: 'Teaching', start_year: '', end_year: '', role: '', institution: '', description: '' }}
                addLabel="Add Experience"
                renderItem={(item, _i, update) => (
                  <div className="space-y-3 pr-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Select value={item.type} onValueChange={v => update('type', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Teaching">Teaching</SelectItem>
                          <SelectItem value="Clinical">Clinical</SelectItem>
                          <SelectItem value="Industry">Industry</SelectItem>
                          <SelectItem value="Research">Research</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Start Year" value={item.start_year} onChange={e => update('start_year', e.target.value)} />
                      <Input placeholder="End Year or Present" value={item.end_year} onChange={e => update('end_year', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input placeholder="Role / Title" value={item.role} onChange={e => update('role', e.target.value)} />
                      <Input placeholder="Institution" value={item.institution} onChange={e => update('institution', e.target.value)} />
                    </div>
                    <Input placeholder="Description (optional)" value={item.description} onChange={e => update('description', e.target.value)} />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: Research */}
        <TabsContent value="research">
          <Card>
            <CardHeader><CardTitle>Research & Publications</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Research Focus Areas</Label>
                <TagInput value={form.research_focus_areas} onChange={v => updateField('research_focus_areas', v)} placeholder="e.g. Artificial Intelligence" />
              </div>

              <div className="space-y-2">
                <Label>Selected Publications</Label>
                <RepeatableGroup<Publication>
                  items={form.publications}
                  onChange={v => updateField('publications', v)}
                  defaultItem={{ title: '', authors: '', journal: '', year: '', doi_url: '', pubmed_url: '' }}
                  addLabel="Add Publication"
                  renderItem={(item, _i, update) => (
                    <div className="space-y-3 pr-6">
                      <Input placeholder="Publication title" value={item.title} onChange={e => update('title', e.target.value)} />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Input placeholder="Authors" value={item.authors} onChange={e => update('authors', e.target.value)} />
                        <Input placeholder="Journal · Vol(Issue), pp." value={item.journal} onChange={e => update('journal', e.target.value)} />
                        <Input placeholder="Year" value={item.year} onChange={e => update('year', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input placeholder="DOI URL" value={item.doi_url} onChange={e => update('doi_url', e.target.value)} />
                        <Input placeholder="PubMed URL" value={item.pubmed_url} onChange={e => update('pubmed_url', e.target.value)} />
                      </div>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Funded Research Projects</Label>
                <RepeatableGroup<FundedProject>
                  items={form.funded_projects}
                  onChange={v => updateField('funded_projects', v)}
                  defaultItem={{ title: '', agency: '', amount: '', period: '', status: 'Ongoing' }}
                  addLabel="Add Funded Research"
                  renderItem={(item, _i, update) => (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pr-6">
                      <Input placeholder="Project title" value={item.title} onChange={e => update('title', e.target.value)} className="col-span-2" />
                      <Input placeholder="Agency" value={item.agency} onChange={e => update('agency', e.target.value)} />
                      <Input placeholder="Amount" value={item.amount} onChange={e => update('amount', e.target.value)} />
                      <Select value={item.status} onValueChange={v => update('status', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Google Scholar URL</Label>
                  <Input value={form.google_scholar_url || ''} onChange={e => updateField('google_scholar_url', e.target.value)} placeholder="https://scholar.google.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>ResearchGate URL</Label>
                  <Input value={form.researchgate_url || ''} onChange={e => updateField('researchgate_url', e.target.value)} placeholder="https://researchgate.net/..." />
                </div>
                <div className="space-y-2">
                  <Label>ORCID URL</Label>
                  <Input value={form.orcid_url || ''} onChange={e => updateField('orcid_url', e.target.value)} placeholder="https://orcid.org/..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: Achievements */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Certifications & Training</Label>
                <RepeatableGroup<Certification>
                  items={form.certifications}
                  onChange={v => updateField('certifications', v)}
                  defaultItem={{ name: '', organisation: '', year: '' }}
                  addLabel="Add Certification"
                  renderItem={(item, _i, update) => (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                      <Input placeholder="Certification name" value={item.name} onChange={e => update('name', e.target.value)} />
                      <Input placeholder="Issuing organisation" value={item.organisation} onChange={e => update('organisation', e.target.value)} />
                      <Input placeholder="Year" value={item.year} onChange={e => update('year', e.target.value)} />
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Awards & Recognitions</Label>
                <RepeatableGroup<AwardType>
                  items={form.awards}
                  onChange={v => updateField('awards', v)}
                  defaultItem={{ name: '', body: '', year: '' }}
                  addLabel="Add Award"
                  renderItem={(item, _i, update) => (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                      <Input placeholder="Award name" value={item.name} onChange={e => update('name', e.target.value)} />
                      <Input placeholder="Awarding body" value={item.body} onChange={e => update('body', e.target.value)} />
                      <Input placeholder="Year" value={item.year} onChange={e => update('year', e.target.value)} />
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Professional Memberships</Label>
                <RepeatableGroup<Membership>
                  items={form.memberships}
                  onChange={v => updateField('memberships', v)}
                  defaultItem={{ organisation: '', type: '', since: '' }}
                  addLabel="Add Membership"
                  renderItem={(item, _i, update) => (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                      <Input placeholder="Organisation name" value={item.organisation} onChange={e => update('organisation', e.target.value)} />
                      <Input placeholder="Type (e.g. Life Member)" value={item.type} onChange={e => update('type', e.target.value)} />
                      <Input placeholder="Since (year)" value={item.since} onChange={e => update('since', e.target.value)} />
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: Mentoring */}
        <TabsContent value="mentoring">
          <Card>
            <CardHeader><CardTitle>Student Mentoring & Guidance</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Mentoring Description</Label>
                <Textarea
                  value={form.mentoring_description}
                  onChange={e => updateField('mentoring_description', e.target.value)}
                  placeholder="e.g. Recognised PhD guide under The Tamil Nadu Dr. M.G.R. Medical University..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>PhD Scholars</Label>
                <RepeatableGroup<PhdScholar>
                  items={form.phd_scholars_list}
                  onChange={v => updateField('phd_scholars_list', v)}
                  defaultItem={{ scholar_name: '', research_topic: '', status: '' }}
                  addLabel="Add PhD Scholar"
                  renderItem={(item, _i, update) => (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-6">
                      <Input placeholder="Scholar name" value={item.scholar_name} onChange={e => update('scholar_name', e.target.value)} />
                      <Input placeholder="Research topic" value={item.research_topic} onChange={e => update('research_topic', e.target.value)} />
                      <Input placeholder="Status (e.g. 2023 or Ongoing)" value={item.status} onChange={e => update('status', e.target.value)} />
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pg_dissertations">PG Dissertations Guided</Label>
                  <Input id="pg_dissertations" type="number" min={0} value={form.pg_dissertations_guided} onChange={e => updateField('pg_dissertations_guided', parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ug_projects">UG Projects Guided</Label>
                  <Input id="ug_projects" type="number" min={0} value={form.ug_projects_guided} onChange={e => updateField('ug_projects_guided', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: FAQs */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader><CardTitle>Frequently Asked Questions</CardTitle></CardHeader>
            <CardContent>
              <RepeatableGroup<Faq>
                items={form.faqs}
                onChange={v => updateField('faqs', v)}
                defaultItem={{ question: '', answer: '' }}
                addLabel="Add FAQ"
                renderItem={(item, _i, update) => (
                  <div className="space-y-3 pr-6">
                    <Input placeholder="Question" value={item.question} onChange={e => update('question', e.target.value)} />
                    <Textarea placeholder="Answer" value={item.answer} onChange={e => update('answer', e.target.value)} rows={3} />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
