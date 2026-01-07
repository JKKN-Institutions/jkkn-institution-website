-- ================================================================
-- MAIN SUPABASE DATABASE FOREIGN KEYS
-- ================================================================
-- Project: JKKN Institution Website
-- Supabase Project ID: pmqodbfhsejbvfbmsfeq
-- Total Foreign Keys: 48
-- Last Updated: 2026-01-03
-- ================================================================
--
-- IMPORTANT: Document changes here BEFORE applying migrations!
--
-- DELETE RULES:
-- - CASCADE: Delete child rows when parent is deleted
-- - SET NULL: Set FK to NULL when parent is deleted
-- - NO ACTION: Prevent deletion if child rows exist
--
-- ================================================================


-- ============================================
-- USER & AUTH RELATED FOREIGN KEYS
-- ============================================

-- user_roles -> profiles
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- user_roles -> roles
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_role_id_fkey
FOREIGN KEY (role_id) REFERENCES public.roles(id)
ON DELETE CASCADE;

-- role_permissions -> roles
ALTER TABLE public.role_permissions
ADD CONSTRAINT role_permissions_role_id_fkey
FOREIGN KEY (role_id) REFERENCES public.roles(id)
ON DELETE CASCADE;

-- user_role_changes -> roles
ALTER TABLE public.user_role_changes
ADD CONSTRAINT user_role_changes_role_id_fkey
FOREIGN KEY (role_id) REFERENCES public.roles(id)
ON DELETE NO ACTION;

-- members -> profiles
ALTER TABLE public.members
ADD CONSTRAINT members_profile_id_fkey
FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- approved_emails -> profiles
ALTER TABLE public.approved_emails
ADD CONSTRAINT approved_emails_added_by_fkey
FOREIGN KEY (added_by) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- End of user & auth foreign keys
-- ============================================


-- ============================================
-- DASHBOARD FOREIGN KEYS
-- ============================================

-- dashboard_layouts -> roles
ALTER TABLE public.dashboard_layouts
ADD CONSTRAINT dashboard_layouts_role_id_fkey
FOREIGN KEY (role_id) REFERENCES public.roles(id)
ON DELETE CASCADE;

-- dashboard_quick_actions -> roles
ALTER TABLE public.dashboard_quick_actions
ADD CONSTRAINT dashboard_quick_actions_role_id_fkey
FOREIGN KEY (role_id) REFERENCES public.roles(id)
ON DELETE CASCADE;

-- user_dashboard_preferences -> dashboard_widgets
ALTER TABLE public.user_dashboard_preferences
ADD CONSTRAINT user_dashboard_preferences_widget_id_fkey
FOREIGN KEY (widget_id) REFERENCES public.dashboard_widgets(id)
ON DELETE CASCADE;

-- End of dashboard foreign keys
-- ============================================


-- ============================================
-- BLOG FOREIGN KEYS
-- ============================================

-- blog_categories (self-referential)
ALTER TABLE public.blog_categories
ADD CONSTRAINT blog_categories_parent_id_fkey
FOREIGN KEY (parent_id) REFERENCES public.blog_categories(id)
ON DELETE SET NULL;

-- blog_posts -> profiles (author)
ALTER TABLE public.blog_posts
ADD CONSTRAINT blog_posts_author_id_fkey
FOREIGN KEY (author_id) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- blog_posts -> blog_categories
ALTER TABLE public.blog_posts
ADD CONSTRAINT blog_posts_category_id_fkey
FOREIGN KEY (category_id) REFERENCES public.blog_categories(id)
ON DELETE SET NULL;

-- blog_posts -> profiles (created_by)
ALTER TABLE public.blog_posts
ADD CONSTRAINT blog_posts_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- blog_posts -> profiles (updated_by)
ALTER TABLE public.blog_posts
ADD CONSTRAINT blog_posts_updated_by_fkey
FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- blog_post_tags -> blog_posts
ALTER TABLE public.blog_post_tags
ADD CONSTRAINT blog_post_tags_post_id_fkey
FOREIGN KEY (post_id) REFERENCES public.blog_posts(id)
ON DELETE CASCADE;

-- blog_post_tags -> blog_tags
ALTER TABLE public.blog_post_tags
ADD CONSTRAINT blog_post_tags_tag_id_fkey
FOREIGN KEY (tag_id) REFERENCES public.blog_tags(id)
ON DELETE CASCADE;

-- blog_post_versions -> blog_posts
ALTER TABLE public.blog_post_versions
ADD CONSTRAINT blog_post_versions_post_id_fkey
FOREIGN KEY (post_id) REFERENCES public.blog_posts(id)
ON DELETE CASCADE;

-- blog_post_versions -> profiles
ALTER TABLE public.blog_post_versions
ADD CONSTRAINT blog_post_versions_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- blog_comments -> blog_posts
ALTER TABLE public.blog_comments
ADD CONSTRAINT blog_comments_post_id_fkey
FOREIGN KEY (post_id) REFERENCES public.blog_posts(id)
ON DELETE CASCADE;

-- blog_comments -> profiles (author)
ALTER TABLE public.blog_comments
ADD CONSTRAINT blog_comments_author_id_fkey
FOREIGN KEY (author_id) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- blog_comments -> profiles (moderated_by)
ALTER TABLE public.blog_comments
ADD CONSTRAINT blog_comments_moderated_by_fkey
FOREIGN KEY (moderated_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- blog_comments (self-referential for replies)
ALTER TABLE public.blog_comments
ADD CONSTRAINT blog_comments_parent_id_fkey
FOREIGN KEY (parent_id) REFERENCES public.blog_comments(id)
ON DELETE CASCADE;

-- blog_comment_likes -> blog_comments
ALTER TABLE public.blog_comment_likes
ADD CONSTRAINT blog_comment_likes_comment_id_fkey
FOREIGN KEY (comment_id) REFERENCES public.blog_comments(id)
ON DELETE CASCADE;

-- End of blog foreign keys
-- ============================================


-- ============================================
-- CAREER FOREIGN KEYS
-- ============================================

-- career_departments -> profiles
ALTER TABLE public.career_departments
ADD CONSTRAINT career_departments_head_id_fkey
FOREIGN KEY (head_id) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- career_jobs -> career_departments
ALTER TABLE public.career_jobs
ADD CONSTRAINT career_jobs_department_id_fkey
FOREIGN KEY (department_id) REFERENCES public.career_departments(id)
ON DELETE SET NULL;

-- career_jobs -> profiles (created_by)
ALTER TABLE public.career_jobs
ADD CONSTRAINT career_jobs_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- career_jobs -> profiles (updated_by)
ALTER TABLE public.career_jobs
ADD CONSTRAINT career_jobs_updated_by_fkey
FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- career_jobs -> profiles (hiring_manager)
ALTER TABLE public.career_jobs
ADD CONSTRAINT career_jobs_hiring_manager_id_fkey
FOREIGN KEY (hiring_manager_id) REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- career_applications -> career_jobs
ALTER TABLE public.career_applications
ADD CONSTRAINT career_applications_job_id_fkey
FOREIGN KEY (job_id) REFERENCES public.career_jobs(id)
ON DELETE CASCADE;

-- career_applications -> profiles (status_changed_by)
ALTER TABLE public.career_applications
ADD CONSTRAINT career_applications_status_changed_by_fkey
FOREIGN KEY (status_changed_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- career_application_history -> career_applications
ALTER TABLE public.career_application_history
ADD CONSTRAINT career_application_history_application_id_fkey
FOREIGN KEY (application_id) REFERENCES public.career_applications(id)
ON DELETE CASCADE;

-- career_application_history -> profiles
ALTER TABLE public.career_application_history
ADD CONSTRAINT career_application_history_changed_by_fkey
FOREIGN KEY (changed_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- career_email_templates -> profiles
ALTER TABLE public.career_email_templates
ADD CONSTRAINT career_email_templates_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.profiles(id)
ON DELETE NO ACTION;

-- email_queue -> career_email_templates
ALTER TABLE public.email_queue
ADD CONSTRAINT email_queue_template_id_fkey
FOREIGN KEY (template_id) REFERENCES public.career_email_templates(id)
ON DELETE SET NULL;

-- End of career foreign keys
-- ============================================


-- ============================================
-- CMS FOREIGN KEYS
-- ============================================

-- cms_pages -> cms_pages (self-referential)
ALTER TABLE public.cms_pages
ADD CONSTRAINT cms_pages_parent_id_fkey
FOREIGN KEY (parent_id) REFERENCES public.cms_pages(id)
ON DELETE SET NULL;

-- cms_pages -> cms_page_templates
ALTER TABLE public.cms_pages
ADD CONSTRAINT cms_pages_template_id_fkey
FOREIGN KEY (template_id) REFERENCES public.cms_page_templates(id)
ON DELETE SET NULL;

-- cms_page_blocks -> cms_pages
ALTER TABLE public.cms_page_blocks
ADD CONSTRAINT cms_page_blocks_page_id_fkey
FOREIGN KEY (page_id) REFERENCES public.cms_pages(id)
ON DELETE CASCADE;

-- cms_page_blocks (self-referential for nested blocks)
ALTER TABLE public.cms_page_blocks
ADD CONSTRAINT cms_page_blocks_parent_block_id_fkey
FOREIGN KEY (parent_block_id) REFERENCES public.cms_page_blocks(id)
ON DELETE CASCADE;

-- cms_page_fab_config -> cms_pages
ALTER TABLE public.cms_page_fab_config
ADD CONSTRAINT cms_page_fab_config_page_id_fkey
FOREIGN KEY (page_id) REFERENCES public.cms_pages(id)
ON DELETE CASCADE;

-- cms_page_versions -> cms_pages
ALTER TABLE public.cms_page_versions
ADD CONSTRAINT cms_page_versions_page_id_fkey
FOREIGN KEY (page_id) REFERENCES public.cms_pages(id)
ON DELETE CASCADE;

-- cms_page_reviews -> cms_pages
ALTER TABLE public.cms_page_reviews
ADD CONSTRAINT cms_page_reviews_page_id_fkey
FOREIGN KEY (page_id) REFERENCES public.cms_pages(id)
ON DELETE CASCADE;

-- cms_seo_metadata -> cms_pages
ALTER TABLE public.cms_seo_metadata
ADD CONSTRAINT cms_seo_metadata_page_id_fkey
FOREIGN KEY (page_id) REFERENCES public.cms_pages(id)
ON DELETE CASCADE;

-- cms_preview_links -> cms_pages
ALTER TABLE public.cms_preview_links
ADD CONSTRAINT cms_preview_links_page_id_fkey
FOREIGN KEY (page_id) REFERENCES public.cms_pages(id)
ON DELETE CASCADE;

-- cms_folders (self-referential)
ALTER TABLE public.cms_folders
ADD CONSTRAINT cms_folders_parent_id_fkey
FOREIGN KEY (parent_id) REFERENCES public.cms_folders(id)
ON DELETE CASCADE;

-- cms_component_collections (self-referential)
ALTER TABLE public.cms_component_collections
ADD CONSTRAINT cms_component_collections_parent_id_fkey
FOREIGN KEY (parent_id) REFERENCES public.cms_component_collections(id)
ON DELETE CASCADE;

-- cms_custom_components -> cms_component_collections
ALTER TABLE public.cms_custom_components
ADD CONSTRAINT cms_custom_components_collection_id_fkey
FOREIGN KEY (collection_id) REFERENCES public.cms_component_collections(id)
ON DELETE SET NULL;

-- cms_preview_jobs -> cms_custom_components
ALTER TABLE public.cms_preview_jobs
ADD CONSTRAINT cms_preview_jobs_component_id_fkey
FOREIGN KEY (component_id) REFERENCES public.cms_custom_components(id)
ON DELETE CASCADE;

-- End of CMS foreign keys
-- ============================================


-- ============================================
-- EDUCATIONAL FOREIGN KEYS
-- ============================================

-- courses -> colleges
ALTER TABLE public.courses
ADD CONSTRAINT courses_college_id_fkey
FOREIGN KEY (college_id) REFERENCES public.colleges(id)
ON DELETE CASCADE;

-- End of educational foreign keys
-- ============================================


-- ============================================
-- SCHEMA MODIFICATIONS (Non-FK Changes)
-- ============================================
-- Note: These are schema changes that don't involve foreign keys
-- but are documented here for completeness

-- ============================================
-- Multi-Viewport Preview Support for Custom Components
-- ============================================
-- Purpose: Add columns for desktop, tablet, and mobile preview images
-- Created: 2026-01-06
-- Modified: N/A
-- Table: cms_custom_components
-- Dependencies: Supabase Storage (previews bucket)
-- Used by: Component management UI, Preview generator modal
-- Context: Enables preview generation for multiple viewport sizes
--          to improve component visual representation in admin panel
-- ============================================

ALTER TABLE public.cms_custom_components
ADD COLUMN IF NOT EXISTS preview_image_desktop TEXT,
ADD COLUMN IF NOT EXISTS preview_image_tablet TEXT,
ADD COLUMN IF NOT EXISTS preview_image_mobile TEXT;

COMMENT ON COLUMN cms_custom_components.preview_image_desktop IS 'URL to desktop viewport preview screenshot (1920x1080)';
COMMENT ON COLUMN cms_custom_components.preview_image_tablet IS 'URL to tablet viewport preview screenshot (768x1024)';
COMMENT ON COLUMN cms_custom_components.preview_image_mobile IS 'URL to mobile viewport preview screenshot (375x667)';

-- End of Multi-Viewport Preview Support
-- ============================================


-- ================================================================
-- END OF FOREIGN KEYS DOCUMENTATION
-- ================================================================
