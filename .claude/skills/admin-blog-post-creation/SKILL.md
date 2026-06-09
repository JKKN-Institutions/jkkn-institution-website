---
name: admin-blog-post-creation
description: Repeatable workflow for creating a blog post in the JKKN admin panel blog module so content, images, tables, and spacing come out correct and consistent every time. This skill should be used when the user asks to "create a blog post", "add a new post", "write a blog article", "upload blog content and images", "fix blog post spacing", or insert tables/images into a post. Enforces the media-library-first image flow (the fix for the 2.5MB content limit and broken layouts from base64), the semantic-HTML authoring rules that make the public page's prose styling space content correctly, and the editor's Table and Image components. Covers the admin form, the TipTap editor, the {type:'html',html} storage format, and the public render path.
---

# Admin Blog Post Creation (JKKN Institution Website)

## Purpose

Make blog-post creation a consistent, repeatable process instead of trial-and-error. Posts that look
right and save reliably all follow the same three habits: **upload images to the media library first**
(never paste/base64), **author with semantic blocks** (H2/H3, paragraphs, lists) so the public page's
`.prose` styles space them correctly, and **insert tables/images through the editor's own components**.
This skill encodes those habits plus the full create-and-publish flow.

## When to use

- "Create / add / write a blog post or article"
- "Upload content and images for a post"
- "Insert a table / image into a blog post"
- "Fix spacing / layout in a blog post"
- "My post won't save" / "content too large" errors

Not for: CMS marketing pages (`cms-page-creation`), reusable blocks (`cms-block-creation`), or admin
list/table scaffolding (`admin-crud-pages`).

## How the blog pipeline works (know this before authoring)

```
/admin/content/blog/new  ->  BlogPostForm (app/(admin)/admin/content/blog/blog-post-form.tsx)
   ├─ RichTextEditor (TipTap, components/ui/rich-text-editor.tsx)  -> emits HTML (editor.getHTML())
   ├─ MediaPickerModal (components/cms/media-picker-modal.tsx)     -> inserts media-library URLs
   └─ createBlogPost (app/actions/cms/blog.ts)  -> saves blog_posts.content as { type:'html', html }
Public: app/(public)/blog/[slug]/page.tsx -> ContentRenderer -> dangerouslySetInnerHTML
        inside  <article ...><div className="prose prose-lg max-w-none">   ← spacing lives here
```

Two facts that explain most problems (details in `references/architecture.md`):

1. **2.5MB content cap** (warns at 2.0MB), enforced in the form AND server-side. Embedding images as
   base64 blows it instantly → the post won't save. Media-library images are URLs (tiny), so they never
   count against the cap.
2. **Spacing comes from `.prose`**, which this project hand-defines in `app/globals.css` (the
   `@tailwindcss/typography` plugin is NOT installed). Only the elements styled there get correct
   spacing. Author with those elements; don't inline-style blocks.

## Workflow

### Step 1 — Prepare images in the Media Library first
Gather every image the post needs and upload them before writing. Upload either on the Media page
(`/admin/content/media`) or directly via the **Upload tab inside the MediaPickerModal** while inserting.
Set `alt_text` on each (used for accessibility + inserted `alt`). This single habit prevents the 2.5MB
save failures.

### Step 2 — Create the post (Content tab)
Go to `/admin/content/blog/new`. Fill: **title** (slug auto-generates; keep lowercase-hyphen),
**excerpt** (≤500 chars; shown above the article), **featured image** (via media picker → `featured`
target). Author the body in the editor following Step 3.

### Step 3 — Author the body for correct spacing
Use real blocks so `.prose` spaces them:
- Section structure: **H2** for major sections, **H3** for sub-sections (not H1 — the post title is the
  page H1).
- Body: plain **paragraphs**. Lists via the bullet/number toolbar buttons. Quotes via the quote button.
- Do **not** paste styled HTML from Word/Docs or wrap text in `<div>`/inline styles — that fights
  `.prose` and looks cramped. Use the editor's "Clear formatting" if pasting.
- Need extra vertical gap? An empty paragraph is a deliberate small spacer (`.prose p:empty` is styled).
See `references/authoring-checklist.md` for the full do/don't list.

### Step 4 — Insert inline images (editor Image / Image Gallery)
Use the editor's **Image** button (single, `content` target) or **Images/Gallery** button (multi) →
MediaPickerModal → pick or upload → it inserts the media URL at the cursor. Never drag-drop a raw file
into the text or paste a screenshot (that base64-embeds it). Note: there is **no `.prose img` spacing
rule**, so add an empty paragraph above/below an image if it sits too tight, and rely on the editor's
alignment buttons for placement.

### Step 5 — Insert tables (editor Table tools)
Use the **Table template picker** (`table-template-picker.tsx`) to drop a pre-sized table, then the
**Table properties dialog** for header rows / column tweaks; cell-merge is supported. Keep tables
reasonably narrow — `.prose table` becomes horizontally scrollable on mobile (`display:block;
overflow-x:auto`), so very wide tables scroll rather than break the layout. The first column and header
row are auto-emphasized by `.prose` styles; don't hand-bold them.

### Step 6 — Watch the size meter
Keep content under **2.0MB** (warning) / **2.5MB** (hard limit). If warned, the cause is almost always a
base64 image — replace it with a media-library insert.

### Step 7 — SEO tab
Set `seo_title`, `seo_description`, `og_image` (media picker → `og` target), optional `canonical_url`
and keywords. These feed `generateMetadata` and `ArticleSchema` on the public page.

### Step 8 — Settings tab
Pick **category**, add **tags** (search existing or inline-create), set **status**
(`draft` → `published`, or `scheduled` with a date), **visibility**, `is_featured`/`is_pinned`, click
**Calculate reading time**, toggle comments. Save (button is disabled while over the size limit).

### Step 9 — Verify on the public page
Preview `/blog/<slug>`. Confirm: headings/paragraphs are well-spaced, images load from the media library
(not giant/base64), tables render with the green header and scroll on mobile, no overflow, and the post
is `published` if it should be live.

## Red-flag checklist

- [ ] Did I upload images to the media library (Step 1) instead of pasting/base64?
- [ ] Are sections H2/H3 and body plain paragraphs (no inline-styled `<div>`s)?
- [ ] Were inline images inserted via the editor Image/Gallery picker?
- [ ] Were tables made with the Table template picker / properties dialog?
- [ ] Is content under 2.0MB (well below the 2.5MB cap)?
- [ ] SEO fields + category + tags + status set?
- [ ] Verified spacing/tables/images on `/blog/<slug>` desktop AND mobile?

## Bundled resources

- `references/architecture.md` — full pipeline, file paths, storage format, size limits, media flow,
  permissions, and the exact `.prose` rules from `globals.css`.
- `references/authoring-checklist.md` — semantic-HTML / spacing / image / table do's and don'ts.
- `templates/post-structure.html` — a recommended body skeleton that spaces correctly under `.prose`.

## Out of scope (offer as follow-ups)

- Adding a global `.prose img` / `figure` spacing rule to `globals.css` (would improve image spacing
  site-wide) — a code change, not part of authoring.
- Bulk-seeding posts via SQL/server action (would follow `database-documentation-workflow`).
