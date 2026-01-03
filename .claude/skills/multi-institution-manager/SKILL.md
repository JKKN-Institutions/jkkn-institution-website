---
name: multi-institution-manager
description: |
  Comprehensive guide for managing multi-institution architecture in JKKN websites.
  This skill should be used when:
  - Adding a new institution to the platform
  - Creating or syncing database migrations across institutions
  - Setting up Supabase projects for new institutions
  - Configuring Vercel deployments for institutions
  - Managing environment variables and feature flags
  - Troubleshooting multi-institution issues
  - Understanding the Single Repository, Multiple Deployments (SRMD) architecture

  Automatically triggers when user mentions: "add institution", "new institution",
  "sync migrations", "multi-tenant", "setup supabase project", "setup vercel",
  "institution deployment", or asks about managing multiple JKKN websites.
---

# Multi-Institution Manager

This skill provides comprehensive guidance for managing the JKKN multi-institution architecture where ONE codebase serves SIX institution websites through separate Supabase and Vercel deployments.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONE GitHub Repository                         │
│                 (jkkn-institution-website)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Vercel: Main  │     │ Vercel: Dental│     │ Vercel: Arts  │
│ jkkn.ac.in    │     │ dental.jkkn.  │     │ arts.jkkn.    │
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Supabase Main │     │Supabase Dental│     │ Supabase Arts │
└───────────────┘     └───────────────┘     └───────────────┘
```

## Current Institutions

| ID | Name | Domain | Supabase Project |
|----|------|--------|------------------|
| `main` | JKKN Institutions | jkkn.ac.in | pmqodbfhsejbvfbmsfeq |
| `arts-science` | JKKN Arts & Science | arts.jkkn.ac.in | TBD |
| `engineering` | JKKN Engineering | engg.jkkn.ac.in | TBD |
| `dental` | JKKN Dental | dental.jkkn.ac.in | TBD |
| `pharmacy` | JKKN Pharmacy | pharmacy.jkkn.ac.in | TBD |
| `nursing` | JKKN Nursing | nursing.jkkn.ac.in | TBD |

---

## Adding a New Institution

### Prerequisites Checklist

Before starting, ensure:

- [ ] Supabase account with organization access
- [ ] Vercel account with team access
- [ ] GitHub repository access
- [ ] Domain DNS access for custom domain
- [ ] Institution branding assets (logo, colors)

### Step 1: Create Supabase Project

1. **Navigate to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/projects
   ```

2. **Create New Project:**
   - Click "New Project"
   - Select organization: JKKN
   - Project name: `jkkn-[institution-id]` (e.g., `jkkn-dental`)
   - Database password: Generate strong password (save securely)
   - Region: `ap-south-1` (Mumbai) or `ap-southeast-1` (Singapore)
   - Pricing plan: Free tier initially

3. **Wait for Project Setup:**
   - Takes 2-3 minutes for project to be ready
   - Note the project reference ID (e.g., `abcdefghijklmnop`)

4. **Get API Credentials:**
   - Go to Project Settings → API
   - Copy: `Project URL`, `anon/public key`, `service_role key`

### Step 2: Apply Database Migrations

**Option A: Using Migration Sync Script (Recommended)**

1. **Add credentials to `.env.institutions`:**
   ```env
   SUPABASE_[ID]_URL=https://[project-ref].supabase.co
   SUPABASE_[ID]_SERVICE_KEY=eyJhbGc...
   ```

2. **Run migration sync:**
   ```bash
   npm run db:migrate -- --institution=[institution-id]
   ```

3. **Verify migrations applied:**
   ```bash
   npm run db:migrate -- --institution=[institution-id] --dry-run
   # Should show "No pending migrations"
   ```

**Option B: Using Supabase MCP (Manual)**

1. **List existing migrations:**
   ```
   mcp__supabase__list_migrations
   ```

2. **Apply each migration in order:**
   - Read migration file from `supabase/migrations/`
   - Execute via `mcp__supabase__apply_migration`
   - Verify with `mcp__supabase__list_tables`

### Step 3: Configure Supabase Project

1. **Enable Auth Providers:**
   - Go to Authentication → Providers
   - Enable Google OAuth
   - Configure: Client ID, Client Secret
   - Authorized redirect: `https://[domain]/auth/callback`

2. **Configure Auth Settings:**
   - Site URL: `https://[institution-domain]`
   - Redirect URLs: Add callback URLs

3. **Set up Storage Buckets:**
   ```sql
   -- Run in SQL Editor
   INSERT INTO storage.buckets (id, name, public) VALUES
     ('avatars', 'avatars', true),
     ('media', 'media', true),
     ('resumes', 'resumes', false);
   ```

4. **Configure RLS for Storage:**
   - Apply storage policies from `supabase/migrations/`

### Step 4: Create Vercel Project

1. **Navigate to Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Import Git Repository:**
   - Click "Add New..." → Project
   - Select: `jkkn-institution-website` repository
   - Framework: Next.js (auto-detected)

3. **Configure Project:**
   - Project Name: `jkkn-[institution-id]`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables:**

   See `references/environment-variables.md` for complete list.

   **Required variables:**
   ```
   NEXT_PUBLIC_INSTITUTION_ID=[institution-id]
   NEXT_PUBLIC_INSTITUTION_NAME=[Full Institution Name]
   NEXT_PUBLIC_SITE_URL=https://[domain]
   NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
   NEXT_PUBLIC_FEATURES=blog,careers,page-builder,analytics
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Step 5: Configure Custom Domain

1. **In Vercel Project Settings → Domains:**
   - Add domain: `[institution].jkkn.ac.in`

2. **Configure DNS:**
   - Add CNAME record: `[institution]` → `cname.vercel-dns.com`
   - Or A record to Vercel IP if apex domain

3. **Wait for SSL:**
   - Vercel auto-provisions SSL certificate
   - Usually takes 5-10 minutes

4. **Verify Domain:**
   - Visit `https://[institution].jkkn.ac.in`
   - Check SSL certificate is valid

### Step 6: Seed Initial Data

1. **Create Admin User:**
   - Add email to `approved_emails` table
   - User signs in via Google OAuth
   - Assign `super_admin` role

2. **Configure Site Settings:**
   - Login to admin panel
   - Go to Settings → General
   - Set site name, contact info, address

3. **Configure Appearance:**
   - Go to Settings → Appearance
   - Upload logo, set theme colors

4. **Configure SEO:**
   - Go to Settings → SEO
   - Set default title template, description, keywords
   - Add Google Search Console verification

### Step 7: Update Registry

1. **Update `lib/config/multi-tenant.ts`:**
   ```typescript
   {
     id: '[institution-id]',
     name: '[Full Name]',
     shortName: '[Short Name]',
     domain: '[institution].jkkn.ac.in',
     type: 'college',
     theme: {
       primaryColor: '#[hex]',
       secondaryColor: '#[hex]',
       accentColor: '#[hex]',
     },
     features: ['blog', 'careers', 'page-builder', 'analytics'],
     supabaseProjectRef: '[project-ref]',
   }
   ```

2. **Update `.env.institutions.example`:**
   ```env
   SUPABASE_[ID]_URL=https://xxx.supabase.co
   SUPABASE_[ID]_SERVICE_KEY=your-service-key
   ```

3. **Update CLAUDE.md:**
   - Add institution to the institutions table

---

## Database Migration Management

### Creating New Migrations

1. **Create migration file:**
   ```bash
   # Format: [number]_[description].sql
   touch supabase/migrations/007_add_new_feature.sql
   ```

2. **Write migration SQL:**
   ```sql
   -- Migration: 007_add_new_feature
   -- Description: Add new feature tables

   CREATE TABLE new_feature (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE new_feature ENABLE ROW LEVEL SECURITY;

   -- Add RLS policies
   CREATE POLICY "Users can view" ON new_feature
     FOR SELECT USING (true);
   ```

3. **Test locally first:**
   - Apply to main Supabase project
   - Verify with `mcp__supabase__list_tables`

### Syncing Migrations Across Institutions

**Automatic (via GitHub Actions):**
- Push changes to `supabase/migrations/`
- GitHub Actions automatically syncs to all institutions

**Manual sync:**
```bash
# Sync all institutions
npm run db:migrate:all

# Preview without applying
npm run db:migrate:dry

# Specific institution only
npm run db:migrate -- --institution=dental

# From specific migration
npm run db:migrate -- --from=007
```

### Migration Best Practices

1. **Always test migrations locally first**
2. **Use transactions for complex migrations**
3. **Include rollback comments**
4. **Add RLS policies for new tables**
5. **Update TypeScript types after schema changes:**
   ```
   mcp__supabase__generate_typescript_types
   ```

### Rollback Procedures

**Manual rollback (if needed):**
```sql
-- Add to migration file as comment for reference
-- ROLLBACK:
-- DROP TABLE IF EXISTS new_feature;
```

**Execute rollback:**
```
mcp__supabase__execute_sql
```

---

## Feature Flags

### Available Features

| Feature | Description |
|---------|-------------|
| `blog` | Blog system with posts, categories, tags |
| `careers` | Job listings and applications |
| `page-builder` | Visual page editor |
| `analytics` | Traffic and engagement analytics |
| `comments` | User comments on blog posts |
| `newsletter` | Email subscription system |
| `events` | Event management and calendar |
| `gallery` | Photo/video gallery |
| `testimonials` | Testimonial management |
| `admissions` | Admission portal |
| `faculty-directory` | Faculty profiles |
| `course-catalog` | Course listings |
| `research-publications` | Research paper management |
| `placements` | Placement statistics |

### Configuring Features

**Via Environment Variable:**
```env
NEXT_PUBLIC_FEATURES=blog,careers,page-builder,analytics
```

**In Code:**
```typescript
import { hasFeature } from '@/lib/config/multi-tenant'

if (hasFeature('blog')) {
  // Blog-specific code
}
```

**In Components:**
```tsx
import { FeatureGate } from '@/lib/hooks/use-institution'

<FeatureGate feature="blog">
  <BlogSection />
</FeatureGate>
```

---

## Troubleshooting

### Common Issues

**1. Migration sync fails:**
- Check `.env.institutions` has correct credentials
- Verify Supabase project is accessible
- Check service role key permissions

**2. Vercel deployment fails:**
- Check environment variables are set
- Verify Supabase URL/keys are correct
- Check build logs for TypeScript errors

**3. Auth not working:**
- Verify Google OAuth configured in Supabase
- Check redirect URLs match domain
- Verify site URL in Supabase settings

**4. Wrong content showing:**
- Verify `NEXT_PUBLIC_INSTITUTION_ID` is correct
- Check Supabase URL points to correct project
- Clear Vercel cache and redeploy

**5. SEO not updating:**
- Check `settings` table has SEO data
- Verify `cms_seo_metadata` for pages
- Clear CDN cache

### Debug Commands

```bash
# Check Vercel environment
vercel env ls

# Check Supabase connection
curl https://[project-ref].supabase.co/rest/v1/ \
  -H "apikey: [anon-key]"

# Test migration sync (dry run)
npm run db:migrate:dry
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/config/multi-tenant.ts` | Institution registry, feature flags |
| `lib/hooks/use-institution.ts` | React hooks for institution context |
| `lib/seo/site-metadata.ts` | Dynamic SEO generation |
| `scripts/sync-migrations.ts` | Migration sync utility |
| `.github/workflows/sync-migrations.yml` | Auto-sync workflow |
| `.env.institutions` | Multi-project credentials (gitignored) |
| `docs/MULTI-INSTITUTION-ARCHITECTURE.md` | Full architecture docs |
| `docs/MULTI-TENANT-SEO.md` | SEO architecture docs |

---

## Quick Reference Commands

```bash
# Development
npm run dev                              # Start dev server

# Migrations
npm run db:migrate:all                   # Sync all institutions
npm run db:migrate:dry                   # Preview changes
npm run db:migrate -- --institution=X    # Sync specific

# Vercel
vercel                                   # Deploy preview
vercel --prod                            # Deploy production
vercel env ls                            # List env vars
```

---

## Additional Resources

For detailed information, see:
- `references/environment-variables.md` - Complete env var reference
- `references/migration-guide.md` - Detailed migration procedures
- `references/institution-checklist.md` - Full setup checklist
- `references/troubleshooting.md` - Extended troubleshooting guide
