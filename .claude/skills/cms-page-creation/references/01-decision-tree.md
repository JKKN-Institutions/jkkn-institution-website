# Decision Tree: Static vs. DB-driven Page

Use this reference to choose between a statically routed page and a CMS database-driven page before Step 2 of the workflow.

## Decision matrix

| Question | Answer → Go this route |
|---|---|
| Will non-developers edit this content? | Yes → DB-driven |
| Is content likely to change quarterly or more often? | Yes → DB-driven |
| Does it need per-institution variation (Main vs. Engineering vs. Dental)? | Yes → DB-driven (rows differ per Supabase project) |
| Is it highly interactive (custom JS, forms, third-party widgets)? | Yes → Static (or hybrid — block component with static route) |
| Is it legally mandated boilerplate (privacy, mandatory disclosure)? | Either — but DB-driven lets legal update without a deploy |
| Is it a one-off landing page for a single event? | Static is fine |

Default: **DB-driven**.

## Static file page

**Path:** `app/(public)/{slug}/page.tsx`

**Structure:**
```tsx
import { DigitalClassroomPage } from '@/components/cms-blocks/content/digital-classroom-page'

export default function Page() {
  return <DigitalClassroomPage {...hardcodedProps} />
}
```

**Pros:** Type safety at build time, zero DB read on render, simple.
**Cons:** Requires code deploy to change content.

## DB-driven page

**Path:** rendered by `app/(public)/[...slug]/page.tsx` (already exists)

**Structure:**
- Row in `cms_pages` (slug, title, status, institution scope)
- One or more rows in `cms_page_blocks` with `component_name` and `props` JSON
- Row in `cms_seo_metadata` for `<head>` tags
- Optional `cms_page_fab_config` row

**Pros:** Editors can change content, multi-institution variation, versioning possible.
**Cons:** DB round trip on render (cache carefully), more moving parts.

## Hybrid (rare)

Register the block component and ALSO mount a static route that imports it directly. Use when the page must exist even if the DB is unavailable.
