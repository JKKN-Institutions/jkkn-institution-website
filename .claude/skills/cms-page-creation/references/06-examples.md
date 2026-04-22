# Reference Examples

Read these existing pages before authoring a new one. They represent the current conventions.

## Exemplar 1: Facility Page

**File:** `components/cms-blocks/content/facility-page.tsx`

Template for any department/facility landing page. Review for:
- Hero layout with background image
- Features grid
- Gallery handling
- Dark-mode variants
- Responsive breakpoints

## Exemplar 2: Digital Classroom Page

**File:** `components/cms-blocks/content/digital-classroom-page.tsx`

Good reference for specialized facility pages with tech/feature emphasis. Review for:
- Icon-feature pairing
- CTA placement
- Image-text alternation

## Exemplar 3: Ambulance Service Page

**File:** `components/cms-blocks/content/ambulance-service-page.tsx`

Reference for service-oriented pages. Review for:
- Contact/CTA integration
- Emergency-style visual emphasis
- Service list patterns

## Existing single-purpose page exemplars

Browse `components/cms-blocks/content/` for more patterns:
- `course-page.tsx`, `be-cse-course-page.tsx`, `be-ece-course-page.tsx` — course landing pages
- `auditorium-page.tsx` — venue/facility with booking CTA
- `contact-page.tsx` — contact form integration
- `academic-calendar-page.tsx` — data-heavy listing

## Reading procedure

Before writing a new page block:

1. Pick the closest exemplar by purpose
2. Read its schema — note field names, defaults, shapes
3. Read its JSX — note Tailwind class patterns, semantic elements, aria usage
4. Check `lib/cms/component-registry.ts` for its registry entry
5. Grep `cms_pages` table for any existing entry using that component name

Reuse naming patterns and structural conventions rather than inventing new ones. Consistency > cleverness for this site.
