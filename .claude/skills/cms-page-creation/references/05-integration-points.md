# Integration Points: How Prerequisite Skills Plug In

This skill does not replace `ultra-ui-ux-designer` or `brand-styling` — it calls them at the correct moment and consumes their outputs. This reference documents the handoff.

## ultra-ui-ux-designer → cms-page-creation

**Invoked at:** Step 0 (before writing any code).

**Expected inputs provided to the UX skill:**
- Page purpose (e.g., "Department landing page for Mechanical Engineering")
- Target audience (prospective students, parents, accreditation bodies)
- Must-have sections (hero, program highlights, faculty, admissions CTA)
- Constraints (must work on mobile, must support dark mode)

**Expected outputs consumed by this skill:**
- Section list with hierarchy (hero → intro → features → gallery → CTA)
- Visual treatment notes per section (e.g., "hero uses split layout with CTA overlay")
- Interaction notes (scroll animations, hover states)
- Accessibility notes (heading levels, focus order)

These outputs feed directly into the Zod schema design in Step 2 — each section typically becomes a top-level schema field.

## brand-styling → cms-page-creation

**Invoked at:** Step 0 (immediately after UX discovery).

**Expected inputs provided to the brand skill:**
- Section list from the UX skill
- Any special components (CTA style, card style, hero style)

**Expected outputs consumed by this skill:**
- Tailwind class strings for each section using tokens from `lib/cms/brand-colors.ts`
- Typography scale assignments (heading sizes, body sizes, line heights)
- Spacing scale assignments (section padding, gap between elements)
- Dark-mode class variants
- Color usage map (primary for CTAs, accent for highlights)

These feed directly into the JSX of the block component in Step 2. **No hardcoded hex values** may appear in the component — all colors must resolve to brand tokens.

## Other skills

- **jkkn-terminologies** — consulted whenever user-facing copy is written (labels, headings, button text). Terminology rules override anything the UX skill suggests.
- **nextjs16-web-development** — referenced for Server Component defaults, caching directives, and image handling (`next/image`).
- **supabase-expert** — referenced when the page's blocks need live data (e.g., a faculty list block that queries the DB). For static-prop pages, not needed.
- **Agentic-SEO-Skill** — optional final pass after Step 5 to audit SEO before flipping status to `published`.
- **superpowers:verification-before-completion** — run before reporting completion to ensure build, visual checks, and Lighthouse scores are confirmed.

## Handoff sequence diagram

```
User: "Create a Mechanical Engineering department page"
  │
  ├─ cms-page-creation (this skill) invoked
  │   │
  │   ├─ Step 0a: invoke ultra-ui-ux-designer
  │   │    └─ returns section spec
  │   │
  │   ├─ Step 0b: invoke brand-styling
  │   │    └─ returns Tailwind token mappings
  │   │
  │   ├─ Step 1: decide static vs. DB-driven → DB-driven
  │   │
  │   ├─ Step 2: write components/cms-blocks/content/mechanical-dept-page.tsx
  │   │    (uses outputs from Steps 0a + 0b)
  │   │
  │   ├─ Step 3: edit lib/cms/component-registry.ts
  │   │
  │   ├─ Step 4: document + execute SQL for cms_pages / blocks / seo rows
  │   │
  │   └─ Step 5: verify (build, visual, Lighthouse)
  │
  └─ Done
```
