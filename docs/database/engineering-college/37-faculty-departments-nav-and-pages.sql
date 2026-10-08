-- ============================================
-- Faculty departments: top-level nav + 7 department PDF pages
-- ============================================
-- Purpose: Add a top-level "Faculty" navigation item whose dropdown lists the
--          7 Engineering departments (CSE, ECE, EEE, IT, MECH, MBA, S&H).
--          Each department page embeds that department's official faculty-list
--          PDF (public/pdfs/faculty/<dept>.pdf) via the DepartmentFacultyPdf
--          CMS block. The /faculty landing page uses FacultyDepartmentsIndex.
--          Also retires the old "Senior Learners" CMS row (slug 'faculty') so the
--          slug is free: the profile directory moved to the code route
--          /senior-learners and is hidden on Engineering (see proxy.ts).
-- Created: 2026-10-08
-- Target:  Engineering College Supabase (kyvfkyjmdbtyimtedkie) ONLY
-- Dependencies: cms_pages, cms_page_blocks, cms_seo_metadata;
--               CMS blocks DepartmentFacultyPdf + FacultyDepartmentsIndex
--               (lib/cms/component-registry.ts); PDFs in public/pdfs/faculty/
-- Security: Plain DML on existing tables; RLS unchanged. No schema change.
-- Rollback:
--   delete from cms_pages where slug = 'faculty' or slug like 'faculty/%';
--     (cascades blocks + SEO)
--   update cms_pages set slug='faculty', hierarchical_slug='others/faculty',
--     status='published', show_in_navigation=true
--     where id = '776fbef5-0c47-4469-8bd2-19e1fb718f92';
--   update cms_pages set sort_order = sort_order - 1
--     where parent_id is null and sort_order >= 4;   -- undo the shift in step 2
-- ============================================

-- Step 1: free the 'faculty' slug. The old row ("Senior Learners", under OTHERS)
-- becomes a hidden draft; the page itself is served by app/(public)/senior-learners.
update public.cms_pages
set slug = 'senior-learners',
    hierarchical_slug = 'others/senior-learners',
    status = 'draft',
    show_in_navigation = false,
    updated_at = now()
where id = '776fbef5-0c47-4469-8bd2-19e1fb718f92'
  and slug = 'faculty';

-- Step 2: make room at top-level position 3 (right after "Courses" at 2).
update public.cms_pages
set sort_order = sort_order + 1
where parent_id is null
  and sort_order >= 3;

-- Step 3: parent page + children + blocks + SEO.
do $$
declare
  v_author  uuid := 'b92f8ccd-b811-4c5a-a93d-1eed2b5f4a60';  -- same author as existing Engineering pages
  v_parent  uuid;
  v_page    uuid;
  d         record;
  v_departments jsonb := jsonb_build_array(
    jsonb_build_object('name','Computer Science and Engineering','shortName','CSE','href','/faculty/cse','description','Faculty list for B.E CSE and M.E CSE'),
    jsonb_build_object('name','Electronics and Communication Engineering','shortName','ECE','href','/faculty/ece','description','Faculty list for B.E ECE'),
    jsonb_build_object('name','Electrical and Electronics Engineering','shortName','EEE','href','/faculty/eee','description','Faculty list for B.E EEE'),
    jsonb_build_object('name','Information Technology','shortName','IT','href','/faculty/it','description','Faculty list for B.Tech IT'),
    jsonb_build_object('name','Mechanical Engineering','shortName','MECH','href','/faculty/mech','description','Faculty list for B.E Mechanical'),
    jsonb_build_object('name','Management Studies','shortName','MBA','href','/faculty/mba','description','Faculty list for MBA'),
    jsonb_build_object('name','Science and Humanities','shortName','S&H','href','/faculty/sh','description','Faculty list for first-year Science and Humanities')
  );
begin
  -- Parent: /faculty (department index)
  insert into public.cms_pages
    (title, slug, description, status, visibility, published_at, sort_order,
     show_in_navigation, navigation_label, metadata, created_by)
  values
    ('Faculty', 'faculty', 'Department-wise faculty lists of JKKN College of Engineering and Technology',
     'published', 'public', now(), 3, true, 'Faculty', '{}'::jsonb, v_author)
  returning id into v_parent;

  insert into public.cms_page_blocks (page_id, component_name, props, sort_order, is_visible)
  values (v_parent, 'FacultyDepartmentsIndex',
          jsonb_build_object(
            'eyebrow','Faculty',
            'title','Our Faculty by Department',
            'subtitle','Choose a department to view its official faculty list.',
            'departments', v_departments),
          0, true);

  insert into public.cms_seo_metadata
    (page_id, meta_title, meta_description, robots_directive, og_title, og_description, og_type)
  values
    (v_parent,
     'Faculty by Department | JKKN College of Engineering and Technology',
     'Browse the official faculty lists of every department at JKKN College of Engineering and Technology: CSE, ECE, EEE, IT, Mechanical, MBA and Science & Humanities.',
     'index, follow',
     'Faculty by Department | JKKN College of Engineering and Technology',
     'Official department-wise faculty lists of JKKN College of Engineering and Technology.',
     'website');

  -- Children: /faculty/<dept>
  for d in
    select * from (values
      (1, 'cse',  'Computer Science and Engineering',          'CSE'),
      (2, 'ece',  'Electronics and Communication Engineering', 'ECE'),
      (3, 'eee',  'Electrical and Electronics Engineering',    'EEE'),
      (4, 'it',   'Information Technology',                    'IT'),
      (5, 'mech', 'Mechanical Engineering',                    'Mechanical'),
      (6, 'mba',  'Management Studies',                        'MBA'),
      (7, 'sh',   'Science and Humanities',                    'S&H')
    ) as t(ord, code, dept_name, short_name)
  loop
    insert into public.cms_pages
      (title, slug, description, parent_id, status, visibility, published_at, sort_order,
       show_in_navigation, navigation_label, metadata, created_by)
    values
      (d.dept_name, 'faculty/' || d.code, 'Faculty list of the Department of ' || d.dept_name,
       v_parent, 'published', 'public', now(), d.ord, true, d.dept_name, '{}'::jsonb, v_author)
    returning id into v_page;

    insert into public.cms_page_blocks (page_id, component_name, props, sort_order, is_visible)
    values (v_page, 'DepartmentFacultyPdf',
            jsonb_build_object(
              'departmentName', 'Department of ' || d.dept_name,
              'eyebrow', 'Faculty',
              'description', 'Official faculty list with AU-FIN and AICTE IDs, names and designations.',
              'pdfUrl', '/pdfs/faculty/' || d.code || '.pdf',
              'downloadFileName', d.code || '-faculty-list.pdf',
              'viewerHeight', 900),
            0, true);

    insert into public.cms_seo_metadata
      (page_id, meta_title, meta_description, robots_directive, og_title, og_description, og_type)
    values
      (v_page,
       d.short_name || ' Faculty List | JKKN College of Engineering and Technology',
       'Official faculty list of the Department of ' || d.dept_name || ' at JKKN College of Engineering and Technology, with AU-FIN and AICTE IDs, names and designations.',
       'index, follow',
       d.short_name || ' Faculty List | JKKN College of Engineering and Technology',
       'Official faculty list of the Department of ' || d.dept_name || '.',
       'website');
  end loop;
end $$;

-- End of faculty-departments-nav-and-pages
-- ============================================
