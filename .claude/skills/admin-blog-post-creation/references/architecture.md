# Blog Post Architecture (JKKN)

Read the live files before relying on this; line numbers drift.

## Key files

| Concern | File |
|---------|------|
| New-post page | `app/(admin)/admin/content/blog/new/page.tsx` |
| Edit-post page | `app/(admin)/admin/content/blog/[id]/edit/page.tsx` |
| The form (all tabs, state, image wiring) | `app/(admin)/admin/content/blog/blog-post-form.tsx` |
| Rich text editor (TipTap) | `components/ui/rich-text-editor.tsx` (+ `rich-text-editor-lazy.tsx`) |
| Table tools | `components/ui/rich-text-editor/table-template-picker.tsx`, `table-properties-dialog.tsx`, `extensions/table-cell-merge.ts` |
| Image gallery extension | `components/ui/rich-text-editor/extensions/image-gallery.ts` |
| Media picker (pick + upload tabs) | `components/cms/media-picker-modal.tsx` |
| Blog server actions | `app/actions/cms/blog.ts` |
| Media server actions | `app/actions/cms/media.ts` |
| Public post page + renderer | `app/(public)/blog/[slug]/page.tsx` (`ContentRenderer`) |
| Prose spacing rules | `app/globals.css` (search `.prose`) |
| Categories / tags actions | `app/actions/cms/blog-categories.ts`, `blog-tags.ts` |

## Content storage format

- Editor emits **HTML** via `editor.getHTML()`. The form posts it through a hidden input
  `name="content"`.
- `createBlogPost` / `updateBlogPost` save it as `blog_posts.content = { type: 'html', html: '<...>' }`.
- The form's `toEditorContent()` unwraps `{type:'html',html}` back to a string when editing.
- Legacy posts may hold ProseMirror JSON; `ContentRenderer` and `calculateReadingTime` still handle that
  branch, but new posts are HTML.

## Size limit (the #1 save failure)

- Form: warns at **2.0MB**, blocks submit at **2.5MB** (`WARN_SIZE_MB` / `MAX_SIZE_MB`), with toasts.
- Server: `contentSizeValidator` in `blog.ts` re-checks `< 2.5MB` and returns the same guidance.
- Root cause when hit: base64-embedded images. Fix: insert images as media-library URLs instead.

## Image flow (media-library-first)

- `MediaPickerModal` has a **Library** tab and an **Upload** tab. Upload tab: `handleUpload` →
  `supabase.storage.upload(...)` → records metadata via `uploadMedia(...)` (`media.ts`) → auto-selects.
- The blog form routes picks by `mediaTarget`: `featured`, `og`, `content` (inserts inline at cursor via
  `contentImageInsertCallback`), `gallery` (multi-insert).
- Inserted value is `MediaItem.file_url`; `alt` comes from `alt_text || original_name`. Set `alt_text`
  when uploading.

## Public render + spacing

- `ContentRenderer`: if `content.type === 'html'` → `<div dangerouslySetInnerHTML={{__html: content.html}}/>`.
- Wrapped in `app/(public)/blog/[slug]/page.tsx` as:
  `<article class="bg-gray-50 rounded-2xl p-6 md:p-8 ..."><div className="prose prose-lg max-w-none">`,
  inside a `max-w-4xl mx-auto` column.
- **`@tailwindcss/typography` is NOT installed.** `app/globals.css` manually restores spacing because
  Tailwind Preflight zeroes margins. Styled elements include:
  - base `.prose`, `.prose h1`–`h4`, `.prose p` (`margin-bottom: 1.25rem`), **`.prose p:empty`**
    (`0.5rem` — empty paragraphs are intentional spacers), `.prose li`, `.prose ul`/`ol`.
  - `.prose blockquote` (green `#0b6d41` left border), `.prose a` (green), `.prose strong`.
  - `.prose table` (`margin: 2rem 0`, full width, collapsed), `.prose thead` (green bg),
    `th`/`td` (green header, padded cells), `tbody tr` hover, `td:first-child` bold,
    `thead/tbody th/td p { margin-bottom: 0 }`, `td em` (green emphasis).
  - **Mobile:** `@media` → `.prose table { display:block; overflow-x:auto; white-space:nowrap }`.
  - **Gap:** there is **no `.prose img` / `figure` rule** — images get no automatic margin. Space them
    with empty paragraphs or editor alignment, or add a rule globally (out of scope for authoring).

## Permissions

- `app/actions/cms/blog.ts` `canActOnBlogPost`: a user may act if they hold the `cms:blog:*` permission
  OR are the post's `author_id` / `created_by` / a `co_authors` member. This lets faculty-admin (often
  `guest` role) manage their own posts. Mirrors the `blog_posts_author_*` RLS policies.

## Status / scheduling

- `status`: `draft | published | scheduled | archived`. `scheduled` needs `scheduled_at`; publishing sets
  `published_at`. `visibility`: `public | private | password_protected`.
