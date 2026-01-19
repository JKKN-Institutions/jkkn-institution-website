# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚨 CRITICAL: READ THIS FIRST

**BEFORE implementing ANY feature or module in this project, you MUST:**

1. ✅ **Load `nextjs16-web-development` skill** - Required for ALL Next.js development
2. ✅ **Load `advanced-tables-components` skill** - Required for ANY data table/list view
3. ✅ **Follow the exact patterns shown in these skills** - No exceptions

**Failure to use these skills will result in non-compliant code that must be rewritten.**

See the **"⚠️ MANDATORY: Claude Skills Usage"** section below for complete details.

---

## 🗄️ CRITICAL: Database Documentation Requirement

**BEFORE executing ANY Supabase migration or database change, you MUST:**

1. ✅ **Document the SQL code FIRST** in `docs/database/main-supabase/`
2. ✅ **Update the appropriate documentation file** based on change type
3. ✅ **ONLY THEN execute the migration** via MCP tools

**This is COMPULSORY and NON-NEGOTIABLE for ALL database operations.**

See the **"📋 Mandatory Database Documentation Workflow"** section below for complete details.

---

## Project Overview

JKKN Institution Website is a comprehensive web application built with **Next.js 16** and **Supabase** for managing institutional operations. The project consists of:

1. **Public Frontend** - Marketing website for prospective students and parents
2. **Admin Panel** - Internal management system with advanced RBAC, content management, and analytics
3. **Backend** - Supabase PostgreSQL with 60+ tables for institutional management

**Current Status:** Early development stage with production-ready database schema and basic Next.js bootstrap.

---

## 🏛️ Multi-Institution Architecture

This is a **Single Repository, Multiple Deployments (SRMD)** architecture serving 6 JKKN institutions from one codebase.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONE GitHub Repository                         │
│                 (jkkn-institution-website)                       │
│                                                                  │
│   Code changes here → ALL 6 institution sites update            │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Vercel: Main  │     │ Vercel: Dental│     │ Vercel: Arts  │  ... (6 total)
│ jkkn.ac.in    │     │ dental.jkkn.  │     │ arts.jkkn.    │
│               │     │   ac.in       │     │   ac.in       │
│ ENV:          │     │ ENV:          │     │ ENV:          │
│ INSTITUTION_ID│     │ INSTITUTION_ID│     │ INSTITUTION_ID│
│ = main        │     │ = dental      │     │ = arts-science│
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Supabase:     │     │ Supabase:     │     │ Supabase:     │
│ Main Project  │     │ Dental Project│     │ Arts Project  │
│ (separate DB) │     │ (separate DB) │     │ (separate DB) │
└───────────────┘     └───────────────┘     └───────────────┘
```

### Institutions

| Institution | ID | Domain | Supabase | DB Status |
|-------------|-----|--------|----------|-----------|
| Main (Umbrella) | `main` | jkkn.ac.in | pmqodbfhsejbvfbmsfeq | ✅ Production (49 tables) |
| Arts & Science | `arts-science` | arts.jkkn.ac.in | TBD | 🚧 Setup Pending |
| Engineering | `engineering` | engg.jkkn.ac.in | kyvfkyjmdbtyimtedkie | ✅ Feature Parity (49 tables) |
| Dental | `dental` | dental.jkkn.ac.in | wnmyvbnqldukeknnmnpl | 🔄 Sync Pending (35 tables) |
| Pharmacy | `pharmacy` | pharmacy.jkkn.ac.in | rwskookarbolpmtolqkd | 🔄 Sync Pending (35 tables) |
| Nursing | `nursing` | nursing.jkkn.ac.in | TBD | 🚧 Setup Pending |

**Database Status Legend:**
- ✅ Feature Parity: Complete database sync with all Main Supabase features
- 🔄 Sync Pending: Basic schema exists, needs feature parity migration
- 🚧 Setup Pending: Supabase project not yet created

**Engineering College (2026-01-16):** Successfully migrated 16 tables, 34 functions, 12 triggers, and 47 RLS policies. Now has complete feature parity with Main Supabase including blog system, analytics, forms management, and advanced CMS features.

### Key Principles

1. **Single Source of Truth**: ONE codebase, ALL institutions use it
2. **Configuration over Code**: Differences handled via environment variables
3. **Data Isolation**: Each institution has its own Supabase project (complete isolation)
4. **Automatic Sync**: Push once → all 6 sites update automatically

### Environment Variables (Per Vercel Project)

```env
# Institution Identity
NEXT_PUBLIC_INSTITUTION_ID=dental
NEXT_PUBLIC_INSTITUTION_NAME="JKKN Dental College"
NEXT_PUBLIC_SITE_URL=https://dental.jkkn.ac.in

# Supabase (Institution-specific)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Feature Flags
NEXT_PUBLIC_FEATURES=blog,careers,page-builder,analytics
```

### Feature Flags System

Control features per institution via `NEXT_PUBLIC_FEATURES`:

```typescript
// lib/config/multi-tenant.ts
import { hasFeature } from '@/lib/config/multi-tenant'

if (hasFeature('blog')) {
  // Show blog features
}

// React hook
import { useHasFeature, FeatureGate } from '@/lib/hooks/use-institution'

// Component-based
<FeatureGate feature="blog">
  <BlogSection />
</FeatureGate>
```

### SEO Handling

SEO is **database-driven**, not code-driven:

1. **Per-Page SEO**: `cms_seo_metadata` table (each institution's Supabase)
2. **Site-Wide SEO**: `settings` table with `category='seo'`
3. **Fallback**: Environment variables (institution name, URL)

Each institution has unique SEO because each has its own database.

### Migration Sync

Sync database migrations across all institution Supabase projects:

```bash
# Apply to all institutions
npm run db:migrate:all

# Dry run (preview)
npm run db:migrate:dry

# Specific institution
npm run db:migrate -- --institution=dental
```

**GitHub Actions**: Migrations auto-sync when `supabase/migrations/` changes.

### Key Files

| File | Purpose |
|------|---------|
| `lib/config/multi-tenant.ts` | Institution config, feature flags |
| `lib/hooks/use-institution.ts` | React hooks for client components |
| `lib/seo/site-metadata.ts` | Dynamic SEO from database |
| `scripts/sync-migrations.ts` | Migration sync utility |
| `.github/workflows/sync-migrations.yml` | Auto-sync on push |
| `docs/MULTI-INSTITUTION-ARCHITECTURE.md` | Full architecture docs |
| `docs/MULTI-TENANT-SEO.md` | SEO architecture docs |

### Adding a New Institution

1. Create Supabase project
2. Create Vercel project (same repo, different env vars)
3. Add environment variables
4. Configure custom domain
5. Run `npm run db:migrate -- --institution=new-id`

### Important Rules

- **NEVER** clone this repo for new institutions
- **NEVER** hardcode institution-specific content in code
- **ALWAYS** use environment variables for institution differences
- **ALWAYS** store content in Supabase (CMS), not in code
- **ALWAYS** use feature flags for institution-specific features

---

## Essential Commands

### Development

```bash
npm run dev          # Start development server (uses current .env.local)
npm run dev:main     # Switch to Main Institution + start dev server
npm run dev:dental   # Switch to Dental College + start dev server
npm run dev:arts-science   # Switch to Dental College + start dev server
npm run dev:engineering   # Switch to Dental College + start dev server
npm run dev:pharmacy   # Switch to Dental College + start dev server
npm run dev:nursing   # Switch to Dental College + start dev server
npm run build        # Production build (runs TypeScript compiler + Next.js build)
npm run start        # Start production server
npm run lint         # Run ESLint
```

### 🔄 Local Development: Institution Switcher

Since this is a multi-tenant architecture with separate Supabase projects per institution, you need to specify **which institution's database** to use during local development.

#### Quick Start

```bash
# Develop with Main Institution database
npm run dev:main

# Develop with Dental College database
npm run dev:dental

# Just switch (without starting dev server)
npm run switch main
npm run switch dental
npm run switch engineering
npm run switch pharmacy

# List all available institutions
npm run switch --list
```

#### How It Works

1. **`scripts/switch-institution.ts`** - Contains institution configurations (URLs, keys, features)
2. Running `npm run dev:main` or `npm run dev:dental`:
   - Executes the switcher script
   - Generates `.env.local` with the selected institution's credentials
   - Starts the Next.js dev server
3. The app connects to the selected institution's Supabase project

#### Institution Registry

| Command | Institution | Supabase Project |
|---------|-------------|------------------|
| `npm run dev:main` | JKKN Institutions (Main) | `pmqodbfhsejbvfbmsfeq` |
| `npm run dev:dental` | JKKN Dental College | `wnmyvbnqldukeknnmnpl` |

#### Adding Service Role Keys (For Admin Operations)

The switcher includes anon keys by default. For full admin access (user management, etc.), create service key files:

```bash
# Create .env.main.servicekey with the service role key
echo "eyJhbGci..." > .env.main.servicekey

# Create .env.dental.servicekey
echo "eyJhbGci..." > .env.dental.servicekey
```

The switcher will automatically use these when switching institutions.

#### Adding More Institutions

1. Edit `scripts/switch-institution.ts`
2. Add new institution to the `INSTITUTIONS` object:
   ```typescript
   'arts-science': {
     id: 'arts-science',
     name: 'JKKN College of Arts and Science',
     supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
     supabaseAnonKey: 'YOUR_ANON_KEY',
     siteUrl: 'http://localhost:3000',
     features: 'blog,careers,faculty-directory,course-catalog',
   },
   ```
3. Add npm script to `package.json`:
   ```json
   "dev:arts": "npx tsx scripts/switch-institution.ts arts-science && next dev"
   ```

#### Key Files

| File | Purpose |
|------|---------|
| `scripts/switch-institution.ts` | Institution switcher script |
| `.env.local` | Auto-generated environment (git-ignored) |
| `.env.main.servicekey` | Main institution service key (git-ignored) |
| `.env.dental.servicekey` | Dental institution service key (git-ignored) |

#### Important Notes

- `.env.local` is auto-generated - don't edit manually
- All `.env*` files are git-ignored for security
- Service keys are optional but needed for admin operations
- The dev server uses port 3000 by default (or next available)

### Database (Supabase MCP)

The project uses Supabase MCP for database operations. Use the following MCP tools:

- `mcp__supabase__list_tables` - View database schema
- `mcp__supabase__execute_sql` - Run SQL queries
- `mcp__supabase__apply_migration` - Create new migrations
- `mcp__supabase__list_migrations` - View applied migrations
- `mcp__supabase__generate_typescript_types` - Generate TypeScript types from schema

**Supabase Project:** `pmqodbfhsejbvfbmsfeq`

### Next.js DevTools (MCP)

- `mcp__next-devtools__init` - **MUST run first** to load Next.js documentation
- `mcp__next-devtools__nextjs_docs` - Query Next.js official docs (search/get)
- `mcp__next-devtools__nextjs_runtime` - Interact with running dev server
- `mcp__next-devtools__browser_eval` - Browser automation for testing

## Architecture

### Tech Stack

- **Framework:** Next.js 16.0.3 (App Router) + React 19.2.0
- **Language:** TypeScript 5 (strict mode)
- **Database:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Styling:** Tailwind CSS v4
- **Components:** Radix UI primitives (extensive collection installed)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Icons:** Lucide React

### Key Architectural Decisions

**1. Monolithic App Router Structure**

```
app/
├── (public)/     # Public frontend (marketing site)
├── (admin)/      # Admin panel (internal management)
└── (auth)/       # Authentication flows
```

**2. Data Fetching Pattern: Hybrid**

- **Server Actions** for mutations (create, update, delete)
- **Server Components** for initial data fetching
- **Client-side Supabase** for real-time subscriptions
- Never use API routes for CRUD (use Server Actions instead)

**3. Permission Model: Secure by Default**

- Format: `module:resource:action` (e.g., `users:profiles:edit`)
- New modules auto-grant to `super_admin` only
- All other roles require explicit permission grants
- Wildcard support: `users:*:*` grants all user permissions

**4. Page Builder: Hybrid JSON + Component Registry**

- Store component name + props as JSON in database
- Map to pre-built React components via registry
- Components registered in `lib/cms/component-registry.ts`
- Categories: content, media, layout, data

### Database Architecture

**Existing Schema (60+ tables):**

- User management: `auth.users`, `profiles`, `members`, `roles`, `user_roles`
- Events: `events`, `event_volunteers`, `event_checkins`, `guest_rsvps`
- Financial: `budgets`, `expenses`, `sponsorships`
- Knowledge: `knowledge_documents`, `wiki_pages`
- Stakeholders: `ngos`, `vendors`, `schools`, `colleges`
- Communications: `announcements`, `announcement_recipients`
- Succession: `succession_cycles`, `succession_nominations`, `succession_evaluations`
- Awards: `award_cycles`, `nominations`, `jury_scores`
- And 40+ more tables for comprehensive institutional management

**New Tables Required (Phase 1):**

- User Management: `role_permissions`, `user_activity_logs`, `system_modules`
- CMS: `cms_pages`, `cms_page_blocks`, `cms_component_registry`, `cms_seo_metadata`, `cms_page_fab_config`, `cms_media_library`, `cms_page_templates`, `cms_page_versions`
- Dashboard: `dashboard_layouts`, `dashboard_widgets`, `user_dashboard_preferences`, `dashboard_quick_actions`

**Row Level Security (RLS):**
All tables have RLS enabled. Permission checks must be implemented server-side using:

```typescript
// Check permissions via database function
SELECT has_permission(auth.uid(), 'module:resource:action')
```

### Authentication Flow

**Google OAuth (Restricted to @jkkn.ac.in):**

1. User clicks "Sign in with Google"
2. Supabase Auth redirects to Google with domain restriction
3. Email validation against `approved_emails` whitelist
4. Auto-create `profiles` and `members` records (existing trigger)
5. Assign default role: `guest`
6. Middleware protects `/admin/*` routes based on role and permissions

**Role Hierarchy:**

- `super_admin` - Full system access
- `director` - Chapter-level management
- `chair` - Vertical/department leadership
- `member` - Standard user
- `guest` - Default role (limited access)

### Path Aliases

TypeScript path mapping configured:

```typescript
"@/*" → project root
```

Usage: `import { Component } from '@/components/ui/button'`

### Supabase Client Patterns

**Three client types:**

1. **Browser Client** (`lib/supabase/client.ts`)

   - Use in Client Components
   - Real-time subscriptions
   - Client-side queries (with RLS protection)

2. **Server Client** (`lib/supabase/server.ts`)

   - Use in Server Components and Server Actions
   - Secure server-side operations
   - Access to service role (when needed)

3. **Middleware Client** (`lib/supabase/middleware.ts`)
   - Use in `middleware.ts` only
   - Session refresh
   - Auth checks

**Never expose service role key to client.**

## Module Development Workflow

### Phase 1 Modules (Priority)

1. **User Management & RBAC** - Authentication, roles, permissions, activity tracking
2. **Content Management System** - Page builder, SEO, media library, FAB
3. **Advanced Dashboard** - Role-based dashboards with widgets

## ⚠️ MANDATORY: Claude Skills Usage

**CRITICAL REQUIREMENT:** For **EVERY** module implementation, you **MUST** use the following skills. This is **NON-NEGOTIABLE** and applies to all development work:

### Required Skills for ALL Module Implementation

#### 1. **nextjs16-web-development** (`.claude/skills/nextjs16-web-development`)

- **REQUIRED FOR:** Every single Next.js feature, component, page, or Server Action
- **WHEN TO USE:**
  - Before writing ANY Next.js code
  - Creating new routes, pages, or layouts
  - Implementing Server Actions or Server Components
  - Setting up forms, validation, or data fetching
  - Implementing caching strategies
  - Any CRUD operation
- **COVERS:**
  - Next.js 16 Cache Components
  - Server Actions best practices
  - Server Components patterns
  - Form handling with React Hook Form
  - Zod validation schemas
  - Supabase integration patterns
  - TypeScript type generation
  - Error handling and loading states
- **⚠️ WARNING:** Do NOT implement Next.js features without consulting this skill first

#### 2. **advanced-tables-components** (`.claude/skills/advanced-tables-components`)

- **REQUIRED FOR:** Every data table, list view, or tabular display
- **WHEN TO USE:**
  - User lists, role lists, activity logs
  - Content pages list, media library
  - Dashboard data tables
  - Any table with pagination, sorting, or filtering
  - Any table with bulk actions or row selection
- **COVERS:**
  - TanStack Table v8 setup and configuration
  - Server-side pagination, sorting, filtering
  - Column management and visibility
  - Row selection and bulk actions
  - Export functionality (CSV, Excel)
  - Real-time table updates
  - Advanced filtering UI
  - Supabase integration for server-side operations
- **⚠️ WARNING:** Do NOT create data tables without using this skill

### Skill Invocation Protocol

**BEFORE starting ANY module implementation:**

```typescript
// 1. FIRST: Load the nextjs16-web-development skill
Skill({ skill: "nextjs16-web-development" })

// 2. THEN: If implementing data tables, load advanced-tables-components
Skill({ skill: "advanced-tables-components" })

// 3. ONLY THEN: Start implementation following skill guidelines
```

**Example Workflow:**

```
User: "Implement the User Management module"

Assistant Steps:
1. ✅ Skill({ skill: "nextjs16-web-development" })
2. ✅ Skill({ skill: "advanced-tables-components" }) // Users list needs tables
3. ✅ Read PRD section for User Management
4. ✅ Follow nextjs16-web-development patterns for Server Actions
5. ✅ Follow advanced-tables-components patterns for user list
6. ✅ Implement with exact patterns from skills
```

### Additional Skills (Use as Needed)

#### 3. **supabase-expert** (`.claude/skills/supabase-expert`)

- **USE FOR:** Database migrations, RLS policies, Auth SSR, Edge Functions
- **WHEN TO USE:** Creating new tables, modifying schema, writing complex RLS policies

#### 4. **brand-styling** (`.claude/skills/brand-styling`)

- **USE FOR:** UI consistency, design system implementation
- **WHEN TO USE:** Creating new UI components, styling pages, implementing design patterns

### Consequences of Not Using Skills

**If you implement modules WITHOUT using the required skills:**

- ❌ Code will not follow Next.js 16 best practices
- ❌ Tables will lack proper server-side operations
- ❌ Performance will be suboptimal
- ❌ Security vulnerabilities may be introduced
- ❌ Code will not match project architecture
- ❌ Implementation will need to be rewritten

### Skill Usage Checklist

Before implementing ANY module, verify:

- [ ] Have I loaded `nextjs16-web-development` skill?
- [ ] Does this module need data tables? → Load `advanced-tables-components`
- [ ] Does this module need database changes? → Load `supabase-expert`
- [ ] Does this module need UI components? → Load `brand-styling`
- [ ] Am I following the exact patterns shown in the skills?

### Server Action Pattern

All mutations must use Server Actions:

```typescript
// app/actions/users.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'

const schema = z.object({
  email: z.string().email().endsWith('@jkkn.ac.in'),
  fullName: z.string().min(1)
})

export async function createUser(formData: FormData) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const data = schema.parse({
    email: formData.get('email'),
    fullName: formData.get('fullName')
  })

  // Database operation
  const { data: result, error } = await supabase
    .from('approved_emails')
    .insert({ email: data.email })
    .select()
    .single()

  if (error) throw error

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'users',
    resourceType: 'approved_email',
    resourceId: result.id,
    metadata: { email: data.email }
  })

  // Revalidate
  revalidatePath('/admin/users')

  return { success: true }
}
```

### Real-time Subscription Pattern

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeTable<T>(table: string, filter?: string) {
  const [data, setData] = useState<T[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table,
        filter
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setData(prev => [payload.new as T, ...prev])
        }
        // Handle UPDATE, DELETE
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [table, filter])

  return data
}
```

### Permission Check Pattern

**Server-side (required):**

```typescript
// middleware.ts or Server Actions
async function checkPermission(userId: string, permission: string) {
  const { data } = await supabase.rpc('has_permission', {
    user_uuid: userId,
    required_permission: permission
  })
  return data
}
```

**Client-side (UI only):**

```typescript
// lib/hooks/use-permissions.ts
'use client'

export function usePermission(permission: string) {
  const { data: hasPermission } = useQuery({
    queryKey: ['permission', permission],
    queryFn: () => checkPermission(userId, permission)
  })
  return hasPermission
}
```

## Component Development

### UI Components (Radix UI)

Extensive Radix UI primitives are installed. Use shadcn/ui pattern:

```typescript
// components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border border-input bg-background'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### CMS Block Components

All page builder components must be registered:

```typescript
// components/cms-blocks/content/hero-section.tsx
import { z } from 'zod'

export const HeroSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  backgroundImage: z.string().url(),
  ctaButtons: z.array(z.object({
    label: z.string(),
    link: z.string(),
    variant: z.enum(['primary', 'secondary'])
  }))
})

export type HeroSectionProps = z.infer<typeof HeroSectionSchema>

export function HeroSection({ title, subtitle, backgroundImage, ctaButtons }: HeroSectionProps) {
  return (
    <section className="relative h-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container mx-auto h-full flex flex-col justify-center">
        <h1 className="text-5xl font-bold">{title}</h1>
        {subtitle && <p className="text-xl mt-4">{subtitle}</p>}
        <div className="flex gap-4 mt-8">
          {ctaButtons?.map((btn, i) => (
            <a key={i} href={btn.link} className={`btn btn-${btn.variant}`}>
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// Register in lib/cms/component-registry.ts
export const COMPONENTS = {
  HeroSection: {
    name: 'HeroSection',
    component: HeroSection,
    propsSchema: HeroSectionSchema,
    category: 'content',
    // ... metadata
  }
}
```

## Critical Implementation Notes

### Next.js 16 Best Practices

1. **Always call `mcp__next-devtools__init` first** when working with Next.js
2. **Query Next.js docs** via `mcp__next-devtools__nextjs_docs` for ANY Next.js concept
3. **Server Components by default** - only use 'use client' when needed
4. **Leverage caching** - Use Next.js 16 Cache Components for dynamic routes
5. **No API routes for CRUD** - Use Server Actions instead

### Security Requirements

1. **All admin routes protected** via middleware with role and permission checks
2. **Guest users restricted** - Can access `/admin/dashboard` only with limited view
3. **RLS policies required** on all new tables
4. **Server-side validation** - Never trust client input
5. **Activity logging required** - Track all user actions across modules

### Database Guidelines

1. **Use migrations for schema changes** via `mcp__supabase__apply_migration`
2. **Generate TypeScript types** after schema changes
3. **Test RLS policies** thoroughly before deployment
4. **Use database functions** for complex permission checks
5. **Index foreign keys** and frequently queried columns

### Performance Considerations

1. **Server-side pagination** - Never load all rows client-side
2. **Optimize images** - Use next/image with WebP conversion
3. **Lazy load components** - Use React.lazy() and Suspense
4. **React Query caching** - Leverage staleTime for client state
5. **Minimize bundle size** - Code split, dynamic imports

## Documentation

- **PRD:** `docs/PRD.md` - Complete product requirements (78,000+ words)
- **Database Schema:** View via `mcp__supabase__list_tables`
- **Migrations:** View via `mcp__supabase__list_migrations`

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://pmqodbfhsejbvfbmsfeq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
NEXT_PUBLIC_SITE_URL=https://jkkn.ac.in
```

## MCP Servers Configured

1. **supabase** - Database operations (project: pmqodbfhsejbvfbmsfeq)
2. **sequential-thinking** - AI reasoning for complex problems
3. **actor-critic-thinking** - Balanced evaluation and analysis
4. **next-devtools** - Next.js documentation and runtime tools

## Next.js Documentation Query Protocol

**MANDATORY:** For ANY Next.js-related question or implementation:

1. Call `mcp__next-devtools__init` (if not already done in session)
2. Use `mcp__next-devtools__nextjs_docs` with action "search" or "get"
3. Never answer from memory - always query official docs
4. This applies to: APIs, concepts, configuration, file conventions, features, routing, data fetching, rendering, deployment, migrations, error handling

Example:

```typescript
// WRONG: Implementing based on memory
export const dynamic = 'force-dynamic' // May be outdated

// CORRECT: Query docs first
// 1. mcp__next-devtools__nextjs_docs({ action: "search", query: "dynamic rendering" })
// 2. Read official documentation
// 3. Implement based on latest Next.js 16 patterns
```

## Workflow for New Features

**MANDATORY SEQUENCE - Follow this exact order:**

1. **Load Required Skills FIRST** ⚠️ **NON-NEGOTIABLE**

   - Load `Skill({ skill: "nextjs16-web-development" })` - ALWAYS required
   - Load `Skill({ skill: "advanced-tables-components" })` - If building tables/lists
   - Load `Skill({ skill: "supabase-expert" })` - If database changes needed
   - Load `Skill({ skill: "brand-styling" })` - If building UI components

2. **Read PRD** (`docs/PRD.md`) for requirements

   - Find the specific module section
   - Understand features, database schema, and implementation details

3. **Check database schema** via `mcp__supabase__list_tables`

   - Use existing tables when possible
   - Identify which new tables are needed (see PRD Section 8)

4. **Create migrations** (if database changes needed)

   - Use `mcp__supabase__apply_migration` for DDL operations
   - Follow migration naming convention: `{timestamp}_{description}.sql`
   - Always add RLS policies for new tables
   - Generate TypeScript types after: `mcp__supabase__generate_typescript_types`

5. **Implement Server Actions** following `nextjs16-web-development` skill patterns

   - All mutations must use Server Actions (NOT API routes)
   - Zod validation schemas required
   - Error handling and revalidation
   - Activity logging

6. **Build UI components** following skill patterns

   - Use `nextjs16-web-development` for forms and layouts
   - Use `advanced-tables-components` for data tables
   - Use `brand-styling` for consistent styling
   - Follow Radix UI + Tailwind patterns

7. **Add permission checks**

   - Server-side validation in middleware and Server Actions
   - Client-side checks for UI only (usePermission hook)
   - Format: `module:resource:action`

8. **Log user activity** via `logActivity()` utility

   - Track all create, edit, delete actions
   - Include metadata for audit trail

9. **Test with real-time** (if applicable)

   - Verify Supabase Realtime subscriptions work
   - Test notification delivery
   - Check activity feed updates

10. **Verify implementation**
    - Run TypeScript compiler: `npm run build`
    - Test all CRUD operations
    - Verify permission checks work
    - Check RLS policies protect data

**⚠️ CRITICAL:** Steps 1 (Load Skills) cannot be skipped. Implementing without skills will result in non-compliant code that must be rewritten.

---

## 📋 Mandatory Database Documentation Workflow

**This workflow is COMPULSORY and must be followed for ALL database operations. No exceptions.**

### Documentation Folder Structure

```
docs/database/
├── main-supabase/           # Main Supabase project (pmqodbfhsejbvfbmsfeq)
│   ├── README.md            # Documentation guide
│   ├── 01-functions.sql     # All PostgreSQL functions
│   ├── 02-rls-policies.sql  # All RLS policies
│   ├── 03-triggers.sql      # All triggers
│   ├── 04-foreign-keys.sql  # All foreign key relationships
│   └── 05-migrations/       # Migration history (optional)
├── dental-supabase/         # Dental College project (wnmyvbnqldukeknnmnpl)
│   └── [same structure]
└── [other-institution]/     # Future institution projects
    └── [same structure]
```

### File Mapping: What Goes Where

| Change Type | Documentation File | Example |
|-------------|-------------------|---------|
| New function | `01-functions.sql` | `is_super_admin()`, `get_dashboard_stats()` |
| New RLS policy | `02-rls-policies.sql` | User roles SELECT policy |
| New trigger | `03-triggers.sql` | `handle_new_user()` trigger |
| New foreign key | `04-foreign-keys.sql` | `user_roles.user_id → auth.users.id` |
| New table | All files as needed | Create table + RLS + triggers |
| Schema modification | Relevant file(s) | Update affected documentation |

### Step-by-Step Workflow

**BEFORE executing ANY database migration, follow these steps IN ORDER:**

#### Step 1: Document First (MANDATORY)

```
1. Open the appropriate documentation file in `docs/database/main-supabase/`
2. Add the SQL code with proper comments
3. Include metadata: purpose, dependencies, security implications
4. Save the documentation file
```

#### Step 2: Execute Migration

```
1. ONLY AFTER documentation is complete
2. Use `mcp__Main_Supabase_Project__apply_migration` for Main Supabase
3. Use `mcp__Dental_College_Supabase_Project__apply_migration` for Dental College
4. Verify migration was successful
```

#### Step 3: Sync to Other Institutions (If Applicable)

```
1. After Main Supabase migration succeeds
2. Apply same migration to other institution databases
3. Document any institution-specific variations
```

### Documentation Format

When adding SQL to documentation files, use this format:

```sql
-- ============================================
-- Function/Policy/Trigger Name
-- ============================================
-- Purpose: [Brief description]
-- Created: [Date]
-- Modified: [Date if updated]
-- Dependencies: [List any dependencies]
-- Used by: [List tables/functions that use this]
-- Security: [SECURITY DEFINER / INVOKER if applicable]
-- ============================================

[SQL CODE HERE]

-- End of [Name]
-- ============================================
```

### Example Workflow

**Scenario:** Adding a new function `get_user_permissions()`

**Step 1: Document in `docs/database/main-supabase/01-functions.sql`**

```sql
-- ============================================
-- get_user_permissions
-- ============================================
-- Purpose: Returns all permissions for a given user
-- Created: 2026-01-03
-- Dependencies: user_roles, role_permissions, roles tables
-- Used by: Permission checking in admin panel
-- Security: SECURITY DEFINER (bypasses RLS)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid UUID)
RETURNS TABLE (permission TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT rp.permission
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  JOIN role_permissions rp ON r.id = rp.role_id
  WHERE ur.user_id = user_uuid;
END;
$$;

-- End of get_user_permissions
-- ============================================
```

**Step 2: Execute Migration**

```typescript
mcp__Main_Supabase_Project__apply_migration({
  name: "add_get_user_permissions_function",
  query: "[SQL from documentation]"
})
```

**Step 3: Sync to Dental College**

```typescript
mcp__Dental_College_Supabase_Project__apply_migration({
  name: "add_get_user_permissions_function",
  query: "[Same SQL]"
})
```

### Multi-Institution Sync Protocol

When syncing changes across institutions:

1. **Document in Main first** → `docs/database/main-supabase/`
2. **Apply to Main Supabase** → Verify success
3. **Apply to each institution** → Use their specific MCP tool
4. **Document any variations** → If an institution needs different SQL

### Supabase Project References

| Institution | Project ID | MCP Tool Prefix |
|-------------|------------|-----------------|
| Main | `pmqodbfhsejbvfbmsfeq` | `mcp__Main_Supabase_Project__` |
| Dental College | `wnmyvbnqldukeknnmnpl` | `mcp__Dental_College_Supabase_Project__` |

### Consequences of NOT Following This Workflow

- ❌ Database changes become undocumented and untraceable
- ❌ Multi-institution sync becomes error-prone
- ❌ Debugging RLS/permission issues becomes extremely difficult
- ❌ Future developers cannot understand database structure
- ❌ Schema drift between institutions goes undetected
- ❌ Recovery from database issues becomes nearly impossible

### Quick Reference Checklist

Before ANY database operation:

- [ ] Have I documented the SQL in `docs/database/[project]/`?
- [ ] Is the documentation properly formatted with comments?
- [ ] Have I specified dependencies and security implications?
- [ ] Am I using the correct MCP tool for the target Supabase project?
- [ ] Do I need to sync this change to other institutions?
- [ ] Have I verified the migration succeeded?

**Remember: DOCUMENT FIRST, EXECUTE SECOND. This is NON-NEGOTIABLE.**

---

## Common Patterns Reference

### Form with Server Action

```typescript
// app/(admin)/users/new/page.tsx
'use client'

import { useFormState } from 'react-dom'
import { createUser } from '@/app/actions/users'

export default function NewUserPage() {
  const [state, formAction] = useFormState(createUser, null)

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="fullName" required />
      <button type="submit">Create User</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

### Data Table with Server-Side Operations

```typescript
// Use advanced-tables-components skill for implementation
// Pattern: TanStack Table + Server Actions + Pagination
```

### Dynamic CMS Page Rendering

```typescript
// app/(public)/[...slug]/page.tsx
export async function generateStaticParams() {
  const { data } = await supabase
    .from('cms_pages')
    .select('slug')
    .eq('status', 'published')
  return data?.map(p => ({ slug: p.slug.split('/') })) || []
}

export default async function DynamicPage({ params }) {
  const slug = params.slug.join('/')
  const { data: page } = await supabase
    .from('cms_pages')
    .select('*, cms_page_blocks(*)')
    .eq('slug', slug)
    .single()

  return <PageRenderer blocks={page.cms_page_blocks} />
}
```

## Implementation Status

**Current:** Bootstrap stage with database schema complete
**Phase 1 (Weeks 1-4):** Foundation setup
**Phase 2 (Weeks 5-7):** User Management & RBAC
**Phase 3 (Weeks 8-12):** Content Management System
**Phase 4 (Weeks 13-15):** Dashboard & Analytics
**Phase 5 (Weeks 16-18):** Public Frontend
**Phase 6 (Weeks 19-20):** Testing & Launch

See `docs/PRD.md` Section 9 for detailed roadmap.
