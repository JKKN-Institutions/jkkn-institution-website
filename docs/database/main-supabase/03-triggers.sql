-- ================================================================
-- MAIN SUPABASE DATABASE TRIGGERS
-- ================================================================
-- Project: JKKN Institution Website
-- Supabase Project ID: pmqodbfhsejbvfbmsfeq
-- Total Triggers: 41
-- Last Updated: 2026-01-03
-- ================================================================
--
-- IMPORTANT: Document changes here BEFORE applying migrations!
--
-- ================================================================


-- ============================================
-- AUTH.USERS TRIGGERS (in auth schema)
-- ============================================
-- Note: These triggers are on auth.users, not public schema
-- They are managed by Supabase Auth but we document custom ones
-- ============================================

-- Trigger: on_auth_user_created
-- Purpose: Create profile and member records when user signs up
-- Function: handle_new_user()
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Trigger: on_auth_user_updated
-- Purpose: Update profile with latest OAuth data on login
-- Function: handle_user_update()
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_update();

-- End of auth.users triggers
-- ============================================


-- ============================================
-- USER ROLES TABLE TRIGGERS
-- ============================================

-- Trigger: on_user_role_change (INSERT)
-- Purpose: Log role assignments to user_role_changes table
CREATE TRIGGER on_user_role_change
AFTER INSERT ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION log_role_change();

-- Trigger: on_user_role_change (DELETE)
-- Purpose: Log role removals to user_role_changes table
CREATE TRIGGER on_user_role_change
AFTER DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION log_role_change();

-- End of user_roles triggers
-- ============================================


-- ============================================
-- ADMISSION INQUIRIES TABLE TRIGGERS
-- ============================================

-- Trigger: set_admission_reference_number
-- Purpose: Auto-generate reference number (JKKN-ADM-YYYY-XXXXX)
CREATE TRIGGER set_admission_reference_number
BEFORE INSERT ON public.admission_inquiries
FOR EACH ROW
EXECUTE FUNCTION generate_admission_reference_number();

-- End of admission_inquiries triggers
-- ============================================


-- ============================================
-- BLOG TABLE TRIGGERS
-- ============================================

-- blog_categories
CREATE TRIGGER trg_blog_categories_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW
EXECUTE FUNCTION update_blog_career_updated_at();

-- blog_comment_likes (INSERT)
CREATE TRIGGER trg_blog_comment_likes_count
AFTER INSERT ON public.blog_comment_likes
FOR EACH ROW
EXECUTE FUNCTION update_blog_comment_likes_count();

-- blog_comment_likes (DELETE)
CREATE TRIGGER trg_blog_comment_likes_count
AFTER DELETE ON public.blog_comment_likes
FOR EACH ROW
EXECUTE FUNCTION update_blog_comment_likes_count();

-- blog_comments (INSERT - reply count)
CREATE TRIGGER trg_blog_comments_reply_count
AFTER INSERT ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION update_blog_comment_counts();

-- blog_comments (DELETE - reply count)
CREATE TRIGGER trg_blog_comments_reply_count
AFTER DELETE ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION update_blog_comment_counts();

-- blog_comments (UPDATE - updated_at)
CREATE TRIGGER trg_blog_comments_updated_at
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION update_blog_career_updated_at();

-- blog_post_tags (INSERT - usage count)
CREATE TRIGGER trg_blog_post_tags_usage_count
AFTER INSERT ON public.blog_post_tags
FOR EACH ROW
EXECUTE FUNCTION update_blog_tag_usage_count();

-- blog_post_tags (DELETE - usage count)
CREATE TRIGGER trg_blog_post_tags_usage_count
AFTER DELETE ON public.blog_post_tags
FOR EACH ROW
EXECUTE FUNCTION update_blog_tag_usage_count();

-- blog_posts (INSERT - category count)
CREATE TRIGGER trg_blog_posts_category_count
AFTER INSERT ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_category_post_count();

-- blog_posts (UPDATE - category count)
CREATE TRIGGER trg_blog_posts_category_count
AFTER UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_category_post_count();

-- blog_posts (DELETE - category count)
CREATE TRIGGER trg_blog_posts_category_count
AFTER DELETE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_category_post_count();

-- blog_posts (UPDATE - updated_at)
CREATE TRIGGER trg_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_career_updated_at();

-- End of blog triggers
-- ============================================


-- ============================================
-- CAREER TABLE TRIGGERS
-- ============================================

-- career_applications (UPDATE - status history)
CREATE TRIGGER trg_career_applications_status_history
BEFORE UPDATE ON public.career_applications
FOR EACH ROW
EXECUTE FUNCTION track_career_application_status();

-- career_applications (UPDATE - updated_at)
CREATE TRIGGER trg_career_applications_updated_at
BEFORE UPDATE ON public.career_applications
FOR EACH ROW
EXECUTE FUNCTION update_blog_career_updated_at();

-- career_departments
CREATE TRIGGER trg_career_departments_updated_at
BEFORE UPDATE ON public.career_departments
FOR EACH ROW
EXECUTE FUNCTION update_blog_career_updated_at();

-- career_email_templates
CREATE TRIGGER trg_career_email_templates_updated_at
BEFORE UPDATE ON public.career_email_templates
FOR EACH ROW
EXECUTE FUNCTION update_blog_career_updated_at();

-- career_jobs (INSERT - department count)
CREATE TRIGGER trg_career_jobs_department_count
AFTER INSERT ON public.career_jobs
FOR EACH ROW
EXECUTE FUNCTION update_career_department_job_count();

-- career_jobs (UPDATE - department count)
CREATE TRIGGER trg_career_jobs_department_count
AFTER UPDATE ON public.career_jobs
FOR EACH ROW
EXECUTE FUNCTION update_career_department_job_count();

-- career_jobs (DELETE - department count)
CREATE TRIGGER trg_career_jobs_department_count
AFTER DELETE ON public.career_jobs
FOR EACH ROW
EXECUTE FUNCTION update_career_department_job_count();

-- career_jobs (UPDATE - updated_at)
CREATE TRIGGER trg_career_jobs_updated_at
BEFORE UPDATE ON public.career_jobs
FOR EACH ROW
EXECUTE FUNCTION update_blog_career_updated_at();

-- End of career triggers
-- ============================================


-- ============================================
-- CMS TABLE TRIGGERS
-- ============================================

-- cms_component_collections
CREATE TRIGGER update_cms_component_collections_updated_at
BEFORE UPDATE ON public.cms_component_collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_component_registry
CREATE TRIGGER update_cms_component_registry_updated_at
BEFORE UPDATE ON public.cms_component_registry
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_custom_components
CREATE TRIGGER update_cms_custom_components_updated_at
BEFORE UPDATE ON public.cms_custom_components
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_external_registries
CREATE TRIGGER update_cms_external_registries_updated_at
BEFORE UPDATE ON public.cms_external_registries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_folders
CREATE TRIGGER cms_folders_updated_at
BEFORE UPDATE ON public.cms_folders
FOR EACH ROW
EXECUTE FUNCTION update_cms_folders_updated_at();

-- cms_media_library
CREATE TRIGGER update_cms_media_library_updated_at
BEFORE UPDATE ON public.cms_media_library
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_page_blocks
CREATE TRIGGER update_cms_page_blocks_updated_at
BEFORE UPDATE ON public.cms_page_blocks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_page_fab_config
CREATE TRIGGER update_cms_page_fab_config_updated_at
BEFORE UPDATE ON public.cms_page_fab_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_page_templates
CREATE TRIGGER update_cms_page_templates_updated_at
BEFORE UPDATE ON public.cms_page_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_pages
CREATE TRIGGER update_cms_pages_updated_at
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- cms_seo_metadata
CREATE TRIGGER update_cms_seo_metadata_updated_at
BEFORE UPDATE ON public.cms_seo_metadata
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- End of CMS triggers
-- ============================================


-- ============================================
-- OTHER TABLE TRIGGERS
-- ============================================

-- contact_submissions
CREATE TRIGGER contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_contact_submissions_updated_at();

-- education_videos
CREATE TRIGGER education_videos_updated_at
BEFORE UPDATE ON public.education_videos
FOR EACH ROW
EXECUTE FUNCTION update_education_videos_updated_at();

-- members
CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- roles
CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON public.roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- site_settings
CREATE TRIGGER trigger_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION update_site_settings_updated_at();

-- system_modules
CREATE TRIGGER update_system_modules_updated_at
BEFORE UPDATE ON public.system_modules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- End of other table triggers
-- ============================================


-- ================================================================
-- END OF TRIGGERS DOCUMENTATION
-- ================================================================
