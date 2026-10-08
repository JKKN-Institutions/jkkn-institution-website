-- ============================================
-- Faculty department pages: show the faculty LIST (photo cards) instead of the PDF
-- ============================================
-- Purpose: Each department page (/faculty/<dept>) now renders the faculty as a page
--          (DepartmentFacultyList block: photo, name, designation, AICTE ID / AU-FIN,
--          head of department highlighted) instead of an embedded PDF. The Faculty
--          menu items and the /faculty landing cards link to these pages (not the PDFs).
--          Data was extracted from the 7 official department PDFs (74 faculty); photos
--          are in public/faculty/photos/<dept>/NN.jpg.
-- Created: 2026-10-08
-- Target:  Engineering College Supabase (kyvfkyjmdbtyimtedkie) ONLY
-- Dependencies: 37-, 38-, 39-faculty-*.sql; code release containing the
--               DepartmentFacultyList block and public/faculty/photos/*.
--               APPLY ONLY AFTER THAT RELEASE IS DEPLOYED.
-- Security: Plain DML on existing tables; RLS unchanged.
-- Rollback:
--   update cms_page_blocks b set component_name = 'DepartmentFacultyPdf',
--     props = jsonb_build_object('departmentName', 'Department of ...', 'pdfUrl', '/faculty/<dept>.pdf', ...)
--     from cms_pages p where p.id = b.page_id and p.slug = 'faculty/<dept>';
--   update cms_pages set external_url = '/faculty/<dept>.pdf' where slug = 'faculty/<dept>';
-- ============================================

-- CSE: 9 faculty
update public.cms_page_blocks b
set component_name = 'DepartmentFacultyList',
    props = $json${"departmentName": "Department of Computer Science and Engineering", "eyebrow": "Faculty", "description": "Meet the faculty of the Department of Computer Science and Engineering.", "showIds": true, "faculty": [{"name": "Dr. NARMADHA S J", "designation": "Professor and Head", "photo": "/faculty/photos/cse/01.jpg", "auFin": "2640021977", "aicteId": "1-2643736163", "isHead": true}, {"name": "Mrs. ISVARYA LAKSHMI O", "designation": "Assistant Professor", "photo": "/faculty/photos/cse/02.jpg", "auFin": "2683351988", "aicteId": "1-787111570", "isHead": false}, {"name": "Mrs. DEEPIKA V", "designation": "Assistant Professor", "photo": "/faculty/photos/cse/03.jpg", "auFin": "2652851990", "aicteId": "1-7452578365", "isHead": false}, {"name": "Mrs. GOKILAVANI M", "designation": "Assistant Professor", "photo": "/faculty/photos/cse/04.jpg", "auFin": "2657631994", "aicteId": "1-11341888331", "isHead": false}, {"name": "Mrs. DHARISANAPRIYA R", "designation": "Assistant Professor", "photo": "/faculty/photos/cse/05.jpg", "auFin": "2652651992", "aicteId": "1-44725780298", "isHead": false}, {"name": "Mrs. SHARMILA B", "designation": "Assistant Professor", "photo": "/faculty/photos/cse/06.jpg", "auFin": "2634401992", "aicteId": "1-44725458948", "isHead": false}, {"name": "Mrs. LAVANYA L", "designation": "Assistant Professor", "photo": "/faculty/photos/cse/07.jpg", "auFin": "2694261991", "aicteId": "1-46478285813", "isHead": false}, {"name": "Ms. LAKSHMI T", "designation": "Assistant Professor", "photo": "/faculty/photos/cse/08.jpg", "auFin": "2666972002", "aicteId": "1-47289025966", "isHead": false}, {"name": "Mrs. AKILA M", "designation": "Assistant Professor", "photo": "/faculty/photos/cse/09.jpg", "auFin": "2780272001", "aicteId": "1-44074165241", "isHead": false}]}$json$::jsonb,
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty/cse'
  and b.component_name = 'DepartmentFacultyPdf';

-- ECE: 10 faculty
update public.cms_page_blocks b
set component_name = 'DepartmentFacultyList',
    props = $json${"departmentName": "Department of Electronics and Communication Engineering", "eyebrow": "Faculty", "description": "Meet the faculty of the Department of Electronics and Communication Engineering.", "showIds": true, "faculty": [{"name": "Dr. RAJESH K P", "designation": "Associate Professor and Head", "photo": "/faculty/photos/ece/01.jpg", "auFin": "2688801987", "aicteId": "1-747489368", "isHead": true}, {"name": "Mrs. PONNARASI N", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/02.jpg", "auFin": "2628721988", "aicteId": "1-2487133057", "isHead": false}, {"name": "Mrs. TAMILSELVI S", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/03.jpg", "auFin": "2679371991", "aicteId": "1-7501836654", "isHead": false}, {"name": "Mrs. SHAANTHANU K", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/04.jpg", "auFin": "2673861989", "aicteId": "1-46546283924", "isHead": false}, {"name": "Mr. PRAVEEN KUMAR K", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/05.jpg", "auFin": "2631081996", "aicteId": "1-44726841993", "isHead": false}, {"name": "Ms. MOUNIGA G", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/06.jpg", "auFin": "2646201998", "aicteId": "1-46654787173", "isHead": false}, {"name": "Mr. VISWANATHAN S", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/07.jpg", "auFin": "2658881987", "aicteId": "1-2468829671", "isHead": false}, {"name": "Mr. DINESH KUMAR D", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/08.jpg", "auFin": "2622891987", "aicteId": "1-44726842197", "isHead": false}, {"name": "Mrs. MEKALA S", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/09.jpg", "auFin": "2672091990", "aicteId": "1-44636037301", "isHead": false}, {"name": "Mr. ALAGURAJ R", "designation": "Assistant Professor", "photo": "/faculty/photos/ece/10.jpg", "auFin": "2660061990", "aicteId": "1-2303287240", "isHead": false}]}$json$::jsonb,
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty/ece'
  and b.component_name = 'DepartmentFacultyPdf';

-- EEE: 12 faculty
update public.cms_page_blocks b
set component_name = 'DepartmentFacultyList',
    props = $json${"departmentName": "Department of Electrical and Electronics Engineering", "eyebrow": "Faculty", "description": "Meet the faculty of the Department of Electrical and Electronics Engineering.", "showIds": true, "faculty": [{"name": "Dr. KATHIRVEL C", "designation": "Principal and Professor", "photo": "/faculty/photos/eee/01.jpg", "auFin": "2627411977", "aicteId": "1-410481154", "isHead": false}, {"name": "Dr. MOHANRAJ M R", "designation": "Associate Professor", "photo": "/faculty/photos/eee/02.jpg", "auFin": "2645861986", "aicteId": "1-466475379", "isHead": false}, {"name": "Mr. ARULJOTHI K", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/03.jpg", "auFin": "2678171995", "aicteId": "1-44244454651", "isHead": false}, {"name": "Mr. VIGNESH M", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/04.jpg", "auFin": "2696711991", "aicteId": "1-44725927254", "isHead": false}, {"name": "Mrs. DEEPIKA R", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/05.jpg", "auFin": "2620811992", "aicteId": "1-4722838584", "isHead": false}, {"name": "Mrs. JEEVITHA V M", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/06.jpg", "auFin": "2647851985", "aicteId": "1-4647937064", "isHead": false}, {"name": "Mrs. DHARSHINI DEVI M", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/07.jpg", "auFin": "2684361997", "aicteId": "1-43512858221", "isHead": false}, {"name": "Mrs. SINDHUJA D", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/08.jpg", "auFin": "2612051988", "aicteId": "1-44244454564", "isHead": false}, {"name": "Ms. VAISHNAVE M", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/09.jpg", "auFin": "2619531999", "aicteId": "1-44912347220", "isHead": false}, {"name": "Mr. VIJAYAPRABAKARAN S", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/10.jpg", "auFin": "2612231994", "aicteId": "1-44244454651", "isHead": false}, {"name": "Mr. V. SILAMBARASAN", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/11.jpg", "auFin": "2615091986", "aicteId": "1-44031130606", "isHead": false}, {"name": "Mr. PRAKASH P", "designation": "Assistant Professor", "photo": "/faculty/photos/eee/12.jpg", "auFin": "2798561998", "aicteId": "1-1060827921", "isHead": false}]}$json$::jsonb,
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty/eee'
  and b.component_name = 'DepartmentFacultyPdf';

-- IT: 10 faculty
update public.cms_page_blocks b
set component_name = 'DepartmentFacultyList',
    props = $json${"departmentName": "Department of Information Technology", "eyebrow": "Faculty", "description": "Meet the faculty of the Department of Information Technology.", "showIds": true, "faculty": [{"name": "Dr. SATHIESH G G", "designation": "Professor", "photo": "/faculty/photos/it/01.jpg", "auFin": "2628811978", "aicteId": "1-47948746023", "isHead": false}, {"name": "Mr. BALAKUMARAN B", "designation": "Assistant Professor", "photo": "/faculty/photos/it/02.jpg", "auFin": "2653571986", "aicteId": "1-25508503191", "isHead": false}, {"name": "Mrs. PORKODI G", "designation": "Assistant Professor", "photo": "/faculty/photos/it/03.jpg", "auFin": "2652341987", "aicteId": "1-4621191737", "isHead": false}, {"name": "Mrs. DHIVYA J", "designation": "Assistant Professor", "photo": "/faculty/photos/it/04.jpg", "auFin": "2610041991", "aicteId": "1-3642906219", "isHead": false}, {"name": "Mr. TAMILARASAN S", "designation": "Assistant Professor", "photo": "/faculty/photos/it/05.jpg", "auFin": "2625951995", "aicteId": "1-11341060392", "isHead": false}, {"name": "Mr. RAKUPATHI P", "designation": "Assistant Professor", "photo": "/faculty/photos/it/06.jpg", "auFin": "2637701989", "aicteId": "1-44244487602", "isHead": false}, {"name": "Mrs. RENUGADEVI S", "designation": "Assistant Professor", "photo": "/faculty/photos/it/07.jpg", "auFin": "2616991996", "aicteId": "1-43518500877", "isHead": false}, {"name": "Ms. MANIMEKALAI G", "designation": "Assistant Professor", "photo": "/faculty/photos/it/08.jpg", "auFin": "2691821997", "aicteId": "1-43522140301", "isHead": false}, {"name": "Ms. SWATHI M", "designation": "Assistant Professor", "photo": "/faculty/photos/it/09.jpg", "auFin": "2633081998", "aicteId": "1-44726285078", "isHead": false}, {"name": "Ms. MANIPRIYA S", "designation": "Assistant Professor", "photo": "/faculty/photos/it/10.jpg", "auFin": "2682031996", "aicteId": "1-11341060580", "isHead": false}]}$json$::jsonb,
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty/it'
  and b.component_name = 'DepartmentFacultyPdf';

-- MECH: 11 faculty
update public.cms_page_blocks b
set component_name = 'DepartmentFacultyList',
    props = $json${"departmentName": "Department of Mechanical Engineering", "eyebrow": "Faculty", "description": "Meet the faculty of the Department of Mechanical Engineering.", "showIds": true, "faculty": [{"name": "Dr. SASIKUMAR R", "designation": "Associate Professor and Head", "photo": "/faculty/photos/mech/01.jpg", "auFin": "2683491980", "aicteId": "1-7461886425", "isHead": true}, {"name": "Mr. RANJITHKUMAR S", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/02.jpg", "auFin": "2681851992", "aicteId": "1-4618649686", "isHead": false}, {"name": "Mr. SIVASHANKAR M", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/03.jpg", "auFin": "2624191990", "aicteId": "1-3172933894", "isHead": false}, {"name": "Mr. SIVABALAN S", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/04.jpg", "auFin": "2615491991", "aicteId": "1-3294628008", "isHead": false}, {"name": "Mr. SHANMUGAM P", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/05.jpg", "auFin": "2658651995", "aicteId": "1-9515999295", "isHead": false}, {"name": "Mr. MEIYAZHAGAN P", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/06.jpg", "auFin": "2680511990", "aicteId": "1-11333619266", "isHead": false}, {"name": "Mr. GOKULAVASAN L", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/07.jpg", "auFin": "2681961992", "aicteId": "1-46560961397", "isHead": false}, {"name": "Mr. YAALARASAN D", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/08.jpg", "auFin": "2628911992", "aicteId": "1-11341388251", "isHead": false}, {"name": "Mr. JAYAPRAKASH P", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/09.jpg", "auFin": "2661871994", "aicteId": "1-44726758244", "isHead": false}, {"name": "Mr. K. TAMILAN", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/10.jpg", "auFin": "2643551992", "aicteId": "1-3214847635", "isHead": false}, {"name": "Ms. DHARANIPRIYA", "designation": "Assistant Professor", "photo": "/faculty/photos/mech/11.jpg", "auFin": "2642501998", "aicteId": "1-44716236443", "isHead": false}]}$json$::jsonb,
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty/mech'
  and b.component_name = 'DepartmentFacultyPdf';

-- MBA: 6 faculty
update public.cms_page_blocks b
set component_name = 'DepartmentFacultyList',
    props = $json${"departmentName": "Department of Management Studies", "eyebrow": "Faculty", "description": "Meet the faculty of the Department of Management Studies.", "showIds": true, "faculty": [{"name": "Dr. MOHANRAJ G", "designation": "Associate Professor", "photo": "/faculty/photos/mba/01.jpg", "auFin": "2666381983", "aicteId": "1-3385085484", "isHead": false}, {"name": "Mrs. VIMALA C", "designation": "Assistant Professor", "photo": "/faculty/photos/mba/02.jpg", "auFin": "2686131977", "aicteId": "1-3643294640", "isHead": false}, {"name": "Mr. ARUN V. P", "designation": "Assistant Professor", "photo": "/faculty/photos/mba/03.jpg", "auFin": "2677461992", "aicteId": "1-44726725884", "isHead": false}, {"name": "Mrs. SARANYA G", "designation": "Assistant Professor", "photo": "/faculty/photos/mba/04.jpg", "auFin": "2672871992", "aicteId": "1-44726725913", "isHead": false}, {"name": "Mrs. RAMYA B", "designation": "Assistant Professor", "photo": "/faculty/photos/mba/05.jpg", "auFin": "2646611999", "aicteId": "1-44771198641", "isHead": false}, {"name": "Mrs. POONGOTHAI M", "designation": "Assistant Professor", "photo": "/faculty/photos/mba/06.jpg", "auFin": "2658321995", "aicteId": "1-9510792781", "isHead": false}]}$json$::jsonb,
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty/mba'
  and b.component_name = 'DepartmentFacultyPdf';

-- SH: 16 faculty
update public.cms_page_blocks b
set component_name = 'DepartmentFacultyList',
    props = $json${"departmentName": "Department of Science and Humanities", "eyebrow": "Faculty", "description": "Meet the faculty of the Department of Science and Humanities.", "showIds": true, "faculty": [{"name": "Dr. N. SASIKALA", "designation": "Assistant Professor and Head", "photo": "/faculty/photos/sh/01.jpg", "auFin": "2792791978", "aicteId": "1-47940125131", "isHead": true}, {"name": "Mrs. BABY M", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/02.jpg", "auFin": "2677501984", "aicteId": "1-7490747764", "isHead": false}, {"name": "Mr. RAJARATNAM R", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/03.jpg", "auFin": "2643141982", "aicteId": "1-44634659341", "isHead": false}, {"name": "Mrs. MUTHULAKSHMI M", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/04.jpg", "auFin": "2641901985", "aicteId": "1-44726246694", "isHead": false}, {"name": "Mrs. SARASWATHI M", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/05.jpg", "auFin": "2641181993", "aicteId": "1-44912347228", "isHead": false}, {"name": "Mrs. DEEPIKA R", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/06.jpg", "auFin": "2620281988", "aicteId": "1-44912347245", "isHead": false}, {"name": "Mrs. SASIKALA D", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/07.jpg", "auFin": "2688261984", "aicteId": "1-44089710900", "isHead": false}, {"name": "Mr. RAJENDIRAN M", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/08.jpg", "auFin": "2663891968", "aicteId": "1-443882397", "isHead": false}, {"name": "Dr. LATHA N", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/09.jpg", "auFin": "2686321973", "aicteId": "1-7460248773", "isHead": false}, {"name": "Mrs. SATHYA N", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/10.jpg", "auFin": "2620111991", "aicteId": "1-44726284918", "isHead": false}, {"name": "Mr. KARUPPUSAMY OP", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/11.jpg", "auFin": "2656471980", "aicteId": "1-46573536107", "isHead": false}, {"name": "Mrs. BHARATHIPRIYA M", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/12.jpg", "auFin": "2674021987", "aicteId": "1-44726483299", "isHead": false}, {"name": "Mrs. KASTHURI R", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/13.jpg", "auFin": "2686701992", "aicteId": "1-44726483421", "isHead": false}, {"name": "Mrs. NARMADHA S", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/14.jpg", "auFin": "2646911989", "aicteId": "1-3604109427", "isHead": false}, {"name": "Mrs. PANJAMI D", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/15.jpg", "auFin": "2665791989", "aicteId": "1-3226225374", "isHead": false}, {"name": "Mr. HARI PRABHU", "designation": "Assistant Professor", "photo": "/faculty/photos/sh/16.jpg", "auFin": "2716301981", "aicteId": "1-47948847953", "isHead": false}]}$json$::jsonb,
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty/sh'
  and b.component_name = 'DepartmentFacultyPdf';

-- Menu items open the department pages (not the PDFs).
update public.cms_pages
set external_url = null,
    updated_at = now()
where slug like 'faculty/%';

-- Landing-page cards link to the department pages.
update public.cms_page_blocks b
set props = jsonb_set(
      b.props,
      '{departments}',
      (
        select jsonb_agg(
                 jsonb_set(d.value, '{href}',
                   to_jsonb('/faculty/' || lower(replace(d.value->>'shortName','&','')))
                 )
                 order by d.ord)
        from jsonb_array_elements(b.props->'departments') with ordinality as d(value, ord)
      )
    ),
    updated_at = now()
from public.cms_pages p
where p.id = b.page_id
  and p.slug = 'faculty'
  and b.component_name = 'FacultyDepartmentsIndex';

-- End of faculty-list-pages
-- ============================================
