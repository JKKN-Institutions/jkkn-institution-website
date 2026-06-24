# Goat-Guided FAQ — Design Spec

**Date:** 2026-06-24
**Status:** Awaiting user review
**Scope:** Replace the static "full goat in a white box" FAQ guide on the live homepage with an animated, head-and-shoulders goat mascot that presents the FAQ one question at a time ("goat asks → reveals its answer").

---

## 1. Problem & Context

The live homepage (`https://www.jkkn.ac.in/`) is a **CMS page**, not the hardcoded landing component.

- Home page route: `app/(public)/page.tsx` → `getPageWithVisibility('')` → renders `cms_pages` row `slug='home'` (id `936f420b-ee5b-461e-9b4e-cf5b19f84882`, status `published`) via `PageRenderer`.
- The visible FAQ is a **`FAQSectionBlock`** block (`sort_order: 19`, `is_visible: true`). A hidden duplicate exists at `sort_order: 16` (ignored).
- That block already has: `showGuide: true`, `guideImage: /images/ai-tools/Goat.png`, `guidePosition: left`, `guideCaption: "Hi! I'm your JKKN guide — tap a question."`, 10 FAQs.
- Today it renders through `FAQGuide` inside `components/cms-blocks/content/faq-section-block.tsx`, which drops the **full** `Goat.png` into a **white "portrait" card** with a **static** caption bubble, beside a standard accordion.

`Goat.png` is a **1254×1254, transparent-background** render of an anthropomorphic goat (horns + face at top-center, JKKN streetwear hoodie, standing on a rock).

**The orphaned file** `components/public/landing/faq-section.tsx` is NOT rendered anywhere live (the `LandingPage` fallback uses `homepageHeroTemplate` blocks via `PageRenderer`, not this component). It is explicitly out of scope.

### Goal

On the homepage FAQ block, replace the white-box full-image guide + accordion with a **goat-led Q&A experience**:

1. Show a **cropped head-and-shoulders** goat avatar (no white card), on a transparent background.
2. The goat is **alive**: gentle idle bob, plus a reactive nod and a speech-bubble pop when the question changes.
3. The goat **"asks" one FAQ question** in a speech bubble; the user taps **Show answer** to reveal it, and **Prev / Next** to cycle. This **replaces the accordion** in this mode.

### Non-Goals (YAGNI)

- No change to any other page that uses `FAQSectionBlock` (they keep the accordion).
- No change to the orphaned `components/public/landing/faq-section.tsx`.
- No change to FAQ JSON-LD generation (it is sourced separately from `getInstitutionSEOConfig()`, see §6).
- No new FAQ content; reuse the block's existing 10 `faqs` from the DB.
- No AI/chat/typewriter, no audio, no multi-language. (Can be added later.)

---

## 2. Approach

**Approach B (chosen): a focused shared component, prop-gated on the block.**

- Add a new guide mode to `FAQSectionBlock`: `guideMode: 'portrait' | 'goat-qa'`, default `'portrait'` (fully backward-compatible — every existing block renders exactly as today).
- When `guideMode === 'goat-qa'` (and `faqs.length > 0`), the block renders a new self-contained `<GoatGuidedFAQ>` widget **instead of** the `FAQGuide` + accordion grid. The section shell (header, decorative patterns, optional CTA, curve divider) is unchanged.
- Enable `guideMode: 'goat-qa'` **only on the homepage block** via a documented DB props update (Main project).

This keeps the interactive widget as one isolated, testable unit, leaves the accordion path untouched for all other pages, and reuses the block's existing theming (`isDark`, `accentColor`, `showAnimations`, `isEditing`).

---

## 3. Architecture & Components

```
components/cms-blocks/content/faq-section-block.tsx   (MODIFIED)
  ├─ reads new prop: guideMode ('portrait' | 'goat-qa')
  ├─ guideMode !== 'goat-qa'  → existing behavior (FAQGuide + accordion)  [UNCHANGED]
  └─ guideMode === 'goat-qa'  → renders <GoatGuidedFAQ ... />             [NEW PATH]

components/cms-blocks/content/goat-guided-faq.tsx      (NEW — the shared widget)
  ├─ GoatAvatar       — animated cropped head image (idle bob + nod), framer-motion
  ├─ SpeechBubble     — current question text + tail; pop-in on change
  ├─ Controls         — "Show answer" / "Hide", "Prev", "Next", progress "n / total"
  ├─ AnswerRegion     — revealed answer, aria-live="polite"
  └─ CrawlableList    — visually-hidden <dl> of ALL Q&A for SEO + screen readers

public/images/ai-tools/Goat-head.png                   (NEW asset — cropped avatar)
scripts/crop-goat-head.ts                              (NEW — one-time sharp crop, reproducible)

lib/cms/registry-types.ts                              (MODIFIED — add guideMode to schema)
lib/cms/component-registry.ts                          (MODIFIED — add guideMode editableProp)
tests/e2e/goat-faq.spec.ts                             (NEW — Playwright e2e)
```

### 3.1 `GoatGuidedFAQ` props (interface)

```ts
interface GoatGuidedFAQProps {
  faqs: FAQItem[]            // from block props (reused; { question, answer })
  avatarSrc: string          // cropped head asset, e.g. /images/ai-tools/Goat-head.png
  avatarAlt?: string         // default: "JKKN goat guide"
  greeting?: string          // idle/intro bubble text (reuses guideCaption)
  position?: 'left' | 'right'// desktop side of avatar (reuses guidePosition); default 'left'
  isDark: boolean            // from block (theme)
  accentColor?: string       // from block
  showAnimations?: boolean   // from block; gates idle/reactive motion
  isEditing?: boolean        // page-builder mode → static, no autoplay
}
```

### 3.2 State (inside `GoatGuidedFAQ`)

- `currentIndex: number` (0-based; starts at 0).
- `isAnswerShown: boolean` (starts `false` → goat "asks" before answering; resets to `false` on question change).
- Derived: `total = faqs.length`, `isFirst`, `isLast`.

### 3.3 Controls / behavior

- The speech bubble shows `faqs[currentIndex].question` (or `greeting` before any interaction is optional — default: show first question immediately so the goat is "asking" on load).
- **Show answer** toggles `isAnswerShown`; the answer renders below/within the bubble area.
- **Next / Prev** change `currentIndex` (clamped) and reset `isAnswerShown=false`; the goat does a quick nod and the bubble re-pops.
- Progress indicator: `"{currentIndex+1} / {total}"`.
- `total <= 1` → hide Prev/Next.
- No auto-advance/autoplay (avoids motion fatigue; revisit later if desired).

### 3.4 Layout (responsive)

- **Desktop (lg+):** two columns — avatar on `position` side (`left` default), bubble + controls + answer on the other. Avatar ~160–200px.
- **Mobile (<lg):** stacked — avatar centered on top, bubble + controls below. Avatar ~120–140px.
- Reuses the block's glassmorphism card styling (`bg-white/5 ... border-white/10` on dark; `bg-white/80 ...` on light) for the bubble/answer container so it matches the section.

---

## 4. The cropped goat asset

- Source: `public/images/ai-tools/Goat.png` (1254×1254, transparent).
- Output: `public/images/ai-tools/Goat-head.png` — a **square head-and-shoulders** crop (horns + face + top of hoodie), transparent background preserved.
- Method: `scripts/crop-goat-head.ts` using `sharp` (already a dependency).
  - Starting crop region (top-center; **to be visually verified/tuned during implementation**): `extract({ left: 367, top: 24, width: 520, height: 520 })`, then optionally `resize(512, 512)`.
  - Run once via `tsx`; the generated `Goat-head.png` is committed to the repo. The script stays in `scripts/` for reproducibility.
- No `next.config.ts` change needed (local `public/` asset). Rendered via `next/image`.
- `guideImage` for the homepage block is updated to `/images/ai-tools/Goat-head.png` so the editor's "guide image" field reflects the actual avatar (and the `portrait` mode, if ever re-enabled, would show the head too — acceptable).

---

## 5. Animation spec (framer-motion, already installed)

- **Idle:** avatar loops a subtle vertical bob (`y: [0, -6, 0]`, ~3s, `easeInOut`, infinite) — "breathing/alive".
- **Reactive:** on question change, a quick nod (`rotate`/`y` keyframe, ~400ms) + the speech bubble pops in (`opacity 0→1`, `scale 0.96→1`, ~250ms).
- **Show answer:** answer height/opacity transition (~250ms).
- **Reduced motion:** `useReducedMotion()` → disable the idle loop and reaction; bubble/answer appear instantly (opacity only). This is a hard requirement.
- Gated by `showAnimations` (block prop) and `isEditing` (no idle loop in the page-builder canvas to avoid distracting editors).

---

## 6. SEO & Accessibility

- **JSON-LD unaffected:** the FAQ rich result is built by `components/seo/faq-schema.tsx` from `getInstitutionSEOConfig().faqs`, independent of this block. No change, no regression there.
- **Crawlable content parity:** the goat-qa widget renders **all** Q&A pairs in the DOM as a visually-hidden semantic list (`<dl>` with `sr-only`), in addition to the interactive active view. Crawlers and screen readers get the full content; the orphaned-content risk of a one-at-a-time carousel is avoided.
- **A11y:**
  - Avatar `<Image alt>` is descriptive but the decorative motion is `aria-hidden` where appropriate.
  - Answer region uses `aria-live="polite"` so reveals are announced.
  - "Show answer", "Prev", "Next" are real `<button>`s with `aria-label`s; question text is a heading or has an accessible label; current question announced.
  - Keyboard: buttons are focusable/operable; Left/Right arrow shortcuts are a nice-to-have (optional).
  - Color contrast follows existing tokens (gold/primary on the themed card).

---

## 7. Data / config change (DB)

Enable the mode on the live homepage block (Main Supabase, project `pmqodbfhsejbvfbmsfeq`):

- Target: `cms_page_blocks` where `page_id = '936f420b-ee5b-461e-9b4e-cf5b19f84882'`, `component_name = 'FAQSectionBlock'`, `sort_order = 19`.
- Set `props.guideMode = 'goat-qa'` and `props.guideImage = '/images/ai-tools/Goat-head.png'` (jsonb merge; leave all other props intact).
- Per the project's **database-documentation-workflow**, the exact `UPDATE` SQL is documented under `docs/database/main-supabase/` (data-change note) **before** execution via the Main Supabase MCP tool.
- Main only (the goat is JKKN-branded and the homepage is the main institution). No multi-institution sync.
- The hidden block at `sort_order: 16` is left untouched.

---

## 8. Backward compatibility & edge cases

- `guideMode` absent / `'portrait'` → identical to current behavior everywhere (default in schema and component).
- `faqs` empty → same as today (render nothing when not editing; placeholder when editing).
- Single FAQ → Prev/Next hidden; Show answer still works.
- `isEditing` (page builder) → static first question, all controls visible, no idle loop.
- Avatar image fails to load → `next/image` alt text shows; container keeps min dimensions so layout doesn't collapse.
- Toggling back to `portrait` later → still valid (no data loss).

---

## 9. Testing

- **Playwright e2e** (`tests/e2e/goat-faq.spec.ts`), against the homepage:
  - Goat avatar image present with `src` ending `Goat-head.png`.
  - Speech bubble shows the first question on load; answer hidden initially.
  - Click "Show answer" → answer text visible.
  - Click "Next" → second question shown, answer hidden again; progress reads "2 / 10".
  - All 10 questions + answers present in the DOM (crawlable list).
  - Emulate `prefers-reduced-motion: reduce` → no idle animation class/loop; content still fully usable.
- **Visual check:** load the homepage locally (`npm run dev:main`) and confirm crop framing, alignment, dark-section legibility, mobile stacking.
- **Build:** `npm run build` passes (TypeScript strict).

---

## 10. File change summary

| File | Change |
|---|---|
| `scripts/crop-goat-head.ts` | NEW — sharp crop Goat.png → Goat-head.png (run once) |
| `public/images/ai-tools/Goat-head.png` | NEW — committed cropped avatar |
| `components/cms-blocks/content/goat-guided-faq.tsx` | NEW — shared goat-led Q&A widget |
| `components/cms-blocks/content/faq-section-block.tsx` | MODIFIED — `guideMode` prop; render `GoatGuidedFAQ` in `goat-qa` mode |
| `lib/cms/registry-types.ts` | MODIFIED — add `guideMode` to `FAQSectionPropsSchema` |
| `lib/cms/component-registry.ts` | MODIFIED — add `guideMode` editableProp (enum select) |
| `tests/e2e/goat-faq.spec.ts` | NEW — e2e coverage |
| `docs/database/main-supabase/` | NEW data-change note documenting the homepage props `UPDATE` |
| Main Supabase `cms_page_blocks` (block #19) | DATA — set `guideMode='goat-qa'`, `guideImage` → head asset |

---

## 11. Open questions / assumptions

- Crop coordinates in §4 are a starting estimate and will be tuned by inspecting the generated `Goat-head.png` (deterministic once chosen).
- Default bubble-on-load = the **first question** (goat "asks" immediately). `guideCaption` is repurposed as an optional intro/greeting; if we'd rather show the greeting first and the question after a tap, that's a small tweak — flagged for review.
- Skills to load at implementation time: `nextjs16-web-development` (component/build), `jkkn-design-system`/`brand-styling` (tokens), `database-documentation-workflow` (the props UPDATE), and `cms-block-creation` patterns for the registry/schema edits.
