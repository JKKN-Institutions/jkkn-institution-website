# JKKN Institution Website - Product Requirements Document (PRD)

**Version:** 1.0
**Date:** November 23, 2025
**Project:** JKKN Institution Website & Admin Panel
**Tech Stack:** Next.js 16 + React 19 + Supabase + TypeScript

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Module 1: User Management & RBAC](#3-module-1-user-management--rbac)
4. [Module 2: Content Management System](#4-module-2-content-management-system)
5. [Module 3: Advanced Dashboard & Analytics](#5-module-3-advanced-dashboard--analytics)
6. [Phase 2+ Future Modules](#6-phase-2-future-modules)
7. [Technical Implementation Guide](#7-technical-implementation-guide)
8. [Database Schema Requirements](#8-database-schema-requirements)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Skills & Best Practices](#10-skills--best-practices)

---

## 1. Executive Summary

### 1.1 Vision

Build a comprehensive institutional website for JKKN (@jkkn.ac.in) with:

- **Public Frontend:** Marketing-focused website for prospective students and parents with dynamic content management
- **Admin Panel:** Internal management system with advanced RBAC, page builder, and extensible module architecture
- **Target Audience:** Prospective students, parents, faculty, staff, and administrators

### 1.2 Key Objectives

1. **Secure Authentication:** Google OAuth restricted to @jkkn.ac.in domain with role-based access control
2. **Dynamic Content:** Advanced page builder with drag-and-drop, SEO optimization, and mobile FAB
3. **Role-Based Access:** Granular permissions with custom role creation and activity tracking
4. **Extensibility:** Modular architecture supporting future feature additions
5. **User Experience:** Dual-mode interfaces for both technical and non-technical users

### 1.3 Current State

**Strengths:**

- ✅ Production-ready database with 60+ tables (Supabase)
- ✅ Comprehensive backend schema for institutional management
- ✅ Next.js 16 + React 19 foundation
- ✅ Tailwind CSS v4 configured
- ✅ TypeScript strict mode
- ✅ Google OAuth authentication backend ready

**Gaps:**

- ❌ No frontend UI components
- ❌ No API routes or Server Actions
- ❌ No admin panel
- ❌ No page builder
- ❌ No user management interfaces

### 1.4 Success Metrics

- **Performance:** < 3s page load time, Lighthouse score > 90
- **Security:** Zero security vulnerabilities, 100% route protection
- **Usability:** Non-technical users can create pages in < 10 minutes
- **Accessibility:** WCAG 2.1 AA compliance
- **SEO:** All public pages indexed with structured data

---

## 2. System Architecture

### 2.1 Technology Stack

| Layer                | Technology             | Version | Purpose                                |
| -------------------- | ---------------------- | ------- | -------------------------------------- |
| **Frontend**         | Next.js                | 16.0.3  | React framework with App Router        |
| **UI Library**       | React                  | 19.2.0  | Component library                      |
| **Language**         | TypeScript             | 5.x     | Type safety                            |
| **Styling**          | Tailwind CSS           | 4.x     | Utility-first CSS                      |
| **Components**       | shadcn/ui + Radix UI   | Latest  | Accessible component primitives        |
| **Icons**            | Lucide React           | Latest  | Icon library                           |
| **Backend**          | Supabase               | Latest  | PostgreSQL + Auth + Storage + Realtime |
| **ORM**              | Supabase JS Client     | Latest  | Database client                        |
| **State Management** | React Query (TanStack) | 5.x     | Server state caching                   |
| **Forms**            | React Hook Form        | 7.x     | Form management                        |
| **Validation**       | Zod                    | 3.x     | Schema validation                      |
| **Charts**           | Recharts               | 2.x     | Data visualization                     |
| **Tables**           | TanStack Table         | 8.x     | Advanced data tables                   |
| **Drag & Drop**      | dnd-kit                | Latest  | Page builder interactions              |

### 2.2 Architecture Decisions

**Decision 1: Monolithic App Router**

- **Choice:** Single Next.js app with route groups
- **Rationale:** Simpler deployment, shared code, unified auth flow
- **Structure:**
  - `/(public)` - Public frontend
  - `/(admin)` - Admin panel
  - `/(auth)` - Authentication flows

**Decision 2: Hybrid Page Builder**

- **Choice:** JSON props + Component Registry
- **Rationale:** Balance between flexibility and type safety
- **Implementation:** Store component name + props as JSON, map to React components

**Decision 3: Hybrid Data Fetching**

- **Choice:** Server Actions + Client Subscriptions
- **Rationale:** Secure mutations + real-time updates
- **Pattern:**
  - Server Actions for mutations (create, update, delete)
  - Server Components for initial data fetching
  - Client-side Supabase for real-time subscriptions

**Decision 4: Permission Model**

- **Choice:** Auto-grant to super admin only (secure default)
- **Rationale:** New modules locked by default, explicit permission grants required
- **Behavior:** Future modules automatically grant access to super_admin, all other roles must be configured

### 2.3 Project Structure

```
D:\JKKN\jkkn-institution-website\
├── app/
│   ├── (public)/                    # Public routes
│   │   ├── page.tsx                 # Homepage
│   │   ├── about/
│   │   ├── programs/
│   │   ├── contact/
│   │   └── [...slug]/               # Dynamic CMS pages
│   ├── (auth)/                      # Auth routes
│   │   ├── login/
│   │   ├── callback/
│   │   └── access-denied/
│   ├── (admin)/                     # Admin panel
│   │   ├── layout.tsx               # Admin layout
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── content/
│   │   └── settings/
│   ├── api/
│   │   └── webhooks/
│   ├── actions/                     # Server Actions
│   │   ├── users.ts
│   │   ├── roles.ts
│   │   └── content.ts
│   └── middleware.ts                # Auth + permissions
├── components/
│   ├── ui/                          # shadcn/ui
│   ├── admin/                       # Admin components
│   ├── page-builder/                # Page builder UI
│   ├── cms-blocks/                  # Page builder components
│   └── public/                      # Public components
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── cms/
│   ├── hooks/
│   ├── utils/
│   └── validations/
├── types/
│   ├── database.ts                  # Supabase types
│   ├── cms.ts
│   └── dashboard.ts
├── docs/                            # Documentation
│   ├── PRD.md                       # This document
│   └── IMPLEMENTATION.md
└── supabase/
    └── migrations/                  # Database migrations
```

### 2.4 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
├─────────────────────────────────────────────────────────┤
│  React Components (Client & Server)                     │
│  ├── Server Components (data fetching)                  │
│  ├── Client Components (interactivity)                  │
│  └── React Query (client state + caching)              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ├─── Server Actions (mutations) ────┐
                  │                                    │
                  ├─── Supabase Realtime ─────────┐  │
                  │                                │  │
┌─────────────────▼────────────────────────────┐  │  │
│          Next.js 16 Server                   │  │  │
│  ├── Middleware (auth + permissions)         │  │  │
│  ├── Server Components (SSR)                 │◄─┘  │
│  └── Server Actions (mutations)              │◄────┘
└─────────────────┬────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────┐
│          Supabase Backend                    │
│  ├── PostgreSQL (60+ tables)                 │
│  ├── Row Level Security (RLS)                │
│  ├── Auth (Google OAuth)                     │
│  ├── Storage (media files)                   │
│  └── Realtime (subscriptions)                │
└──────────────────────────────────────────────┘
```

---

## 3. Module 1: User Management & RBAC

### 3.1 Overview

Complete user lifecycle management with Google OAuth authentication, custom role creation, granular permission management, and comprehensive activity tracking.

### 3.2 Database Schema (Existing)

**Tables Already Available:**

- `auth.users` - Supabase authentication
- `approved_emails` - Email whitelist (@jkkn.ac.in)
- `profiles` - User profile extension
- `members` - Member records linked to profiles
- `roles` - Role definitions
- `user_roles` - User-to-role assignments (many-to-many)
- `user_role_changes` - Role assignment audit trail

**New Tables Required:**

```sql
-- User Activity Tracking
CREATE TABLE user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  action text NOT NULL,
  module text NOT NULL,
  resource_type text,
  resource_id uuid,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Role Permissions
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles NOT NULL,
  permission text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission)
);

-- System Modules
CREATE TABLE system_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  is_enabled boolean DEFAULT false,
  route_path text,
  icon text,
  order_index integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 3.3 Features

#### 3.3.1 Authentication Flow

**Route:** `/auth/login`

**Flow:**

1. User clicks "Sign in with Google"
2. Redirect to Google OAuth (Supabase Auth)
3. Google returns with user info
4. **Email Domain Check:** Verify email ends with `@jkkn.ac.in`
5. **Whitelist Check:** Query `approved_emails` table
6. If approved:
   - Auto-create `profiles` and `members` record (existing trigger)
   - Assign default role: `guest`
   - Redirect to `/admin/dashboard`
7. If not approved:
   - Show error: "Your email is not authorized. Contact administrator."
   - Redirect to `/auth/access-denied`

**Guest User Behavior:**

- Can access `/admin/dashboard` but see "Pending Approval" banner
- All other `/admin/*` routes show "Access Denied - Contact Super Admin" message
- Cannot access any admin features until role upgraded

**Implementation:**

```typescript
// app/(auth)/login/page.tsx
export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClientComponentClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          hd: 'jkkn.ac.in' // Restrict to domain
        }
      }
    })
  }

  return (
    <div>
      <h1>JKKN Admin Login</h1>
      <button onClick={handleGoogleLogin}>
        Sign in with Google (@jkkn.ac.in)
      </button>
    </div>
  )
}

// app/(auth)/callback/route.ts
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient()
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    const { data: { user } } = await supabase.auth.getUser()

    // Check approved emails
    const { data: approved } = await supabase
      .from('approved_emails')
      .select('*')
      .eq('email', user.email)
      .single()

    if (!approved) {
      return NextResponse.redirect('/auth/access-denied')
    }
  }

  return NextResponse.redirect('/admin/dashboard')
}
```

#### 3.3.2 User Management Interface

**Route:** `/admin/users`

**Layout:**

- Header with "Add User" button, search bar, filters
- Advanced data table (TanStack Table) with:
  - Columns: Avatar, Name, Email, Role(s), Status, Last Login, Actions
  - Server-side pagination (50 per page)
  - Server-side sorting (all columns)
  - Server-side filtering (role, status, date range)
  - Bulk selection with actions: Assign Role, Activate, Deactivate, Export
  - Row actions: View, Edit, Manage Roles, View Activity, Deactivate

**Features:**

- **Search:** Real-time search by name/email with debounce
- **Filters:**
  - Role (multi-select dropdown)
  - Status (Active, Inactive, Pending)
  - Date Range (Last Login, Created Date)
- **Sorting:** Click column headers to sort
- **Export:** Download CSV/Excel with current filters applied
- **Bulk Actions:**
  - Select multiple users via checkboxes
  - Apply actions to all selected users
  - Confirmation dialog before bulk operations

**Implementation (Advanced Table Pattern):**

```typescript
// app/(admin)/users/page.tsx
'use client'

import { useDataTable } from '@/lib/hooks/use-data-table'
import { DataTable } from '@/components/admin/data-table'
import { columns } from './columns'

export default function UsersPage() {
  const { data, isLoading, pagination, sorting, filtering } = useDataTable({
    queryKey: ['users'],
    queryFn: async ({ pagination, sorting, filtering }) => {
      // Server-side data fetching
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ pagination, sorting, filtering })
      })
      return response.json()
    }
  })

  return (
    <div>
      <DataTableToolbar
        filters={[
          { key: 'role', label: 'Role', type: 'multi-select' },
          { key: 'status', label: 'Status', type: 'select' }
        ]}
        actions={[
          { label: 'Add User', onClick: () => router.push('/admin/users/new') }
        ]}
      />
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        sorting={sorting}
        isLoading={isLoading}
      />
    </div>
  )
}
```

#### 3.3.3 User Detail Page

**Route:** `/admin/users/[id]`

**Sections:**

**Profile Information:**

- Avatar (uploadable)
- Full Name, Email
- Member ID, Chapter
- Join Date, Last Login
- Status toggle (Active/Inactive)
- Edit Profile button

**Role Assignments:**

- Current roles (badges with colors)
- "Assign Role" button → Modal with role selector
- Role history table:
  - Columns: Role, Assigned By, Date, Action (Added/Removed)
  - Timeline view option

**Activity Log:**

- Recent activity table (last 50 actions)
- Columns: Action, Module, Resource, Timestamp
- "View Full Activity" link → Dedicated page with filters
- Real-time updates (Supabase Realtime subscription)

**Permissions Overview:**

- Expandable list grouped by module
- Shows inherited permissions from roles
- Visual indicator: Direct vs Inherited

**Actions:**

- Edit Profile
- Manage Roles
- View Activity
- Reset Password (send email)
- Deactivate Account

#### 3.3.4 Manual User Creation

**Route:** `/admin/users/new`

**Form Fields:**

1. **Email Address** (required)
   - Validation: Must end with `@jkkn.ac.in`
   - Check if already exists
2. **Full Name** (required)
3. **Chapter** (select dropdown)
4. **Roles** (multi-select)
5. **Send Invitation Email** (checkbox, default: checked)

**Process:**

1. Add email to `approved_emails` table
2. Send invitation email with login link
3. User follows link → Google OAuth → Auto-create profile
4. Assign selected roles automatically

**Validation:**

- Email format and domain
- Duplicate email check
- At least one role must be selected
- Display real-time validation errors

#### 3.3.5 Role Management

**Route:** `/admin/roles`

**Pre-defined Roles:**

- `super_admin` - Full system access (cannot be deleted/modified)
- `director` - Chapter-level management
- `chair` - Vertical/department leadership
- `member` - Standard user
- `guest` - Default role (no admin access)

**Features:**

- List all roles (table view)
- Create custom role button
- Edit role (name, description, permissions)
- Delete role (with confirmation, check for users with role)
- Duplicate role (create copy with same permissions)

**Custom Role Creation:**

- Role name (unique)
- Description
- Parent role (inherit permissions)
- Permission selection (tree view with checkboxes)
- Hierarchy level (determines menu order)

**Permission Matrix:**

- Table layout: Modules (rows) × Actions (columns)
- Checkboxes for each permission
- "Select All" per module or action
- Visual grouping by category

#### 3.3.6 Permission System

**Permission Format:** `module:resource:action`

**Examples:**

- `users:*:*` - All user operations
- `users:profiles:view` - View user profiles only
- `content:pages:edit` - Edit pages only
- `dashboard:analytics:view` - View analytics
- `system:settings:manage` - Manage system settings

**Permission Categories:**

**Users Module:**

- `users:profiles:view`
- `users:profiles:create`
- `users:profiles:edit`
- `users:profiles:delete`
- `users:roles:view`
- `users:roles:manage`
- `users:activity:view`

**Content Module:**

- `content:pages:view`
- `content:pages:create`
- `content:pages:edit`
- `content:pages:delete`
- `content:pages:publish`
- `content:media:view`
- `content:media:upload`
- `content:media:delete`

**Dashboard Module:**

- `dashboard:view`
- `dashboard:analytics:view`
- `dashboard:analytics:export`
- `dashboard:widgets:customize`

**System Module:**

- `system:settings:view`
- `system:settings:manage`
- `system:logs:view`
- `system:modules:manage`

**Permission Inheritance:**

- Roles can inherit from parent roles
- Child role permissions = Parent permissions + Own permissions
- Cannot remove inherited permissions (must edit parent)
- Visual indicator in UI for inherited vs direct permissions

**Dynamic Permission Checks:**

```typescript
// lib/auth/permissions.ts
export async function checkPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  const supabase = createServerClient()

  // Get all user roles
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id, roles(name)')
    .eq('user_id', userId)

  // Super admin has all permissions
  if (userRoles?.some(ur => ur.roles.name === 'super_admin')) {
    return true
  }

  // Check role permissions
  const { data: permissions } = await supabase
    .from('role_permissions')
    .select('permission')
    .in('role_id', userRoles.map(r => r.role_id))

  // Check exact match or wildcard
  return permissions?.some(p =>
    p.permission === permission ||
    matchWildcard(p.permission, permission)
  ) || false
}

function matchWildcard(pattern: string, permission: string): boolean {
  const patternParts = pattern.split(':')
  const permissionParts = permission.split(':')

  return patternParts.every((part, i) =>
    part === '*' || part === permissionParts[i]
  )
}

// React hook for client components
export function usePermission(permission: string) {
  const { data: hasPermission, isLoading } = useQuery({
    queryKey: ['permission', permission],
    queryFn: () => checkPermission(userId, permission)
  })

  return { hasPermission, isLoading }
}
```

#### 3.3.7 Dynamic Menu Sidebar

**Behavior:**

- Only show menu items user has permission to access
- Hide entire module sections if no permissions
- Nested menu items (collapsible)
- Active state highlighting
- Breadcrumb navigation

**Menu Structure:**

```typescript
// lib/admin/menu-config.ts
export const ADMIN_MENU = [
  {
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/admin/dashboard',
    permission: 'dashboard:view'
  },
  {
    label: 'Users',
    icon: 'Users',
    permission: 'users:*:view',
    children: [
      {
        label: 'All Users',
        href: '/admin/users',
        permission: 'users:profiles:view'
      },
      {
        label: 'Roles',
        href: '/admin/roles',
        permission: 'users:roles:view'
      },
      {
        label: 'Activity Logs',
        href: '/admin/users/activity',
        permission: 'users:activity:view'
      }
    ]
  },
  {
    label: 'Content',
    icon: 'FileText',
    permission: 'content:*:view',
    children: [
      {
        label: 'Pages',
        href: '/admin/content/pages',
        permission: 'content:pages:view'
      },
      {
        label: 'Media Library',
        href: '/admin/content/media',
        permission: 'content:media:view'
      }
    ]
  },
  // ... more menu items
]

// components/admin/sidebar.tsx
export function AdminSidebar() {
  const { hasPermission } = usePermissions()

  const filteredMenu = useMemo(() => {
    return ADMIN_MENU.filter(item => {
      // Check if user has permission for this menu item
      if (item.permission && !hasPermission(item.permission)) {
        return false
      }

      // Filter children
      if (item.children) {
        item.children = item.children.filter(child =>
          !child.permission || hasPermission(child.permission)
        )
        // Hide parent if no children left
        return item.children.length > 0
      }

      return true
    })
  }, [hasPermission])

  return (
    <aside>
      {filteredMenu.map(item => (
        <MenuItem key={item.label} item={item} />
      ))}
    </aside>
  )
}
```

#### 3.3.8 User Activity Tracking

**Automatic Tracking:**
Track all user actions across modules automatically using middleware.

**Tracked Actions:**

- `view` - View resource
- `create` - Create new resource
- `edit` - Update resource
- `delete` - Delete resource
- `publish` - Publish content
- `export` - Export data
- `login` - User login
- `logout` - User logout
- `permission_change` - Role/permission modification

**Captured Data:**

- User ID
- Action type
- Module name
- Resource type (e.g., "page", "user", "role")
- Resource ID
- Metadata (JSON - action-specific details)
- IP address
- User agent
- Timestamp

**Implementation:**

```typescript
// lib/utils/activity-logger.ts
export async function logActivity({
  userId,
  action,
  module,
  resourceType,
  resourceId,
  metadata = {}
}: ActivityLog) {
  const supabase = createServerClient()

  await supabase.from('user_activity_logs').insert({
    user_id: userId,
    action,
    module,
    resource_type: resourceType,
    resource_id: resourceId,
    metadata,
    ip_address: getClientIP(),
    user_agent: headers().get('user-agent'),
    created_at: new Date().toISOString()
  })
}

// Usage in Server Actions
export async function updateUser(userId: string, data: any) {
  // Update user logic
  await supabase.from('profiles').update(data).eq('id', userId)

  // Log activity
  await logActivity({
    userId: currentUser.id,
    action: 'edit',
    module: 'users',
    resourceType: 'profile',
    resourceId: userId,
    metadata: { changes: data }
  })
}
```

**Activity Dashboard:**

**Route:** `/admin/users/[id]/activity`

Features:

- Filter by action type, module, date range
- Search by resource type/ID
- Export activity log (CSV)
- Real-time updates
- Pagination (100 per page)
- Detail view (expandable rows with metadata)

**System-Wide Activity Feed:**

**Route:** `/admin/activity` (super admin only)

Features:

- All users' activities in one view
- Advanced filters (user, module, action, date)
- Activity heatmap calendar
- Most active users widget
- Activity by module chart
- Export full log

#### 3.3.9 Guest User Protection

**Middleware Implementation:**

```typescript
// app/middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if user has non-guest role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', session.user.id)

    const hasGuestRoleOnly = userRoles?.every(ur => ur.roles.name === 'guest')

    // Allow dashboard access but show banner
    if (hasGuestRoleOnly && request.nextUrl.pathname !== '/admin/dashboard') {
      return NextResponse.redirect(new URL('/admin/access-denied', request.url))
    }

    // Check route-specific permissions
    const requiredPermission = getRoutePermission(request.nextUrl.pathname)
    if (requiredPermission) {
      const hasPermission = await checkPermission(session.user.id, requiredPermission)
      if (!hasPermission) {
        return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
      }
    }
  }

  return NextResponse.next()
}
```

**Access Denied Page:**

**Route:** `/admin/access-denied`

Content:

- Message: "Your account is pending approval. Please contact the Super Admin to gain access."
- Super Admin contact form
- Email sent to all super admins with user details
- Link back to dashboard

---

## 4. Module 2: Content Management System

### 4.1 Overview

Dynamic page creation system with advanced drag-and-drop page builder, reusable React components, comprehensive SEO management, and mobile-optimized floating action buttons.

### 4.2 Database Schema

```sql
-- CMS Pages
CREATE TABLE cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  parent_id uuid REFERENCES cms_pages,
  status text CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  page_type text CHECK (page_type IN ('static', 'dynamic')) DEFAULT 'dynamic',
  template_id uuid REFERENCES cms_page_templates,
  created_by uuid REFERENCES auth.users NOT NULL,
  updated_by uuid REFERENCES auth.users,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Page Blocks
CREATE TABLE cms_page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES cms_pages ON DELETE CASCADE NOT NULL,
  component_name text NOT NULL,
  props jsonb DEFAULT '{}',
  order_index integer NOT NULL,
  parent_block_id uuid REFERENCES cms_page_blocks,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Component Registry
CREATE TABLE cms_component_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text CHECK (category IN ('content', 'media', 'layout', 'data')) NOT NULL,
  display_name text NOT NULL,
  description text,
  thumbnail_url text,
  props_schema jsonb NOT NULL,
  is_active boolean DEFAULT true,
  version text DEFAULT '1.0.0',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SEO Metadata
CREATE TABLE cms_seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES cms_pages ON DELETE CASCADE UNIQUE NOT NULL,
  meta_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image text,
  twitter_card_type text DEFAULT 'summary_large_image',
  twitter_title text,
  twitter_description text,
  twitter_image text,
  canonical_url text,
  keywords text[],
  structured_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Floating Action Button Config
CREATE TABLE cms_page_fab_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES cms_pages ON DELETE CASCADE UNIQUE NOT NULL,
  is_enabled boolean DEFAULT true,
  actions jsonb NOT NULL,
  position text CHECK (position IN ('bottom-right', 'bottom-left', 'bottom-center')) DEFAULT 'bottom-right',
  theme text CHECK (theme IN ('light', 'dark', 'auto')) DEFAULT 'auto',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Media Library
CREATE TABLE cms_media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text CHECK (file_type IN ('image', 'video', 'document')) NOT NULL,
  mime_type text NOT NULL,
  alt_text text,
  caption text,
  uploaded_by uuid REFERENCES auth.users NOT NULL,
  file_size bigint NOT NULL,
  dimensions jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Page Templates
CREATE TABLE cms_page_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  thumbnail_url text,
  blocks_config jsonb NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Page Version History
CREATE TABLE cms_page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES cms_pages ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  title text NOT NULL,
  blocks_snapshot jsonb NOT NULL,
  seo_snapshot jsonb,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(page_id, version_number)
);

-- Indexes
CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);
CREATE INDEX idx_cms_pages_parent_id ON cms_pages(parent_id);
CREATE INDEX idx_cms_page_blocks_page_id ON cms_page_blocks(page_id);
CREATE INDEX idx_cms_page_blocks_order ON cms_page_blocks(page_id, order_index);
CREATE INDEX idx_cms_media_library_uploaded_by ON cms_media_library(uploaded_by);
CREATE INDEX idx_cms_page_versions_page_id ON cms_page_versions(page_id);
```

### 4.3 Features

#### 4.3.1 Page Management Interface

**Route:** `/admin/content/pages`

**Layout:**

- Tree view with parent-child hierarchy
- Expandable/collapsible folders
- Drag-to-reorder (update parent/order)
- Breadcrumb navigation

**Table Columns:**

- Status badge (Draft, Published, Archived)
- Title (with nesting indicator)
- Slug
- Parent page
- Last updated
- Updated by
- Actions dropdown

**Toolbar:**

- "Create Page" button
- Search by title/slug
- Filter by status
- Filter by page type
- Bulk actions: Publish, Unpublish, Delete

**Row Actions:**

- Edit (page builder)
- Preview
- Duplicate
- View Analytics
- View Versions
- Delete

#### 4.3.2 Page Builder Interface

**Route:** `/admin/content/pages/[id]/edit`

**Dual Mode Interface:**

**Visual Mode (Default):**

- Left sidebar: Component Palette
- Center: Canvas (editable preview)
- Right sidebar: Props Panel
- Bottom toolbar: Device switcher, Undo/Redo, Save, Preview, Publish

**Advanced Mode (Toggle):**

- Split view: Code editor (left) + Live preview (right)
- JSON editor for block configuration
- Custom CSS input per block
- Responsive breakpoint controls
- Component props inspector with JSON schema validation

**Top Bar:**

- Page title input
- Status dropdown (Draft, Published)
- Back button
- Mode toggle (Visual / Advanced)
- Undo / Redo buttons
- Auto-save indicator
- Preview button (opens in new tab)
- Publish button

**Component Palette (Left Sidebar):**

- Search components
- Categories (tabs):
  - Content Blocks
  - Media Blocks
  - Layout Blocks
  - Data Blocks
- Component cards:
  - Thumbnail preview
  - Name
  - Description (tooltip)
  - Drag handle

**Canvas (Center):**

- Iframe preview (isolated styles)
- Device selector: Desktop (1920px), Laptop (1440px), Tablet (768px), Mobile (375px)
- Hover effects: Show block outline + toolbar
- Click to select: Highlight + open props panel
- Drag to reorder blocks
- Drop zones between blocks
- Delete button (X) on hover
- Duplicate button on hover
- Nested blocks supported (e.g., columns within sections)

**Props Panel (Right Sidebar):**

- Component name + icon
- Tabbed interface:
  - **Content:** Text inputs, rich text editors, selectors
  - **Design:** Spacing, colors, borders, shadows
  - **Advanced:** Custom CSS, IDs, animation
- Real-time preview updates
- Validation errors displayed
- "Responsive" toggle per prop (set different values per breakpoint)

**Bottom Toolbar:**

- Device icons (click to switch)
- Zoom controls (50%, 75%, 100%, 125%)
- Undo stack (with history preview)
- Redo stack
- Save button (manual save + auto-save every 30s)
- "Save as Template" button
- Publish dropdown:
  - Publish Now
  - Schedule Publish
  - Update SEO

#### 4.3.3 Component Categories & Registry

**Content Blocks:**

1. **Hero Section**

   - Props: title, subtitle, backgroundImage, backgroundVideo, ctaButtons (array)
   - Variants: Full height, Half height, Split (image + text)

2. **Text Editor**

   - Props: content (rich HTML), alignment, maxWidth
   - Features: Bold, italic, links, lists, headings

3. **Heading**

   - Props: text, level (H1-H6), alignment, color

4. **Call-to-Action**

   - Props: title, description, buttons (array)
   - Variants: Centered, Left-aligned, Card style

5. **Testimonials**

   - Props: testimonials (array: quote, author, role, avatar)
   - Layouts: Carousel, Grid, Single

6. **FAQ Accordion**

   - Props: faqs (array: question, answer)
   - Features: Expand/collapse, search

7. **Tabs**

   - Props: tabs (array: label, content)

8. **Timeline**

   - Props: events (array: date, title, description)

9. **Pricing Tables**
   - Props: plans (array: name, price, features, cta)

**Media Blocks:**

1. **Image**

   - Props: src, alt, caption, width, height, objectFit
   - Features: Lazy loading, responsive sizes

2. **Image Gallery**

   - Props: images (array), layout (grid, masonry, carousel)
   - Features: Lightbox, captions

3. **Video Player**

   - Props: src (YouTube, Vimeo, or self-hosted), autoplay, controls

4. **Image Carousel**

   - Props: images (array), autoplay, interval

5. **Before/After Slider**

   - Props: beforeImage, afterImage

6. **Logo Cloud**
   - Props: logos (array: image, link)
   - Layouts: Grid, Marquee animation

**Layout Blocks:**

1. **Container**

   - Props: maxWidth, padding

2. **Grid Layout**

   - Props: columns (1-12), gap, responsive (different columns per breakpoint)

3. **Flexbox Layout**

   - Props: direction, justify, align, wrap

4. **Spacer**

   - Props: height (desktop, tablet, mobile)

5. **Divider**

   - Props: style (solid, dashed, dotted), color, thickness

6. **Card Container**

   - Props: shadow, border, padding, background

7. **Section Wrapper**
   - Props: background (color, gradient, image), padding, fullWidth

**Data Blocks (Dynamic):**

1. **Events List**

   - Props: filter (upcoming/past), limit, layout (list/grid/calendar)
   - Data source: `events` table

2. **Faculty Directory**

   - Props: department (filter), layout (grid/list), columns
   - Data source: `members` table with role filter

3. **Programs Showcase**

   - Props: category (filter), layout (cards/table)
   - Data source: Custom `programs` table (to be created)

4. **Stats Counter**

   - Props: stats (array: label, value, suffix, icon)
   - Features: Animated count-up on scroll

5. **Announcements Feed**

   - Props: limit, showDate, layout
   - Data source: `announcements` table

6. **Blog Posts Grid**
   - Props: category (filter), limit, columns
   - Data source: CMS pages with type="blog"

**Component Registry Implementation:**

```typescript
// lib/cms/component-registry.ts
import { z } from 'zod'

// Component definitions
export const COMPONENTS = {
  HeroSection: {
    name: 'HeroSection',
    displayName: 'Hero Section',
    category: 'content',
    description: 'Full-width hero with background image/video and CTAs',
    thumbnail: '/components/hero.png',
    component: lazy(() => import('@/components/cms-blocks/content/hero-section')),
    propsSchema: z.object({
      title: z.string().min(1, 'Title is required'),
      subtitle: z.string().optional(),
      backgroundImage: z.string().url().optional(),
      backgroundVideo: z.string().url().optional(),
      ctaButtons: z.array(z.object({
        label: z.string(),
        link: z.string(),
        variant: z.enum(['primary', 'secondary'])
      })).optional()
    }),
    defaultProps: {
      title: 'Welcome to JKKN',
      subtitle: 'Excellence in Education',
      ctaButtons: [
        { label: 'Apply Now', link: '/apply', variant: 'primary' }
      ]
    }
  },

  ImageGallery: {
    name: 'ImageGallery',
    displayName: 'Image Gallery',
    category: 'media',
    description: 'Image gallery with multiple layout options',
    thumbnail: '/components/gallery.png',
    component: lazy(() => import('@/components/cms-blocks/media/image-gallery')),
    propsSchema: z.object({
      images: z.array(z.object({
        src: z.string().url(),
        alt: z.string(),
        caption: z.string().optional()
      })),
      layout: z.enum(['grid', 'masonry', 'carousel']).default('grid'),
      columns: z.number().min(1).max(6).default(3)
    }),
    defaultProps: {
      images: [],
      layout: 'grid',
      columns: 3
    }
  },

  EventsList: {
    name: 'EventsList',
    displayName: 'Events List',
    category: 'data',
    description: 'Dynamic list of upcoming/past events',
    thumbnail: '/components/events.png',
    component: lazy(() => import('@/components/cms-blocks/data/events-list')),
    propsSchema: z.object({
      filter: z.enum(['upcoming', 'past', 'all']).default('upcoming'),
      limit: z.number().min(1).max(50).default(10),
      layout: z.enum(['list', 'grid', 'calendar']).default('grid')
    }),
    defaultProps: {
      filter: 'upcoming',
      limit: 10,
      layout: 'grid'
    }
  }

  // ... more components
}

// Component loader
export function getComponent(name: string) {
  return COMPONENTS[name]?.component
}

// Props validation
export function validateProps(componentName: string, props: any) {
  const schema = COMPONENTS[componentName]?.propsSchema
  if (!schema) throw new Error(`Component ${componentName} not found`)
  return schema.parse(props)
}
```

#### 4.3.4 Page Builder Features

**Undo/Redo System:**

- Maintain history stack (last 50 actions)
- Actions tracked: Add block, Delete block, Move block, Update props
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)
- Visual history preview (hover to see state)

**Auto-save:**

- Save draft every 30 seconds
- Show indicator: "Saving...", "Saved at 12:34 PM"
- Conflict detection if multiple users editing
- "Restore auto-saved version" on reload

**Version History:**

- Save snapshot on manual save or publish
- Version number auto-incremented
- Store: title, blocks config, SEO metadata, timestamp, user
- Compare versions (diff view)
- Restore previous version

**Templates:**

- Save current page as template
- Template browser modal
- Filter by category
- Preview before applying
- Apply template: Replace all blocks or append

**Duplicate Page:**

- Copy all blocks + SEO + FAB config
- New slug required
- Option: Keep as draft or publish immediately

**Preview:**

- Open in new tab
- Show unpublished changes
- Device preview (responsive)
- Share preview link (expires in 24h)

**Responsive Controls:**

- Set different prop values per breakpoint
- Example: Hide on mobile, show on desktop
- Visual breakpoint switcher in canvas
- Props panel shows active breakpoint

**Component Search:**

- Search bar in component palette
- Filter by category
- Keyboard shortcut: Ctrl+K

**Keyboard Shortcuts:**

- `Ctrl+S` - Save
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+K` - Component search
- `Ctrl+D` - Duplicate selected block
- `Delete` - Delete selected block
- `Esc` - Deselect block

#### 4.3.5 SEO Management

**SEO Panel (Tab in Page Builder):**

**Basic SEO:**

- Meta Title (60 char limit, counter)
- Meta Description (160 char limit, counter)
- Slug editor (auto-generated from title, editable)
- Canonical URL (optional)

**Open Graph (Facebook):**

- OG Title (default: meta title)
- OG Description (default: meta description)
- OG Image (upload or select from media)
- Preview card

**Twitter Card:**

- Card Type (summary, summary_large_image)
- Twitter Title (default: OG title)
- Twitter Description (default: OG description)
- Twitter Image (default: OG image)
- Preview card

**Keywords:**

- Tag input (comma-separated)
- Suggestions from content
- Max 10 keywords recommended

**Structured Data (Schema.org):**

- JSON-LD editor
- Templates:
  - Organization
  - WebPage
  - Article
  - Event
  - Course
  - FAQPage
- Validation (Google Rich Results Test)

**SEO Score:**

- Algorithm checks:
  - Meta title length (40-60 chars = 100%)
  - Meta description length (120-160 chars = 100%)
  - Keyword in title
  - Keyword in description
  - Image alt texts
  - Heading hierarchy (H1 > H2 > H3)
  - Internal links count
  - Readability score
- Overall score: 0-100
- Color-coded: Red (0-50), Yellow (51-80), Green (81-100)
- Recommendations list

**Preview Snippets:**

- Google SERP preview (desktop + mobile)
- Facebook share preview
- Twitter card preview
- Real-time updates as you type

**XML Sitemap:**

- Auto-generated from published pages
- Route: `/sitemap.xml`
- Include: URL, last modified, change frequency, priority
- Submit to Google Search Console

**Robots Meta Tags:**

- Index/Noindex toggle
- Follow/Nofollow toggle
- Per-page control

#### 4.3.6 Floating Action Button (FAB)

**Configuration (Per Page):**

**Enable/Disable Toggle:**

- Show on this page (checkbox)
- Only visible on mobile/tablet (< 1024px)

**Actions (Up to 4):**

1. **Quick Contact**

   - Phone: Click-to-call with number
   - WhatsApp: Pre-filled message template
   - Email: Mailto link with subject

2. **Apply Now**

   - Link to application form
   - Open in same tab or new tab

3. **Inquiry Form**

   - Slide-up modal with form:
     - Name, Email, Phone, Message
     - Submit → Save to `inquiries` table

4. **Share**

   - Native Web Share API
   - Fallback: Share modal with options:
     - WhatsApp, Facebook, Twitter, LinkedIn, Copy Link

5. **Page-Specific Actions**
   - Custom icon + label + link
   - Examples:
     - Event page: "Register Now"
     - Program page: "Download Brochure"
     - Faculty page: "Schedule Meeting"

**Position:**

- Bottom Right (default)
- Bottom Left
- Bottom Center

**Theme:**

- Light (white background)
- Dark (dark background)
- Auto (based on page background color detection)

**Animation:**

- Entrance: Scale, Fade, Slide up
- Expand: Radial menu on click
- Icons + labels

**Implementation:**

```typescript
// components/public/fab.tsx
'use client'

export function FloatingActionButton({ config }: { config: FABConfig }) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  if (!config.is_enabled || !isMobile) return null

  return (
    <div className={cn('fixed z-50', {
      'bottom-4 right-4': config.position === 'bottom-right',
      'bottom-4 left-4': config.position === 'bottom-left',
      'bottom-4 left-1/2 -translate-x-1/2': config.position === 'bottom-center'
    })}>
      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary shadow-lg"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Action buttons (radial menu) */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2">
          {config.actions.map((action, i) => (
            <ActionButton key={i} action={action} />
          ))}
        </div>
      )}
    </div>
  )
}
```

#### 4.3.7 Media Library

**Route:** `/admin/content/media`

**Upload Interface:**

- Drag-and-drop zone
- Click to browse file picker
- Multiple file upload
- Progress bars per file
- Supported formats:
  - Images: JPG, PNG, WebP, SVG, GIF
  - Videos: MP4, WebM
  - Documents: PDF

**Image Optimization:**

- Auto WebP conversion
- Generate responsive sizes (thumbnail, small, medium, large)
- Compress on upload
- Store in Supabase Storage

**Layout:**

- Grid view (default)
- List view (toggle)
- Thumbnail size slider

**File Card:**

- Thumbnail preview
- File name
- File size
- Upload date
- Actions: Edit, Delete, Copy URL

**Edit Modal:**

- Alt text input (accessibility)
- Caption input
- Replace file button
- View usage (pages using this media)

**Filters:**

- File type (Image, Video, Document)
- Uploaded by (user selector)
- Date range
- Folder (if organization added)

**Search:**

- By file name
- By alt text

**Bulk Actions:**

- Select multiple files
- Delete selected
- Download selected (zip)

**Upload to Supabase Storage:**

```typescript
// app/actions/media.ts
'use server'

export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File
  const supabase = createServerClient()

  // Upload to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, file)

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(fileName)

  // Save metadata to database
  await supabase.from('cms_media_library').insert({
    file_name: file.name,
    file_path: publicUrl,
    file_type: getFileType(file.type),
    mime_type: file.type,
    file_size: file.size,
    uploaded_by: user.id,
    dimensions: file.type.startsWith('image/')
      ? await getImageDimensions(file)
      : null
  })

  return { url: publicUrl }
}
```

#### 4.3.8 Page Rendering (Frontend)

**Dynamic Route:** `/[...slug]`

```typescript
// app/(public)/[...slug]/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { PageRenderer } from '@/lib/cms/page-renderer'
import { notFound } from 'next/navigation'

// Generate static params for all published pages
export async function generateStaticParams() {
  const supabase = createServerClient()
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('slug')
    .eq('status', 'published')

  return pages?.map(page => ({
    slug: page.slug.split('/')
  })) || []
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const supabase = createServerClient()

  const { data: page } = await supabase
    .from('cms_pages')
    .select('*, cms_seo_metadata(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!page) return {}

  const seo = page.cms_seo_metadata

  return {
    title: seo?.meta_title || page.title,
    description: seo?.meta_description,
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.og_title || seo?.meta_title,
      description: seo?.og_description || seo?.meta_description,
      images: seo?.og_image ? [seo.og_image] : []
    },
    twitter: {
      card: seo?.twitter_card_type,
      title: seo?.twitter_title,
      description: seo?.twitter_description,
      images: seo?.twitter_image ? [seo.twitter_image] : []
    }
  }
}

export default async function DynamicPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const supabase = createServerClient()

  // Fetch page with blocks
  const { data: page } = await supabase
    .from('cms_pages')
    .select(`
      *,
      cms_page_blocks (
        id,
        component_name,
        props,
        order_index,
        parent_block_id
      ),
      cms_page_fab_config (*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!page) notFound()

  // Sort blocks by order
  const blocks = page.cms_page_blocks.sort((a, b) => a.order_index - b.order_index)

  return (
    <>
      {/* Structured Data */}
      {page.cms_seo_metadata?.structured_data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(page.cms_seo_metadata.structured_data)
          }}
        />
      )}

      {/* Page Content */}
      <PageRenderer blocks={blocks} />

      {/* Floating Action Button */}
      {page.cms_page_fab_config?.is_enabled && (
        <FloatingActionButton config={page.cms_page_fab_config} />
      )}
    </>
  )
}
```

**Page Renderer Component:**

```typescript
// lib/cms/page-renderer.tsx
import { getComponent } from './component-registry'

export function PageRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <div className="page-content">
      {blocks.map(block => {
        const Component = getComponent(block.component_name)

        if (!Component) {
          console.error(`Component ${block.component_name} not found`)
          return null
        }

        return (
          <Suspense key={block.id} fallback={<BlockSkeleton />}>
            <Component {...block.props} />
          </Suspense>
        )
      })}
    </div>
  )
}
```

---

## 5. Module 3: Advanced Dashboard & Analytics

### 5.1 Overview

Role-based comprehensive dashboards with operational widgets (tasks, actions, notifications) and analytical widgets (charts, KPIs, reports) with real-time updates.

### 5.2 Database Schema

```sql
-- Dashboard Layouts
CREATE TABLE dashboard_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  role_id uuid REFERENCES roles,
  layout_config jsonb NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (user_id IS NOT NULL OR role_id IS NOT NULL)
);

-- Dashboard Widgets Registry
CREATE TABLE dashboard_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text CHECK (category IN ('operational', 'analytical', 'data_table', 'quick_action')) NOT NULL,
  component_name text NOT NULL,
  default_config jsonb DEFAULT '{}',
  required_permissions text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Dashboard Preferences
CREATE TABLE user_dashboard_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  widget_id uuid REFERENCES dashboard_widgets NOT NULL,
  config jsonb DEFAULT '{}',
  position jsonb NOT NULL,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, widget_id)
);

-- Dashboard Quick Actions
CREATE TABLE dashboard_quick_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid REFERENCES roles NOT NULL,
  action_key text NOT NULL,
  label text NOT NULL,
  icon text NOT NULL,
  link text NOT NULL,
  permission_required text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_dashboard_layouts_user_id ON dashboard_layouts(user_id);
CREATE INDEX idx_dashboard_layouts_role_id ON dashboard_layouts(role_id);
CREATE INDEX idx_user_dashboard_preferences_user_id ON user_dashboard_preferences(user_id);
CREATE INDEX idx_dashboard_quick_actions_role_id ON dashboard_quick_actions(role_id);
```

### 5.3 Features

#### 5.3.1 Dashboard Landing

**Route:** `/admin/dashboard`

**Layout Structure:**

- Top bar: Welcome message, notifications icon, quick actions dropdown, time range selector
- Main area: Grid system (12 columns, responsive)
- Edit mode toggle (top-right corner)

**Time Range Selector:**

- Today
- Last 7 days
- Last 30 days
- Custom (date picker)
- Applied to all time-based widgets

**Export Dashboard:**

- Button: "Export Dashboard"
- Formats: PDF, PNG
- Captures entire dashboard layout with charts rendered

**Edit Mode:**

- Toggle button: "Edit Dashboard"
- When active:
  - Show "Add Widget" button
  - Show widget drag handles
  - Show widget resize handles
  - Show widget settings (gear icon)
  - Show widget delete (X icon)
- Save layout button
- Reset to default layout button

#### 5.3.2 Operational Widgets

**1. Pending Tasks Widget**

**Purpose:** Show pending actions requiring user attention

**Content:**

- Grouped by category:
  - User Approvals (guest users awaiting activation)
  - Content Reviews (draft pages pending publish)
  - Event RSVPs (pending confirmations)
  - Budget Approvals (pending expense approvals)
- Each item:
  - Icon + description
  - Timestamp ("2 hours ago")
  - Badge count per category
  - Click to navigate to detail page
- "Mark All as Complete" button
- "View All Tasks" link

**Data Source:**

```typescript
// Aggregate pending tasks
const pendingTasks = await Promise.all([
  // Guest users
  supabase.from('user_roles')
    .select('*, profiles(*)')
    .eq('roles.name', 'guest')
    .then(data => data.map(u => ({
      type: 'user_approval',
      description: `${u.profiles.full_name} awaiting approval`,
      link: `/admin/users/${u.user_id}`,
      timestamp: u.created_at
    }))),

  // Draft pages
  supabase.from('cms_pages')
    .select('*')
    .eq('status', 'draft')
    .then(data => data.map(p => ({
      type: 'content_review',
      description: `"${p.title}" ready for review`,
      link: `/admin/content/pages/${p.id}/edit`,
      timestamp: p.updated_at
    })))
])
```

**2. Recent Activity Feed**

**Purpose:** Real-time activity stream across all modules

**Content:**

- List of recent activities (last 50)
- Each activity:
  - User avatar + name
  - Action description ("created a new page", "approved budget")
  - Resource link (click to view)
  - Timestamp
- Filters:
  - Module (dropdown)
  - Action type (view, create, edit, delete)
  - User (searchable select)
- Real-time updates (Supabase Realtime)
- Auto-scroll to new activities (with animation)
- "Load More" button

**Real-time Implementation:**

```typescript
useEffect(() => {
  const channel = supabase
    .channel('activity_feed')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'user_activity_logs'
    }, (payload) => {
      // Add new activity to feed
      setActivities(prev => [payload.new, ...prev])
    })
    .subscribe()

  return () => { channel.unsubscribe() }
}, [])
```

**3. Quick Stats Cards**

**Purpose:** High-level metrics with trend indicators

**Cards:**

1. Total Users

   - Count + trend (vs previous period)
   - Click → `/admin/users`

2. Active Members

   - Count + trend
   - Click → `/admin/members`

3. Published Pages

   - Count + trend
   - Click → `/admin/content/pages`

4. Upcoming Events
   - Count
   - Click → `/admin/events`

**Design:**

- Icon (large, colored)
- Label
- Number (large font)
- Trend indicator:
  - Arrow up/down
  - Percentage change
  - Color: Green (positive), Red (negative), Gray (no change)
- Sparkline chart (optional, shows trend over time)

**4. Notifications Panel**

**Purpose:** In-app notifications system

**Content:**

- List of notifications (unread first)
- Each notification:
  - Icon (type-based)
  - Title
  - Description
  - Timestamp
  - Read/Unread indicator (blue dot)
  - Click to mark as read + navigate
- Categories:
  - System (updates, maintenance)
  - Approval Needed (tasks requiring action)
  - Mention (user mentioned you)
  - Assignment (task assigned to you)
- Mark as read button (per notification)
- Mark all as read button
- Notification preferences link

**Real-time Push:**

```typescript
// Create notification
export async function createNotification({
  userId,
  type,
  title,
  description,
  link
}: Notification) {
  await supabase.from('in_app_notifications').insert({
    user_id: userId,
    type,
    title,
    description,
    link,
    is_read: false
  })

  // Trigger real-time update
  // Client subscribes to notifications for their user_id
}
```

**5. Upcoming Events Calendar**

**Purpose:** Mini calendar showing events

**Features:**

- Calendar view (month view)
- Dates with events highlighted
- Click date → Show events in popover
- Today indicator
- Navigation: Previous/Next month
- "Add Event" quick action
- "View All Events" link

#### 5.3.3 Analytical Widgets

**1. User Growth Chart**

**Type:** Line chart

**Data:**

- X-axis: Date (daily, weekly, or monthly based on range)
- Y-axis: User count
- Lines:
  - New Users (blue)
  - Active Users (green)
  - Total Users (gray)
- Filter by role (dropdown)
- Export data (CSV)

**Implementation:**

```typescript
// Fetch user growth data
const userGrowth = await supabase.rpc('get_user_growth_data', {
  start_date: startDate,
  end_date: endDate,
  group_by: 'day' // or 'week', 'month'
})

// SQL function
CREATE OR REPLACE FUNCTION get_user_growth_data(
  start_date timestamptz,
  end_date timestamptz,
  group_by text
)
RETURNS TABLE (
  date timestamptz,
  new_users bigint,
  active_users bigint,
  total_users bigint
) AS $$
  -- Implementation with date_trunc and window functions
$$ LANGUAGE sql;
```

**2. Content Performance**

**Type:** Mixed (Bar chart + Pie chart + Table)

**Bar Chart:**

- X-axis: Page titles
- Y-axis: View count
- Top 10 pages by views

**Pie Chart:**

- Traffic sources (Direct, Search, Social, Referral)
- Color-coded slices

**Table:**

- Columns: Page, Views, Unique Visitors, Avg. Time, Bounce Rate
- Sortable
- Pagination (top 20)

**Data Source:**

- Integrate with analytics service (Google Analytics API, Plausible, etc.)
- Or build custom analytics (track page views in database)

**3. Role Distribution**

**Type:** Donut chart

**Data:**

- Slice per role
- Show count + percentage
- Color per role
- Interactive: Click slice to filter user list
- Legend with role names

**4. Activity Heatmap**

**Type:** Calendar heatmap

**Data:**

- Grid: Weeks (columns) × Days (rows)
- Color intensity based on activity count
- Tooltip on hover: Date + count + top activities
- Filter by module (dropdown)
- Date range: Last 3 months

**Library:** react-calendar-heatmap or custom with Recharts

**5. KPI Dashboard**

**Purpose:** Customizable KPI cards

**Cards:**

- Content Publish Rate (pages/week)
- User Engagement Score (calculated metric)
- System Uptime (%)
- Each card:
  - Label
  - Current value
  - Target value
  - Progress bar
  - Trend sparkline
  - Status: On Track (green), At Risk (yellow), Critical (red)

**Customization:**

- User can select KPIs to display
- Configure targets
- Set alert thresholds

**6. Event Statistics**

**Type:** Multi-line chart

**Data:**

- X-axis: Events (or time periods)
- Y-axis: Count
- Lines:
  - Registrations (blue)
  - Attendance (green)
  - Capacity (gray dashed)
- Calculated: Attendance rate (%)
- Filter: Chapter, Date range, Event category
- Compare events side-by-side

#### 5.3.4 Data Table Widgets

**1. Recent Users**

- Columns: Avatar, Name, Role, Join Date
- Limit: 10 rows
- Actions: Edit, Deactivate
- "View All Users" link

**2. Latest Content Pages**

- Columns: Title, Status, Published Date
- Limit: 10 rows
- Actions: Edit, Preview
- "View All Pages" link

**3. Top Contributors**

- Ranking list (ranked by activity count)
- Show: Avatar, Name, Activity Count, Badge
- Limit: 10 users
- "View Leaderboard" link

#### 5.3.5 Role-Based Dashboard Templates

**Super Admin Dashboard:**

**Widgets:**

- System health monitor (server status, database size, error rate)
- All user activity feed (all users)
- Role distribution chart
- Module usage statistics (which modules are most used)
- Pending approvals (all categories)
- Quick actions: Add User, Create Role, View Logs, System Settings

**Director Dashboard:**

**Widgets:**

- Chapter-level analytics (filtered by director's chapter)
- Member activity within chapter
- Event performance for chapter (attendance rates, feedback)
- Budget overview (allocated, spent, remaining)
- Upcoming chapter events (calendar)
- Quick actions: Create Event, Approve Budget, Message Members, View Reports

**Content Editor Dashboard:**

**Widgets:**

- Content performance metrics (top pages, total views)
- Draft pages list (pages I created or assigned to me)
- Recently published pages
- SEO score overview (avg score, pages needing improvement)
- Media library usage (storage used, recent uploads)
- Quick actions: Create Page, Upload Media, View Analytics

**Member Dashboard:**

**Widgets:**

- Personal activity summary (my recent actions)
- Assigned tasks (tasks assigned to me)
- Upcoming events (events I registered for)
- Personal profile completion (progress bar)
- Notifications panel
- Quick actions: Update Profile, Browse Events, View Knowledge Base

#### 5.3.6 Dashboard Customization

**Edit Mode:**

Activated by toggle button "Edit Dashboard" (top-right)

**Features:**

**1. Add Widget:**

- Button: "+ Add Widget"
- Opens modal: Widget Library
- Categories: Operational, Analytical, Data Tables
- Search widgets by name
- Filter by permission (only show widgets user has access to)
- Each widget card:
  - Preview thumbnail
  - Name + description
  - Permissions required (badge)
  - "Add" button
- Click "Add" → Widget appears on dashboard (next available position)

**2. Reorder Widgets:**

- Drag handle appears on each widget (⋮⋮ icon)
- Drag widget to new position
- Grid system: 12 columns, auto-layout
- Drop zones highlighted on drag
- Snap to grid

**3. Resize Widgets:**

- Resize handles (corners + edges)
- Min/Max size per widget type:
  - Small: 1x1 (stats card)
  - Medium: 2x1 or 1x2 (charts)
  - Large: 2x2 (tables, heatmaps)
- Responsive: Stacks on mobile

**4. Widget Settings:**

- Gear icon on each widget
- Opens popover/modal with:
  - Widget-specific configuration
  - Data source filters
  - Display options (colors, labels, limits)
  - Refresh interval (30s, 1m, 5m, Manual)
- Save changes → Widget re-renders with new config

**5. Remove Widget:**

- X button on each widget (top-right corner)
- Confirmation dialog: "Remove [Widget Name] from dashboard?"
- Confirm → Widget removed from layout

**6. Save Layout:**

- Button: "Save Layout"
- Saves to database: `user_dashboard_preferences` or `dashboard_layouts`
- Confirmation toast: "Dashboard layout saved"

**7. Reset to Default:**

- Button: "Reset to Default"
- Confirmation dialog: "Reset dashboard to default layout for your role?"
- Confirm → Load role-based default layout
- User customizations cleared

**Widget Library Modal:**

**Layout:**

- Search bar (top)
- Category tabs (Operational, Analytical, Data Tables, All)
- Grid of widget cards (2-3 columns)
- Each card:
  - Thumbnail (static preview image)
  - Widget name
  - Short description
  - Permission badges (if any)
  - "Add to Dashboard" button
  - "Preview" button (shows full-size preview in modal)

**Filter Logic:**

```typescript
const filteredWidgets = allWidgets.filter(widget => {
  // Check if user has required permissions
  if (widget.required_permissions.length > 0) {
    const hasAllPermissions = widget.required_permissions.every(perm =>
      userPermissions.includes(perm)
    )
    if (!hasAllPermissions) return false
  }

  // Filter by search query
  if (searchQuery && !widget.name.toLowerCase().includes(searchQuery.toLowerCase())) {
    return false
  }

  // Filter by category
  if (selectedCategory !== 'all' && widget.category !== selectedCategory) {
    return false
  }

  return true
})
```

#### 5.3.7 Real-Time Updates

**Supabase Realtime Subscriptions:**

**Activity Feed:**

```typescript
const channel = supabase
  .channel('activity_feed')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'user_activity_logs'
  }, (payload) => {
    setActivities(prev => [payload.new, ...prev])
    // Show toast notification for new activity
    toast.info('New activity detected')
  })
  .subscribe()
```

**Notifications:**

```typescript
const channel = supabase
  .channel(`notifications:${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'in_app_notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    setNotifications(prev => [payload.new, ...prev])
    // Show toast
    toast.info(payload.new.title)
    // Play sound
    playNotificationSound()
  })
  .subscribe()
```

**Pending Tasks Count:**

```typescript
// Update badge count when tasks change
const channel = supabase
  .channel('pending_tasks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'user_roles',
    filter: `roles.name=eq.guest`
  }, () => {
    // Refetch pending tasks count
    refetchPendingTasks()
  })
  .subscribe()
```

**Auto-Refresh:**

Configurable per widget:

- 30 seconds (high frequency)
- 1 minute (default for operational widgets)
- 5 minutes (default for analytical widgets)
- Manual only (user clicks refresh)

**Visual Indicators:**

- Pulse animation on new data
- Toast notifications for significant events
- Badge count updates
- "Updated 5 seconds ago" timestamp

#### 5.3.8 Export & Reporting

**Export Dashboard:**

- Button: "Export Dashboard"
- Options:
  - PDF (full dashboard as document)
  - PNG (screenshot)
- Uses html2canvas + jsPDF libraries
- Includes: All visible widgets, charts rendered, timestamps

**Export Widget Data:**

- Per-widget export button (download icon)
- Formats: CSV, Excel, JSON
- Exports current filtered/sorted data
- Filename: `{widget-name}_{date}.{format}`

**Schedule Reports:**

- Route: `/admin/dashboard/reports`
- Create scheduled report:
  - Report name
  - Widgets to include (multi-select)
  - Frequency: Daily, Weekly, Monthly
  - Day/time
  - Recipients (email list)
  - Format: PDF, Excel
- Sent via email using background job

**Custom Date Range:**

- Date range picker (from - to)
- Presets: Today, Yesterday, Last 7 days, Last 30 days, This month, Last month, Custom
- Applied to all time-based widgets
- "Apply" button refreshes all widgets

---

## 6. Phase 2+ Future Modules

### 6.1 Module Activation System

**System Modules Table:**

- Each module has a feature flag: `is_enabled`
- Super admin can enable/disable modules from `/admin/settings/modules`
- When module enabled:
  - Permissions auto-created for super_admin role
  - Menu items appear (for users with permissions)
  - Routes become accessible

**Module Configuration:**

```typescript
export const AVAILABLE_MODULES = [
  {
    key: 'events',
    name: 'Event Management',
    description: 'Manage events, volunteers, check-ins, and resources',
    icon: 'Calendar',
    route: '/admin/events',
    permissions: ['events:*:*'],
    dependencies: [], // Other modules required
    database_tables: ['events', 'event_volunteers', 'event_checkins'],
    status: 'available' // 'available', 'coming_soon', 'beta'
  },
  {
    key: 'members',
    name: 'Member Management',
    description: 'Member directory, skills, networks, and assessments',
    icon: 'Users',
    route: '/admin/members',
    permissions: ['members:*:*'],
    dependencies: [],
    database_tables: ['members', 'member_skills', 'member_networks'],
    status: 'available'
  },
  // ... more modules
]
```

### 6.2 Future Module Roadmap

**Phase 2 (Q1 2026):**

1. Event Management
2. Member Management

**Phase 3 (Q2 2026):** 3. Financial Management 4. Knowledge Management

**Phase 4 (Q3 2026):** 5. Stakeholder CRM 6. Communication Hub

**Phase 5 (Q4 2026):** 7. Awards & Recognition 8. Succession Planning

**Phase 6 (2027):** 9. Vertical Performance 10. PWA & Mobile Features 11. National Integration

### 6.3 Module Summaries

**(Detailed specifications to be created when implementing each module)**

**Event Management:**

- Leverages existing: `events`, `event_volunteers`, `event_checkins`, `guest_rsvps`, `event_documents`, `resources`, `resource_bookings`
- Features: Event creation wizard, volunteer assignment, QR code check-in, guest management, resource booking

**Member Management:**

- Leverages existing: `members`, `member_skills`, `member_networks`, `availability`, `leadership_assessments`
- Features: Member directory, skills inventory, relationship mapping, availability calendar, leadership pipeline

**Financial Management:**

- Leverages existing: `budgets`, `budget_allocations`, `expenses`, `expense_receipts`, `sponsorships`
- Features: Budget planning, expense tracking, approval workflows, sponsorship management, financial reports

**Knowledge Management:**

- Leverages existing: `knowledge_documents`, `knowledge_document_versions`, `wiki_pages`, `best_practices`
- Features: Document library, full-text search, wiki collaboration, version control, access logs

**Stakeholder CRM:**

- Leverages existing: `ngos`, `vendors`, `schools`, `colleges`, `relationship_health_scores`
- Features: Partner database, MOU tracking, collaboration history, relationship health scoring

**Communication Hub:**

- Leverages existing: `announcements`, `announcement_recipients`, `announcement_templates`, `communication_segments`
- Features: Multi-channel messaging, template library, audience segmentation, delivery analytics

**Awards & Recognition:**

- Leverages existing: `award_cycles`, `nominations`, `jury_members`, `jury_scores`
- Features: Award cycle management, nomination system, jury scoring, winner announcements

**Succession Planning:**

- Leverages existing: `succession_cycles`, `succession_positions`, `succession_nominations`, `succession_evaluations`
- Features: Position planning, nomination workflow, evaluation system, interview scheduling, audit trail

**Vertical Performance:**

- Leverages existing: `vertical_plans`, `vertical_kpis`, `vertical_kpi_actuals`, `vertical_activities`
- Features: KPI tracking, activity logging, achievement showcase, performance reviews

**PWA & Mobile:**

- Leverages existing: `push_subscriptions`, `push_notification_logs`
- Features: Web push notifications, offline support, install prompts, mobile optimization

**National Integration:**

- Leverages existing: `national_sync_logs`, `national_sync_entities`, `national_data_conflicts`
- Features: Multi-chapter data sync, conflict resolution, national-level reporting

---

## 7. Technical Implementation Guide

### 7.1 Setup & Installation

**1. Install Dependencies:**

```bash
npm install @supabase/ssr @supabase/supabase-js
npm install @tanstack/react-query @tanstack/react-table
npm install @radix-ui/react-* # All Radix primitives
npm install class-variance-authority clsx tailwind-merge
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react recharts date-fns
npm install sonner vaul cmdk
npm install @dnd-kit/core @dnd-kit/sortable
npm install react-dropzone sharp
```

**2. Environment Variables:**

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://pmqodbfhsejbvfbmsfeq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional
NEXT_PUBLIC_SITE_URL=https://jkkn.ac.in
```

**3. Supabase Client Setup:**

```typescript
// lib/supabase/client.ts (Browser)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts (Server Components)
import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
}

// lib/supabase/middleware.ts (Middleware)
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value: '', ...options })
        }
      }
    }
  )

  return { supabase, response }
}
```

**4. React Query Provider:**

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 7.2 Authentication Implementation

**Middleware:**

```typescript
// middleware.ts
import { createMiddlewareClient } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // Refresh session
  const { data: { session } } = await supabase.auth.getSession()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check role (non-guest)
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', session.user.id)

    const isGuest = userRoles?.every(ur => ur.roles.name === 'guest')

    if (isGuest && request.nextUrl.pathname !== '/admin/dashboard') {
      return NextResponse.redirect(new URL('/admin/access-denied', request.url))
    }

    // Check permissions
    const requiredPermission = getRoutePermission(request.nextUrl.pathname)
    if (requiredPermission) {
      const hasPermission = await checkPermission(supabase, session.user.id, requiredPermission)
      if (!hasPermission) {
        return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*']
}

function getRoutePermission(pathname: string): string | null {
  const routePermissions: Record<string, string> = {
    '/admin/users': 'users:profiles:view',
    '/admin/roles': 'users:roles:view',
    '/admin/content/pages': 'content:pages:view',
    // ... map all routes
  }
  return routePermissions[pathname] || null
}

async function checkPermission(supabase: any, userId: string, permission: string): Promise<boolean> {
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id, roles(name)')
    .eq('user_id', userId)

  // Super admin has all permissions
  if (userRoles?.some((ur: any) => ur.roles.name === 'super_admin')) {
    return true
  }

  // Check role permissions
  const { data: permissions } = await supabase
    .from('role_permissions')
    .select('permission')
    .in('role_id', userRoles.map((r: any) => r.role_id))

  return permissions?.some((p: any) =>
    p.permission === permission || matchWildcard(p.permission, permission)
  ) || false
}

function matchWildcard(pattern: string, permission: string): boolean {
  const patternParts = pattern.split(':')
  const permissionParts = permission.split(':')
  return patternParts.every((part, i) => part === '*' || part === permissionParts[i])
}
```

### 7.3 Server Actions Pattern

```typescript
// app/actions/users.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'

const createUserSchema = z.object({
  email: z.string().email().endsWith('@jkkn.ac.in'),
  fullName: z.string().min(1),
  chapterId: z.string().uuid(),
  roleIds: z.array(z.string().uuid()).min(1)
})

export async function createUser(formData: FormData) {
  const supabase = createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Validate
  const data = createUserSchema.parse({
    email: formData.get('email'),
    fullName: formData.get('fullName'),
    chapterId: formData.get('chapterId'),
    roleIds: JSON.parse(formData.get('roleIds') as string)
  })

  // Add to approved emails
  const { data: approvedEmail, error: emailError } = await supabase
    .from('approved_emails')
    .insert({ email: data.email })
    .select()
    .single()

  if (emailError) throw emailError

  // Send invitation email
  // (Implement email sending logic)

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'users',
    resourceType: 'approved_email',
    resourceId: approvedEmail.id,
    metadata: { email: data.email }
  })

  // Revalidate
  revalidatePath('/admin/users')

  return { success: true, email: data.email }
}
```

### 7.4 Advanced Table Pattern

```typescript
// components/admin/data-table.tsx
'use client'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'

export function DataTable({ queryKey, queryFn, columns }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 })
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState({})

  // Server-side data fetching
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, pagination, sorting, filtering],
    queryFn: () => queryFn({ pagination, sorting, filtering })
  })

  const table = useReactTable({
    data: data?.rows || [],
    columns,
    pageCount: data?.pageCount || 0,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true
  })

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() && (
                    <span>{header.column.getIsSorted() === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={columns.length}>Loading...</td></tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <span>Page {pagination.pageIndex + 1} of {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
      </div>
    </div>
  )
}
```

### 7.5 Real-time Subscription Pattern

```typescript
// lib/hooks/use-realtime.ts
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeSubscription<T>(
  table: string,
  filter?: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) {
  const [data, setData] = useState<T | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', {
        event,
        schema: 'public',
        table,
        filter
      }, (payload) => {
        setData(payload.new as T)
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [table, filter, event])

  return data
}

// Usage
const newActivity = useRealtimeSubscription('user_activity_logs', null, 'INSERT')

useEffect(() => {
  if (newActivity) {
    setActivities(prev => [newActivity, ...prev])
    toast.info('New activity detected')
  }
}, [newActivity])
```

---

## 8. Database Schema Requirements

### 8.1 New Migrations to Create

**Priority 1 (User Management & RBAC):**

1. `create_role_permissions_table.sql`
2. `create_user_activity_logs_table.sql`
3. `create_system_modules_table.sql`
4. `seed_default_permissions.sql`
5. `seed_system_modules.sql`

**Priority 2 (Content Management):** 6. `create_cms_pages_table.sql` 7. `create_cms_page_blocks_table.sql` 8. `create_cms_component_registry_table.sql` 9. `create_cms_seo_metadata_table.sql` 10. `create_cms_page_fab_config_table.sql` 11. `create_cms_media_library_table.sql` 12. `create_cms_page_templates_table.sql` 13. `create_cms_page_versions_table.sql` 14. `seed_cms_component_registry.sql`

**Priority 3 (Dashboard):** 15. `create_dashboard_layouts_table.sql` 16. `create_dashboard_widgets_table.sql` 17. `create_user_dashboard_preferences_table.sql` 18. `create_dashboard_quick_actions_table.sql` 19. `seed_dashboard_widgets.sql` 20. `seed_dashboard_layouts.sql`

### 8.2 RLS Policies Required

**All new tables need RLS policies:**

```sql
-- Example: cms_pages RLS
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

-- View: Users with content:pages:view permission
CREATE POLICY "Users can view published pages"
  ON cms_pages FOR SELECT
  USING (
    status = 'published' OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      WHERE ur.user_id = auth.uid()
      AND (rp.permission = 'content:pages:view' OR rp.permission = 'content:*:*')
    )
  );

-- Create: Users with content:pages:create permission
CREATE POLICY "Users can create pages"
  ON cms_pages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      WHERE ur.user_id = auth.uid()
      AND (rp.permission = 'content:pages:create' OR rp.permission = 'content:*:*')
    )
  );

-- Update: Users with content:pages:edit permission or page creator
CREATE POLICY "Users can update own pages or with permission"
  ON cms_pages FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      WHERE ur.user_id = auth.uid()
      AND (rp.permission = 'content:pages:edit' OR rp.permission = 'content:*:*')
    )
  );

-- Delete: Users with content:pages:delete permission
CREATE POLICY "Users can delete pages with permission"
  ON cms_pages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      WHERE ur.user_id = auth.uid()
      AND (rp.permission = 'content:pages:delete' OR rp.permission = 'content:*:*')
    )
  );
```

### 8.3 Database Functions

**Get User Permissions:**

```sql
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid uuid)
RETURNS TABLE (permission text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT rp.permission
  FROM user_roles ur
  JOIN role_permissions rp ON ur.role_id = rp.role_id
  WHERE ur.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Check Permission:**

```sql
CREATE OR REPLACE FUNCTION has_permission(user_uuid uuid, required_permission text)
RETURNS boolean AS $$
DECLARE
  has_perm boolean;
BEGIN
  -- Check if user has super_admin role
  IF EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND r.name = 'super_admin'
  ) THEN
    RETURN true;
  END IF;

  -- Check exact permission or wildcard match
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = user_uuid
    AND (
      rp.permission = required_permission OR
      rp.permission LIKE REPLACE(REPLACE(required_permission, ':*', ':%'), ':%', ':*')
    )
  ) INTO has_perm;

  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 9. Implementation Roadmap

### 9.1 Phase 1: Foundation (Weeks 1-4)

**Week 1: Project Setup**

- Install dependencies
- Configure Supabase clients (browser, server, middleware)
- Set up React Query provider
- Create shadcn/ui component library
- Configure Tailwind + global styles
- Set up TypeScript types (generate from Supabase)

**Week 2: Database Migrations**

- Create all new tables (user management, CMS, dashboard)
- Apply RLS policies
- Create database functions
- Seed default data (roles, permissions, modules, widgets)
- Test migrations locally

**Week 3: Authentication & Authorization**

- Implement Google OAuth login page
- Create auth callback handler
- Build middleware with permission checks
- Create access-denied and unauthorized pages
- Build useAuth and usePermissions hooks
- Test auth flow end-to-end

**Week 4: Admin Layout & Navigation**

- Build admin layout with sidebar
- Implement dynamic menu (permission-based)
- Create header with user dropdown
- Build breadcrumb navigation
- Add notifications icon
- Responsive mobile sidebar

### 9.2 Phase 2: User Management Module (Weeks 5-7)

**Week 5: User List & Detail**

- Build users list page with advanced table
- Implement server-side pagination, sorting, filtering
- Create user detail page (profile, roles, activity)
- Build manual user creation form
- Add bulk actions (assign role, deactivate)

**Week 6: Role Management**

- Build roles list page
- Create custom role creation form
- Implement permission matrix UI
- Add role detail page with permission editor
- Build permission inheritance system

**Week 7: Activity Tracking & Testing**

- Implement activity logger utility
- Create activity log viewer
- Add system-wide activity feed
- Build guest user protection
- End-to-end testing of user management

### 9.3 Phase 3: Content Management Module (Weeks 8-12)

**Week 8: Page Management**

- Build pages list with tree view
- Create page creation wizard
- Implement slug generation
- Add page status workflow (draft, published, archived)
- Build page duplication feature

**Week 9-10: Page Builder (Visual Mode)**

- Build page builder canvas (drag-and-drop)
- Create component palette with categories
- Implement props panel with form inputs
- Add device switcher (responsive preview)
- Build undo/redo system
- Implement auto-save

**Week 11: Page Builder (Advanced Features)**

- Add advanced mode (code editor + preview)
- Implement version history
- Build template system (save & apply)
- Add preview functionality
- Create publish workflow

**Week 12: CMS Components & Media**

- Build all CMS block components (content, media, layout, data)
- Implement component registry
- Create media library interface
- Add image upload to Supabase Storage
- Build FAB configuration UI
- Implement SEO panel

### 9.4 Phase 4: Dashboard Module (Weeks 13-15)

**Week 13: Dashboard Foundation**

- Build dashboard layout with grid system
- Implement role-based default layouts
- Create time range selector
- Add edit mode toggle
- Build widget library modal

**Week 14: Widgets (Operational)**

- Build pending tasks widget
- Create recent activity feed with real-time
- Implement quick stats cards
- Add notifications panel
- Create upcoming events calendar widget

**Week 15: Widgets (Analytical) & Customization**

- Build user growth chart
- Create content performance widgets
- Implement role distribution donut chart
- Add activity heatmap
- Build KPI dashboard widget
- Implement dashboard customization (add, remove, reorder, resize widgets)
- Add export dashboard functionality

### 9.5 Phase 5: Frontend Public Website (Weeks 16-18)

**Week 16: Public Layout & Core Pages**

- Build public layout (navbar, footer)
- Create homepage
- Build about page
- Create programs page
- Add contact page

**Week 17: Dynamic Page Rendering**

- Implement `[...slug]` route
- Build PageRenderer component
- Create component registry loader
- Add SEO metadata generation
- Implement FAB on mobile

**Week 18: Data Blocks & Polish**

- Build data block components (events list, faculty directory, stats counters)
- Implement server-side data fetching for data blocks
- Add loading states and skeletons
- Optimize images (WebP, responsive sizes)
- SEO testing and optimization

### 9.6 Phase 6: Testing & Launch (Weeks 19-20)

**Week 19: Testing**

- End-to-end testing (all modules)
- Permission testing (verify RBAC works correctly)
- Performance testing (Lighthouse, Core Web Vitals)
- Accessibility testing (WCAG 2.1 AA)
- Browser compatibility testing
- Mobile responsiveness testing

**Week 20: Launch Preparation**

- Production deployment (Vercel recommended)
- DNS configuration
- SSL certificate
- Set up monitoring (Sentry, analytics)
- Create admin user documentation
- Train initial users
- Soft launch with limited users
- Collect feedback and iterate

### 9.7 Post-Launch

**Weeks 21+:**

- Monitor system performance and errors
- Address bugs and feedback
- Optimize performance bottlenecks
- Plan Phase 2 modules (Event Management, Member Management)
- Iterate based on user needs

---

## 10. Skills & Best Practices

### 10.1 Required Skills to Use

**For All Module Implementation:**

1. **nextjs16-web-development** (`.claude/skills/nextjs16-web-development`)

   - Use for: Building all CRUD features, Server Actions, caching strategies, form handling
   - When to trigger: Any Next.js 16 development task, module creation, feature implementation
   - Covers: Server Components, Server Actions, caching, validation, database integration

2. **advanced-tables-components** (`.claude/skills/advanced-tables-components`)
   - Use for: User list, roles list, activity logs, any data table with server-side operations
   - When to trigger: Building data-intensive tables with pagination, sorting, filtering
   - Covers: TanStack Table v8, server-side operations, Supabase integration, bulk actions

**For Database Work:**

3. **supabase-expert** (`.claude/skills/supabase-expert`)
   - Use for: Creating migrations, RLS policies, database functions, Auth SSR
   - When to trigger: Database schema changes, security policies, Edge Functions
   - Covers: Migrations, RLS, Auth, Edge Functions, database design

**For UI Work:**

4. **brand-styling** (`.claude/skills/brand-styling`)

   - Use for: Implementing consistent design across all components
   - When to trigger: Building new UI components, styling pages
   - Covers: Brand colors, typography, spacing, responsive design, dark mode

5. **frontend-design:frontend-design** (plugin)
   - Use for: Creating polished, distinctive UI components
   - When to trigger: Building complex UI (page builder, dashboard widgets)
   - Covers: Production-grade frontend with high design quality

**For Complex Features:**

6. **brainstorming** (`.claude/skills/brainstorming`)
   - Use for: Refining rough ideas into fully-formed designs before implementation
   - When to trigger: Planning new features, exploring alternatives, design decisions
   - Covers: Structured questioning, alternative exploration, incremental validation

**For Implementation Planning:**

7. **writing-plans** (`.claude/skills/writing-plans`)
   - Use for: Creating detailed implementation plans for engineers
   - When to trigger: When design is complete and ready for implementation
   - Covers: Task breakdown, file paths, code examples, verification steps

### 10.2 Development Best Practices

**Next.js 16 Patterns:**

- Use Server Components by default
- Only mark components as 'use client' when needed (interactivity, hooks)
- Use Server Actions for mutations (not API routes)
- Leverage Next.js caching (fetch, unstable_cache)
- Use generateStaticParams for dynamic routes

**Supabase Patterns:**

- Always use RLS policies (never bypass with service role in client code)
- Use server-side client for sensitive operations
- Implement proper error handling for database queries
- Use real-time subscriptions for live updates
- Optimize queries with select('specific, fields')

**TypeScript:**

- Generate types from Supabase: `npx supabase gen types typescript --local > types/database.ts`
- Use Zod for runtime validation
- Type all Server Actions
- Avoid `any` types

**Performance:**

- Optimize images (next/image with WebP)
- Lazy load components (React.lazy, Suspense)
- Implement pagination (don't load all data at once)
- Use React Query for client-side caching
- Minimize bundle size (code splitting, dynamic imports)

**Security:**

- Never expose service role key to client
- Always validate user permissions server-side
- Sanitize user inputs
- Use CSRF protection (built-in with Next.js)
- Implement rate limiting for sensitive operations

**Accessibility:**

- Use semantic HTML
- Add ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader testing

---

## Appendices

### A. Glossary

- **RBAC:** Role-Based Access Control
- **RLS:** Row Level Security (Supabase)
- **FAB:** Floating Action Button
- **CMS:** Content Management System
- **SEO:** Search Engine Optimization
- **SSR:** Server-Side Rendering
- **KPI:** Key Performance Indicator
- **MCP:** Model Context Protocol

### B. References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Table](https://tanstack.com/table)
- [React Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

### C. Contact & Support

**Project Owner:** JKKN Institution
**Development Team:** TBD
**Super Admin:** TBD

---

**End of PRD Document**

_This document is a living specification and will be updated as requirements evolve and features are implemented._
