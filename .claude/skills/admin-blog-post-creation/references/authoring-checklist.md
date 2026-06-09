# Blog Authoring Checklist — Spacing, Images, Tables (JKKN)

The public page renders post HTML through `.prose prose-lg` (hand-defined in `app/globals.css`, no
typography plugin). "Proper spacing" = authoring with the elements that `.prose` actually styles.

## Spacing: DO

- Use **H2** for sections, **H3** for sub-sections. (H1 is reserved for the post title.)
- Write body as **paragraphs**; the editor wraps them in `<p>` which gets `margin-bottom: 1.25rem`.
- Use the toolbar **bullet / numbered list** buttons → `<ul>`/`<ol>` are styled with proper indent.
- Use the **quote** button for callouts → `.prose blockquote` gets the green left border.
- Need a little extra gap between elements → insert an **empty paragraph** (`.prose p:empty` = 0.5rem
  spacer). This is the sanctioned way to add breathing room.
- Use **bold** (`<strong>`) for emphasis — it is styled darker by `.prose strong`.

## Spacing: DON'T

- Don't paste from Word / Google Docs without **Clear formatting** — pasted inline styles and `<div>`s
  override `.prose` and produce cramped or inconsistent spacing.
- Don't wrap text in `<div>` or add inline `style="margin/padding"` — `.prose` targets semantic tags, so
  custom wrappers get no spacing.
- Don't use H1 inside the body (duplicate-H1 hurts SEO and the H1 rule has large top margin meant for
  page titles).
- Don't simulate spacing with many `<br>` — use empty paragraphs.

## Images

- **Upload to the media library first** (Media page or the picker's Upload tab). Insert via the editor's
  **Image** (single) or **Images/Gallery** (multi) button → the picker → it inserts the media URL.
- **Never** paste a screenshot or drag a raw file into the text body — that embeds base64 and will push
  the post over the 2.5MB limit so it won't save.
- Always set **alt text** (on upload, or it falls back to the file name).
- There is **no `.prose img` spacing rule**: if an image hugs the text, add an empty paragraph above and
  below it. Use the editor's alignment for left/center/right.
- The **featured image** (Content tab) and **og_image** (SEO tab) are separate from inline images — set
  them via their own pickers.

## Tables

- Build with the **Table template picker** (pre-sized starters), refine with the **Table properties
  dialog**; cell-merge is available. Don't hand-type raw `<table>` HTML.
- The **header row and first column are auto-emphasized** by `.prose` (green header, bold first cell) —
  don't manually bold them.
- Keep tables reasonably narrow. On mobile `.prose table` switches to `display:block; overflow-x:auto`
  (horizontal scroll) — wide tables scroll instead of breaking layout, but very wide tables are still a
  poor mobile experience, so prefer fewer columns.
- Cell text is wrapped in `<p>` with `margin-bottom: 0`, so cells stay tight — that's expected.

## Size budget

- Target < **2.0MB** content (warning threshold); hard cap **2.5MB**. The size meter in the form shows
  current usage. If it climbs, a base64 image is almost always the cause.

## Before publishing

- Status = `published` (or `scheduled` + date). Category + at least one tag set. SEO title/description
  filled. Reading time calculated. Then verify on `/blog/<slug>` (desktop + mobile).
