## Multi-Institution Sitemap System

This guide explains how the multi-institution sitemap system works and how to manage sitemaps for each institution.

## How It Works

Each institution has its own set of sitemaps that are dynamically generated based on:
- `NEXT_PUBLIC_INSTITUTION_ID` - Determines which sitemap content to serve
- `NEXT_PUBLIC_SITE_URL` - Used in all sitemap URLs

### System Architecture

```
1. Configuration: lib/config/sitemaps.config.ts
   - Stores sitemap entries for each institution
   - Generates XML from data

2. Route Handlers:
   - app/sitemap.xml/route.ts (main index)
   - app/sitemap-pages.xml/route.ts (general pages)
   - app/sitemap-courses.xml/route.ts (courses/departments)
   - app/sitemap-blog.xml/route.ts (blog/events/news)

3. Dynamic Serving:
   - Engineering gets Engineering sitemaps
   - Main gets Main sitemaps
   - Each institution's URLs automatically use their SITE_URL
```

## Current Status

| Institution | Sitemaps | Status |
|-------------|----------|--------|
| **Engineering** | ✅ All 4 sitemaps | **Complete** |
| Main | ⏳ Basic pages only | Pending |
| Dental | ❌ Not configured | Pending |
| Pharmacy | ❌ Not configured | Pending |
| Arts & Science | ❌ Not configured | Pending |
| Nursing | ❌ Not configured | Pending |

## Engineering College Sitemaps

### sitemap.xml (Index)
**URL:** `https://engg.jkkn.ac.in/sitemap.xml`

References:
- `/sitemap-pages.xml` (28 general pages)
- `/sitemap-courses.xml` (17 course/department pages)
- `/sitemap-blog.xml` (35 blog/event articles)

### sitemap-pages.xml
**URL:** `https://engg.jkkn.ac.in/sitemap-pages.xml`

Includes:
- Homepage (priority 1.0, daily updates)
- About pages (0.8 priority)
- Facilities (0.6-0.7 priority)
- Policies & rules (0.3-0.5 priority)
- Gallery, library, auditorium

### sitemap-courses.xml
**URL:** `https://engg.jkkn.ac.in/sitemap-courses.xml`

Includes:
- Courses offered (0.9 priority)
- Departments (ECE, MBA, etc.)
- NAAC & NIRF pages
- Program outcomes
- Accreditation info

### sitemap-blog.xml
**URL:** `https://engg.jkkn.ac.in/sitemap-blog.xml`

Includes:
- Events (Orbitra26, Technovanza, etc.)
- Workshops & seminars
- Achievement announcements
- Web stories

## Testing

### Test Engineering Sitemaps Locally

```bash
# Switch to Engineering
npm run dev:engineering

# Visit sitemaps in browser:
# http://localhost:3000/sitemap.xml
# http://localhost:3000/sitemap-pages.xml
# http://localhost:3000/sitemap-courses.xml
# http://localhost:3000/sitemap-blog.xml
```

All URLs should show `https://engg.jkkn.ac.in/...` in the XML.

### Test Main Institution

```bash
npm run dev:main

# Visit:
# http://localhost:3000/sitemap.xml
# http://localhost:3000/sitemap-pages.xml
```

URLs should show `https://jkkn.ac.in/...` in the XML.

## Adding Sitemaps for Other Institutions

### Step 1: Collect Sitemap Data

For each institution, you need:
- List of pages (URLs, priorities, change frequencies)
- Course/department pages (if applicable)
- Blog/news/events (if applicable)

### Step 2: Update Configuration

Edit `lib/config/sitemaps.config.ts`:

**Add to sitemap index:**

```typescript
export function getSitemapIndex(siteUrl: string, institutionId: string): SitemapIndex[] {
  const config: { [key: string]: SitemapIndex[] } = {
    engineering: [
      { loc: `${siteUrl}/sitemap-pages.xml`, lastmod: '2026-02-16' },
      { loc: `${siteUrl}/sitemap-courses.xml`, lastmod: '2026-02-16' },
      { loc: `${siteUrl}/sitemap-blog.xml`, lastmod: '2026-02-16' },
    ],
    dental: [
      { loc: `${siteUrl}/sitemap-pages.xml`, lastmod: '2026-02-16' },
      { loc: `${siteUrl}/sitemap-courses.xml`, lastmod: '2026-02-16' },
    ],
    // ... add your institution
  }

  return config[institutionId] || config.main
}
```

**Add pages function:**

```typescript
function getDentalPages(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}`, lastmod: '2026-02-16', changefreq: 'daily', priority: 1.0 },
    { loc: `${siteUrl}/about`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    // ... add all pages
  ]
}
```

**Update getPagesSitemap:**

```typescript
export function getPagesSitemap(siteUrl: string, institutionId: string): SitemapEntry[] {
  if (institutionId === 'engineering') {
    return getEngineeringPages(siteUrl)
  }

  if (institutionId === 'dental') {
    return getDentalPages(siteUrl)  // ← Add this
  }

  return getMainPages(siteUrl)
}
```

Repeat for courses and blog if needed.

### Step 3: Test Locally

```bash
npm run dev:dental
# Visit http://localhost:3000/sitemap.xml
```

### Step 4: Deploy

Push to GitHub → Auto-deploys to Vercel → Sitemaps live!

## Sitemap Best Practices

### Priority Guidelines

| Page Type | Priority | Example |
|-----------|----------|---------|
| Homepage | 1.0 | / |
| Main sections | 0.8-0.9 | /about, /courses, /admissions |
| Sub-pages | 0.6-0.7 | /facilities/library, /gallery |
| Blog/News | 0.5-0.6 | /events/sports-day |
| Policies | 0.3-0.5 | /privacy-policy |

### Change Frequency Guidelines

| Frequency | Use For |
|-----------|---------|
| `daily` | Homepage, frequently updated sections |
| `weekly` | News, events, blog |
| `monthly` | General pages, facilities |
| `yearly` | Policies, static information |

### URL Format

✅ **Correct:**
```xml
<loc>https://engg.jkkn.ac.in/about</loc>
```

❌ **Wrong:**
```xml
<loc>/about</loc>  <!-- Missing domain -->
<loc>engg.jkkn.ac.in/about</loc>  <!-- Missing protocol -->
```

## Submitting to Google Search Console

### Step 1: Generate Sitemaps

Sitemaps are auto-generated on deploy. No manual generation needed.

### Step 2: Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (e.g., `https://engg.jkkn.ac.in`)
3. Navigate to **Sitemaps** (left sidebar)
4. Enter sitemap URL: `https://engg.jkkn.ac.in/sitemap.xml`
5. Click **Submit**

Google will automatically discover and crawl the sub-sitemaps.

### Step 3: Verify Indexing

After a few days:
1. Check **Sitemaps** section in Search Console
2. Verify "Discovered URLs" count matches your sitemap entries
3. Check for any errors

## Troubleshooting

### Problem: Sitemap shows wrong URLs

**Cause:** Environment variable mismatch

**Solution:**
1. Check Vercel environment variables
2. Ensure `NEXT_PUBLIC_SITE_URL` is correct for the institution
3. Redeploy if needed

Example:
- Engineering: `NEXT_PUBLIC_SITE_URL=https://engg.jkkn.ac.in`
- Main: `NEXT_PUBLIC_SITE_URL=https://jkkn.ac.in`

### Problem: 404 on sitemap-courses.xml or sitemap-blog.xml

**Cause:** Institution has no entries for these sitemaps

**Solution:**
1. Check `sitemaps.config.ts` - does the institution have these sitemaps?
2. If not needed, this is expected behavior (route returns 404)
3. Update sitemap index to not reference non-existent sitemaps

### Problem: Sitemap not updating

**Cause:** Cached sitemap

**Solution:**
1. Sitemaps have 24-hour cache (`revalidate: 86400`)
2. Force revalidation: Redeploy on Vercel
3. Clear CDN cache (Vercel auto-purges on deploy)

### Problem: XML parsing error in browser

**Cause:** Invalid XML syntax

**Solution:**
1. Check configuration for unescaped characters
2. Ensure all URLs are properly encoded
3. Test locally first: `npm run dev:engineering`

## Dynamic Sitemaps (Future Enhancement)

Current implementation uses static sitemap entries. For institutions with database-driven content (CMS pages, blog posts), consider:

### Option 1: Fetch from Database

```typescript
async function getEngineeringBlog(siteUrl: string): Promise<SitemapEntry[]> {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')

  return posts.map(post => ({
    loc: `${siteUrl}/blog/${post.slug}`,
    lastmod: post.updated_at,
    changefreq: 'monthly',
    priority: 0.6
  }))
}
```

### Option 2: Hybrid (Static + Dynamic)

- Keep high-priority static pages in config
- Fetch blog/news from database
- Combine both in route handler

## Related Documentation

- [Multi-Institution Architecture](../../docs/MULTI-INSTITUTION-ARCHITECTURE.md)
- [robots.txt Configuration](./README-ROBOTS.md)
- [Google Verification](./README-GOOGLE-VERIFICATION.md)
- [SEO Strategy](../../docs/MULTI-TENANT-SEO.md)

## Resources

- [Sitemaps.org Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
