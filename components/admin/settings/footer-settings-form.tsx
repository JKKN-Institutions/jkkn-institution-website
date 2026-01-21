'use client'

import { useState, useTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateFooterSettings } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Loader2,
  Save,
  Plus,
  X,
  GripVertical,
  FileText,
  Link2,
  Eye,
  EyeOff,
  Share2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { FooterSettings } from '@/app/actions/cms/footer'

const footerLinkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'URL is required'),
  order: z.number(),
  visible: z.boolean(),
})

const footerSettingsSchema = z.object({
  tagline: z.string().min(1, 'Tagline is required'),
  description: z.string().min(1, 'Description is required'),
  institutions: z.array(footerLinkSchema),
  programs: z.array(footerLinkSchema),
  resources: z.array(footerLinkSchema),
  show_about: z.boolean(),
  show_institutions: z.boolean(),
  show_programs: z.boolean(),
  show_resources: z.boolean(),
  show_social: z.boolean(),
  section_title_institutions: z.string().min(1, 'Section title is required'),
  section_title_programs: z.string().min(1, 'Section title is required'),
  section_title_resources: z.string().min(1, 'Section title is required'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().min(1, 'Phone is required'),
  address_line1: z.string().min(1, 'Address line 1 is required'),
  address_line2: z.string().optional(),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.string().min(1, 'State is required'),
  address_pincode: z.string().min(1, 'Pincode is required'),
  address_country: z.string().min(1, 'Country is required'),
  social_facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  social_youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type FooterSettingsFormValues = z.infer<typeof footerSettingsSchema>

interface FooterSettingsFormProps {
  initialSettings: FooterSettings
}

export function FooterSettingsForm({ initialSettings }: FooterSettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<FooterSettingsFormValues>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: {
      tagline: initialSettings.tagline || 'Excellence in Education',
      description: initialSettings.description || '',
      institutions: initialSettings.institutions || [],
      programs: initialSettings.programs || [],
      resources: initialSettings.resources || [],
      show_about: initialSettings.sectionsVisibility?.show_about ?? true,
      show_institutions: initialSettings.sectionsVisibility?.show_institutions ?? true,
      show_programs: initialSettings.sectionsVisibility?.show_programs ?? true,
      show_resources: initialSettings.sectionsVisibility?.show_resources ?? true,
      show_social: initialSettings.sectionsVisibility?.show_social ?? true,
      section_title_institutions: initialSettings.sectionTitles?.institutions || 'Our Institutions',
      section_title_programs: initialSettings.sectionTitles?.programs || 'Programs',
      section_title_resources: initialSettings.sectionTitles?.resources || 'Resources',
      contactEmail: initialSettings.contactEmail || 'info@jkkn.ac.in',
      contactPhone: initialSettings.contactPhone || '+91 422 266 1100',
      address_line1: initialSettings.address?.line1 || '',
      address_line2: initialSettings.address?.line2 || '',
      address_city: initialSettings.address?.city || '',
      address_state: initialSettings.address?.state || '',
      address_pincode: initialSettings.address?.pincode || '',
      address_country: initialSettings.address?.country || 'India',
      social_facebook: initialSettings.socialLinks?.facebook || '',
      social_twitter: initialSettings.socialLinks?.twitter || '',
      social_instagram: initialSettings.socialLinks?.instagram || '',
      social_linkedin: initialSettings.socialLinks?.linkedin || '',
      social_youtube: initialSettings.socialLinks?.youtube || '',
    },
  })

  const institutionsArray = useFieldArray({
    control: form.control,
    name: 'institutions',
  })

  const programsArray = useFieldArray({
    control: form.control,
    name: 'programs',
  })

  const resourcesArray = useFieldArray({
    control: form.control,
    name: 'resources',
  })

  async function onSubmit(data: FooterSettingsFormValues) {
    startTransition(async () => {
      const result = await updateFooterSettings(data)

      if (result.success) {
        toast.success('Footer settings saved successfully')
      } else {
        toast.error(result.message || 'Failed to save settings')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* About Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">About Section</h3>
            </div>
            <FormField
              control={form.control}
              name="show_about"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormLabel className="text-sm text-muted-foreground">Show Section</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Excellence in Education" />
                </FormControl>
                <FormDescription>
                  Short tagline displayed below the logo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="JKKN Group of Institutions is committed to providing quality education..."
                  />
                </FormControl>
                <FormDescription>
                  Brief description about the institution
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Institutions Links */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="section_title_institutions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institutions Section Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Our Institutions" />
                </FormControl>
                <FormDescription>
                  Title displayed in the footer for the institutions section
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Institutions Links</h3>
            </div>
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="show_institutions"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel className="text-sm text-muted-foreground">Show Section</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => institutionsArray.append({ label: '', href: '', order: institutionsArray.fields.length, visible: true })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {institutionsArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                <div className="flex-1 grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`institutions.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="JKKN College of Engineering" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`institutions.${index}.href`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/institutions/engineering" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`institutions.${index}.visible`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 mt-8">
                      <FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(!field.value)}
                        >
                          {field.value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => institutionsArray.remove(index)}
                  className="mt-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Programs Links */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="section_title_programs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programs Section Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Programs" />
                </FormControl>
                <FormDescription>
                  Title displayed in the footer for the programs section
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Programs Links</h3>
            </div>
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="show_programs"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel className="text-sm text-muted-foreground">Show Section</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => programsArray.append({ label: '', href: '', order: programsArray.fields.length, visible: true })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {programsArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                <div className="flex-1 grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`programs.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="B.E. Computer Science" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`programs.${index}.href`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/programs/computer-science" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`programs.${index}.visible`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 mt-8">
                      <FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(!field.value)}
                        >
                          {field.value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => programsArray.remove(index)}
                  className="mt-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Links */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="section_title_resources"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resources Section Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resources" />
                </FormControl>
                <FormDescription>
                  Title displayed in the footer for the resources section
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Resources Links</h3>
            </div>
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="show_resources"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel className="text-sm text-muted-foreground">Show Section</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => resourcesArray.append({ label: '', href: '', order: resourcesArray.fields.length, visible: true })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {resourcesArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                <div className="flex-1 grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`resources.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Library" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`resources.${index}.href`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/resources/library" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`resources.${index}.visible`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 mt-8">
                      <FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(!field.value)}
                        >
                          {field.value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => resourcesArray.remove(index)}
                  className="mt-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Contact Information</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input {...field} type="email" className="pl-10" placeholder="info@jkkn.ac.in" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input {...field} type="tel" className="pl-10" placeholder="+91 422 266 1100" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="JKKN Group of Institutions" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Komarapalayam" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Namakkal District" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tamil Nadu" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="638183" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="India" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Social Media</h3>
            </div>
            <FormField
              control={form.control}
              name="show_social"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormLabel className="text-sm text-muted-foreground">Show Section</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="social_facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://facebook.com/jkkn" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://twitter.com/jkkn" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://instagram.com/jkkn" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://linkedin.com/company/jkkn" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="social_youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://youtube.com/jkkn" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
