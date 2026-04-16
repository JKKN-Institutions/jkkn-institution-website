-- ============================================
-- CMS Page Seed: Ambulance Service (Main Institution)
-- ============================================
-- Purpose: Seeds cms_pages, cms_page_blocks, and cms_seo_metadata rows
--          for the /ambulance-service public route on the Main site.
-- Created: 2026-04-16
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata (all in public schema)
-- Component used: FacilityPage (registered in lib/cms/component-registry.ts)
-- Institution scope: Main Institution (Supabase project pmqodbfhsejbvfbmsfeq)
-- ============================================

-- 1. Create the page row (under Facilities parent: bf0b8fd9-f3b5-4b92-931d-e30a5515b237)
INSERT INTO public.cms_pages (
  slug, title, description, status, visibility,
  show_in_navigation, navigation_label, sort_order, parent_id, created_by
) VALUES (
  'ambulance-service',
  'Ambulance Service',
  '24/7 ambulance service at JKKN Educational Institutions — GPS-tracked vehicles, trained paramedics, and rapid campus-wide emergency response.',
  'published',
  'public',
  true,
  'Ambulance Service',
  2,
  'bf0b8fd9-f3b5-4b92-931d-e30a5515b237',  -- Facilities parent page
  'bdf878d6-75b6-4568-9d35-afb30ff38759'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Attach FacilityPage block with ambulance service content
INSERT INTO public.cms_page_blocks (page_id, component_name, props, sort_order, is_visible)
SELECT
  p.id,
  'FacilityPage',
  jsonb_build_object(
    'facilityTitle', 'AMBULANCE SERVICE',
    'images', jsonb_build_array(
      jsonb_build_object('src', '/images/facilities/ambulance-1.jpg', 'alt', 'JKKN Ambulance fleet'),
      jsonb_build_object('src', '/images/facilities/ambulance-2.jpg', 'alt', 'Ambulance interior with medical equipment'),
      jsonb_build_object('src', '/images/facilities/ambulance-3.jpg', 'alt', 'Paramedic team ready for emergency response')
    ),
    'introduction', '<p>JKKN Educational Institutions is committed to the safety and well-being of every student, faculty member, and staff on campus. Our dedicated <strong>24/7 Ambulance Service</strong> ensures that professional emergency medical assistance is always just a phone call away.</p><p>Equipped with modern life-support systems and staffed by trained paramedics, our ambulance fleet provides rapid response across the entire JKKN campus — covering all colleges, hostels, sports grounds, and residential quarters. Whether it is a medical emergency, an accident, or a student feeling unwell, our team is prepared to deliver immediate first-aid and safe transport to the nearest hospital.</p><p>The service operates round the clock, including weekends and holidays, reflecting our unwavering commitment to creating a safe and secure campus environment for our community of over 10,000 students and staff.</p>',
    'features', jsonb_build_array(
      jsonb_build_object(
        'title', '24/7 Emergency Response',
        'description', 'Our ambulance service operates round the clock, 365 days a year. A dedicated emergency helpline ensures that an ambulance is dispatched within minutes of receiving a call, day or night.'
      ),
      jsonb_build_object(
        'title', 'Trained Paramedic Staff',
        'description', 'Each ambulance is staffed by certified paramedics trained in Basic Life Support (BLS) and Advanced First Aid. They are equipped to handle cardiac emergencies, trauma, fractures, and other critical situations.'
      ),
      jsonb_build_object(
        'title', 'Modern Medical Equipment',
        'description', 'Our ambulances are equipped with oxygen cylinders, first-aid kits, stretchers, cervical collars, splints, pulse oximeters, and automated external defibrillators (AEDs) for comprehensive pre-hospital care.'
      ),
      jsonb_build_object(
        'title', 'GPS-Tracked Vehicles',
        'description', 'All ambulance vehicles are fitted with GPS tracking systems, enabling the control room to monitor real-time location and dispatch the nearest available unit for the fastest response time.'
      ),
      jsonb_build_object(
        'title', 'Campus-Wide Coverage',
        'description', 'The service covers the entire JKKN campus — all six colleges, hostels, sports facilities, auditoriums, and residential areas — ensuring no corner of the campus is more than a few minutes away from help.'
      ),
      jsonb_build_object(
        'title', 'Hospital Tie-Ups',
        'description', 'We maintain tie-ups with leading hospitals in the region, including JKKN Dental Hospital and nearby multi-specialty hospitals, for seamless patient transfer and priority admission during emergencies.'
      )
    ),
    'conclusion', '<p>At JKKN, student safety is not just a policy — it is a promise. Our ambulance service stands as a pillar of our commitment to providing a secure learning environment. Parents can rest assured that their children are in safe hands, with professional medical assistance available at all times.</p>',
    'backgroundColor', 'rgb(251, 251, 238)',
    'accentColor', '#0b6d41',
    'textColor', '#000000'
  ),
  0,
  true
FROM public.cms_pages p
WHERE p.slug = 'ambulance-service';

-- 3. Add SEO metadata
INSERT INTO public.cms_seo_metadata (
  page_id, meta_title, meta_description, meta_keywords,
  og_title, og_description, og_type
)
SELECT
  p.id,
  'Ambulance Service | JKKN Educational Institutions — 24/7 Emergency Medical Response',
  'JKKN campus ambulance service provides 24/7 emergency medical response with GPS-tracked vehicles, trained paramedics, modern life-support equipment, and campus-wide coverage for 10,000+ students.',
  ARRAY['ambulance service', 'emergency care', 'campus safety', 'JKKN', 'paramedic', '24/7 medical', 'student safety', 'first aid', 'campus ambulance'],
  'Ambulance Service — JKKN Educational Institutions',
  '24/7 ambulance service with trained paramedics, GPS-tracked vehicles, and modern medical equipment covering the entire JKKN campus.',
  'website'
FROM public.cms_pages p
WHERE p.slug = 'ambulance-service';

-- End of Ambulance Service Page Seed
-- ============================================
