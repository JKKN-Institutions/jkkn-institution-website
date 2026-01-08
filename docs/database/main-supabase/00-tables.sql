-- ================================================================
-- MAIN SUPABASE DATABASE TABLES
-- ================================================================
-- Project: JKKN Institution Website
-- Supabase Project ID: pmqodbfhsejbvfbmsfeq
-- Total Tables: 52
-- Last Updated: 2026-01-07
-- ================================================================
--
-- IMPORTANT: This file documents ALL table structures in the database.
-- All table creations MUST be documented here BEFORE being executed.
--
-- TABLE CATEGORIES:
-- 1. User Management & RBAC (9 tables)
-- 2. CMS System (15 tables)
-- 3. Blog System (8 tables)
-- 4. Career Management (5 tables)
-- 5. Dashboard & Widgets (4 tables)
-- 6. Educational Content (3 tables)
-- 7. Contact & Communication (4 tables)
-- 8. System Configuration (4 tables)
-- ================================================================


-- ================================================================
-- CATEGORY 1: USER MANAGEMENT & RBAC
-- ================================================================
-- Purpose: Core user authentication, roles, permissions, and access control
-- Tables: 9
-- ================================================================

-- ============================================
-- TABLE: profiles
-- ============================================
-- Purpose: User profile information (1:1 with auth.users)
-- Created: 2025-12-01
-- Dependencies: auth.users (Supabase Auth)
-- Used by: members, user_roles, user_activity_logs
-- ============================================

CREATE TABLE profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  department text,
  designation text,
  employee_id text,
  date_of_joining date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login_at timestamp with time zone,
  PRIMARY KEY (id),
  UNIQUE (email)
);

-- End of profiles
-- ============================================


-- ============================================
-- TABLE: members
-- ============================================
-- Purpose: Organization membership tracking
-- Created: 2025-12-01
-- Dependencies: profiles, auth.users
-- ============================================

CREATE TABLE members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  profile_id uuid,
  member_id text,
  chapter text,
  status text DEFAULT 'active'::text,
  membership_type text,
  joined_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (member_id, user_id)
);

-- End of members
-- ============================================


-- ============================================
-- TABLE: roles
-- ============================================
-- Purpose: Role definitions for RBAC
-- Created: 2025-12-01
-- System Roles: super_admin, director, chair, member, guest
-- ============================================

CREATE TABLE roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  description text,
  is_system_role boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (name)
);

-- End of roles
-- ============================================


-- ============================================
-- TABLE: user_roles
-- ============================================
-- Purpose: User-to-role assignments (many-to-many)
-- Created: 2025-12-01
-- Dependencies: auth.users, roles
-- ============================================

CREATE TABLE user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  assigned_by uuid,
  assigned_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, role_id)
);

-- End of user_roles
-- ============================================


-- ============================================
-- TABLE: role_permissions
-- ============================================
-- Purpose: Role-to-permission mappings
-- Created: 2025-12-01
-- Permission Format: module:resource:action (e.g., users:profiles:edit)
-- ============================================

CREATE TABLE role_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL,
  permission text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (role_id, permission)
);

-- End of role_permissions
-- ============================================


-- ============================================
-- TABLE: user_role_changes
-- ============================================
-- Purpose: Audit trail for role assignments/removals
-- Created: 2025-12-01
-- Actions: assign, remove
-- ============================================

CREATE TABLE user_role_changes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  role_id uuid NOT NULL,
  action text NOT NULL,
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT now(),
  reason text,
  PRIMARY KEY (id)
);

-- End of user_role_changes
-- ============================================


-- ============================================
-- TABLE: user_activity_logs
-- ============================================
-- Purpose: Comprehensive activity logging for compliance and auditing
-- Created: 2025-12-01
-- Retention: Per data retention policies
-- ============================================

CREATE TABLE user_activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  module text NOT NULL,
  resource_type text,
  resource_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of user_activity_logs
-- ============================================


-- ============================================
-- TABLE: approved_emails
-- ============================================
-- Purpose: Email whitelist for Google OAuth (@jkkn.ac.in restriction)
-- Created: 2025-12-01
-- Status: active, inactive
-- ============================================

CREATE TABLE approved_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  added_by uuid,
  added_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'active'::text,
  notes text,
  PRIMARY KEY (id),
  UNIQUE (email)
);

-- End of approved_emails
-- ============================================


-- ============================================
-- TABLE: deleted_users_archive
-- ============================================
-- Purpose: GDPR-compliant user deletion archive with snapshots
-- Created: 2025-12-19
-- Modified: 2026-01-07 (Upgraded to advanced schema)
-- Features:
--   - Email hashing for privacy
--   - Profile and role snapshots
--   - Data retention policies
--   - Purge tracking
--   - Anonymization support
-- ============================================

CREATE TABLE deleted_users_archive (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  original_user_id uuid NOT NULL,
  deleted_by uuid,
  deleted_at timestamp with time zone DEFAULT now(),
  deletion_reason text,
  deletion_type text DEFAULT 'user_requested'::text,
  profile_snapshot jsonb,
  roles_snapshot jsonb,
  anonymized_data jsonb DEFAULT '{}'::jsonb,
  retention_until timestamp with time zone,
  is_purged boolean DEFAULT false,
  purged_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb,
  email_hash text,
  PRIMARY KEY (id)
);

-- End of deleted_users_archive
-- ============================================


-- ================================================================
-- CATEGORY 2: CMS SYSTEM
-- ================================================================
-- Purpose: Content Management System with page builder
-- Tables: 15
-- ================================================================

-- ============================================
-- TABLE: cms_pages
-- ============================================
-- Purpose: Main CMS pages table
-- Created: 2025-12-10
-- Soft Delete: deleted_at, deleted_by columns
-- Status: draft, submitted, approved, published, archived
-- Visibility: public, private, password_protected
-- ============================================

CREATE TABLE cms_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  parent_id uuid,
  template_id uuid,
  status text NOT NULL DEFAULT 'draft'::text,
  visibility text NOT NULL DEFAULT 'public'::text,
  password_hash text,
  scheduled_publish_at timestamp with time zone,
  published_at timestamp with time zone,
  featured_image text,
  sort_order integer DEFAULT 0,
  is_homepage boolean DEFAULT false,
  show_in_navigation boolean DEFAULT true,
  navigation_label text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  external_url text,
  submitted_for_review_at timestamp with time zone,
  submitted_by uuid,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  review_notes text,
  deleted_at timestamp with time zone,
  deleted_by uuid,
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of cms_pages
-- ============================================

-- ============================================
-- ALTER TABLE: cms_pages - Add Page Redirect Feature
-- ============================================
-- Purpose: Add redirect functionality to pages
-- Modified: 2026-01-08
-- Feature: Page Redirect URL
-- Description: When is_redirect is TRUE, the page will redirect to redirect_url
--              instead of rendering components. This allows pages to redirect
--              to external URLs or internal paths without creating content blocks.
-- Dependencies: None
-- Used by: Page editor, public page renderer
-- Security: redirect_url is validated to prevent open redirect vulnerabilities
-- ============================================
-- Columns Added:
--   - is_redirect: Boolean flag to enable/disable redirect
--   - redirect_url: Target URL for redirect (required when is_redirect = TRUE)
--   - redirect_type: Redirect HTTP status code ('permanent' = 301, 'temporary' = 302)
--
-- Business Rules:
--   1. When is_redirect = TRUE, redirect_url must be provided
--   2. redirect_url must be a valid URL or path
--   3. When is_redirect = TRUE, cms_page_blocks should be empty (enforced in UI)
--   4. redirect_type determines HTTP status code (301 vs 302)
--   5. Validation prevents open redirect attacks (whitelist approach)
-- ============================================

ALTER TABLE cms_pages
ADD COLUMN is_redirect BOOLEAN DEFAULT FALSE,
ADD COLUMN redirect_url TEXT,
ADD COLUMN redirect_type TEXT DEFAULT 'temporary' CHECK (redirect_type IN ('permanent', 'temporary')),
ADD CONSTRAINT redirect_url_required_when_enabled
  CHECK (is_redirect = FALSE OR (redirect_url IS NOT NULL AND redirect_url != ''));

-- Create index for filtering redirect pages
CREATE INDEX idx_cms_pages_is_redirect ON cms_pages(is_redirect) WHERE is_redirect = TRUE;

-- Comment for documentation
COMMENT ON COLUMN cms_pages.is_redirect IS 'Enable page redirect instead of rendering content';
COMMENT ON COLUMN cms_pages.redirect_url IS 'Target URL for redirect (required when is_redirect = TRUE)';
COMMENT ON COLUMN cms_pages.redirect_type IS 'Redirect type: permanent (301) or temporary (302)';

-- End of cms_pages redirect feature
-- ============================================


-- ============================================
-- TABLE: cms_page_blocks
-- ============================================
-- Purpose: Page builder blocks (components)
-- Created: 2025-12-10
-- Dependencies: cms_pages, cms_component_registry
-- Supports: Nested blocks via parent_block_id
-- ============================================

CREATE TABLE cms_page_blocks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  parent_block_id uuid,
  component_name text NOT NULL,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean DEFAULT true,
  responsive_settings jsonb DEFAULT '{}'::jsonb,
  custom_css text,
  custom_classes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of cms_page_blocks
-- ============================================


-- ============================================
-- TABLE: cms_page_versions
-- ============================================
-- Purpose: Version control for CMS pages
-- Created: 2025-12-10
-- Snapshot Types: auto, manual, published
-- ============================================

CREATE TABLE cms_page_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  version_number integer NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  blocks_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_snapshot jsonb DEFAULT '{}'::jsonb,
  fab_snapshot jsonb DEFAULT '{}'::jsonb,
  change_summary text,
  is_auto_save boolean DEFAULT false,
  is_published_version boolean DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (page_id, version_number)
);

-- End of cms_page_versions
-- ============================================


-- ============================================
-- TABLE: cms_page_templates
-- ============================================
-- Purpose: Reusable page templates
-- Created: 2025-12-10
-- System Templates: Cannot be deleted/modified
-- ============================================

CREATE TABLE cms_page_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  thumbnail_url text,
  default_blocks jsonb DEFAULT '[]'::jsonb,
  is_system boolean DEFAULT false,
  category text DEFAULT 'general'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of cms_page_templates
-- ============================================


-- ============================================
-- TABLE: cms_page_fab_config
-- ============================================
-- Purpose: Floating Action Button configuration per page
-- Created: 2025-12-15
-- Position: bottom-right, bottom-left, top-right, top-left
-- ============================================

CREATE TABLE cms_page_fab_config (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  is_enabled boolean DEFAULT false,
  position text DEFAULT 'bottom-right'::text,
  theme text DEFAULT 'auto'::text,
  primary_action text DEFAULT 'contact'::text,
  custom_action_label text,
  custom_action_url text,
  custom_action_icon text,
  show_whatsapp boolean DEFAULT true,
  show_phone boolean DEFAULT true,
  show_email boolean DEFAULT true,
  show_directions boolean DEFAULT false,
  whatsapp_number text,
  phone_number text,
  email_address text,
  directions_url text,
  animation text DEFAULT 'bounce'::text,
  delay_ms integer DEFAULT 0,
  hide_on_scroll boolean DEFAULT false,
  custom_css text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  show_add boolean DEFAULT false,
  add_label text DEFAULT 'Add New'::text,
  add_url text,
  show_edit boolean DEFAULT false,
  edit_label text DEFAULT 'Edit'::text,
  show_update boolean DEFAULT false,
  update_label text DEFAULT 'Update'::text,
  show_settings boolean DEFAULT false,
  settings_label text DEFAULT 'Settings'::text,
  settings_url text,
  PRIMARY KEY (id),
  UNIQUE (page_id)
);

-- End of cms_page_fab_config
-- ============================================


-- ============================================
-- TABLE: cms_page_reviews
-- ============================================
-- Purpose: Review workflow tracking for page approvals
-- Created: 2025-12-10
-- Actions: submit, approve, reject, request_changes
-- ============================================

CREATE TABLE cms_page_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  action text NOT NULL,
  from_status text NOT NULL,
  to_status text NOT NULL,
  notes text,
  reviewed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of cms_page_reviews
-- ============================================


-- ============================================
-- TABLE: cms_seo_metadata
-- ============================================
-- Purpose: SEO metadata for CMS pages
-- Created: 2025-12-10
-- Dependencies: cms_pages (1:1 relationship)
-- ============================================

CREATE TABLE cms_seo_metadata (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  meta_title text,
  meta_description text,
  meta_keywords _text[],
  canonical_url text,
  robots_directive text DEFAULT 'index, follow'::text,
  og_title text,
  og_description text,
  og_image text,
  og_type text DEFAULT 'website'::text,
  twitter_card text DEFAULT 'summary_large_image'::text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  structured_data jsonb DEFAULT '[]'::jsonb,
  custom_head_tags text,
  seo_score integer DEFAULT 0,
  last_analyzed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (page_id)
);

-- End of cms_seo_metadata
-- ============================================


-- ============================================
-- TABLE: cms_component_registry
-- ============================================
-- Purpose: Built-in component definitions for page builder
-- Created: 2025-12-10
-- Categories: content, media, layout, data
-- ============================================

CREATE TABLE cms_component_registry (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  description text,
  category text NOT NULL,
  icon text,
  props_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  default_props jsonb DEFAULT '{}'::jsonb,
  supports_children boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (name)
);

-- End of cms_component_registry
-- ============================================


-- ============================================
-- TABLE: cms_component_collections
-- ============================================
-- Purpose: Organize custom components into collections
-- Created: 2025-12-20
-- ============================================

CREATE TABLE cms_component_collections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  icon text DEFAULT 'Folder'::text,
  color text DEFAULT '#6366f1'::text,
  parent_id uuid,
  sort_order integer DEFAULT 0,
  is_system boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of cms_component_collections
-- ============================================


-- ============================================
-- TABLE: cms_custom_components
-- ============================================
-- Purpose: User-created/imported custom components
-- Created: 2025-12-20
-- Source Types: npm, url, inline, local, github
-- Preview Status: pending, processing, success, failed
-- ============================================

CREATE TABLE cms_custom_components (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  description text,
  category text NOT NULL,
  icon text DEFAULT 'Puzzle'::text,
  source_type text NOT NULL,
  source_url text,
  source_registry text,
  file_path text NOT NULL,
  code text NOT NULL,
  props_schema jsonb DEFAULT '{}'::jsonb,
  default_props jsonb DEFAULT '{}'::jsonb,
  editable_props jsonb DEFAULT '[]'::jsonb,
  supports_children boolean DEFAULT false,
  is_full_width boolean DEFAULT false,
  preview_image text,
  preview_status text DEFAULT 'pending'::text,
  collection_id uuid,
  is_active boolean DEFAULT true,
  keywords _text[] DEFAULT '{}'::text[],
  dependencies jsonb DEFAULT '[]'::jsonb,
  version text DEFAULT '1.0.0'::text,
  created_by uuid,
  updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  preview_image_desktop text,
  preview_image_tablet text,
  preview_image_mobile text,
  PRIMARY KEY (id),
  UNIQUE (name)
);

-- End of cms_custom_components
-- ============================================


-- ============================================
-- TABLE: cms_external_registries
-- ============================================
-- Purpose: External component registries (npm, GitHub, etc.)
-- Created: 2025-12-20
-- Registry Types: npm, github, url, custom
-- Sync Status: never, syncing, success, failed
-- ============================================

CREATE TABLE cms_external_registries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  registry_url text NOT NULL,
  registry_type text NOT NULL,
  api_endpoint text,
  is_active boolean DEFAULT true,
  last_synced_at timestamp with time zone,
  sync_status text DEFAULT 'never'::text,
  sync_error text,
  cached_components jsonb DEFAULT '[]'::jsonb,
  auth_config jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of cms_external_registries
-- ============================================


-- ============================================
-- TABLE: cms_media_library
-- ============================================
-- Purpose: Central media storage and management
-- Created: 2025-12-12
-- File Types: image, video, audio, document, other
-- ============================================

CREATE TABLE cms_media_library (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  original_name text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  mime_type text NOT NULL,
  file_size bigint NOT NULL,
  width integer,
  height integer,
  alt_text text,
  caption text,
  folder text DEFAULT 'general'::text,
  tags _text[] DEFAULT '{}'::text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  uploaded_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of cms_media_library
-- ============================================


-- ============================================
-- TABLE: cms_folders
-- ============================================
-- Purpose: Folder structure for media library
-- Created: 2025-12-12
-- Supports: Nested folders via parent_id
-- ============================================

CREATE TABLE cms_folders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  parent_id uuid,
  color text,
  icon text,
  sort_order integer DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of cms_folders
-- ============================================


-- ============================================
-- TABLE: cms_preview_jobs
-- ============================================
-- Purpose: Background job queue for component preview generation
-- Created: 2025-12-20
-- Status: pending, processing, completed, failed
-- ============================================

CREATE TABLE cms_preview_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  component_id uuid NOT NULL,
  status text DEFAULT 'pending'::text,
  error_message text,
  attempts integer DEFAULT 0,
  max_attempts integer DEFAULT 3,
  scheduled_at timestamp with time zone DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of cms_preview_jobs
-- ============================================


-- ============================================
-- TABLE: cms_preview_links
-- ============================================
-- Purpose: Shareable preview links for draft pages
-- Created: 2025-12-15
-- Security: Token-based with optional password and email whitelist
-- ============================================

CREATE TABLE cms_preview_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  token text NOT NULL,
  name text,
  expires_at timestamp with time zone,
  password_hash text,
  is_active boolean DEFAULT true,
  max_views integer,
  view_count integer DEFAULT 0,
  last_viewed_at timestamp with time zone,
  allowed_emails _text[],
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (token)
);

-- End of cms_preview_links
-- ============================================


-- ================================================================
-- CATEGORY 3: BLOG SYSTEM
-- ================================================================
-- Purpose: Blogging platform with categories, tags, comments
-- Tables: 8
-- ================================================================

-- ============================================
-- TABLE: blog_posts
-- ============================================
-- Purpose: Blog post content
-- Created: 2025-12-05
-- Status: draft, published, scheduled, archived
-- Visibility: public, private, password_protected
-- ============================================

CREATE TABLE blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title varchar(300) NOT NULL,
  slug varchar(300) NOT NULL,
  excerpt text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  featured_image varchar(500),
  category_id uuid,
  author_id uuid NOT NULL,
  co_authors _uuid[] DEFAULT '{}'::uuid[],
  status varchar(20) DEFAULT 'draft'::character varying,
  visibility varchar(20) DEFAULT 'public'::character varying,
  password_hash varchar(255),
  published_at timestamp with time zone,
  scheduled_at timestamp with time zone,
  reading_time_minutes integer DEFAULT 5,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_pinned boolean DEFAULT false,
  allow_comments boolean DEFAULT true,
  seo_title varchar(200),
  seo_description varchar(500),
  seo_keywords _text[],
  og_image varchar(500),
  canonical_url varchar(500),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of blog_posts
-- ============================================


-- ============================================
-- TABLE: blog_categories
-- ============================================
-- Purpose: Blog post categories (hierarchical)
-- Created: 2025-12-05
-- Category Types: blog, news, events
-- ============================================

CREATE TABLE blog_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  description text,
  parent_id uuid,
  icon varchar(50),
  color varchar(7) DEFAULT '#6366f1'::character varying,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  post_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  category_type varchar(20) NOT NULL DEFAULT 'blog'::character varying,
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of blog_categories
-- ============================================


-- ============================================
-- TABLE: blog_tags
-- ============================================
-- Purpose: Blog post tags
-- Created: 2025-12-05
-- ============================================

CREATE TABLE blog_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  description text,
  color varchar(7) DEFAULT '#10b981'::character varying,
  usage_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of blog_tags
-- ============================================


-- ============================================
-- TABLE: blog_post_tags
-- ============================================
-- Purpose: Many-to-many relationship between posts and tags
-- Created: 2025-12-05
-- ============================================

CREATE TABLE blog_post_tags (
  post_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

-- End of blog_post_tags
-- ============================================


-- ============================================
-- TABLE: blog_comments
-- ============================================
-- Purpose: Threaded comments on blog posts
-- Created: 2025-12-05
-- Status: pending, approved, rejected, spam
-- Supports: Nested comments via parent_id
-- ============================================

CREATE TABLE blog_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid,
  parent_id uuid,
  author_id uuid,
  author_name varchar(100) NOT NULL,
  author_email varchar(255) NOT NULL,
  author_avatar varchar(500),
  content text NOT NULL,
  status varchar(20) DEFAULT 'pending'::character varying,
  moderated_by uuid,
  moderated_at timestamp with time zone,
  rejection_reason text,
  likes_count integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  ip_address inet,
  user_agent text,
  is_edited boolean DEFAULT false,
  edited_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of blog_comments
-- ============================================


-- ============================================
-- TABLE: blog_comment_likes
-- ============================================
-- Purpose: Track comment likes by users
-- Created: 2025-12-05
-- ============================================

CREATE TABLE blog_comment_likes (
  comment_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (comment_id, user_id)
);

-- End of blog_comment_likes
-- ============================================


-- ============================================
-- TABLE: blog_subscriptions
-- ============================================
-- Purpose: Email subscriptions for blog updates
-- Created: 2025-12-05
-- ============================================

CREATE TABLE blog_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL,
  user_id uuid,
  is_verified boolean DEFAULT false,
  verification_token varchar(100),
  subscribed_at timestamp with time zone DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  preferences jsonb DEFAULT '{"new_posts": true, "weekly_digest": false}'::jsonb,
  PRIMARY KEY (id),
  UNIQUE (email)
);

-- End of blog_subscriptions
-- ============================================


-- ============================================
-- TABLE: blog_post_versions
-- ============================================
-- Purpose: Version control for blog posts
-- Created: 2025-12-05
-- Snapshot Types: auto, manual
-- ============================================

CREATE TABLE blog_post_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid,
  version_number integer NOT NULL,
  title varchar(300) NOT NULL,
  content jsonb NOT NULL,
  excerpt text,
  snapshot_type varchar(20) DEFAULT 'auto'::character varying,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (post_id, version_number)
);

-- End of blog_post_versions
-- ============================================


-- ================================================================
-- CATEGORY 4: CAREER MANAGEMENT
-- ================================================================
-- Purpose: Job postings and application tracking
-- Tables: 5
-- ================================================================

-- ============================================
-- TABLE: career_jobs
-- ============================================
-- Purpose: Job postings
-- Created: 2025-12-08
-- Status: draft, published, closed, archived
-- Job Types: full-time, part-time, contract, internship, temporary
-- Work Mode: onsite, remote, hybrid
-- ============================================

CREATE TABLE career_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title varchar(200) NOT NULL,
  slug varchar(200) NOT NULL,
  description text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  department_id uuid,
  job_type varchar(30) NOT NULL,
  experience_level varchar(30),
  location varchar(100) NOT NULL,
  work_mode varchar(20) DEFAULT 'onsite'::character varying,
  salary_min numeric,
  salary_max numeric,
  salary_currency varchar(3) DEFAULT 'INR'::character varying,
  salary_period varchar(20) DEFAULT 'monthly'::character varying,
  show_salary boolean DEFAULT false,
  benefits _text[],
  qualifications _text[] NOT NULL DEFAULT '{}'::text[],
  skills_required _text[] NOT NULL DEFAULT '{}'::text[],
  skills_preferred _text[],
  experience_years_min integer,
  experience_years_max integer,
  status varchar(20) DEFAULT 'draft'::character varying,
  published_at timestamp with time zone,
  deadline timestamp with time zone,
  positions_available integer DEFAULT 1,
  positions_filled integer DEFAULT 0,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_urgent boolean DEFAULT false,
  seo_title varchar(200),
  seo_description varchar(500),
  hiring_manager_id uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  application_method application_method_type,
  apply_email text,
  external_apply_url text,
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of career_jobs
-- ============================================


-- ============================================
-- TABLE: career_departments
-- ============================================
-- Purpose: Organizational departments for job categorization
-- Created: 2025-12-08
-- ============================================

CREATE TABLE career_departments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  description text,
  icon varchar(50),
  color varchar(7) DEFAULT '#3b82f6'::character varying,
  head_id uuid,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  job_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of career_departments
-- ============================================


-- ============================================
-- TABLE: career_applications
-- ============================================
-- Purpose: Job applications from candidates
-- Created: 2025-12-08
-- Status: new, screening, shortlisted, interviewing, offered, hired, rejected, withdrawn
-- ============================================

CREATE TABLE career_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  job_id uuid,
  applicant_name varchar(200) NOT NULL,
  applicant_email varchar(255) NOT NULL,
  applicant_phone varchar(20),
  applicant_user_id uuid,
  cover_letter text,
  resume_url varchar(500),
  portfolio_url varchar(500),
  linkedin_url varchar(500),
  answers jsonb DEFAULT '{}'::jsonb,
  status varchar(30) DEFAULT 'new'::character varying,
  status_changed_at timestamp with time zone DEFAULT now(),
  status_changed_by uuid,
  rating integer,
  internal_notes text,
  last_contact_at timestamp with time zone,
  interview_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  resume_file_size integer,
  PRIMARY KEY (id),
  UNIQUE (job_id, applicant_email)
);

-- End of career_applications
-- ============================================


-- ============================================
-- TABLE: career_application_history
-- ============================================
-- Purpose: Audit trail for application status changes
-- Created: 2025-12-08
-- ============================================

CREATE TABLE career_application_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  application_id uuid,
  previous_status varchar(30),
  new_status varchar(30) NOT NULL,
  notes text,
  changed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of career_application_history
-- ============================================


-- ============================================
-- TABLE: career_email_templates
-- ============================================
-- Purpose: Email templates for automated application responses
-- Created: 2025-12-08
-- Trigger Status: new, screening, shortlisted, rejected, etc.
-- ============================================

CREATE TABLE career_email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL,
  trigger_status varchar(30) NOT NULL,
  subject varchar(200) NOT NULL,
  body_html text NOT NULL,
  body_text text,
  variables _text[],
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (slug)
);

-- End of career_email_templates
-- ============================================


-- ================================================================
-- CATEGORY 5: DASHBOARD & WIDGETS
-- ================================================================
-- Purpose: Role-based dashboard customization
-- Tables: 4
-- ================================================================

-- ============================================
-- TABLE: dashboard_layouts
-- ============================================
-- Purpose: Dashboard layout configurations per user/role
-- Created: 2025-12-18
-- ============================================

CREATE TABLE dashboard_layouts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  role_id uuid,
  layout_config jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of dashboard_layouts
-- ============================================


-- ============================================
-- TABLE: dashboard_widgets
-- ============================================
-- Purpose: Available dashboard widgets
-- Created: 2025-12-18
-- Categories: stats, charts, recent_activity, quick_actions
-- ============================================

CREATE TABLE dashboard_widgets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  widget_key text NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  component_name text NOT NULL,
  default_config jsonb DEFAULT '{}'::jsonb,
  required_permissions _text[] DEFAULT '{}'::text[],
  is_active boolean DEFAULT true,
  min_width integer DEFAULT 1,
  min_height integer DEFAULT 1,
  max_width integer DEFAULT 4,
  max_height integer DEFAULT 4,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (widget_key)
);

-- End of dashboard_widgets
-- ============================================


-- ============================================
-- TABLE: dashboard_quick_actions
-- ============================================
-- Purpose: Quick action buttons per role
-- Created: 2025-12-18
-- ============================================

CREATE TABLE dashboard_quick_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role_id uuid,
  action_key text NOT NULL,
  label text NOT NULL,
  icon text NOT NULL,
  link text NOT NULL,
  permission_required text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of dashboard_quick_actions
-- ============================================


-- ============================================
-- TABLE: user_dashboard_preferences
-- ============================================
-- Purpose: User-specific dashboard widget preferences
-- Created: 2025-12-18
-- ============================================

CREATE TABLE user_dashboard_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  widget_id uuid NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  position jsonb NOT NULL DEFAULT '{"h": 2, "w": 2, "x": 0, "y": 0}'::jsonb,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, widget_id)
);

-- End of user_dashboard_preferences
-- ============================================


-- ================================================================
-- CATEGORY 6: EDUCATIONAL CONTENT
-- ================================================================
-- Purpose: Colleges, courses, and educational videos
-- Tables: 3
-- ================================================================

-- ============================================
-- TABLE: colleges
-- ============================================
-- Purpose: List of colleges/institutions
-- Created: 2025-11-28
-- ============================================

CREATE TABLE colleges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (code)
);

-- End of colleges
-- ============================================


-- ============================================
-- TABLE: courses
-- ============================================
-- Purpose: Courses offered by colleges
-- Created: 2025-11-28
-- ============================================

CREATE TABLE courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL,
  name text NOT NULL,
  code text NOT NULL,
  level text,
  duration text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (college_id, code)
);

-- End of courses
-- ============================================


-- ============================================
-- TABLE: education_videos
-- ============================================
-- Purpose: YouTube educational videos
-- Created: 2025-12-02
-- ============================================

CREATE TABLE education_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  youtube_url text NOT NULL,
  youtube_video_id text NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  duration text,
  category text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  PRIMARY KEY (id)
);

-- End of education_videos
-- ============================================


-- ================================================================
-- CATEGORY 7: CONTACT & COMMUNICATION
-- ================================================================
-- Purpose: Contact forms, email queue, notifications
-- Tables: 4
-- ================================================================

-- ============================================
-- TABLE: contact_submissions
-- ============================================
-- Purpose: General contact form submissions
-- Created: 2025-12-03
-- Status: new, in_progress, replied, closed
-- ============================================

CREATE TABLE contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new'::text,
  source text DEFAULT 'contact_form'::text,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  replied_at timestamp with time zone,
  replied_by uuid,
  reply_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  reference_number text,
  PRIMARY KEY (id),
  UNIQUE (reference_number)
);

-- End of contact_submissions
-- ============================================


-- ============================================
-- TABLE: admission_inquiries
-- ============================================
-- Purpose: Admission inquiry form submissions
-- Created: 2025-12-03
-- Status: new, contacted, interested, not_interested, enrolled
-- Priority: low, normal, high, urgent
-- ============================================

CREATE TABLE admission_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  mobile_number text NOT NULL,
  email text NOT NULL,
  district_city text NOT NULL,
  college_name text NOT NULL,
  course_interested text NOT NULL,
  current_qualification text NOT NULL,
  preferred_contact_time text,
  consent_given boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new'::text,
  status_changed_at timestamp with time zone DEFAULT now(),
  status_changed_by uuid,
  priority text DEFAULT 'normal'::text,
  assigned_to uuid,
  follow_up_date timestamp with time zone,
  reply_message text,
  replied_at timestamp with time zone,
  replied_by uuid,
  ip_address inet,
  user_agent text,
  source text DEFAULT 'website'::text,
  referrer text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  reference_number text,
  PRIMARY KEY (id),
  UNIQUE (reference_number)
);

-- End of admission_inquiries
-- ============================================


-- ============================================
-- TABLE: email_queue
-- ============================================
-- Purpose: Email sending queue for automated emails
-- Created: 2025-12-08
-- Status: pending, sending, sent, failed, cancelled
-- ============================================

CREATE TABLE email_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  to_email varchar(255) NOT NULL,
  to_name varchar(200),
  subject varchar(300) NOT NULL,
  body_html text NOT NULL,
  body_text text,
  template_id uuid,
  related_type varchar(50),
  related_id uuid,
  status varchar(20) DEFAULT 'pending'::character varying,
  attempts integer DEFAULT 0,
  last_attempt_at timestamp with time zone,
  error_message text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of email_queue
-- ============================================


-- ============================================
-- TABLE: in_app_notifications
-- ============================================
-- Purpose: In-app notification system
-- Created: 2025-12-18
-- Types: info, success, warning, error, announcement
-- ============================================

CREATE TABLE in_app_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  link text,
  icon text,
  is_read boolean DEFAULT false,
  read_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of in_app_notifications
-- ============================================


-- ================================================================
-- CATEGORY 8: SYSTEM CONFIGURATION
-- ================================================================
-- Purpose: System settings and analytics
-- Tables: 4
-- ================================================================

-- ============================================
-- TABLE: site_settings
-- ============================================
-- Purpose: Global site configuration
-- Created: 2025-12-01
-- Categories: general, seo, integrations, features
-- ============================================

CREATE TABLE site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  setting_key text NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL DEFAULT 'general'::text,
  description text,
  is_public boolean DEFAULT false,
  updated_by uuid,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (setting_key)
);

-- End of site_settings
-- ============================================


-- ============================================
-- TABLE: system_modules
-- ============================================
-- Purpose: System module registry for feature flags
-- Created: 2025-12-18
-- ============================================

CREATE TABLE system_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_key text NOT NULL,
  name text NOT NULL,
  description text,
  is_enabled boolean DEFAULT false,
  route_path text,
  icon text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (module_key)
);

-- End of system_modules
-- ============================================


-- ============================================
-- TABLE: page_views
-- ============================================
-- Purpose: Page view analytics
-- Created: 2025-12-12
-- ============================================

CREATE TABLE page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  page_title text,
  referrer text,
  visitor_id text NOT NULL,
  device_type text,
  browser text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- End of page_views
-- ============================================


-- ============================================
-- TABLE: imported_master_templates
-- ============================================
-- Purpose: Track imported CMS templates from master registry
-- Created: 2025-12-22
-- ============================================

CREATE TABLE imported_master_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  master_template_id uuid NOT NULL,
  master_template_slug text NOT NULL,
  master_template_version text NOT NULL,
  local_template_id uuid,
  imported_at timestamp with time zone DEFAULT now(),
  imported_by uuid,
  last_synced_at timestamp with time zone,
  update_available boolean DEFAULT false,
  latest_version text,
  metadata jsonb DEFAULT '{}'::jsonb,
  PRIMARY KEY (id),
  UNIQUE (master_template_slug)
);

-- End of imported_master_templates
-- ============================================


-- ================================================================
-- END OF TABLES DOCUMENTATION
-- ================================================================
-- Total Tables Documented: 52
-- Last Updated: 2026-01-07
-- ================================================================
