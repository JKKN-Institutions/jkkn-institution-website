# Zod Block Schema Conventions

Every CMS block must export a Zod schema that doubles as:
1. Runtime validator for the `props` JSON stored in `cms_page_blocks`
2. Source of truth for the TypeScript prop type
3. Definition used by the admin block editor to render form fields

## Rules

- Schema name = `{PascalCaseComponentName}Schema`
- Component type = `z.infer<typeof {Schema}>`
- Every field must have a description via `.describe(...)` — the CMS editor uses this as the form label/helper text
- Provide `.default(...)` for optional fields so defaults can be extracted for new blocks
- Nested arrays of items (cards, tabs, slides) must themselves be named schemas (e.g., `CtaButtonSchema`) so they appear as repeaters in the editor
- URLs use `.url()`; email uses `.email()`; never use raw `.string()` for these
- Images: use `z.string().url()` for external, `z.string()` for Supabase storage paths
- Enums: use `z.enum([...])` not string unions

## Canonical example

```tsx
import { z } from 'zod'

export const CtaButtonSchema = z.object({
  label: z.string().describe('Button label'),
  href: z.string().describe('Destination URL or path'),
  variant: z.enum(['primary', 'secondary', 'ghost']).default('primary').describe('Visual style'),
})

export const HeroSchema = z.object({
  eyebrow: z.string().optional().describe('Small text above the heading'),
  title: z.string().describe('Main heading (h1)'),
  subtitle: z.string().optional().describe('Supporting paragraph'),
  backgroundImage: z.string().url().describe('Hero background image URL'),
  ctas: z.array(CtaButtonSchema).default([]).describe('Call-to-action buttons'),
})

export const FacilityPageSchema = z.object({
  hero: HeroSchema,
  intro: z.string().describe('Introductory paragraph'),
  features: z.array(z.object({
    icon: z.string().describe('Lucide icon name'),
    title: z.string(),
    description: z.string(),
  })).default([]),
  gallery: z.array(z.string().url()).default([]).describe('Image URLs'),
})

export type FacilityPageProps = z.infer<typeof FacilityPageSchema>
```

## Anti-patterns

- ❌ Free-form `z.record(z.any())` props — defeats the point of validation
- ❌ Duplicating a type separately from the schema — always `z.infer`
- ❌ Missing `.describe()` calls — editor forms become unusable
- ❌ Schemas defined inline in a page file — export them from the component file so the registry can reference them
