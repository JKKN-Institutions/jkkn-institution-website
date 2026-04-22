# Registry Entry Conventions

New block components must be registered in `lib/cms/component-registry.ts` so the CMS renderer (`components/cms-blocks/page-renderer.tsx`) can resolve them from their stored name string.

## Required shape

```ts
import { FacilityPage, FacilityPageSchema } from '@/components/cms-blocks/content/facility-page'

FacilityPage: {
  name: 'FacilityPage',                 // MUST match DB column cms_page_blocks.component_name
  component: FacilityPage,              // React component
  propsSchema: FacilityPageSchema,      // Zod schema
  category: 'content',                  // content | layout | media | data
  icon: 'Building2',                    // Lucide icon identifier
  description: 'Facility/department landing page with hero, features, and gallery',
  defaultProps: {
    hero: {
      title: 'Facility name',
      backgroundImage: 'https://.../placeholder.jpg',
      ctas: [],
    },
    intro: 'Short facility description',
    features: [],
    gallery: [],
  },
}
```

## Rules

- The object KEY and the `name` field must match and must match the string stored in `cms_page_blocks.component_name`
- Category drives grouping in the admin block picker; choose the most specific one
- `defaultProps` must satisfy `propsSchema.parse(defaultProps)` without throwing — the admin uses it as the starter payload
- Do not register the same `name` twice — check the existing registry before adding
- Keep the import at the top of the file grouped with other content blocks

## Verification

After editing the registry, run:

```bash
npx tsc --noEmit
```

Any TypeScript error here means the registry is broken and page rendering will fail at runtime.
