# Multi-Tenant SEO Architecture

## The Key Insight

> **SEO content lives in the DATABASE, not in the CODE.**
>
> The codebase provides the STRUCTURE for reading and rendering SEO.
> Each institution's Supabase project contains its own SEO data.

---

## How It Works: Visual Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SINGLE CODEBASE                                      │
│                                                                              │
│   The code only knows HOW to read and render SEO data                       │
│   It does NOT contain any actual SEO content                                │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  generateMetadata() function                                         │  │
│   │                                                                      │  │
│   │  1. Read from cms_seo_metadata table (per-page SEO)                 │  │
│   │  2. Fallback to settings table (site-wide SEO)                      │  │
│   │  3. Final fallback to env vars (institution identity)               │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Reads from
                                      ▼
        ┌─────────────────────────────────────────────────────────┐
        │                   DIFFERENT DATABASES                     │
        │              (One per institution)                        │
        └─────────────────────────────────────────────────────────┘
                     │                    │                    │
        ┌────────────┴───┐    ┌──────────┴───┐    ┌──────────┴───┐
        ▼                ▼    ▼              ▼    ▼              ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   MAIN JKKN   │  │  DENTAL JKKN  │  │   ARTS JKKN   │  │  ENGG JKKN    │
│   Supabase    │  │   Supabase    │  │   Supabase    │  │   Supabase    │
├───────────────┤  ├───────────────┤  ├───────────────┤  ├───────────────┤
│ settings:     │  │ settings:     │  │ settings:     │  │ settings:     │
│ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌───────────┐ │
│ │site_name: │ │  │ │site_name: │ │  │ │site_name: │ │  │ │site_name: │ │
│ │"JKKN      │ │  │ │"JKKN      │ │  │ │"JKKN Arts │ │  │ │"JKKN      │ │
│ │Group"     │ │  │ │Dental"    │ │  │ │& Science" │ │  │ │Engineering│ │
│ └───────────┘ │  │ └───────────┘ │  │ └───────────┘ │  │ └───────────┘ │
│               │  │               │  │               │  │               │
│ seo settings: │  │ seo settings: │  │ seo settings: │  │ seo settings: │
│ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌───────────┐ │
│ │title:     │ │  │ │title:     │ │  │ │title:     │ │  │ │title:     │ │
│ │"%s | JKKN"│ │  │ │"%s |      │ │  │ │"%s | JKKN │ │  │ │"%s | JKKN │ │
│ │           │ │  │ │Dental"    │ │  │ │CAS"       │ │  │ │CET"       │ │
│ │keywords:  │ │  │ │keywords:  │ │  │ │keywords:  │ │  │ │keywords:  │ │
│ │education, │ │  │ │dental,    │ │  │ │arts,      │ │  │ │engineering│ │
│ │tamil nadu │ │  │ │dentistry  │ │  │ │science    │ │  │ │technology │ │
│ └───────────┘ │  │ └───────────┘ │  │ └───────────┘ │  │ └───────────┘ │
│               │  │               │  │               │  │               │
│ cms_pages:    │  │ cms_pages:    │  │ cms_pages:    │  │ cms_pages:    │
│ (unique pages)│  │ (unique pages)│  │ (unique pages)│  │ (unique pages)│
│               │  │               │  │               │  │               │
│ cms_seo:      │  │ cms_seo:      │  │ cms_seo:      │  │ cms_seo:      │
│ (per-page SEO)│  │ (per-page SEO)│  │ (per-page SEO)│  │ (per-page SEO)│
└───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘
        │                    │                    │                    │
        ▼                    ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  jkkn.ac.in   │  │dental.jkkn.   │  │arts.jkkn.     │  │engg.jkkn.     │
│               │  │   ac.in       │  │   ac.in       │  │   ac.in       │
│               │  │               │  │               │  │               │
│ <title>       │  │ <title>       │  │ <title>       │  │ <title>       │
│ Home | JKKN   │  │ Home | Dental │  │ Home | CAS    │  │ Home | CET    │
│ </title>      │  │ </title>      │  │ </title>      │  │ </title>      │
└───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘
```

---

## SEO Data Sources (Priority Order)

### 1. Page-Specific SEO (Highest Priority)

**Table:** `cms_seo_metadata`

Each page in the CMS has its own SEO settings:

```sql
SELECT * FROM cms_seo_metadata WHERE page_id = 'about-us-page-id';

-- Result (different in each institution's database):
-- MAIN:   meta_title = "About JKKN Group - 30 Years of Excellence"
-- DENTAL: meta_title = "About JKKN Dental College - Best Dental School"
-- ARTS:   meta_title = "About JKKN Arts & Science - Academic Excellence"
```

**Admin UI:** Each institution's admin sets this in Page Editor → SEO tab

### 2. Site-Wide SEO Defaults (Medium Priority)

**Table:** `settings` (category = 'seo')

Site-wide defaults for when page-specific SEO is not set:

```sql
-- In DENTAL Supabase:
INSERT INTO settings (category, data) VALUES ('seo', '{
  "title_template": "%s | JKKN Dental College",
  "default_title": "JKKN Dental College - Best Dental Education in Tamil Nadu",
  "site_description": "Leading dental college with state-of-the-art facilities...",
  "site_keywords": ["dental college", "BDS", "MDS", "Tamil Nadu", "dentistry"],
  "og_image": "https://dental.jkkn.ac.in/og-image.jpg"
}');

-- In ARTS Supabase:
INSERT INTO settings (category, data) VALUES ('seo', '{
  "title_template": "%s | JKKN Arts & Science",
  "default_title": "JKKN Arts & Science College - Excellence in Education",
  "site_description": "Premier arts and science college...",
  "site_keywords": ["arts college", "science", "UG", "PG", "Tamil Nadu"],
  "og_image": "https://arts.jkkn.ac.in/og-image.jpg"
}');
```

**Admin UI:** Settings → SEO Configuration

### 3. Environment Variables (Lowest Priority - Fallback)

**Source:** Vercel Environment Variables

Only used when database settings are not available:

```env
# DENTAL Vercel Project
NEXT_PUBLIC_INSTITUTION_ID=dental
NEXT_PUBLIC_INSTITUTION_NAME="JKKN Dental College"
NEXT_PUBLIC_SITE_URL=https://dental.jkkn.ac.in

# ARTS Vercel Project
NEXT_PUBLIC_INSTITUTION_ID=arts-science
NEXT_PUBLIC_INSTITUTION_NAME="JKKN Arts & Science College"
NEXT_PUBLIC_SITE_URL=https://arts.jkkn.ac.in
```

---

## Complete SEO Flow Example

**Scenario:** User visits `https://dental.jkkn.ac.in/admissions`

```
1. Request hits Vercel (dental.jkkn.ac.in)
   ↓
2. Vercel routes to Next.js app
   Environment: NEXT_PUBLIC_SUPABASE_URL = dental-project.supabase.co
   ↓
3. Next.js page.tsx calls generateMetadata()
   ↓
4. Code fetches from DENTAL Supabase:

   a. cms_seo_metadata (page-specific)
      └── Found: meta_title = "BDS/MDS Admissions 2024 - Apply Now"
      └── Found: meta_description = "Apply for dental courses..."
      └── Found: og_image = "/images/admissions-dental.jpg"

   b. settings.seo (site defaults) - used for missing fields
      └── title_template = "%s | JKKN Dental"
      └── twitter_handle = "@jkkndental"
   ↓
5. Generated HTML:

   <head>
     <title>BDS/MDS Admissions 2024 - Apply Now | JKKN Dental</title>
     <meta name="description" content="Apply for dental courses...">
     <meta property="og:image" content="https://dental.jkkn.ac.in/images/admissions-dental.jpg">
     <link rel="canonical" href="https://dental.jkkn.ac.in/admissions">
   </head>
```

---

## SEO Tables Structure

### cms_seo_metadata (Per-Page SEO)

```sql
CREATE TABLE cms_seo_metadata (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES cms_pages(id),

  -- Basic SEO
  meta_title VARCHAR(70),           -- "Best Dental College in Tamil Nadu"
  meta_description VARCHAR(160),    -- Snippet shown in search results
  meta_keywords TEXT,               -- Comma-separated keywords

  -- Open Graph (Facebook, LinkedIn)
  og_title VARCHAR(70),
  og_description VARCHAR(200),
  og_image TEXT,                    -- Full URL to image
  og_type VARCHAR(50),              -- website, article, etc.

  -- Twitter Card
  twitter_card VARCHAR(50),         -- summary, summary_large_image
  twitter_title VARCHAR(70),
  twitter_description VARCHAR(200),
  twitter_image TEXT,

  -- Technical
  canonical_url TEXT,               -- https://dental.jkkn.ac.in/about
  robots_directive VARCHAR(100),    -- index,follow or noindex,nofollow

  -- Structured Data (JSON-LD)
  structured_data JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### settings (Site-Wide SEO)

```sql
-- category = 'seo'
{
  "title_template": "%s | JKKN Dental",
  "default_title": "JKKN Dental College",
  "site_description": "Leading dental education...",
  "site_keywords": ["dental", "BDS", "MDS"],
  "og_image": "https://dental.jkkn.ac.in/default-og.jpg",
  "twitter_handle": "@jkkndental",
  "google_site_verification": "abc123...",
  "bing_site_verification": "xyz789..."
}

-- category = 'general'
{
  "site_name": "JKKN Dental College",
  "contact_email": "info@dental.jkkn.ac.in",
  "contact_phone": "+91-1234567890",
  "address": {
    "streetAddress": "123 Main Road",
    "addressLocality": "Komarapalayam",
    "addressRegion": "Tamil Nadu",
    "postalCode": "638183",
    "addressCountry": "IN"
  }
}
```

---

## Admin Panel SEO Management

Each institution's admin panel (accessed via their domain) manages their own SEO:

### 1. Site-Wide SEO Settings
**Location:** Admin → Settings → SEO

- Default title template
- Site description
- Default OG image
- Social media handles
- Search console verification codes
- Robots.txt configuration

### 2. Per-Page SEO
**Location:** Admin → Pages → Edit Page → SEO Tab

- Meta title (with character count)
- Meta description (with preview)
- Keywords
- Open Graph settings
- Twitter Card settings
- Canonical URL
- Robots directive
- Structured data (JSON-LD)

### 3. Blog Post SEO
**Location:** Admin → Blog → Edit Post → SEO Tab

Similar to pages but with article-specific schema

---

## Google Search Console Setup

Each institution gets its own Search Console property:

1. **MAIN:** https://jkkn.ac.in → Separate Search Console
2. **DENTAL:** https://dental.jkkn.ac.in → Separate Search Console
3. **ARTS:** https://arts.jkkn.ac.in → Separate Search Console
4. **ENGG:** https://engg.jkkn.ac.in → Separate Search Console

**Verification:** Each institution adds their verification code to their database settings:

```sql
-- In DENTAL Supabase
UPDATE settings
SET data = data || '{"google_site_verification": "dental-verification-code"}'
WHERE category = 'seo';
```

---

## Sitemap Generation

Each institution generates its own sitemap from its own database:

```
https://dental.jkkn.ac.in/sitemap.xml
├── Reads from DENTAL Supabase
├── Lists all published pages in DENTAL CMS
└── Uses dental.jkkn.ac.in as base URL

https://arts.jkkn.ac.in/sitemap.xml
├── Reads from ARTS Supabase
├── Lists all published pages in ARTS CMS
└── Uses arts.jkkn.ac.in as base URL
```

**Implementation:** The sitemap route reads from the connected Supabase:

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const supabase = await createServerClient() // Connects to THIS institution's Supabase
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  const { data: pages } = await supabase
    .from('cms_pages')
    .select('slug, updated_at')
    .eq('status', 'published')

  return pages.map(page => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updated_at,
  }))
}
```

---

## robots.txt Per Institution

Each institution can customize their robots.txt:

```
# https://dental.jkkn.ac.in/robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://dental.jkkn.ac.in/sitemap.xml

# https://arts.jkkn.ac.in/robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://arts.jkkn.ac.in/sitemap.xml
```

---

## Summary: Why This Works

| Concern | How It's Handled |
|---------|------------------|
| Different domains | Separate Vercel deployments with custom domains |
| Different titles | Stored in each institution's Supabase `settings` |
| Different descriptions | Stored in each institution's Supabase `settings` |
| Different keywords | Stored in each institution's Supabase `settings` |
| Different OG images | Stored in each institution's Supabase Storage |
| Per-page SEO | Each institution's `cms_seo_metadata` table |
| Sitemaps | Generated from each institution's database |
| Search Console | Each institution verifies their own property |
| Rankings | Each domain ranks independently in Google |

**The codebase is identical. The SEO data is unique per institution because each has its own database.**
