-- ============================================
-- CMS Page Publish: Bank & Post Office (Main Institution)
-- ============================================
-- Purpose: Publishes the archived bank-post-office page with enhanced
--          features and SEO metadata.
-- Created: 2026-04-16
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata
-- Component used: FacilityPage (registered in lib/cms/component-registry.ts)
-- Institution scope: Main Institution (Supabase project pmqodbfhsejbvfbmsfeq)
-- Note: Page already has real uploaded images from Supabase Storage
-- ============================================

-- 1. Publish the page
UPDATE public.cms_pages
SET
  status = 'published',
  visibility = 'public',
  deleted_at = NULL,
  navigation_label = 'Bank & Post Office',
  description = 'On-campus banking and postal services at JKKN Educational Institutions — Indian Bank branch, ATM, post office, savings schemes, and hassle-free financial services for students and staff.'
WHERE slug = 'bank-post-office';

-- 2. Update block with enhanced features
UPDATE public.cms_page_blocks
SET props = jsonb_build_object(
  'facilityTitle', 'BANK & POST OFFICE',
  'images', jsonb_build_array(
    jsonb_build_object('src', 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/f183477b-d3f1-42ad-8262-7998b89875b0.jpg', 'alt', 'Indian Bank branch on JKKN campus'),
    jsonb_build_object('src', 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/9ce1eac3-ae2d-4f9f-b673-42dc0da2ccc7.webp', 'alt', 'Indian Bank ATM on campus'),
    jsonb_build_object('src', 'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/9ce1eac3-ae2d-4f9f-b673-42dc0da2ccc7.webp', 'alt', 'JKKN campus post office')
  ),
  'introduction', '<p>Looking for hassle-free banking and postal services? Look no further than JKKN Educational Institutions, where we offer a range of convenient and reliable banking and postal services to our students and staff. With both an <strong>Indian Bank branch</strong> and a <strong>dedicated post office</strong> located right on campus, you can handle all your financial and postal needs without ever leaving the campus grounds.</p><p>These on-campus facilities save valuable time for students and staff, allowing them to focus on academics and work while ensuring their banking transactions, mail, and packages are handled efficiently and securely.</p>',
  'features', jsonb_build_array(
    jsonb_build_object(
      'title', 'Full-Service Bank Branch',
      'description', 'Our campus hosts a fully-functional branch of Indian Bank, offering a complete range of services including account opening, cash deposits and withdrawals, fund transfers, fixed deposits, education loans, and more. Students and staff can avail of special offers and discounts exclusively for the JKKN community.'
    ),
    jsonb_build_object(
      'title', '24/7 ATM Facility',
      'description', 'An on-campus ATM is available round the clock for cash withdrawals, balance enquiries, and mini-statements. The ATM supports all major bank cards, ensuring convenient access to funds at any time — even on weekends and holidays.'
    ),
    jsonb_build_object(
      'title', 'Postal Services',
      'description', 'Our dedicated campus post office offers domestic and international mail, registered post, speed post, parcel delivery, and more. Additional services include post office savings schemes, money orders, and postal life insurance — helping students and staff stay connected and manage important documents with ease.'
    ),
    jsonb_build_object(
      'title', 'Education Loan Assistance',
      'description', 'The on-campus bank branch provides dedicated education loan counselling and processing for students. From documentation guidance to quick approvals, the bank staff assists students in securing financial support for their academic journey.'
    ),
    jsonb_build_object(
      'title', 'Digital Banking Services',
      'description', 'Students can access internet banking, mobile banking, and UPI services through the campus bank. The bank also conducts periodic financial literacy workshops to educate students on digital transactions, savings, and investment planning.'
    ),
    jsonb_build_object(
      'title', 'Convenient Operating Hours',
      'description', 'Both the bank and post office operate during convenient hours aligned with the academic schedule. The bank is open Monday to Friday (10:00 AM – 4:00 PM) and Saturdays (10:00 AM – 1:00 PM), while the post office operates Monday to Saturday (9:00 AM – 5:00 PM).'
    )
  ),
  'conclusion', '<p>With a full-service bank and a dedicated post office on campus, JKKN ensures that students and staff have easy access to essential financial and postal services. These facilities reflect our commitment to providing a self-sufficient campus where every need is taken care of, so our community can focus on what matters most — learning and growth.</p>',
  'backgroundColor', 'rgb(251, 251, 238)',
  'accentColor', '#0b6d41',
  'textColor', '#000000'
)
WHERE page_id = (SELECT id FROM public.cms_pages WHERE slug = 'bank-post-office');

-- 3. Add SEO metadata
INSERT INTO public.cms_seo_metadata (
  page_id, meta_title, meta_description, meta_keywords,
  og_title, og_description, og_type
)
SELECT
  p.id,
  'Bank & Post Office | JKKN Educational Institutions — On-Campus Financial Services',
  'Indian Bank branch, 24/7 ATM, and dedicated post office on JKKN campus. Education loans, digital banking, postal services, and financial literacy for 10,000+ students and staff.',
  ARRAY['bank', 'post office', 'ATM', 'Indian Bank', 'JKKN campus', 'education loan', 'banking services', 'postal services', 'campus facilities', 'digital banking'],
  'Bank & Post Office — JKKN Educational Institutions',
  'On-campus Indian Bank branch, 24/7 ATM, and post office providing hassle-free banking and postal services for JKKN students and staff.',
  'website'
FROM public.cms_pages p
WHERE p.slug = 'bank-post-office'
ON CONFLICT (page_id) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  og_title = EXCLUDED.og_title,
  og_description = EXCLUDED.og_description;

-- End of Bank & Post Office Page Publish
-- ============================================
