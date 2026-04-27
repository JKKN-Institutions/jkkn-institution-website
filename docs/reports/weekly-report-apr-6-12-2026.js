const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak } = require("docx");

// ─── Colors ───
const BRAND_GREEN = "0B6D41";
const DARK_GREEN = "084D2E";
const HEADER_BG = "E8F5EE";
const LIGHT_BG = "F8FDF9";
const BORDER_CLR = "B8D4C8";
const GRAY = "555555";
const BLACK = "000000";
const WHITE = "FFFFFF";

// ─── Reusable ───
const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER_CLR };
const cellBorders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function headerCell(text, width) {
  return new TableCell({
    borders: cellBorders, width: { size: width, type: WidthType.DXA },
    shading: { fill: BRAND_GREEN, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 },
      children: [new TextRun({ text, bold: true, color: WHITE, size: 20, font: "Arial" })] })]
  });
}

function dataCell(text, width, opts = {}) {
  return new TableCell({
    borders: cellBorders, width: { size: width, type: WidthType.DXA },
    shading: opts.shade ? { fill: LIGHT_BG, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ spacing: { before: 40, after: 40 },
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text, size: 20, font: "Arial", bold: !!opts.bold, color: opts.color || BLACK })] })]
  });
}

function sectionTitle(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, color: BRAND_GREEN, font: "Arial" })] });
}

function subTitle(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: DARK_GREEN, font: "Arial" })] });
}

function bodyText(text) {
  return new Paragraph({ spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 21, font: "Arial", color: "333333" })] });
}

function bulletItem(text, ref) {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: "333333" })] });
}

function metricRow(label, value, shade) {
  return new TableRow({ children: [
    dataCell(label, 5400, { shade, bold: true }),
    dataCell(value, 3960, { shade, center: true, bold: true, color: BRAND_GREEN })
  ]});
}

// ─── Build Document ───
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: BRAND_GREEN, font: "Arial" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: BRAND_GREEN, font: "Arial" },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: DARK_GREEN, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "nums-feat", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "nums-bug", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "nums-tech", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ─── COVER / HEADER SECTION ───
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({ children: [
          new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0 },
            children: [new TextRun({ text: "JKKN Institution Website", size: 18, color: GRAY, font: "Arial", italics: true })] })
        ] })
      },
      footers: {
        default: new Footer({ children: [
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", size: 18, color: GRAY, font: "Arial" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRAY, font: "Arial" }),
              new TextRun({ text: " of ", size: 18, color: GRAY, font: "Arial" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: GRAY, font: "Arial" }),
            ] })
        ] })
      },
      children: [
        // ── Title block ──
        new Paragraph({ spacing: { before: 600, after: 0 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "WEEKLY DEVELOPMENT REPORT", size: 44, bold: true, color: BRAND_GREEN, font: "Arial" })] }),
        new Paragraph({ spacing: { before: 80, after: 200 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "JKKN Institution Website — Main & Engineering", size: 26, color: GRAY, font: "Arial" })] }),

        // ── Divider ──
        new Table({
          columnWidths: [9360],
          rows: [new TableRow({ children: [new TableCell({
            borders: { top: noBorder, bottom: { style: BorderStyle.SINGLE, size: 3, color: BRAND_GREEN }, left: noBorder, right: noBorder },
            width: { size: 9360, type: WidthType.DXA },
            children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: " ", size: 4 })] })]
          })] })]
        }),

        // ── Report Metadata ──
        new Paragraph({ spacing: { before: 300 } }),
        new Table({
          columnWidths: [3200, 6160],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 3200, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Developer:", bold: true, size: 22, color: DARK_GREEN, font: "Arial" })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6160, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Sangeetha V", size: 22, font: "Arial" })] })] }),
            ] }),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 3200, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Reporting Period:", bold: true, size: 22, color: DARK_GREEN, font: "Arial" })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6160, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "April 6 \u2013 12, 2026", size: 22, font: "Arial" })] })] }),
            ] }),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 3200, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Report Date:", bold: true, size: 22, color: DARK_GREEN, font: "Arial" })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6160, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "April 12, 2026", size: 22, font: "Arial" })] })] }),
            ] }),
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 3200, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "Project:", bold: true, size: 22, color: DARK_GREEN, font: "Arial" })] })] }),
              new TableCell({ borders: noBorders, width: { size: 6160, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "JKKN Institution Website (Main + Engineering)", size: 22, font: "Arial" })] })] }),
            ] }),
          ]
        }),

        // ═══════════════════════════════════════════════
        // 1. EXECUTIVE SUMMARY
        // ═══════════════════════════════════════════════
        new Paragraph({ spacing: { before: 480 } }),
        sectionTitle("1. Executive Summary"),
        bodyText("This report covers development activity for the JKKN Institution Website project across both the Main and Engineering websites during the week of April 6\u201312, 2026."),

        new Paragraph({ spacing: { before: 200 } }),
        new Table({
          columnWidths: [5400, 3960],
          rows: [
            new TableRow({ children: [headerCell("Metric", 5400), headerCell("Value", 3960)] }),
            metricRow("Total Commits", "27", true),
            metricRow("Files Changed", "303", false),
            metricRow("Lines Added", "5,700", true),
            metricRow("Lines Removed", "13,633", false),
            metricRow("Net Code Change", "-7,933 lines (code simplification)", true),
            metricRow("Active Working Days", "5 of 7", false),
            metricRow("Features Delivered", "12", true),
            metricRow("Bugs Fixed", "15", false),
          ]
        }),

        new Paragraph({ spacing: { before: 200 } }),
        bodyText("The net reduction of 7,933 lines reflects significant code simplification \u2014 removing over-engineered animations, unused variant systems, and stale documentation while delivering more functionality with cleaner code."),

        // ═══════════════════════════════════════════════
        // 2. ENGINEERING WEBSITE
        // ═══════════════════════════════════════════════
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("2. Engineering Website Tasks"),
        bodyText("5 commits focused on content quality, SEO, admin tooling, and data accuracy for the Engineering College website."),

        // 2.1 Faculty Admin Panel
        new Paragraph({ spacing: { before: 200 } }),
        subTitle("2.1 Faculty Admin Panel (New Feature)"),
        bodyText("Built a complete faculty management system with full CRUD operations, enabling engineering college administrators to manage faculty profiles without developer intervention."),
        new Paragraph({ spacing: { before: 100 } }),
        bulletItem("Created admin panel at /admin/faculty/ with form, table, and detail views", "bullets"),
        bulletItem("Built dedicated faculty-admin portal at /faculty-admin/manage/ with separate layout and header", "bullets"),
        bulletItem("Added public-facing faculty listing page (/faculty/) and individual profile view (/faculty/[slug]/)", "bullets"),
        bulletItem("Implemented faculty server actions for create, update, and delete operations", "bullets"),
        bulletItem("Made faculty admin table fully responsive for mobile devices", "bullets"),
        bulletItem("Added profile photo upload and editing functionality", "bullets"),
        bodyText("Impact: 61 files changed, +3,546 lines added, -11,405 lines removed (includes cleanup of 3 stale documentation files)."),

        // 2.2 Real Campus Photos
        new Paragraph({ spacing: { before: 200 } }),
        subTitle("2.2 Real Campus Photo Migration"),
        bodyText("Replaced all stock/placeholder images across the engineering website with 109 authentic campus photographs."),
        new Paragraph({ spacing: { before: 100 } }),
        bulletItem("Added real photos for: Library, Senthuraja Hall, Classrooms, CSE Lab, ECE Lab, EEE Lab, IT Lab, Mechanical Lab, R&D Lab", "bullets"),
        bulletItem("Updated all image references in homepage template, facilities seeder, course pages, and CMS block components", "bullets"),
        bulletItem("Removed dependency on external Unsplash URLs for better reliability and page load performance", "bullets"),
        bodyText("Impact: 123 files changed (109 new images + 14 code reference updates)."),

        // 2.3 SEO
        new Paragraph({ spacing: { before: 200 } }),
        subTitle("2.3 SEO Regional Keywords"),
        bodyText("Added 62 Tamil Nadu-specific long-tail keywords to improve search engine discoverability for regional queries."),
        new Paragraph({ spacing: { before: 100 } }),
        bulletItem("Targeted phrases like \"top mechanical engineering colleges in tamilnadu\", \"best CSE college near Erode\"", "bullets"),
        bulletItem("Applied across 7 course pages: BE CSE, ECE, EEE, Mechanical, B.Tech IT, ME CSE, MBA", "bullets"),
        bulletItem("Keywords added to metadata.keywords arrays for proper SEO indexing", "bullets"),
        bodyText("Impact: 7 files changed, +63 lines."),

        // 2.4 Fee Structure
        new Paragraph({ spacing: { before: 200 } }),
        subTitle("2.4 Fee Structure Data Fix"),
        bodyText("Aligned the FeeEntry TypeScript type and data with the new fee structure that splits fees by Government Quota (GQ) and Management Quota (MQ) per category."),
        new Paragraph({ spacing: { before: 100 } }),
        bulletItem("Updated FeeEntry type to include category, gqFee, and mqFee fields", "bullets"),
        bulletItem("Fixed TypeScript build error where engineering page read f.category on a stale type", "bullets"),
        bulletItem("Categories covered: UG, PG, and Lateral Entry", "bullets"),
        bodyText("Impact: 3 files changed, +82 / -30 lines."),

        // 2.5 ME CSE Curriculum
        new Paragraph({ spacing: { before: 200 } }),
        subTitle("2.5 ME CSE Curriculum Enhancement"),
        bodyText("Enhanced the ME CSE course page with tabbed curriculum view and added real lab images across all departments."),
        new Paragraph({ spacing: { before: 100 } }),
        bulletItem("Added tab-based Year 1 / Year 2 curriculum view for ME CSE", "bullets"),
        bulletItem("Standardized section padding (py-16 md:py-20) across all engineering course pages", "bullets"),
        bulletItem("Added real lab images for CSE, ECE, EEE, MECH, and IT departments", "bullets"),
        bulletItem("Added contact page for engineering website", "bullets"),
        bodyText("Impact: 102 files changed, +638 / -307 lines."),

        // ═══════════════════════════════════════════════
        // 3. MAIN WEBSITE — FACILITY PAGES
        // ═══════════════════════════════════════════════
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("3. Main Website \u2014 Facility Page Redesigns"),
        bodyText("Six facility pages were completely redesigned with a consistent, modern design language. All pages now share a unified visual pattern for brand consistency."),

        new Paragraph({ spacing: { before: 160 } }),
        subTitle("3.1 Design System Applied"),
        bulletItem("Green hero banner with badge, title, subtitle, and curved bottom transition", "bullets"),
        bulletItem("Multi-image gallery (3-column responsive grid) replacing single hero images", "bullets"),
        bulletItem("Clean white cards for all content sections with consistent spacing", "bullets"),
        bulletItem("Feature cards with auto-mapped icons in 3-column grid layouts", "bullets"),
        bulletItem("Fully responsive layouts for mobile, tablet, and desktop breakpoints", "bullets"),
        bulletItem("CMS inline editor support preserved for all components", "bullets"),
        bulletItem("Removed all IntersectionObserver animations (caused visibility bugs at page top)", "bullets"),
        bulletItem("Removed dark/light variant complexity, decorative circles, glass/solid/gradient card styles", "bullets"),

        // Pages table
        new Paragraph({ spacing: { before: 200 } }),
        subTitle("3.2 Pages Redesigned"),
        new Table({
          columnWidths: [2000, 4200, 3160],
          rows: [
            new TableRow({ children: [
              headerCell("Page", 2000), headerCell("Key Changes", 4200), headerCell("Code Impact", 3160)
            ] }),
            new TableRow({ children: [
              dataCell("Hostel", 2000, { shade: true, bold: true }),
              dataCell("Bento image gallery, pill-style tab switcher (boys/girls), feature cards with icons, smooth animations", 4200, { shade: true }),
              dataCell("+313 / -212 lines + 4 follow-up fixes", 3160, { shade: true }),
            ] }),
            new TableRow({ children: [
              dataCell("Ambulance", 2000, { bold: true }),
              dataCell("Red emergency contact banner with pulsing icon, side-by-side image+text layout, brand green/yellow colors", 4200),
              dataCell("+229 / -196 lines + 3 follow-up fixes", 3160),
            ] }),
            new TableRow({ children: [
              dataCell("Food Court", 2000, { shade: true, bold: true }),
              dataCell("3-column image grid, feature cards with auto-mapped food icons, highlights as check-mark cards", 4200, { shade: true }),
              dataCell("Combined: +272 / -559 lines", 3160, { shade: true }),
            ] }),
            new TableRow({ children: [
              dataCell("Auditorium", 2000, { bold: true }),
              dataCell("Image + content layout, feature cards in grid, removed dark/light variant complexity", 4200),
              dataCell("(same commit as Food Court)", 3160),
            ] }),
            new TableRow({ children: [
              dataCell("Classroom", 2000, { shade: true, bold: true }),
              dataCell("Multi-image gallery, feature cards with icon mapping, backwards compatible with heroImage prop", 4200, { shade: true }),
              dataCell("+110 / -258 lines", 3160, { shade: true }),
            ] }),
            new TableRow({ children: [
              dataCell("Library", 2000, { bold: true }),
              dataCell("3-column photo gallery, resource stats grid, sections + services side by side, librarian contact card", 4200),
              dataCell("+119 / -462 lines", 3160),
            ] }),
          ]
        }),

        bodyText("All redesigned components have updated Zod schemas in the CMS component registry (lib/cms/component-registry.ts) to support the new multi-image prop structure."),

        // ═══════════════════════════════════════════════
        // 4. BLOG SYSTEM FIXES
        // ═══════════════════════════════════════════════
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("4. Blog System Fixes"),
        bodyText("Four commits resolved a chain of related issues in the blog content pipeline after the rich text editor was upgraded to output HTML instead of ProseMirror JSON."),

        new Paragraph({ spacing: { before: 200 } }),
        new Table({
          columnWidths: [600, 2600, 3600, 2560],
          rows: [
            new TableRow({ children: [
              headerCell("#", 600), headerCell("Issue", 2600), headerCell("Root Cause & Fix", 3600), headerCell("Impact", 2560)
            ] }),
            new TableRow({ children: [
              dataCell("1", 600, { center: true, shade: true }),
              dataCell("Blog post creation failed with \"Invalid content format\"", 2600, { shade: true }),
              dataCell("Server action called JSON.parse() on HTML output from TipTap editor. Fixed to handle both HTML and JSON formats.", 3600, { shade: true }),
              dataCell("2 files, +22 / -23 lines", 2560, { shade: true }),
            ] }),
            new TableRow({ children: [
              dataCell("2", 600, { center: true }),
              dataCell("HTTP 431 (Header Too Large) errors on localhost", 2600),
              dataCell("Supabase auth cookies accumulate when switching institutions, exceeding Node.js 16KB limit. Increased to 32KB.", 3600),
              dataCell("1 file, config change", 2560),
            ] }),
            new TableRow({ children: [
              dataCell("3", 600, { center: true, shade: true }),
              dataCell("Reading time calculation crashed on HTML content", 2600, { shade: true }),
              dataCell("calculateReadingTime still called JSON.parse() on HTML. Added DOMParser branch for HTML with JSON fallback for legacy posts.", 3600, { shade: true }),
              dataCell("2 files, +94 / -39 lines", 2560, { shade: true }),
            ] }),
            new TableRow({ children: [
              dataCell("4", 600, { center: true }),
              dataCell("Generic error messages hidden actual validation failures", 2600),
              dataCell("Surfaced real Supabase error messages (code, hint, message) and Zod field-level validation errors in toast notifications.", 3600),
              dataCell("1 file, +7 / -2 lines", 2560),
            ] }),
          ]
        }),

        // ═══════════════════════════════════════════════
        // 5. MEDIA LIBRARY
        // ═══════════════════════════════════════════════
        new Paragraph({ spacing: { before: 300 } }),
        sectionTitle("5. Media Library Improvements"),
        bodyText("Two fixes improved the media upload experience for content administrators."),

        new Paragraph({ spacing: { before: 160 } }),
        new Table({
          columnWidths: [600, 3000, 3200, 2560],
          rows: [
            new TableRow({ children: [
              headerCell("#", 600), headerCell("Issue", 3000), headerCell("Fix", 3200), headerCell("Impact", 2560)
            ] }),
            new TableRow({ children: [
              dataCell("1", 600, { center: true, shade: true }),
              dataCell("AVIF image format rejected during upload", 3000, { shade: true }),
              dataCell("Added .avif extension and image/avif MIME type to react-dropzone accept config across all upload components", 3200, { shade: true }),
              dataCell("3 files, +4 / -3 lines", 2560, { shade: true }),
            ] }),
            new TableRow({ children: [
              dataCell("2", 600, { center: true }),
              dataCell("Generic \"Failed to upload\" error message on all failures", 3000),
              dataCell("Now surfaces the actual Supabase Storage error message for easier debugging", 3200),
              dataCell("1 file, +8 / -2 lines", 2560),
            ] }),
          ]
        }),

        // ═══════════════════════════════════════════════
        // 6. CROSS-SITE UPDATES
        // ═══════════════════════════════════════════════
        new Paragraph({ spacing: { before: 300 } }),
        sectionTitle("6. Cross-Site Updates"),
        bodyText("One update affected both Main and Engineering websites simultaneously."),

        new Paragraph({ spacing: { before: 160 } }),
        subTitle("6.1 Admission Form Link Migration"),
        bulletItem("Updated all \"Apply Now\" CTA links from the old URL (admission.jkkn.ac.in/form/...) to the new 2026 URL (jkkn.ai/apply/jkkn-admission-2026)", "bullets"),
        bulletItem("Applied across hero sections, CTA blocks, admission sections, course data templates, and navigation bars", "bullets"),
        bulletItem("15 files updated to ensure no broken or outdated admission links remain", "bullets"),
        bodyText("Impact: 15 files changed, +79 / -65 lines."),

        // ═══════════════════════════════════════════════
        // 7. SUMMARY TABLES
        // ═══════════════════════════════════════════════
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("7. Complete Feature List"),

        new Table({
          columnWidths: [600, 4000, 2400, 2360],
          rows: [
            new TableRow({ children: [
              headerCell("#", 600), headerCell("Feature", 4000), headerCell("Website", 2400), headerCell("Status", 2360)
            ] }),
            ...([
              ["1", "Faculty admin panel (CRUD + portal)", "Engineering", "Completed"],
              ["2", "Faculty public listing + profile pages", "Engineering", "Completed"],
              ["3", "109 real campus photos (stock replacement)", "Engineering", "Completed"],
              ["4", "Tamil Nadu SEO keywords (62 phrases, 7 pages)", "Engineering", "Completed"],
              ["5", "ME CSE tabbed curriculum (Year 1/2)", "Engineering", "Completed"],
              ["6", "Admission form link update (2026)", "Both", "Completed"],
              ["7", "Hostel page redesign", "Main", "Completed"],
              ["8", "Ambulance Service page redesign", "Main", "Completed"],
              ["9", "Food Court page redesign", "Main", "Completed"],
              ["10", "Auditorium page redesign", "Main", "Completed"],
              ["11", "Digital Classroom page redesign", "Main", "Completed"],
              ["12", "Library page redesign", "Main", "Completed"],
            ].map((r, i) => new TableRow({ children: [
              dataCell(r[0], 600, { center: true, shade: i % 2 === 0 }),
              dataCell(r[1], 4000, { shade: i % 2 === 0 }),
              dataCell(r[2], 2400, { center: true, shade: i % 2 === 0 }),
              dataCell(r[3], 2360, { center: true, shade: i % 2 === 0, color: BRAND_GREEN }),
            ] })))
          ]
        }),

        new Paragraph({ spacing: { before: 360 } }),
        sectionTitle("8. Complete Bug Fix List"),

        new Table({
          columnWidths: [500, 3200, 2800, 2860],
          rows: [
            new TableRow({ children: [
              headerCell("#", 500), headerCell("Bug Fixed", 3200), headerCell("Root Cause", 2800), headerCell("Area", 2860)
            ] }),
            ...([
              ["1", "Faculty admin mobile responsiveness", "Table layout not mobile-optimized", "Engineering"],
              ["2", "FeeEntry type mismatch (GQ/MQ)", "Stale TypeScript type after fee change", "Engineering"],
              ["3", "Blog HTML content parsing failure", "TipTap outputs HTML, server expected JSON", "Blog System"],
              ["4", "HTTP 431 header too large", "Cookie accumulation across institutions", "Infrastructure"],
              ["5", "Blog reading-time calculation crash", "JSON.parse() called on HTML content", "Blog System"],
              ["6", "Generic DB error messages in blog", "Real Supabase errors not surfaced", "Blog System"],
              ["7", "Zod field errors hidden in blog toast", "Validation details not shown to users", "Blog System"],
              ["8", "Hostel: missing large image", "aspect-auto collapsed image to 0 height", "Main Facility"],
              ["9", "Hostel: empty girls tab", "Animation deadlock: dual trigger needed", "Main Facility"],
              ["10", "Hostel: hero not visible", "IntersectionObserver unreliable at top", "Main Facility"],
              ["11", "Hostel: bento image clipping", "CSS Grid bento clipping 3rd image", "Main Facility"],
              ["12", "Ambulance: wrong brand colors", "Used red instead of brand green/yellow", "Main Facility"],
              ["13", "Ambulance: hero-content spacing", "Gap too large between sections", "Main Facility"],
              ["14", "AVIF upload blocked", "Missing MIME type in dropzone config", "Media Library"],
              ["15", "Generic upload error messages", "Supabase error not surfaced to UI", "Media Library"],
            ].map((r, i) => new TableRow({ children: [
              dataCell(r[0], 500, { center: true, shade: i % 2 === 0 }),
              dataCell(r[1], 3200, { shade: i % 2 === 0 }),
              dataCell(r[2], 2800, { shade: i % 2 === 0 }),
              dataCell(r[3], 2860, { center: true, shade: i % 2 === 0 }),
            ] })))
          ]
        }),

        // ═══════════════════════════════════════════════
        // 9. METRICS BY WEBSITE
        // ═══════════════════════════════════════════════
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("9. Metrics by Website"),

        subTitle("9.1 Main Website"),
        new Table({
          columnWidths: [5400, 3960],
          rows: [
            new TableRow({ children: [headerCell("Metric", 5400), headerCell("Value", 3960)] }),
            metricRow("Total Commits", "22", true),
            metricRow("Facility Pages Redesigned", "6", false),
            metricRow("Bugs Fixed", "12", true),
            metricRow("Blog Issues Resolved", "4", false),
            metricRow("Media Library Fixes", "2", true),
          ]
        }),
        new Paragraph({ spacing: { before: 80 } }),
        bodyText("Key Achievement: Complete facility pages visual overhaul with consistent design system across all 6 pages."),

        new Paragraph({ spacing: { before: 240 } }),
        subTitle("9.2 Engineering Website"),
        new Table({
          columnWidths: [5400, 3960],
          rows: [
            new TableRow({ children: [headerCell("Metric", 5400), headerCell("Value", 3960)] }),
            metricRow("Total Commits", "5", true),
            metricRow("Features Delivered", "5", false),
            metricRow("Real Campus Photos Added", "109", true),
            metricRow("SEO Keywords Added", "62", false),
            metricRow("New Admin Modules", "1 (Faculty)", true),
          ]
        }),
        new Paragraph({ spacing: { before: 80 } }),
        bodyText("Key Achievement: Faculty admin panel + complete stock-to-real image migration + regional SEO targeting."),

        // ═══════════════════════════════════════════════
        // 10. TECHNICAL HIGHLIGHTS
        // ═══════════════════════════════════════════════
        new Paragraph({ spacing: { before: 360 } }),
        sectionTitle("10. Technical Highlights"),

        bulletItem("Net code reduction of 7,933 lines \u2014 removed over-engineered IntersectionObserver animations, unused dark/light/glass/gradient variant systems, and 3 stale documentation files, while delivering 12 new features with cleaner, simpler code.", "bullets"),
        new Paragraph({ spacing: { before: 80 } }),
        bulletItem("Design system standardization \u2014 all 6 facility pages now follow an identical layout pattern (green hero \u2192 image gallery \u2192 content cards \u2192 feature grid), making future facility pages faster to build and maintain.", "bullets"),
        new Paragraph({ spacing: { before: 80 } }),
        bulletItem("CMS component registry alignment \u2014 all redesigned components have updated Zod schemas in the registry, ensuring CMS validation works correctly with new multi-image props.", "bullets"),
        new Paragraph({ spacing: { before: 80 } }),
        bulletItem("SEO regional targeting \u2014 62 Tamil Nadu-specific long-tail keywords across 7 engineering course pages targeting local search queries for improved discoverability.", "bullets"),
        new Paragraph({ spacing: { before: 80 } }),
        bulletItem("Blog content pipeline fix chain \u2014 resolved a cascading issue where upgrading TipTap editor to HTML output broke content parsing, reading-time calculation, and error reporting \u2014 all 4 issues resolved systematically.", "bullets"),

        // ── Footer ──
        new Paragraph({ spacing: { before: 600 } }),
        new Table({
          columnWidths: [9360],
          rows: [new TableRow({ children: [new TableCell({
            borders: { top: { style: BorderStyle.SINGLE, size: 3, color: BRAND_GREEN }, bottom: noBorder, left: noBorder, right: noBorder },
            width: { size: 9360, type: WidthType.DXA },
            children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: " ", size: 4 })] })]
          })] })]
        }),
        new Paragraph({ spacing: { before: 120 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "End of Report", size: 20, color: GRAY, italics: true, font: "Arial" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Prepared by Sangeetha V \u2022 JKKN Institution Website Project", size: 18, color: GRAY, font: "Arial" })] }),
      ]
    }
  ]
});

// ─── Generate ───
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("docs/reports/Weekly-Report-Apr-6-12-2026.docx", buffer);
  console.log("Report generated: docs/reports/Weekly-Report-Apr-6-12-2026.docx");
});
