-- Facilities Pages Creation Script
-- Creates 10 facility submenu pages for Engineering College
-- Execute with: Engineering College Supabase Project MCP tool

-- Begin transaction
BEGIN;

-- Variables
DO $$
DECLARE
  parent_page_id UUID := '96f3bbba-23e2-4753-b202-0680009f6fc7';
  creator_id UUID := 'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60';
  current_time TIMESTAMP := NOW();

  -- Page IDs
  ambulance_page_id UUID := gen_random_uuid();
  auditorium_page_id UUID := gen_random_uuid();
  transport_page_id UUID := gen_random_uuid();
  classroom_page_id UUID := gen_random_uuid();
  foodcourt_page_id UUID := gen_random_uuid();
  hostel_page_id UUID := gen_random_uuid();
  library_page_id UUID := gen_random_uuid();
  seminar_page_id UUID := gen_random_uuid();
  sports_page_id UUID := gen_random_uuid();
  wifi_page_id UUID := gen_random_uuid();

BEGIN
  -- ==========================================
  -- 1. AMBULANCE SERVICES
  -- ==========================================

  -- Insert page
  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (
    ambulance_page_id,
    'Ambulance Services',
    'facilities/ambulance-services',
    '24/7 emergency medical services with advanced equipment and trained paramedics',
    parent_page_id,
    'published',
    'public',
    true,
    1,
    creator_id,
    creator_id,
    current_time,
    current_time,
    current_time
  );

  -- Insert block
  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    ambulance_page_id,
    'FacilityPage',
    '{
      "facilityTitle": "AMBULANCE SERVICES",
      "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed mb-4\">Our state-of-the-art ambulance services provide 24/7 emergency medical care to ensure the safety and well-being of our students, faculty, and staff.</p>",
      "images": [
        "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800",
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800"
      ],
      "features": [
        {"title": "24/7 Availability", "description": "Round-the-clock emergency medical services"},
        {"title": "Advanced Equipment", "description": "Modern medical devices and life-support systems"},
        {"title": "Trained Paramedics", "description": "Professional medical staff"},
        {"title": "Rapid Response", "description": "Quick response time for emergencies"}
      ]
    }'::jsonb,
    1,
    true,
    current_time,
    current_time
  );

  -- Insert SEO metadata
  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    ambulance_page_id,
    'Ambulance Services - JKKN College of Engineering',
    '24/7 emergency medical services with advanced equipment and trained paramedics.',
    'Ambulance Services - JKKN Engineering College',
    'Round-the-clock emergency medical care facility.',
    'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=1200&h=630',
    'summary_large_image',
    'https://engg.jkkn.ac.in/facilities/ambulance-services',
    current_time,
    current_time
  );

  -- Insert FAB config
  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, primary_action, position, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    ambulance_page_id,
    true,
    '{"label": "Emergency Call", "icon": "phone", "action": "tel:+914565226001", "variant": "primary"}'::jsonb,
    'bottom-right',
    current_time,
    current_time
  );

  RAISE NOTICE '✅ Created: Ambulance Services';

  -- ==========================================
  -- 2. AUDITORIUM
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (auditorium_page_id, 'Auditorium', 'facilities/auditorium', 'Modern auditorium with advanced audiovisual systems', parent_page_id, 'published', 'public', true, 2, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), auditorium_page_id, 'FacilityPage', '{"facilityTitle": "AUDITORIUM", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Modern auditorium facility with seating for 500+ attendees.</p>", "images": ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"], "features": [{"title": "Large Seating", "description": "500+ comfortable seats"}, {"title": "Advanced AV", "description": "Professional sound and projection"}, {"title": "Air-Conditioned", "description": "Climate-controlled environment"}]}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), auditorium_page_id, 'Auditorium - JKKN College of Engineering', 'Modern auditorium with advanced audiovisual systems.', 'Auditorium - JKKN Engineering College', 'State-of-the-art auditorium facility.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/auditorium', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, primary_action, position, created_at, updated_at)
  VALUES (gen_random_uuid(), auditorium_page_id, true, '{"label": "Book Auditorium", "icon": "calendar", "action": "/contact?service=auditorium", "variant": "primary"}'::jsonb, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Auditorium';

  -- ==========================================
  -- 3. TRANSPORT
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (transport_page_id, 'Transport', 'facilities/transport', 'Comprehensive bus transport facilities', parent_page_id, 'published', 'public', true, 3, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), transport_page_id, 'TransportPage', '{"facilityTitle": "TRANSPORT FACILITIES", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Comprehensive bus transport services covering major routes.</p>", "busImages": ["https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"], "routes": [{"routeNumber": "Route 1", "from": "Namakkal", "to": "JKKN Engineering College", "stops": ["Bus Stand", "College Junction"], "timing": "7:00 AM - 6:30 PM", "frequency": "Every 30 minutes"}], "features": [{"title": "GPS Tracking", "description": "Real-time bus tracking"}, {"title": "Safety Features", "description": "CCTV cameras and safety equipment"}]}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), transport_page_id, 'Transport - JKKN College of Engineering', 'Comprehensive bus transport services.', 'Transport - JKKN Engineering College', 'Safe and comfortable transportation.', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/transport', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, position, created_at, updated_at)
  VALUES (gen_random_uuid(), transport_page_id, false, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Transport';

  -- ==========================================
  -- 4. CLASS ROOM
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (classroom_page_id, 'Class Room', 'facilities/class-room', 'Modern smart classrooms with advanced teaching aids', parent_page_id, 'published', 'public', true, 4, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), classroom_page_id, 'FacilityPage', '{"facilityTitle": "CLASSROOM FACILITIES", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Modern smart classrooms for enhanced learning.</p>", "images": ["https://images.unsplash.com/photo-1562774053-701939374585?w=800"], "features": [{"title": "Smart Boards", "description": "Interactive digital boards"}, {"title": "Audio-Visual", "description": "High-quality projectors"}, {"title": "Climate Control", "description": "Air-conditioned classrooms"}]}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), classroom_page_id, 'Classrooms - JKKN College of Engineering', 'Modern smart classrooms.', 'Classrooms - JKKN Engineering College', 'Technology-enabled learning spaces.', 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/class-room', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, position, created_at, updated_at)
  VALUES (gen_random_uuid(), classroom_page_id, false, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Class Room';

  -- ==========================================
  -- 5. FOOD COURT
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (foodcourt_page_id, 'Food Court', 'facilities/food-court', 'Hygienic food court serving nutritious meals', parent_page_id, 'published', 'public', true, 5, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), foodcourt_page_id, 'FacilityPage', '{"facilityTitle": "FOOD COURT", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Spacious food court with multiple cuisine options.</p>", "images": ["https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800"], "features": [{"title": "Hygienic Environment", "description": "Maintained cleanliness standards"}, {"title": "Nutritious Menu", "description": "Balanced meal options"}, {"title": "Affordable Pricing", "description": "Subsidized rates for students"}]}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), foodcourt_page_id, 'Food Court - JKKN College of Engineering', 'Hygienic food court facilities.', 'Food Court - JKKN Engineering College', 'Quality food in clean environment.', 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/food-court', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, position, created_at, updated_at)
  VALUES (gen_random_uuid(), foodcourt_page_id, false, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Food Court';

  -- ==========================================
  -- 6. HOSTEL
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (hostel_page_id, 'Hostel', 'facilities/hostel', 'Separate hostel facilities for boys and girls', parent_page_id, 'published', 'public', true, 6, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), hostel_page_id, 'HostelPage', '{"facilityTitle": "HOSTEL FACILITIES", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Safe and comfortable hostel facilities.</p>", "boysHostel": {"images": ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"], "features": [{"title": "Accommodation", "description": "2-3 students per room"}, {"title": "Mess Facility", "description": "Nutritious meals"}], "capacity": "500 students", "warden": {"name": "Dr. Rajkumar", "contact": "+91-9876543210"}}, "girlsHostel": {"images": ["https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800"], "features": [{"title": "Safe Environment", "description": "24/7 security"}, {"title": "Comfortable Rooms", "description": "Modern furniture"}], "capacity": "400 students", "warden": {"name": "Dr. Lakshmi", "contact": "+91-9876543211"}}}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), hostel_page_id, 'Hostel - JKKN College of Engineering', 'Separate hostel facilities for boys and girls.', 'Hostel - JKKN Engineering College', 'Safe and comfortable accommodation.', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/hostel', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, position, created_at, updated_at)
  VALUES (gen_random_uuid(), hostel_page_id, false, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Hostel';

  -- ==========================================
  -- 7. LIBRARY
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (library_page_id, 'Library', 'facilities/library', 'Central library with extensive collection', parent_page_id, 'published', 'public', true, 7, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), library_page_id, 'FacilityPage', '{"facilityTitle": "LIBRARY", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Central library with 50,000+ books.</p>", "images": ["https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800"], "features": [{"title": "Extensive Collection", "description": "50,000+ books"}, {"title": "Digital Library", "description": "E-books and e-journals"}, {"title": "Reading Rooms", "description": "Quiet study areas"}]}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), library_page_id, 'Library - JKKN College of Engineering', 'Central library facilities.', 'Library - JKKN Engineering College', 'Comprehensive learning resources.', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/library', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, position, created_at, updated_at)
  VALUES (gen_random_uuid(), library_page_id, false, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Library';

  -- ==========================================
  -- 8. SEMINAR HALL
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (seminar_page_id, 'Seminar Hall', 'facilities/seminar-hall', 'Modern seminar halls for workshops', parent_page_id, 'published', 'public', true, 8, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), seminar_page_id, 'FacilityPage', '{"facilityTitle": "SEMINAR HALLS", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Modern seminar halls for events.</p>", "images": ["https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800"], "features": [{"title": "Multiple Halls", "description": "Various capacity options"}, {"title": "Presentation Equipment", "description": "Projectors and audio systems"}, {"title": "Air-Conditioned", "description": "Comfortable environment"}]}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), seminar_page_id, 'Seminar Halls - JKKN College of Engineering', 'Modern seminar facilities.', 'Seminar Halls - JKKN Engineering College', 'Well-equipped event spaces.', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/seminar-hall', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, position, created_at, updated_at)
  VALUES (gen_random_uuid(), seminar_page_id, false, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Seminar Hall';

  -- ==========================================
  -- 9. SPORTS
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (sports_page_id, 'Sports', 'facilities/sports', 'Comprehensive sports facilities', parent_page_id, 'published', 'public', true, 9, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), sports_page_id, 'FacilityPage', '{"facilityTitle": "SPORTS FACILITIES", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Comprehensive sports infrastructure.</p>", "images": ["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"], "features": [{"title": "Outdoor Facilities", "description": "Cricket, football, basketball courts"}, {"title": "Indoor Games", "description": "Badminton, table tennis"}, {"title": "Fitness Center", "description": "Modern gymnasium"}]}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), sports_page_id, 'Sports - JKKN College of Engineering', 'Comprehensive sports facilities.', 'Sports - JKKN Engineering College', 'World-class athletic infrastructure.', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/sports', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, position, created_at, updated_at)
  VALUES (gen_random_uuid(), sports_page_id, false, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Sports';

  -- ==========================================
  -- 10. WI-FI CAMPUS
  -- ==========================================

  INSERT INTO cms_pages (id, title, slug, description, parent_id, status, visibility, show_in_navigation, sort_order, created_by, updated_by, published_at, created_at, updated_at)
  VALUES (wifi_page_id, 'Wi-Fi Campus', 'facilities/wi-fi-campus', 'Campus-wide high-speed internet', parent_page_id, 'published', 'public', true, 10, creator_id, creator_id, current_time, current_time, current_time);

  INSERT INTO cms_page_blocks (id, page_id, component_name, props, sort_order, is_visible, created_at, updated_at)
  VALUES (gen_random_uuid(), wifi_page_id, 'FacilityPage', '{"facilityTitle": "WI-FI CAMPUS", "introduction": "<p class=\"text-lg text-gray-700 leading-relaxed\">Campus-wide wireless connectivity.</p>", "images": ["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800"], "features": [{"title": "Complete Coverage", "description": "Wi-Fi across campus"}, {"title": "High-Speed Internet", "description": "Fast connectivity"}, {"title": "Secure Network", "description": "Protected access"}]}'::jsonb, 1, true, current_time, current_time);

  INSERT INTO cms_seo_metadata (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_card, canonical_url, created_at, updated_at)
  VALUES (gen_random_uuid(), wifi_page_id, 'Wi-Fi Campus - JKKN College of Engineering', 'Campus-wide internet connectivity.', 'Wi-Fi Campus - JKKN Engineering College', 'High-speed wireless network.', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200', 'summary_large_image', 'https://engg.jkkn.ac.in/facilities/wi-fi-campus', current_time, current_time);

  INSERT INTO cms_page_fab_config (id, page_id, is_enabled, position, created_at, updated_at)
  VALUES (gen_random_uuid(), wifi_page_id, false, 'bottom-right', current_time, current_time);

  RAISE NOTICE '✅ Created: Wi-Fi Campus';

END $$;

-- Commit transaction
COMMIT;

-- Verification query
SELECT
  title,
  slug,
  status,
  show_in_navigation,
  sort_order
FROM cms_pages
WHERE parent_id = '96f3bbba-23e2-4753-b202-0680009f6fc7'
ORDER BY sort_order;
