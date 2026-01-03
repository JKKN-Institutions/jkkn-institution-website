# Multi-Institution Architecture

## Overview

This document describes the **Single Repository, Multiple Deployments (SRMD)** architecture for managing 6+ JKKN institution websites from a single codebase.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SINGLE SOURCE OF TRUTH                                │
│                                                                              │
│    ┌──────────────────────────────────────────────────────────────────┐    │
│    │              GitHub Repository (main)                             │    │
│    │           jkkn-institution-website                                │    │
│    │                                                                   │    │
│    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │    │
│    │  │   app/   │  │  lib/    │  │components│  │  supabase/   │    │    │
│    │  │          │  │          │  │          │  │ migrations/  │    │    │
│    │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │    │
│    └──────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    │ git push                               │
│                                    ▼                                        │
│    ┌──────────────────────────────────────────────────────────────────┐    │
│    │                    GitHub Actions Workflow                        │    │
│    │                                                                   │    │
│    │  1. Detect changes in supabase/migrations/                       │    │
│    │  2. If changes: Apply migrations to ALL Supabase projects        │    │
│    │  3. Trigger Vercel deployments (automatic via webhook)           │    │
│    └──────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  Vercel Project │       │  Vercel Project │       │  Vercel Project │
│     (Main)      │       │     (Arts)      │       │   (Engineering) │
│                 │       │                 │       │                 │
│ Domain:         │       │ Domain:         │       │ Domain:         │
│ jkkn.ac.in      │       │ arts.jkkn.ac.in │       │ engg.jkkn.ac.in │
│                 │       │                 │       │                 │
│ ENV:            │       │ ENV:            │       │ ENV:            │
│ INSTITUTION_ID= │       │ INSTITUTION_ID= │       │ INSTITUTION_ID= │
│ main            │       │ arts-science    │       │ engineering     │
│ SUPABASE_URL=   │       │ SUPABASE_URL=   │       │ SUPABASE_URL=   │
│ project1.sup... │       │ project2.sup... │       │ project3.sup... │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    Supabase     │       │    Supabase     │       │    Supabase     │
│    Project 1    │       │    Project 2    │       │    Project 3    │
│                 │       │                 │       │                 │
│ - cms_pages     │       │ - cms_pages     │       │ - cms_pages     │
│ - blog_posts    │       │ - blog_posts    │       │ - blog_posts    │
│ - settings      │       │ - settings      │       │ - settings      │
│ - users         │       │ - users         │       │ - users         │
│ (institution-   │       │ (institution-   │       │ (institution-   │
│  specific data) │       │  specific data) │       │  specific data) │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## Core Principles

### 1. Single Source of Truth
- **ONE repository** contains all code
- Changes to main repo automatically deploy to ALL institutions
- No code drift, no inconsistency

### 2. Configuration over Code
- Institution differences are handled via **environment variables**
- Content differences are handled via **Supabase databases**
- No code branching for different institutions

### 3. Automated Synchronization
- GitHub Actions applies migrations to all Supabase projects
- Vercel auto-deploys when code changes
- Zero manual intervention for routine updates

### 4. Independent Data Isolation
- Each institution has its own Supabase project
- Complete data isolation (users, content, settings)
- Independent SEO and domain configuration

---

## Institutions Configuration

### Required Environment Variables Per Vercel Project

```env
# Institution Identity
NEXT_PUBLIC_INSTITUTION_ID=main                    # Unique identifier
NEXT_PUBLIC_INSTITUTION_NAME="JKKN Institutions"   # Display name
NEXT_PUBLIC_SITE_URL=https://jkkn.ac.in            # Primary domain

# Supabase (Institution-specific project)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Feature Flags (comma-separated)
NEXT_PUBLIC_FEATURES=blog,careers,page-builder,analytics

# Theme Override (optional)
NEXT_PUBLIC_PRIMARY_COLOR=#1e3a8a
NEXT_PUBLIC_SECONDARY_COLOR=#3b82f6
```

### Institution IDs

| Institution | ID | Domain | Supabase Project |
|-------------|----|---------|--------------------|
| Main (All JKKN) | `main` | jkkn.ac.in | pmqodbfhsejbvfbmsfeq |
| Arts & Science | `arts-science` | arts.jkkn.ac.in | TBD |
| Engineering | `engineering` | engg.jkkn.ac.in | TBD |
| Dental | `dental` | dental.jkkn.ac.in | TBD |
| Pharmacy | `pharmacy` | pharmacy.jkkn.ac.in | TBD |
| Nursing | `nursing` | nursing.jkkn.ac.in | TBD |

---

## How to Add a New Institution

### Step 1: Create Supabase Project

```bash
# Using Supabase CLI
supabase projects create "JKKN Arts Science" --org-id your-org-id --region ap-south-1
```

### Step 2: Apply Migrations

```bash
# From project root
npm run db:migrate:all
# OR manually via Supabase MCP
```

### Step 3: Create Vercel Project

1. Go to Vercel Dashboard → New Project
2. Import from GitHub → Select `jkkn-institution-website`
3. Configure environment variables (see above)
4. Deploy

### Step 4: Configure Domain

1. In Vercel project → Settings → Domains
2. Add custom domain (e.g., `arts.jkkn.ac.in`)
3. Configure DNS records as instructed

### Step 5: Seed Initial Data

```bash
# Run seed script for the new institution
npm run db:seed -- --institution=arts-science
```

---

## Migration Synchronization

### Automatic (Recommended)

GitHub Actions automatically applies new migrations to all Supabase projects when:
- Changes detected in `supabase/migrations/`
- Push to `main` branch

### Manual

```bash
# Apply to all institutions
npm run db:migrate:all

# Apply to specific institution
npm run db:migrate -- --institution=arts-science
```

---

## Feature Flags

Control which features are available per institution:

```typescript
// lib/config/features.ts
export function hasFeature(feature: string): boolean {
  const enabledFeatures = process.env.NEXT_PUBLIC_FEATURES?.split(',') || []
  return enabledFeatures.includes(feature)
}

// Usage in components
if (hasFeature('blog')) {
  // Show blog features
}
```

### Available Features

| Feature | Description |
|---------|-------------|
| `blog` | Blog system with posts, categories, tags |
| `careers` | Job listings and applications |
| `page-builder` | Visual page editor |
| `analytics` | Traffic and engagement analytics |
| `comments` | User comments on blog posts |
| `newsletter` | Email subscription system |

---

## Institution-Specific Customizations

### 1. Via Environment Variables (Recommended)
- Site name, colors, logos
- Feature flags
- API endpoints

### 2. Via Database Settings
- Detailed appearance settings
- Navigation structure
- Footer configuration
- SEO defaults

### 3. Via Conditional Code (Last Resort)
```typescript
// Only use when absolutely necessary
const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID

if (institutionId === 'dental') {
  // Dental-specific logic
}
```

---

## Development Workflow

### Local Development

```bash
# Clone repo
git clone https://github.com/your-org/jkkn-institution-website

# Install dependencies
npm install

# Copy environment variables for a specific institution
cp .env.example .env.local
# Edit .env.local with institution-specific values

# Start development
npm run dev
```

### Testing Different Institutions Locally

```bash
# Use different .env files
npm run dev -- --env-file=.env.main
npm run dev -- --env-file=.env.arts
npm run dev -- --env-file=.env.dental
```

### Making Changes

1. Make changes in main repository
2. Test locally with different institution configs
3. Push to GitHub
4. Automatic deployment to ALL institutions
5. Automatic migration sync (if DB changes)

---

## Troubleshooting

### Migration Fails on One Institution

```bash
# Check migration status
npm run db:migrate:status -- --institution=arts-science

# Apply manually if needed
npm run db:migrate -- --institution=arts-science --from=006
```

### Content Not Showing

1. Verify Supabase URL is correct for the institution
2. Check if content exists in that Supabase project
3. Verify RLS policies allow access

### Wrong Branding

1. Check `NEXT_PUBLIC_INSTITUTION_ID` environment variable
2. Verify appearance settings in Supabase `settings` table
3. Clear Vercel cache and redeploy

---

## Security Considerations

1. **Separate Supabase Projects**: Complete data isolation
2. **Environment Variables**: Sensitive keys never in code
3. **RLS Policies**: Database-level access control
4. **Domain Verification**: Each domain verified in Vercel

---

## Cost Optimization

### Vercel
- Free tier: Up to 100GB bandwidth/month per project
- Pro tier: Shared across organization

### Supabase
- Free tier: 500MB database, 2GB bandwidth
- Pro tier: $25/month per project
- Consider: Shared Supabase for lower-traffic institutions

---

## Future Enhancements

1. **Central Admin Panel**: Manage all institutions from one dashboard
2. **Content Syndication**: Share content across institutions
3. **Unified Analytics**: Aggregate traffic across all sites
4. **Shared Component Library**: Custom components available to all
