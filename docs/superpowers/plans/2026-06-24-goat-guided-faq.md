# Goat-Guided FAQ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static "full goat in a white box" FAQ guide on the live homepage with an animated, cropped head-and-shoulders goat mascot that presents the FAQ one question at a time (goat asks → reveals its answer), gated behind a new `guideMode='goat-qa'` prop on `FAQSectionBlock`.

**Architecture:** Add a `guideMode: 'portrait' | 'goat-qa'` prop to the existing CMS `FAQSectionBlock` (default `'portrait'` = unchanged behavior everywhere). In `goat-qa` mode the block renders a new self-contained `GoatGuidedFAQ` client widget instead of the white-box guide + accordion. A one-time `sharp` script crops `Goat.png` into a transparent head avatar. The live homepage block is flipped to `goat-qa` via a documented Supabase data update (Main project only).

**Tech Stack:** Next.js 16 (App Router, client component), React 19, TypeScript 5 (strict), Tailwind CSS v4, framer-motion (idle/reaction animation + `useReducedMotion`), next/image, sharp (asset crop), Supabase (Main project), Playwright (e2e).

## Global Constraints

- Target ONLY the live homepage FAQ. `guideMode` defaults to `'portrait'`; every other `FAQSectionBlock` instance must render exactly as today.
- Do NOT touch `components/public/landing/faq-section.tsx` (orphaned, not rendered live).
- Reuse the existing brand tokens already used by the block: `gold` / `#D4AF37` (dark), `primary` / `#0b6d41` (light), glassmorphism (`bg-white/5 border-white/10` dark; `bg-white/80 border-gray-200 shadow-lg` light). Font: Poppins (inherited).
- Animation MUST respect `prefers-reduced-motion` (framer-motion `useReducedMotion()`): no idle loop, no reaction, instant reveal.
- All FAQ Q&A pairs MUST remain in the DOM (visually-hidden list) for SEO/crawlers + screen readers; answer reveal region uses `aria-live="polite"`.
- The FAQ JSON-LD (`components/seo/faq-schema.tsx`) is sourced from `getInstitutionSEOConfig()` and MUST NOT be modified.
- DB change is Main Supabase only (`pmqodbfhsejbvfbmsfeq`); document the SQL under `docs/database/main-supabase/` BEFORE executing (project database-documentation-workflow). No multi-institution sync.
- Avatar asset path constant (used as fallback): `/images/ai-tools/Goat-head.png`.
- Typecheck gate per code task: `npx tsc --noEmit` (the repo has no separate lint/unit-test script; full `npm run build` is heavy and reserved for pre-merge).
- Commit after each task. Branch is `feature/goat-guided-faq` (already created off `master`).

---

### Task 1: Crop the goat head-and-shoulders avatar asset

**Files:**
- Create: `scripts/crop-goat-head.ts`
- Create (generated, committed): `public/images/ai-tools/Goat-head.png`
- Source (read-only): `public/images/ai-tools/Goat.png` (1254×1254, transparent)

**Interfaces:**
- Consumes: nothing.
- Produces: the asset file `public/images/ai-tools/Goat-head.png` (transparent, square), referenced by later tasks via the constant `/images/ai-tools/Goat-head.png`.

- [ ] **Step 1: Write the crop script**

Create `scripts/crop-goat-head.ts`:

```ts
/**
 * One-time asset script: crop a head-and-shoulders avatar from the full-body
 * JKKN goat render (public/images/ai-tools/Goat.png, 1254x1254, transparent)
 * into public/images/ai-tools/Goat-head.png.
 *
 * The crop region is expressed as fractions of the source so it is easy to
 * tune: run, eyeball the output, adjust REGION, re-run. Transparency is
 * preserved (PNG). Run: `npx tsx scripts/crop-goat-head.ts`
 */
import sharp from 'sharp'
import path from 'node:path'

const SRC = path.join(process.cwd(), 'public/images/ai-tools/Goat.png')
const OUT = path.join(process.cwd(), 'public/images/ai-tools/Goat-head.png')

// Head-and-shoulders region as fractions of the source (tune by inspecting OUT).
// Top-centered: horns + face + top of the hoodie; legs/rock excluded.
const REGION = { leftFrac: 0.30, topFrac: 0.02, widthFrac: 0.42, heightFrac: 0.42 }
const OUTPUT_SIZE = 512

async function main() {
  const meta = await sharp(SRC).metadata()
  const W = meta.width ?? 1254
  const H = meta.height ?? 1254

  const left = Math.round(REGION.leftFrac * W)
  const top = Math.round(REGION.topFrac * H)
  const width = Math.round(REGION.widthFrac * W)
  const height = Math.round(REGION.heightFrac * H)

  await sharp(SRC)
    .extract({ left, top, width, height })
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(OUT)

  const outMeta = await sharp(OUT).metadata()
  console.log(`[crop-goat-head] wrote ${OUT}`)
  console.log(`[crop-goat-head] source ${W}x${H}, extract {left:${left},top:${top},w:${width},h:${height}}`)
  console.log(`[crop-goat-head] output ${outMeta.width}x${outMeta.height}, hasAlpha=${outMeta.hasAlpha}`)
  if (outMeta.width !== OUTPUT_SIZE || outMeta.height !== OUTPUT_SIZE) {
    throw new Error('Output is not the expected square size')
  }
}

main().catch((err) => {
  console.error('[crop-goat-head] failed:', err)
  process.exit(1)
})
```

- [ ] **Step 2: Run the script**

Run: `npx tsx scripts/crop-goat-head.ts`
Expected: logs `wrote .../Goat-head.png` and `output 512x512, hasAlpha=true`, exit 0.

- [ ] **Step 3: Visually verify the crop and tune if needed**

Open `public/images/ai-tools/Goat-head.png`. It must show the goat's **horns + face + top of hoodie** on a transparent background, with no legs/rock and no clipped horns. If the framing is off, adjust `REGION` (`leftFrac`/`topFrac`/`widthFrac`/`heightFrac`) in the script and re-run Step 2 until it looks right.

- [ ] **Step 4: Commit**

```bash
git add scripts/crop-goat-head.ts public/images/ai-tools/Goat-head.png
git commit -m "feat(faq): add sharp script + cropped goat head avatar asset"
```

---

### Task 2: Add `guideMode` to schema, defaults, and editor prop

**Files:**
- Modify: `lib/cms/registry-types.ts` (FAQSectionPropsSchema, ends line 520)
- Modify: `lib/cms/component-registry.ts` (FAQSectionBlock `defaultProps` ~line 1146 and `editableProps` ~line 1207)

**Interfaces:**
- Consumes: nothing.
- Produces: `FAQSectionProps.guideMode?: 'portrait' | 'goat-qa'` (default `'portrait'`), consumed by Tasks 4.

- [ ] **Step 1: Add `guideMode` to the Zod schema**

In `lib/cms/registry-types.ts`, inside `FAQSectionPropsSchema`, immediately AFTER the `guidePosition` line (currently the last property before the closing `})` at line ~519), add:

```ts
  guideMode: z
    .enum(['portrait', 'goat-qa'])
    .default('portrait')
    .describe("Guide rendering mode: 'portrait' (image card beside the accordion) or 'goat-qa' (animated mascot presents one question at a time, replacing the accordion)"),
```

- [ ] **Step 2: Add `guideMode` to `defaultProps`**

In `lib/cms/component-registry.ts`, in the `FAQSectionBlock.defaultProps` object, after the `guidePosition: 'left',` line (~1146), add:

```ts
      guideMode: 'portrait',
```

- [ ] **Step 3: Add `guideMode` to `editableProps`**

In `lib/cms/component-registry.ts`, in the `FAQSectionBlock.editableProps` array, after the `guidePosition` entry (~1207), add:

```ts
      { name: 'guideMode', type: 'enum', label: 'Guide Mode', options: ['portrait', 'goat-qa'], description: "'portrait' = image card; 'goat-qa' = animated mascot presents Q&A one at a time" },
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors). The new `guideMode` is now part of `FAQSectionProps`.

- [ ] **Step 5: Commit**

```bash
git add lib/cms/registry-types.ts lib/cms/component-registry.ts
git commit -m "feat(faq): add guideMode prop (portrait | goat-qa) to FAQSectionBlock"
```

---

### Task 3: Build the `GoatGuidedFAQ` widget

**Files:**
- Create: `components/cms-blocks/content/goat-guided-faq.tsx`

**Interfaces:**
- Consumes: `FAQItem` from `@/lib/cms/registry-types`; `cn` from `@/lib/utils`.
- Produces: named export `GoatGuidedFAQ` with props:
  `{ faqs: FAQItem[]; avatarSrc: string; avatarAlt?: string; greeting?: string; position?: 'left' | 'right'; isDark: boolean; accentColor?: string; showAnimations?: boolean; isEditing?: boolean }`. Consumed by Task 4.

- [ ] **Step 1: Write the component**

Create `components/cms-blocks/content/goat-guided-faq.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQItem } from '@/lib/cms/registry-types'

export interface GoatGuidedFAQProps {
  faqs: FAQItem[]
  avatarSrc: string
  avatarAlt?: string
  greeting?: string
  position?: 'left' | 'right'
  isDark: boolean
  accentColor?: string
  showAnimations?: boolean
  isEditing?: boolean
}

/**
 * Goat-led FAQ: the mascot "asks" one question at a time in a speech bubble;
 * the visitor taps "Show answer" to reveal it and Prev/Next to cycle. Replaces
 * the accordion when FAQSectionBlock runs in guideMode='goat-qa'. All Q&A stay
 * in the DOM (sr-only <dl>) for SEO + screen readers.
 */
export function GoatGuidedFAQ({
  faqs,
  avatarSrc,
  avatarAlt = 'JKKN goat guide',
  greeting,
  position = 'left',
  isDark,
  accentColor,
  showAnimations = true,
  isEditing = false,
}: GoatGuidedFAQProps) {
  const prefersReduced = useReducedMotion()
  const animate = showAnimations && !isEditing && !prefersReduced

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnswerShown, setIsAnswerShown] = useState(false)

  if (!faqs || faqs.length === 0) return null

  const total = faqs.length
  const current = faqs[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1
  const accent = accentColor || (isDark ? '#D4AF37' : '#0b6d41')

  const goTo = (next: number) => {
    setCurrentIndex(Math.max(0, Math.min(total - 1, next)))
    setIsAnswerShown(false)
  }

  return (
    <div
      className={cn(
        'mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 lg:gap-12',
        position === 'right'
          ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,220px)]'
          : 'lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]'
      )}
    >
      {/* Avatar */}
      <div className={cn(position === 'right' && 'lg:order-2')}>
        <GoatAvatar src={avatarSrc} alt={avatarAlt} animate={animate} nodKey={currentIndex} />
      </div>

      {/* Bubble + controls + answer */}
      <div className={cn(position === 'right' && 'lg:order-1')}>
        <div
          className={cn(
            'relative rounded-2xl p-5 lg:p-6',
            isDark
              ? 'bg-white/5 backdrop-blur-md border border-white/10'
              : 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg'
          )}
        >
          {/* speech-bubble tail toward the avatar (desktop only) */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-8 hidden h-4 w-4 rotate-45 lg:block',
              isDark ? 'border-b border-l border-white/10 bg-white/5' : 'border-b border-l border-gray-200 bg-white/80',
              position === 'right' ? '-right-2' : '-left-2'
            )}
          />

          {greeting && (
            <p className={cn('mb-2 text-xs font-medium uppercase tracking-wide', isDark ? 'text-white/50' : 'text-gray-400')}>
              {greeting}
            </p>
          )}

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentIndex}
              initial={animate ? { opacity: 0, scale: 0.96, y: 6 } : false}
              animate={animate ? { opacity: 1, scale: 1, y: 0 } : undefined}
              exit={animate ? { opacity: 0 } : undefined}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              data-testid="goat-faq-question"
              className={cn('text-lg font-semibold leading-snug lg:text-xl', isDark ? 'text-white' : 'text-gray-900')}
            >
              {current.question}
            </motion.h3>
          </AnimatePresence>

          {/* Answer (always in DOM; collapsed via grid-rows) */}
          <div
            aria-live="polite"
            className={cn(
              'grid transition-all duration-300 ease-in-out',
              isAnswerShown ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            )}
          >
            <div className="overflow-hidden">
              <p className={cn('text-sm leading-relaxed', isDark ? 'text-white/70' : 'text-gray-600')}>
                {current.answer}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAnswerShown((s) => !s)}
              aria-expanded={isAnswerShown}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-gray-900 transition-transform duration-200 hover:scale-105"
              style={{ backgroundColor: accent }}
            >
              {isAnswerShown ? 'Hide answer' : 'Show answer'}
            </button>

            {total > 1 && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(currentIndex - 1)}
                  disabled={isFirst}
                  aria-label="Previous question"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                    isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span
                  className={cn('min-w-[3.5rem] text-center text-sm font-medium tabular-nums', isDark ? 'text-white/70' : 'text-gray-600')}
                  data-testid="goat-faq-progress"
                >
                  {currentIndex + 1} / {total}
                </span>
                <button
                  type="button"
                  onClick={() => goTo(currentIndex + 1)}
                  disabled={isLast}
                  aria-label="Next question"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                    isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Crawlable + screen-reader full list (SEO/a11y parity) */}
        <dl className="sr-only" data-testid="goat-faq-crawlable">
          {faqs.map((faq, i) => (
            <div key={i}>
              <dt>{faq.question}</dt>
              <dd>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

function GoatAvatar({
  src,
  alt,
  animate,
  nodKey,
}: {
  src: string
  alt: string
  animate: boolean
  nodKey: number
}) {
  return (
    <div className="relative mx-auto w-[120px] sm:w-[150px] lg:w-full lg:max-w-[200px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-br from-gold/25 via-primary/15 to-transparent opacity-70 blur-2xl"
      />
      <motion.div
        animate={animate ? { y: [0, -6, 0] } : undefined}
        transition={animate ? { duration: 3, ease: 'easeInOut', repeat: Infinity } : undefined}
        className="relative"
      >
        <motion.div
          key={nodKey}
          initial={animate ? { rotate: -3, y: 4 } : false}
          animate={animate ? { rotate: 0, y: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        >
          <Image
            src={src}
            alt={alt}
            width={512}
            height={512}
            sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 200px"
            className="h-auto w-full select-none drop-shadow-xl"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (`gold`/`primary` utility classes already exist in the theme — they are used by the current `FAQGuide`.)

- [ ] **Step 3: Commit**

```bash
git add components/cms-blocks/content/goat-guided-faq.tsx
git commit -m "feat(faq): add GoatGuidedFAQ animated goat-led Q&A widget"
```

---

### Task 4: Render `GoatGuidedFAQ` from `FAQSectionBlock` in goat-qa mode

**Files:**
- Modify: `components/cms-blocks/content/faq-section-block.tsx` (import; destructure `guideMode`; the FAQ content block lines 154-228)

**Interfaces:**
- Consumes: `GoatGuidedFAQ` (Task 3); `guideMode` (Task 2).
- Produces: live homepage behavior once the DB prop is flipped (Task 6).

- [ ] **Step 1: Add the import**

In `components/cms-blocks/content/faq-section-block.tsx`, after the existing import of `useSectionTypography` (line 9), add:

```tsx
import { GoatGuidedFAQ } from './goat-guided-faq'
```

- [ ] **Step 2: Destructure the new prop**

In the `FAQSectionBlock` parameter list, after `guidePosition = 'left',` (line 30), add:

```tsx
  guideMode = 'portrait',
```

- [ ] **Step 3: Branch the content section on `guideMode`**

Replace the entire block currently at lines 154-228 — the `{/* FAQ Content with Glassmorphism (+ optional Guide Mascot) */}` `<div>...</div>` — with the following. The outer animated wrapper is preserved; only its inner content branches:

```tsx
        {/* FAQ Content (goat-qa mode) OR Glassmorphism guide + accordion (portrait mode) */}
        <div
          className={cn(
            guideMode === 'goat-qa' || (showGuide && guideImage) ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto',
            showAnimations && 'transition-all duration-700 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          {guideMode === 'goat-qa' ? (
            <GoatGuidedFAQ
              faqs={faqs}
              avatarSrc={guideImage && guideImage.trim() ? guideImage : '/images/ai-tools/Goat-head.png'}
              avatarAlt={guideImageAlt}
              greeting={guideCaption}
              position={guidePosition}
              isDark={isDark}
              accentColor={accentColor}
              showAnimations={showAnimations}
              isEditing={isEditing}
            />
          ) : (
            <div
              className={cn(
                showGuide && guideImage && cn(
                  'grid grid-cols-1 items-start gap-8 lg:gap-12',
                  guidePosition === 'right'
                    ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)]'
                    : 'lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]'
                )
              )}
            >
              {/* Guide Mascot (left side) */}
              {showGuide && guideImage && guidePosition !== 'right' && (
                <FAQGuide
                  image={guideImage}
                  alt={guideImageAlt}
                  caption={guideCaption}
                  isDark={isDark}
                  isVisible={isVisible}
                  showAnimations={showAnimations}
                />
              )}

              {/* FAQ Accordion card */}
              <div className={cn(
                'rounded-2xl p-5 lg:p-8',
                isDark
                  ? 'bg-white/5 backdrop-blur-md border border-white/10'
                  : 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg'
              )}>
                <div className="space-y-0">
                  {faqs.map((faq, index) => (
                    <FAQAccordionItem
                      key={index}
                      faq={faq}
                      index={index}
                      isOpen={openItem === index}
                      onToggle={() => setOpenItem(openItem === index ? null : index)}
                      isDark={isDark}
                      isLast={index === faqs.length - 1}
                    />
                  ))}

                  {faqs.length === 0 && (
                    <p className={cn(
                      'text-center py-8',
                      isDark ? 'text-white/50' : 'text-gray-400'
                    )}>
                      No questions added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Guide Mascot (right side) */}
              {showGuide && guideImage && guidePosition === 'right' && (
                <FAQGuide
                  image={guideImage}
                  alt={guideImageAlt}
                  caption={guideCaption}
                  isDark={isDark}
                  isVisible={isVisible}
                  showAnimations={showAnimations}
                />
              )}
            </div>
          )}
        </div>
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (Portrait mode markup is byte-for-byte the original, just nested under the `else` branch.)

- [ ] **Step 5: Commit**

```bash
git add components/cms-blocks/content/faq-section-block.tsx
git commit -m "feat(faq): render GoatGuidedFAQ when FAQSectionBlock guideMode is goat-qa"
```

---

### Task 5: Add Playwright e2e coverage

**Files:**
- Create: `tests/e2e/goat-faq.spec.ts`

**Interfaces:**
- Consumes: a running dev server pointed at the Main institution (homepage block flipped to goat-qa in Task 6). `data-testid="goat-faq-progress"` and `data-testid="goat-faq-crawlable"` from Task 3.
- Produces: nothing.

> NOTE: This test PASSES only after Task 6 flips the homepage block to `goat-qa` and the dev server runs against Main (`npm run switch main`). Written here first (TDD); it fails until Tasks 4 + 6 are both done.

- [ ] **Step 1: Write the spec**

Create `tests/e2e/goat-faq.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

// The goat-led FAQ lives on the Main homepage (guideMode='goat-qa').
// Run against Main: `npm run switch main` then `npm test`.
test.describe('Goat-guided FAQ (homepage)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll the FAQ into view so its scroll-reveal + lazy bits mount.
    await page.getByTestId('goat-faq-progress').scrollIntoViewIfNeeded()
  })

  test('renders the cropped goat avatar', async ({ page }) => {
    // Locate by src (robust to alt text); next/image keeps the original path in the optimized URL.
    const avatar = page.locator('img[src*="Goat-head"]')
    await expect(avatar.first()).toBeVisible()
  })

  test('asks the first question and reveals its answer on tap', async ({ page }) => {
    await expect(page.getByTestId('goat-faq-progress')).toHaveText('1 / 10')

    const firstQuestion = page.getByTestId('goat-faq-question')
    const questionText = (await firstQuestion.textContent())?.trim() ?? ''
    expect(questionText.length).toBeGreaterThan(0)

    const showBtn = page.getByRole('button', { name: 'Show answer' })
    await expect(showBtn).toBeVisible()
    await showBtn.click()
    await expect(page.getByRole('button', { name: 'Hide answer' })).toBeVisible()
  })

  test('Next advances to the second question and resets the answer', async ({ page }) => {
    await page.getByRole('button', { name: 'Show answer' }).click()
    await page.getByRole('button', { name: 'Next question' }).click()
    await expect(page.getByTestId('goat-faq-progress')).toHaveText('2 / 10')
    // Answer collapses again -> button shows "Show answer"
    await expect(page.getByRole('button', { name: 'Show answer' })).toBeVisible()
  })

  test('all Q&A pairs are present in the DOM for crawlers', async ({ page }) => {
    const dl = page.getByTestId('goat-faq-crawlable')
    await expect(dl.locator('dt')).toHaveCount(10)
    await expect(dl.locator('dd')).toHaveCount(10)
  })

  test('reduced-motion users can still use the widget', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    await page.getByTestId('goat-faq-progress').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Show answer' }).click()
    await expect(page.getByRole('button', { name: 'Hide answer' })).toBeVisible()
    await context.close()
  })
})
```

- [ ] **Step 2: Run the spec (expect failure now)**

Run: `npx playwright test goat-faq --project=chromium`
Expected: FAIL — the homepage block is still `portrait` (Task 6 not done), so `goat-faq-progress` is absent. This confirms the test is wired to the real behavior.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/goat-faq.spec.ts
git commit -m "test(faq): e2e for goat-guided FAQ homepage widget"
```

---

### Task 6: Document + apply the homepage block DB flip (Main only)

**Files:**
- Create: `docs/database/main-supabase/data-changes/2026-06-24-homepage-faq-goat-qa.sql`
- Data: Main Supabase `cms_page_blocks` (page `936f420b-ee5b-461e-9b4e-cf5b19f84882`, `FAQSectionBlock`, `sort_order=19`)

**Interfaces:**
- Consumes: deployed/preview code from Tasks 2-4 understands `guideMode` (old prod code safely ignores the new key).
- Produces: live homepage renders goat-qa; enables Task 7.

- [ ] **Step 1: Document the SQL first (project workflow)**

Create `docs/database/main-supabase/data-changes/2026-06-24-homepage-faq-goat-qa.sql`:

```sql
-- ============================================
-- Homepage FAQ → goat-qa guide mode
-- ============================================
-- Purpose: Switch the live homepage FAQSectionBlock to the animated goat-led
--          Q&A experience and point the guide image at the cropped head asset.
-- Created: 2026-06-24
-- Project: Main (pmqodbfhsejbvfbmsfeq) ONLY — the goat is JKKN-branded and the
--          homepage is the Main institution. No multi-institution sync.
-- Target : cms_page_blocks, page_id 936f420b-ee5b-461e-9b4e-cf5b19f84882,
--          component FAQSectionBlock, sort_order 19 (the visible block).
-- Safety : Old deployed code ignores unknown props.guideMode, so this is safe
--          to apply before the new code ships. jsonb merge preserves all other
--          props (faqs, title, showGuide, etc.).
-- ============================================

UPDATE cms_page_blocks
SET props = props
  || '{"guideMode":"goat-qa"}'::jsonb
  || '{"guideImage":"/images/ai-tools/Goat-head.png"}'::jsonb
WHERE page_id = '936f420b-ee5b-461e-9b4e-cf5b19f84882'
  AND component_name = 'FAQSectionBlock'
  AND sort_order = 19;

-- Verify:
-- SELECT sort_order, props->>'guideMode' AS guide_mode, props->>'guideImage' AS guide_image
-- FROM cms_page_blocks
-- WHERE page_id = '936f420b-ee5b-461e-9b4e-cf5b19f84882'
--   AND component_name = 'FAQSectionBlock' AND sort_order = 19;

-- End of Homepage FAQ → goat-qa guide mode
-- ============================================
```

- [ ] **Step 2: Apply the UPDATE via the Main Supabase MCP tool**

Use `mcp__Main_Supabase_Project__execute_sql` with the `UPDATE` statement above (data change, not DDL).
Expected: 1 row updated.

- [ ] **Step 3: Verify**

Use `mcp__Main_Supabase_Project__execute_sql` with the verify SELECT (commented above).
Expected: one row → `guide_mode = goat-qa`, `guide_image = /images/ai-tools/Goat-head.png`.

- [ ] **Step 4: Commit the data-change doc**

```bash
git add docs/database/main-supabase/data-changes/2026-06-24-homepage-faq-goat-qa.sql
git commit -m "docs(db/main): record homepage FAQ goat-qa props update"
```

---

### Task 7: Verify end-to-end + visual check

**Files:** none (verification).

- [ ] **Step 1: Point local dev at Main**

Run: `npm run switch main`
Expected: `.env.local` regenerated for the Main institution.

- [ ] **Step 2: Run the e2e suite (now expected to pass)**

Run: `npx playwright test goat-faq --project=chromium`
Expected: all 5 tests PASS (Playwright auto-starts `npm run dev`; the homepage block is now goat-qa).

- [ ] **Step 3: Visual confirmation**

Run: `npm run dev:main`, open `http://localhost:3000/`, scroll to the FAQ. Confirm: cropped goat (no white box, transparent), gentle idle bob, the goat "asks" Q1, "Show answer" reveals it, Prev/Next cycle with the nod + bubble pop, progress reads `n / 10`, and the section looks right on a narrow (mobile) viewport.

- [ ] **Step 4: Pre-merge typecheck/build**

Run: `npx tsc --noEmit` (fast gate). Optionally `npm run build` before merging to `master`.
Expected: PASS.

- [ ] **Step 5: Finalize**

No new code expected here. If Step 3 surfaced framing/spacing tweaks, make them in `goat-guided-faq.tsx` (or re-tune `scripts/crop-goat-head.ts`), re-run Step 2, and commit:

```bash
git add -A
git commit -m "fix(faq): polish goat-guided FAQ after visual review"
```

---

## Notes for the implementer

- Skills to load before coding: `nextjs16-web-development` (component/build conventions), `jkkn-design-system` / `brand-styling` (tokens), `database-documentation-workflow` (Task 6).
- Do NOT add a unit-test framework; this repo tests via Playwright e2e + `tsc`. Don't introduce jest/vitest (YAGNI).
- The hidden duplicate FAQ block (`sort_order=16`, `is_visible=false`) is intentionally left untouched.
- If you prefer the goat to greet first and ask on the first tap (instead of asking Q1 immediately), that is a small change in `GoatGuidedFAQ` — out of scope unless the user requests it.
