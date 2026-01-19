# JKKN Multi-Institution Website - Comprehensive Code Structure Analysis

**Analysis Date:** 2026-01-19
**Project:** JKKN Institution Website (Next.js 16 + Supabase)
**Architecture:** Single Repository, Multiple Deployments (SRMD)

---

## Executive Summary

The JKKN Institution Website is a **production-grade, full-stack Next.js 16 application** serving 6 educational institutions from a single codebase. It demonstrates advanced architectural patterns including:

- **Multi-Tenancy**: Single repository with 6 separate Supabase databases and Vercel deployments
- **Comprehensive Security**: Role-Based Access Control (RBAC), granular permissions (`module:resource:action` format), Row-Level Security (RLS), complete audit logging
- **Modern Tech Stack**: Next.js 16 Cache Components, Server Actions, React 19, TypeScript strict mode
- **Advanced Features**: Visual page builder (60+ components), CMS, blog system, analytics dashboard, real-time updates
- **Developer Experience**: MCP integration, institution switcher, clear conventions, comprehensive documentation

**Current Status:** Early development with production-ready database schema (60+ tables) and architectural foundation complete.

---

## 1. Project Architecture Overview

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.0.7 |
| **Runtime** | React | 19.2.1 |
| **Language** | TypeScript (strict mode) | 5.x |
| **Database** | Supabase PostgreSQL | Cloud |
| **Authentication** | Supabase Auth (Google OAuth) | - |
| **Storage** | Supabase Storage | - |
| **Styling** | Tailwind CSS | v4 |
| **UI Components** | Radix UI + shadcn/ui | Latest |
| **Forms** | React Hook Form + Zod | Latest |
| **Data Tables** | TanStack Table | v8 |
| **Charts** | Recharts | Latest |
| **Real-time** | Supabase Realtime | - |
| **Deployment** | Vercel | - |

### Multi-Institution Architecture (SRMD)

```
┌─────────────────────────────────────────────────┐
│        ONE GitHub Repository (jkkn-main)        │
│     All code changes → All 6 sites auto-update  │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬──────────┐
        ▼               ▼               ▼          ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ [etc.]
│ Vercel Main │ │Vercel Dental│ │Vercel Engr. │
│ jkkn.ac.in  │ │dental.jkkn. │ │engg.jkkn.   │
│ ENV:main    │ │ENV:dental   │ │ENV:engr     │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │
       ▼               ▼               ▼
  Supabase:      Supabase:        Supabase:
  pmqodbfh...    wnmyvbnqlduk...  kyvfkyjm...
  (Main DB)      (Dental DB)      (Engr. DB)
```

**6 Institutions:**
1. **Main** (jkkn.ac.in) - Umbrella organization - ✅ Production (60+ tables)
2. **Engineering** (engg.jkkn.ac.in) - ✅ Feature Parity (49+ tables)
3. **Dental** (dental.jkkn.ac.in) - 🔄 Partial (35+ tables)
4. **Pharmacy** (pharmacy.jkkn.ac.in) - 🔄 Partial (35+ tables)
5. **Arts & Science** (arts.jkkn.ac.in) - 🚧 Setup Pending
6. **Nursing** (nursing.jkkn.ac.in) - 🚧 Setup Pending

**Key Principle:** Configuration over code - differences handled via environment variables and feature flags, not code branching.

---

## 2. Folder Structure & Organization

### Top-Level Directory Structure

```
jkkn-main-website/
├── app/                    # Next.js App Router (all routes + Server Actions)
│   ├── (public)/          # Public marketing website
│   ├── (admin)/           # Admin panel (internal management)
│   ├── (auth)/            # Authentication flows
│   ├── (editor)/          # Page builder editor
│   ├── (test)/            # Testing routes (dev only)
│   ├── actions/           # Server Actions (~40 files)
│   ├── api/               # API routes (webhooks, cron, preview)
│   └── layout.tsx         # Root layout with providers
│
├── components/            # React components (UI, layouts, features)
│   ├── ui/               # Base Radix UI components (40+)
│   ├── cms-blocks/       # Page builder content blocks (60+)
│   ├── page-builder/     # Visual page editor
│   ├── data-table/       # TanStack Table components
│   ├── dashboard/        # Dashboard widgets
│   ├── admin/            # Admin-specific components
│   ├── public/           # Public site components
│   ├── analytics/        # Analytics & charts
│   ├── navigation/       # Nav components (mobile, desktop)
│   └── providers/        # React context providers
│
├── lib/                  # Shared utilities and helpers
│   ├── supabase/        # Supabase clients (browser, server, admin, middleware)
│   ├── cms/             # CMS utilities, component registry (305KB)
│   ├── config/          # Configuration (multi-tenant, institutions)
│   ├── hooks/           # Custom React hooks
│   ├── seo/             # SEO utilities and metadata
│   ├── analytics/       # Analytics tracking
│   ├── dashboard/       # Dashboard widget registry
│   ├── utils/           # General utilities
│   └── constants/       # Institutional data constants
│
├── docs/                # Documentation
│   ├── database/        # Database documentation per institution
│   │   ├── main-supabase/
│   │   ├── dental-college/
│   │   ├── engineering-college/
│   │   └── pharmacy-supabase/
│   ├── Multi-Institution/  # Architecture docs
│   ├── page-builder/       # Page builder guides
│   └── PRD.md             # Product Requirements (99KB)
│
├── public/              # Static assets
├── styles/              # Global CSS
├── supabase/            # Supabase migrations folder
├── scripts/             # Utility scripts (institution switcher, migrations)
├── tests/               # Playwright E2E tests
├── metrics/             # Performance metrics
│
├── middleware.ts        # Auth and permission middleware
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
├── .mcp.json           # MCP server configurations
└── CLAUDE.md           # AI development guidelines
```

### Key Architectural Decisions

1. **Route Groups** - Organized by user context:
   - `(public)/` - Marketing website
   - `(admin)/` - Internal management
   - `(auth)/` - Authentication flows
   - `(editor)/` - Page builder

2. **Server Actions** - All mutations use Server Actions (no traditional API routes for CRUD)

3. **Component Registry** - CMS blocks registered in `lib/cms/component-registry.ts` (305KB, 60+ components)

4. **Permission Model** - Format: `module:resource:action` (e.g., `users:profiles:edit`)

---

## 3. Application Routes Structure

### Public Routes (`app/(public)/`)

```
(public)/
├── layout.tsx              # Public layout (header, footer, theme)
├── [[...slug]]/page.tsx   # Dynamic catch-all for CMS pages
├── blog/                   # Blog listing and detail pages
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   └── category/[slug]/page.tsx
└── admissions/             # Admissions pages
    └── [institution]/page.tsx
```

**Key Feature:** Dynamic page rendering from `cms_pages` table using catch-all route.

### Admin Routes (`app/(admin)/`)

```
(admin)/admin/
├── layout.tsx                    # Admin layout (sidebar, header, auth check)
├── dashboard/page.tsx            # Main dashboard
├── analytics/                    # Analytics dashboard
│   ├── page.tsx
│   ├── users/page.tsx
│   ├── content/page.tsx
│   └── engagement/page.tsx
├── content/                      # Content Management
│   ├── pages/                   # CMS pages
│   │   ├── page.tsx            # List
│   │   ├── new/page.tsx        # Create
│   │   └── [id]/
│   │       ├── page.tsx        # View
│   │       └── edit/page.tsx   # Edit
│   ├── blog/                   # Blog management
│   ├── media/                  # Media library
│   └── components/             # Component registry
├── users/                       # User Management
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
├── roles/                       # Role Management
│   ├── page.tsx
│   └── [id]/page.tsx
├── activity/page.tsx            # Activity logs
└── settings/                    # System Settings
    ├── general/page.tsx
    ├── appearance/page.tsx
    ├── seo/page.tsx
    ├── notifications/page.tsx
    └── system/page.tsx
```

**Security:** All `/admin/*` routes protected by middleware with role and permission checks.

### Authentication Routes (`app/(auth)/`)

```
(auth)/auth/
├── login/page.tsx           # Google OAuth login
├── callback/route.ts        # OAuth callback handler
└── access-denied/page.tsx   # Permission denied page
```

### Editor Routes (`app/(editor)/`)

```
(editor)/editor/
└── [id]/page.tsx           # Page builder editor
```

---

## 4. Backend Architecture

### Server Actions Organization (`app/actions/`)

**40+ Server Action files** organized by domain:

```
actions/
├── auth.ts                 # Login, logout, session management
├── users.ts               # User CRUD (1,700+ lines)
├── roles.ts               # Role management
├── permissions.ts         # Permission checks
├── analytics.ts           # Analytics operations
├── contact.ts             # Contact form submissions
├── admission-inquiry.ts   # Admission form handling
├── dashboard-stats.ts     # Dashboard statistics
├── track-pageview.ts      # Page view tracking
├── cms/
│   ├── pages.ts          # Page CRUD
│   ├── blocks.ts         # Block operations
│   ├── media.ts          # Media uploads
│   ├── blog.ts           # Blog posts
│   ├── navigation.ts     # Nav menu management
│   ├── appearance.ts     # Logo, theme settings
│   ├── footer.ts         # Footer config
│   ├── components.ts     # Custom components
│   ├── fab.ts            # Floating action button
│   ├── templates.ts      # Page templates
│   └── versions.ts       # Version control
└── settings.ts           # System settings
```

**Standard Server Action Pattern:**

```typescript
'use server'

export async function createResource(formData: FormData) {
  // 1. Create server client
  const supabase = await createServerSupabaseClient()

  // 2. Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 3. Validate input (Zod)
  const data = schema.parse(...)

  // 4. Check permissions
  const hasPermission = await checkUserPermission(user.id, 'module:resource:create')
  if (!hasPermission) throw new Error('Forbidden')

  // 5. Perform database operation
  const { data: result, error } = await supabase.from('table').insert(...)
  if (error) throw error

  // 6. Log activity
  await logActivity({ userId: user.id, action: 'create', ... })

  // 7. Revalidate cache
  revalidatePath('/admin/resources')

  return { success: true }
}
```

### Supabase Client Patterns (3-Tier Architecture)

1. **Browser Client** (`lib/supabase/client.ts`)
   - Use in Client Components
   - Real-time subscriptions
   - Client-side queries (RLS protection)
   - Public anon key

2. **Server Client** (`lib/supabase/server.ts`)
   - Use in Server Components and Server Actions
   - Cookie-based session management
   - Secure server-side operations
   - Anon key with user context

3. **Admin Client** (`lib/supabase/server.ts::createAdminSupabaseClient()`)
   - Privileged operations (service role key)
   - Bypasses RLS policies
   - User management via Auth Admin API
   - **Never expose to client**

4. **Middleware Client** (`lib/supabase/middleware.ts`)
   - Use in `middleware.ts` only
   - Session refresh
   - Auth checks

5. **Public Client** (`lib/supabase/public.ts`)
   - Static generation-friendly (no cookies)
   - Public data only
   - SEO metadata

### Authentication & Authorization Flow

**OAuth Flow (Google):**
1. User clicks "Sign in with Google"
2. Supabase redirects to Google OAuth (domain: `@jkkn.ac.in`)
3. After approval, redirects to `/auth/callback`
4. Callback exchanges code for session
5. Database trigger auto-creates `profiles` and `members`
6. Default `guest` role assigned
7. Middleware validates email domain and roles
8. Redirects to `/admin` dashboard

**Middleware Permission System** (`middleware.ts`):
- **Level 1:** Authentication check
- **Level 2:** Domain validation (`@jkkn.ac.in`)
- **Level 3:** Role + Permission validation
  - Super admin: Full access
  - Guest: Limited to `/admin` dashboard only
  - Others: Route-specific permission checks

**Permission Format:** `module:resource:action`
- Examples: `users:profiles:view`, `content:pages:edit`, `cms:templates:export`
- Wildcards: `*:*:*` (super admin), `users:*:*` (all user operations), `users:profiles:*` (all profile actions)

---

## 5. Database Architecture

### Multi-Institution Database Setup

Each institution has **separate Supabase project** with identical schema:

| Institution | Project ID | Tables | Status |
|-------------|------------|--------|--------|
| Main | `pmqodbfhsejbvfbmsfeq` | 60+ | ✅ Production |
| Engineering | `kyvfkyjmdbtyimtedkie` | 49+ | ✅ Feature Parity |
| Dental | `wnmyvbnqldukeknnmnpl` | 35+ | 🔄 Partial |
| Pharmacy | `rwskookarbolpmtolqkd` | 35+ | 🔄 Partial |
| Arts & Science | TBD | - | 🚧 Pending |
| Nursing | TBD | - | 🚧 Pending |

### Database Schema (60+ Tables)

**User Management (9 tables):**
- `profiles` - User profile data (1:1 with auth.users)
- `members` - Organization membership
- `roles` - Role definitions (super_admin, director, chair, member, guest)
- `user_roles` - User-to-role assignments (many-to-many)
- `role_permissions` - Role-to-permission mappings
- `user_role_changes` - Audit trail for role changes
- `user_activity_logs` - Comprehensive activity logging
- `approved_emails` - Email whitelist for OAuth
- `deleted_users_archive` - Deleted user data

**CMS System (15 tables):**
- `cms_pages` - Page metadata (title, slug, status, visibility)
- `cms_page_blocks` - Page content blocks (hierarchical)
- `cms_page_versions` - Page version history
- `cms_page_templates` - Reusable page templates
- `cms_page_fab_config` - Floating action button config
- `cms_seo_metadata` - SEO metadata per page
- `cms_media_library` - Media file tracking
- `cms_component_registry` - Available components
- `cms_page_collections` - Page groupings
- And 6 more...

**Blog System (8 tables):**
- `blog_posts`, `blog_posts_versions`, `blog_categories`, `blog_tags`
- `blog_comments`, `blog_comments_likes`, `blog_posts_likes`, `blog_subscribers`

**Analytics (3 tables):**
- `page_views`, `page_analytics`, `user_analytics`

**Dashboard (4 tables):**
- `dashboard_layouts`, `dashboard_widgets`, `dashboard_widget_data`, `user_dashboard_preferences`

**Plus:** Events, announcements, settings, career management, etc.

### Row-Level Security (RLS)

**126+ RLS Policies** enforcing:
- Permission-based access (`has_permission()` function)
- Role-based restrictions (`is_super_admin()` function)
- User ownership checks
- Status-based visibility (published vs draft)

**Example Policy:**
```sql
CREATE POLICY "users can view profiles if they have permission"
ON public.profiles
FOR SELECT
TO public
USING (has_permission(auth.uid(), 'users:profiles:view'));
```

### Database Functions

**56+ PostgreSQL Functions** including:
- `has_permission(user_uuid, required_permission)` - Permission checking with wildcard support
- `is_super_admin(user_uuid)` - Super admin check
- `get_user_roles(user_uuid)` - All roles for user
- `get_user_permissions(user_uuid)` - Flattened permissions array
- Various analytics functions, content stats, etc.

### Database Documentation Structure

**Mandatory Documentation:** All database changes documented in `docs/database/[institution]/` **BEFORE** executing migrations.

```
docs/database/
├── main-supabase/
│   ├── 00-tables.sql          # 52+ table definitions
│   ├── 01-functions.sql       # 56+ PostgreSQL functions
│   ├── 02-rls-policies.sql    # 126+ RLS policies
│   ├── 03-triggers.sql        # Auto-created profiles, members
│   ├── 04-foreign-keys.sql    # Foreign key relationships
│   ├── 05-indexes.sql         # Performance indexes
│   └── README.md              # Documentation guide
├── dental-supabase/
├── pharmacy-supabase/
└── engineering-college/
```

---

## 6. Frontend Component Architecture

### Component Organization

```
components/
├── ui/                      # Base Radix UI (40+ components)
│   ├── button.tsx          # All use CVA for variants
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── [40+ more...]
│
├── cms-blocks/              # Page Builder content (60+ blocks)
│   ├── content/            # 56 content sections
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── modern-*.tsx (12 modern glassmorphism variants)
│   │   └── [education, institutions, galleries...]
│   ├── admissions/         # 10+ admission-specific blocks
│   ├── layout/             # Layout blocks (containers, columns)
│   ├── media/              # Media blocks (video, gallery)
│   ├── data/               # Data-driven blocks
│   └── page-renderer.tsx   # Block rendering engine
│
├── page-builder/           # Visual Editor (900+ lines)
│   ├── page-builder.tsx    # Main editor with DnD (@dnd-kit)
│   ├── properties/         # Dynamic form for props
│   │   └── dynamic-form.tsx  # Universal form generator
│   ├── palette/            # Component palette UI
│   ├── canvas/             # Builder canvas
│   ├── panels/             # Settings panels (SEO, FAB, Typography)
│   ├── elementor/          # Layer navigator
│   └── toolbar/            # Top toolbar
│
├── data-table/             # TanStack Table v8
│   ├── data-table.tsx      # Server-side pagination/sort/filter
│   ├── data-table-column-header.tsx
│   └── data-table-pagination.tsx
│
├── dashboard/              # Admin Dashboard
│   ├── widgets/            # 7+ reusable widgets
│   │   ├── content-metrics-widget.tsx
│   │   ├── recent-activity-widget.tsx
│   │   └── [notifications, quick actions...]
│   └── dashboard-grid.tsx
│
├── public/                 # Public Site
│   ├── site-header.tsx     # Dynamic navigation
│   ├── site-footer.tsx     # Footer with map
│   ├── landing-page.tsx    # Landing wrapper
│   └── contact-form.tsx
│
├── admin/                  # Admin Panel
│   ├── admin-sidebar.tsx
│   ├── admin-header.tsx
│   └── settings/           # Settings forms
│
├── analytics/              # Charts & Analytics
│   └── charts/             # Recharts-based visualizations
│
└── providers/              # React Context
    └── user-data-provider.tsx
```

### CMS/Page Builder Implementation

**Architecture:** Hybrid JSON + Component Registry

**Component Registry** (`lib/cms/component-registry.ts` - 305KB):
- Maps component names to React components
- 60+ pre-built components with Zod schemas
- Categories: content, media, layout, admissions
- Custom component runtime registration
- Lazy-loaded imports for performance

**Component Entry Format:**
```typescript
{
  name: 'HeroSection',
  displayName: 'Hero Section',
  description: 'Large hero banner with background',
  component: HeroSection,
  category: 'content',
  icon: 'Layout',
  defaultProps: { title: '', subtitle: '' },
  editableProps: [
    { name: 'title', type: 'string', label: 'Title' },
    { name: 'backgroundImage', type: 'image', label: 'Background' }
  ],
  supportsChildren: false
}
```

**Page Builder Features:**
- **Drag & Drop:** @dnd-kit for palette → canvas, reordering
- **Universal Form:** Dynamic form generator based on registry props
- **Live Preview:** Device-responsive (mobile/tablet/desktop)
- **Auto-Save:** Debounced auto-save every 3 seconds
- **Undo/Redo:** Full history tracking
- **Copy/Paste:** Block clipboard support
- **SEO Panel:** Meta tags, OG image, structured data
- **Typography Panel:** Font family, sizes per screen
- **FAB Config:** Floating action button settings

### Design System

**Brand Colors:**
```css
--brand-primary: #0b6d41         (JKKN Green)
--brand-secondary: #ffde59        (JKKN Yellow)
--brand-cream: #fbfbee
--gold-text: #735E1E              (WCAG AA+: 6.27:1)
--gold-accent: #C5A572            (WCAG AAA: 8.38:1)
```

**Typography System:**
- 7 font families loaded from Google Fonts
- Dynamic font loading with caching
- Page-level typography settings

**Styling Approach:**
1. **Tailwind CSS v4** - Core utility styling
2. **CSS Modules** - Component-scoped (where needed)
3. **Inline Styles** - Dynamic styling (color pickers, etc.)
4. **Glassmorphism** - Custom glass.css utilities with presets

### State Management

**Zustand** - Page Builder State:
- Blocks management (add, update, delete, reorder)
- Selection state
- Undo/Redo history
- Clipboard (copy/paste)
- UI state (device, preview mode, dirty flag)

**React Context** - User Data:
- `UserDataProvider` - User role/permission context
- Cached to prevent re-fetching

**Supabase Realtime** - Live Updates:
- `useRealtimeTable` - Subscribe to table changes
- `useRealtimeList` - Auto-sync list with DB
- `useRealtimeRecord` - Watch single record
- `usePresence` - Collaborative presence tracking

---

## 7. Multi-Institution Configuration

### Configuration Management

**Environment Variables (Per Vercel Deployment):**
```env
NEXT_PUBLIC_INSTITUTION_ID=main|dental|engineering|pharmacy|etc.
NEXT_PUBLIC_INSTITUTION_NAME="JKKN Institutions"
NEXT_PUBLIC_SITE_URL=https://jkkn.ac.in
NEXT_PUBLIC_SUPABASE_URL=https://pmqodbfh....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_FEATURES=blog,careers,page-builder,analytics
```

**Runtime Configuration** (`lib/config/multi-tenant.ts`):
```typescript
getCurrentInstitution()      // Get institution config
getInstitutionId()          // Get institution ID
hasFeature(feature)         // Check feature flag
getThemeCSSVariables()      // Get theme colors
getInstitutionMetadata()    // Get SEO metadata
```

**Local Development Switcher:**
```bash
npm run dev:main          # Main Supabase
npm run dev:dental        # Dental Supabase
npm run dev:engineering   # Engineering Supabase
npm run dev:pharmacy      # Pharmacy Supabase
npm run switch main       # Just switch (no dev server)
```

**How it works:**
1. `scripts/switch-institution.ts` contains institution configs
2. Generates `.env.local` with selected institution's credentials
3. Dev server connects to that institution's Supabase

---

## 8. Data Flow Architecture

### Complete Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                USER INTERACTION                          │
│              (Click, Form Submit)                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Middleware (middleware.ts) │
        │  - Auth: getUser()          │
        │  - Domain: @jkkn.ac.in      │
        │  - Roles: Load user roles   │
        │  - Permissions: Check route │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Server Action / Component  │
        │  (app/actions/...)          │
        │  - Validate (Zod)           │
        │  - Check auth               │
        │  - Check permission (RPC)   │
        │  - Query database           │
        │  - Log activity             │
        │  - Revalidate cache         │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Supabase Database          │
        │  - RLS Policies enforced    │
        │  - Triggers (auto-create)   │
        │  - Functions (permissions)  │
        │  - Foreign Keys (cascade)   │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Response to Client         │
        │  - Type-safe FormState      │
        │  - Error codes & details    │
        │  - Returned data            │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  React Component            │
        │  - Display data/error       │
        │  - Permission-based UI      │
        │  - Real-time updates        │
        └────────────────────────────┘
```

---

## 9. Security Architecture

### Multi-Layered Security

1. **Authentication:**
   - Google OAuth (domain: `@jkkn.ac.in`)
   - Session management via cookies
   - Token refresh in middleware

2. **Authorization:**
   - **Middleware:** Route-level checks
   - **Server Actions:** Permission validation
   - **Database:** RLS policies enforced
   - **Client:** UI-only checks (not security)

3. **Data Protection:**
   - Service role key never exposed to client
   - All tables have RLS enabled
   - Anon key limited to RLS-protected operations

4. **Audit Trail:**
   - All actions logged in `user_activity_logs`
   - Includes: user, action, module, resource, IP, user agent, metadata

### Permission System (Two-Tier)

**Server-Side (Authoritative):**
```typescript
// Via RPC function
const { data } = await supabase.rpc('has_permission', {
  user_uuid: userId,
  required_permission: 'users:profiles:edit'
})

// In RLS policies
CREATE POLICY ... USING (has_permission(auth.uid(), 'users:profiles:view'));
```

**Client-Side (UI Only):**
```typescript
const { hasPermission } = usePermission('users:profiles:edit')
return hasPermission ? <EditButton /> : <ViewOnlyText />
```

---

## 10. Performance Optimizations

### Next.js 16 Configuration

**Cache Components:**
- Enabled for static optimization
- Dynamic routes cached at build time

**Bundle Optimization:**
- Radix UI (priority 30)
- Supabase (priority 25)
- TanStack (React Table + Query)
- React core (priority 40)
- Page Builder, Dashboard, Analytics specific chunks

**Image Optimization:**
- AVIF + WebP formats
- Remote patterns for Supabase CDN (4 institutions)
- YouTube, Instagram, Google Drive support

**Cache Headers:**
- Media: 1 year (immutable)
- Images: 30 days (stale-while-revalidate)
- Static files: 1 year

### Application-Level

1. **Lazy Loading:**
   - `React.lazy()` + `Suspense`
   - Modal/panel imports on demand
   - Rich text editor lazy-loaded

2. **Auto-Save with Debounce:**
   - 3-second delay
   - Silent background saves

3. **Pagination:**
   - Server-side pagination in tables
   - `range()` queries with `count: 'exact'`

4. **Real-time:**
   - RLS filters to limit subscription scope
   - Selective channel subscriptions

---

## 11. Development Workflow

### Essential Commands

```bash
# Install dependencies
npm install

# Development (with institution switcher)
npm run dev:main          # Main Supabase
npm run dev:dental        # Dental Supabase
npm run dev:engineering   # Engineering Supabase
npm run dev:pharmacy      # Pharmacy Supabase

# Just switch (no dev server)
npm run switch main
npm run switch --list     # List all institutions

# Production build
npm run build            # TypeScript + Next.js build

# Testing
npm run test
npm run test:headed      # Headed browser testing
npm run test:ui          # Playwright UI mode

# Database migrations
npm run db:migrate:all            # Apply to all institutions
npm run db:migrate:dry            # Preview only
npm run db:migrate -- --institution=dental  # Specific institution
```

### Deployment Architecture

**Vercel Projects (One Per Institution):**

Each institution = Separate Vercel project with:
- Same GitHub repo (branch: main)
- Different environment variables
- Custom domain (jkkn.ac.in, dental.jkkn.ac.in, etc.)
- Auto-deploy on push

**Push once → All 6 Vercel projects auto-deploy**

---

## 12. Key Files Reference

### Critical Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Cache Components, bundle optimization, image config |
| `middleware.ts` | Auth checks, permission validation, session refresh |
| `tsconfig.json` | TypeScript config (strict mode, path aliases) |
| `.mcp.json` | MCP server configurations (Supabase, Next.js, thinking) |
| `CLAUDE.md` | AI development guidelines (mandatory patterns) |

### Core Library Files

| File | Purpose |
|------|---------|
| `lib/supabase/server.ts` | Server & admin Supabase clients |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/middleware.ts` | Middleware client |
| `lib/cms/component-registry.ts` | Component mapping engine (305KB) |
| `lib/cms/registry-types.ts` | Type definitions (93KB) |
| `lib/config/multi-tenant.ts` | Institution config, feature flags |
| `lib/hooks/use-permissions.ts` | Client-side permission hooks |
| `lib/utils/activity-logger.ts` | Activity logging utility |

### Key Component Files

| File | Purpose |
|------|---------|
| `components/page-builder/page-builder.tsx` | Main visual editor (900+ lines) |
| `components/page-builder/properties/dynamic-form.tsx` | Universal prop editor |
| `components/cms-blocks/page-renderer.tsx` | Block rendering engine |
| `components/data-table/data-table.tsx` | TanStack table wrapper |
| `components/providers/user-data-provider.tsx` | User context provider |
| `app/layout.tsx` | Root layout with metadata |
| `app/globals.css` | Design system (Tailwind + brand) |

---

## 13. Documentation Structure

### Comprehensive Documentation

| Document | Purpose | Size |
|----------|---------|------|
| `CLAUDE.md` | AI development guidelines, mandatory skills | 1,177 lines |
| `docs/PRD.md` | Complete product requirements | 99KB |
| `docs/IMPLEMENTATION_PLAN.md` | Implementation roadmap | 70KB |
| `docs/database/main-supabase/*` | Database documentation | Multiple files |
| `docs/page-builder/*` | Page builder guides | Multiple files |
| `docs/Multi-Institution/*` | Architecture docs | Multiple files |

### Database Documentation Protocol

**MANDATORY:** All database changes documented **BEFORE** executing migrations.

**File Mapping:**
- `01-functions.sql` - PostgreSQL functions
- `02-rls-policies.sql` - RLS policies
- `03-triggers.sql` - Database triggers
- `04-foreign-keys.sql` - Foreign key relationships
- `05-indexes.sql` - Performance indexes

---

## 14. Mandatory Development Patterns

### Required Skills (CLAUDE.md)

**CRITICAL REQUIREMENT:** For **EVERY** module implementation:

1. **`nextjs16-web-development`** - Required for ALL Next.js code
   - Server Actions, Server Components, caching, forms, validation

2. **`advanced-tables-components`** - Required for data tables
   - TanStack Table v8, server-side operations, pagination, filtering

3. **`supabase-expert`** - Required for database changes
   - Migrations, RLS policies, Auth SSR, Edge Functions

4. **`brand-styling`** - Required for UI components
   - Design system, consistent styling

**⚠️ WARNING:** Implementing without these skills results in non-compliant code requiring rewrites.

### Database Documentation Workflow

**MANDATORY SEQUENCE:**

1. **Document First** - Add SQL to `docs/database/[project]/[file].sql`
2. **Execute Migration** - Use `mcp__[Project]__apply_migration`
3. **Sync to Other Institutions** - Apply to all institution databases

**Consequences of skipping:** Undocumented changes, schema drift, debugging difficulties, recovery issues.

---

## 15. Key Architectural Patterns Summary

| Pattern | Implementation | Location |
|---------|----------------|----------|
| **Multi-Tenant Config** | Environment variables + feature flags | `lib/config/multi-tenant.ts` |
| **Permission Model** | `module:resource:action` with wildcards | `middleware.ts`, `app/actions` |
| **Activity Logging** | All actions logged with metadata | `lib/utils/activity-logger.ts` |
| **Server Actions** | All mutations use Server Actions | `app/actions/*.ts` |
| **Component Registry** | JSON-based component mapping | `lib/cms/component-registry.ts` |
| **Dynamic Pages** | Catch-all route + DB rendering | `app/(public)/[[...slug]]` |
| **Cache Components** | Next.js 16 static optimization | `next.config.ts` |
| **RLS Policies** | Row-level security on all tables | `docs/database/*/02-rls-policies.sql` |
| **Feature Flags** | Institution-specific features | `NEXT_PUBLIC_FEATURES` env var |
| **Real-time Updates** | Supabase subscriptions | `lib/hooks/use-realtime.ts` |

---

## 16. Project Status & Roadmap

### Current Status
- ✅ Database schema complete (60+ tables)
- ✅ Authentication & RBAC system
- ✅ Multi-institution architecture
- ✅ Page builder foundation
- ✅ Admin panel structure
- 🚧 CMS implementation (in progress)
- 🚧 Public website (in progress)
- 🚧 Analytics dashboard (in progress)

### Implementation Phases (from PRD)

**Phase 1 (Weeks 1-4):** Foundation setup
**Phase 2 (Weeks 5-7):** User Management & RBAC
**Phase 3 (Weeks 8-12):** Content Management System
**Phase 4 (Weeks 13-15):** Dashboard & Analytics
**Phase 5 (Weeks 16-18):** Public Frontend
**Phase 6 (Weeks 19-20):** Testing & Launch

---

## 17. Critical Notes & Best Practices

1. **Security First:** All permission checks happen server-side. Client-side checks are UI-only.

2. **RLS Enforcement:** Database enforces permissions automatically via RLS policies.

3. **Type Safety:** TypeScript strict mode + Zod validation + generated database types.

4. **Multi-Tenant:** Complete data isolation - each institution has separate Supabase project.

5. **Audit Trail:** All actions logged in `user_activity_logs` with IP, user agent, metadata.

6. **Service Role Key:** Never expose to client - only use in admin client for privileged operations.

7. **Session Management:** OAuth callback bypassed in middleware to avoid cookie conflicts.

8. **Real-time:** Supports subscriptions with RLS filtering for performance.

9. **Activity Logging:** Decoupled from main operations (errors logged but don't break flow).

10. **Documentation First:** All database changes documented before executing migrations.

11. **Skills Mandatory:** Must use specified Claude skills for implementation (see CLAUDE.md).

12. **No API Routes:** Use Server Actions for mutations, not traditional API routes.

13. **Server Components Default:** Only use 'use client' when necessary for interactivity.

14. **Cache Revalidation:** Always call `revalidatePath()` after mutations.

15. **Form Validation:** Zod schemas required for all input validation.

---

## 18. Technology Stack Summary

### Core Technologies

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.0.7 |
| **Runtime** | React | 19.2.1 |
| **Language** | TypeScript (strict) | 5.x |
| **Database** | Supabase PostgreSQL | Cloud |
| **Styling** | Tailwind CSS | v4 |
| **UI Library** | Radix UI + shadcn/ui | Latest |
| **Forms** | React Hook Form + Zod | Latest |
| **Tables** | TanStack Table | v8 |
| **Charts** | Recharts | Latest |
| **DnD** | @dnd-kit | Latest |
| **Rich Text** | Tiptap | Latest |
| **State** | Zustand + Context | Latest |
| **Icons** | Lucide React | 550+ icons |
| **Animations** | Framer Motion | Latest |
| **Notifications** | Sonner | Latest |
| **Testing** | Playwright | Latest |
| **Deployment** | Vercel | - |

---

## Conclusion

The JKKN Institution Website represents a **production-grade, enterprise-level Next.js application** with:

- **Advanced Multi-Tenancy:** Single codebase serving 6 institutions with complete data isolation
- **Comprehensive Security:** Multi-layered RBAC, RLS policies, complete audit trails
- **Modern Architecture:** Next.js 16 Cache Components, Server Actions, React 19
- **Developer Experience:** Clear patterns, comprehensive documentation, MCP integration
- **Scalability:** Designed to handle institutional growth and feature expansion
- **Maintainability:** Strict TypeScript, clear conventions, mandatory documentation

The architecture demonstrates professional software engineering practices suitable for mission-critical educational management systems.
