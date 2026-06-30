-- ============================================
-- 43 — JKKN Terminology Compliance Sweep (DB content)
-- ============================================
-- Purpose: Apply learner-centered terminology to live CMS/blog/SEO content.
-- Created: 2026-06-30
-- Scope: cms_pages, cms_page_blocks, cms_seo_metadata, blog_posts (Main Supabase).
-- Method: value-only JSONB transform + case-preserving text fix. Object KEYS,
--   URLs/slugs, and proper nouns (NCTE/TNTEU "Teacher Education", "Lab/Laboratory
--   Technology" degrees) are preserved. Helper functions dropped at end.
-- Mirrors the code codemod's term map for cross-surface consistency.
-- ============================================

-- Single-string transform: null/URL/slug guarded, proper-noun protected, case-preserving.
CREATE OR REPLACE FUNCTION jkkn_term_fix(t text) RETURNS text LANGUAGE plpgsql IMMUTABLE AS $func$
BEGIN
  IF t IS NULL THEN RETURN NULL; END IF;
  -- Skip URLs / paths / slugs / identifiers (no whitespace + url/path/identifier chars).
  IF t ~ '^(https?://|mailto:|tel:|/|\./|#)' THEN RETURN t; END IF;
  IF t !~ '\s' AND t ~ '[/_:.@-]' THEN RETURN t; END IF;
  -- Mask protected proper nouns (longest first).
  t := regexp_replace(t, '\ylaboratory technology\y', 'JKKNPROT0ZZ', 'gi');
  t := regexp_replace(t, '\ylaboratory technician\y', 'JKKNPROT1ZZ', 'gi');
  t := regexp_replace(t, '\yclinical laboratory\y', 'JKKNPROT2ZZ', 'gi');
  t := regexp_replace(t, '\ymedical laboratory\y', 'JKKNPROT3ZZ', 'gi');
  t := regexp_replace(t, '\yteachers education\y', 'JKKNPROT4ZZ', 'gi');
  t := regexp_replace(t, '\yteacher education\y', 'JKKNPROT5ZZ', 'gi');
  t := regexp_replace(t, '\ylab technology\y', 'JKKNPROT6ZZ', 'gi');
  t := regexp_replace(t, '\ylab technician\y', 'JKKNPROT7ZZ', 'gi');
  -- Apply terminology replacements (phrases first, 3 case variants each).
  t := regexp_replace(t, '\yteaching staff\y', 'senior learners', 'g');
  t := regexp_replace(t, '\yTEACHING STAFF\y', 'SENIOR LEARNERS', 'g');
  t := regexp_replace(t, '\yTeaching Staff\y', 'Senior Learners', 'g');
  t := regexp_replace(t, '\yfaculty members\y', 'senior learners', 'g');
  t := regexp_replace(t, '\yFACULTY MEMBERS\y', 'SENIOR LEARNERS', 'g');
  t := regexp_replace(t, '\yFaculty Members\y', 'Senior Learners', 'g');
  t := regexp_replace(t, '\yfaculty member\y', 'senior learner', 'g');
  t := regexp_replace(t, '\yFACULTY MEMBER\y', 'SENIOR LEARNER', 'g');
  t := regexp_replace(t, '\yFaculty Member\y', 'Senior Learner', 'g');
  t := regexp_replace(t, '\ystaff members\y', 'team members', 'g');
  t := regexp_replace(t, '\ySTAFF MEMBERS\y', 'TEAM MEMBERS', 'g');
  t := regexp_replace(t, '\yStaff Members\y', 'Team Members', 'g');
  t := regexp_replace(t, '\ystaff member\y', 'team member', 'g');
  t := regexp_replace(t, '\ySTAFF MEMBER\y', 'TEAM MEMBER', 'g');
  t := regexp_replace(t, '\yStaff Member\y', 'Team Member', 'g');
  t := regexp_replace(t, '\ystudent body\y', 'learner community', 'g');
  t := regexp_replace(t, '\ySTUDENT BODY\y', 'LEARNER COMMUNITY', 'g');
  t := regexp_replace(t, '\yStudent Body\y', 'Learner Community', 'g');
  t := regexp_replace(t, '\ylecture halls\y', 'learning auditoriums', 'g');
  t := regexp_replace(t, '\yLECTURE HALLS\y', 'LEARNING AUDITORIUMS', 'g');
  t := regexp_replace(t, '\yLecture Halls\y', 'Learning Auditoriums', 'g');
  t := regexp_replace(t, '\ylecture hall\y', 'learning auditorium', 'g');
  t := regexp_replace(t, '\yLECTURE HALL\y', 'LEARNING AUDITORIUM', 'g');
  t := regexp_replace(t, '\yLecture Hall\y', 'Learning Auditorium', 'g');
  t := regexp_replace(t, '\ystudy halls\y', 'learning commons', 'g');
  t := regexp_replace(t, '\ySTUDY HALLS\y', 'LEARNING COMMONS', 'g');
  t := regexp_replace(t, '\yStudy Halls\y', 'Learning Commons', 'g');
  t := regexp_replace(t, '\ystudy hall\y', 'learning commons', 'g');
  t := regexp_replace(t, '\ySTUDY HALL\y', 'LEARNING COMMONS', 'g');
  t := regexp_replace(t, '\yStudy Hall\y', 'Learning Commons', 'g');
  t := regexp_replace(t, '\ystudy rooms\y', 'learning commons', 'g');
  t := regexp_replace(t, '\ySTUDY ROOMS\y', 'LEARNING COMMONS', 'g');
  t := regexp_replace(t, '\yStudy Rooms\y', 'Learning Commons', 'g');
  t := regexp_replace(t, '\ystudy room\y', 'learning commons', 'g');
  t := regexp_replace(t, '\ySTUDY ROOM\y', 'LEARNING COMMONS', 'g');
  t := regexp_replace(t, '\yStudy Room\y', 'Learning Commons', 'g');
  t := regexp_replace(t, '\ystudents\y', 'learners', 'g');
  t := regexp_replace(t, '\ySTUDENTS\y', 'LEARNERS', 'g');
  t := regexp_replace(t, '\yStudents\y', 'Learners', 'g');
  t := regexp_replace(t, '\ystudent\y', 'learner', 'g');
  t := regexp_replace(t, '\ySTUDENT\y', 'LEARNER', 'g');
  t := regexp_replace(t, '\yStudent\y', 'Learner', 'g');
  t := regexp_replace(t, '\ypupils\y', 'learners', 'g');
  t := regexp_replace(t, '\yPUPILS\y', 'LEARNERS', 'g');
  t := regexp_replace(t, '\yPupils\y', 'Learners', 'g');
  t := regexp_replace(t, '\ypupil\y', 'learner', 'g');
  t := regexp_replace(t, '\yPUPIL\y', 'LEARNER', 'g');
  t := regexp_replace(t, '\yPupil\y', 'Learner', 'g');
  t := regexp_replace(t, '\ytrainees\y', 'learners', 'g');
  t := regexp_replace(t, '\yTRAINEES\y', 'LEARNERS', 'g');
  t := regexp_replace(t, '\yTrainees\y', 'Learners', 'g');
  t := regexp_replace(t, '\ytrainee\y', 'learner', 'g');
  t := regexp_replace(t, '\yTRAINEE\y', 'LEARNER', 'g');
  t := regexp_replace(t, '\yTrainee\y', 'Learner', 'g');
  t := regexp_replace(t, '\yfaculty\y', 'senior learners', 'g');
  t := regexp_replace(t, '\yFACULTY\y', 'SENIOR LEARNERS', 'g');
  t := regexp_replace(t, '\yFaculty\y', 'Senior Learners', 'g');
  t := regexp_replace(t, '\yteachers\y', 'senior learners', 'g');
  t := regexp_replace(t, '\yTEACHERS\y', 'SENIOR LEARNERS', 'g');
  t := regexp_replace(t, '\yTeachers\y', 'Senior Learners', 'g');
  t := regexp_replace(t, '\yteacher\y', 'senior learner', 'g');
  t := regexp_replace(t, '\yTEACHER\y', 'SENIOR LEARNER', 'g');
  t := regexp_replace(t, '\yTeacher\y', 'Senior Learner', 'g');
  t := regexp_replace(t, '\yprofessors\y', 'senior learners', 'g');
  t := regexp_replace(t, '\yPROFESSORS\y', 'SENIOR LEARNERS', 'g');
  t := regexp_replace(t, '\yProfessors\y', 'Senior Learners', 'g');
  t := regexp_replace(t, '\yprofessor\y', 'senior learner', 'g');
  t := regexp_replace(t, '\yPROFESSOR\y', 'SENIOR LEARNER', 'g');
  t := regexp_replace(t, '\yProfessor\y', 'Senior Learner', 'g');
  t := regexp_replace(t, '\yinstructors\y', 'senior learners', 'g');
  t := regexp_replace(t, '\yINSTRUCTORS\y', 'SENIOR LEARNERS', 'g');
  t := regexp_replace(t, '\yInstructors\y', 'Senior Learners', 'g');
  t := regexp_replace(t, '\yinstructor\y', 'senior learner', 'g');
  t := regexp_replace(t, '\yINSTRUCTOR\y', 'SENIOR LEARNER', 'g');
  t := regexp_replace(t, '\yInstructor\y', 'Senior Learner', 'g');
  t := regexp_replace(t, '\ytutors\y', 'senior learners', 'g');
  t := regexp_replace(t, '\yTUTORS\y', 'SENIOR LEARNERS', 'g');
  t := regexp_replace(t, '\yTutors\y', 'Senior Learners', 'g');
  t := regexp_replace(t, '\ytutor\y', 'senior learner', 'g');
  t := regexp_replace(t, '\yTUTOR\y', 'SENIOR LEARNER', 'g');
  t := regexp_replace(t, '\yTutor\y', 'Senior Learner', 'g');
  t := regexp_replace(t, '\yeducators\y', 'senior learners', 'g');
  t := regexp_replace(t, '\yEDUCATORS\y', 'SENIOR LEARNERS', 'g');
  t := regexp_replace(t, '\yEducators\y', 'Senior Learners', 'g');
  t := regexp_replace(t, '\yeducator\y', 'senior learner', 'g');
  t := regexp_replace(t, '\yEDUCATOR\y', 'SENIOR LEARNER', 'g');
  t := regexp_replace(t, '\yEducator\y', 'Senior Learner', 'g');
  t := regexp_replace(t, '\yemployees\y', 'team members', 'g');
  t := regexp_replace(t, '\yEMPLOYEES\y', 'TEAM MEMBERS', 'g');
  t := regexp_replace(t, '\yEmployees\y', 'Team Members', 'g');
  t := regexp_replace(t, '\yemployee\y', 'team member', 'g');
  t := regexp_replace(t, '\yEMPLOYEE\y', 'TEAM MEMBER', 'g');
  t := regexp_replace(t, '\yEmployee\y', 'Team Member', 'g');
  t := regexp_replace(t, '\yworkers\y', 'team members', 'g');
  t := regexp_replace(t, '\yWORKERS\y', 'TEAM MEMBERS', 'g');
  t := regexp_replace(t, '\yWorkers\y', 'Team Members', 'g');
  t := regexp_replace(t, '\ystaff\y', 'team members', 'g');
  t := regexp_replace(t, '\ySTAFF\y', 'TEAM MEMBERS', 'g');
  t := regexp_replace(t, '\yStaff\y', 'Team Members', 'g');
  t := regexp_replace(t, '\yclassrooms\y', 'learning studios', 'g');
  t := regexp_replace(t, '\yCLASSROOMS\y', 'LEARNING STUDIOS', 'g');
  t := regexp_replace(t, '\yClassrooms\y', 'Learning Studios', 'g');
  t := regexp_replace(t, '\yclassroom\y', 'learning studio', 'g');
  t := regexp_replace(t, '\yCLASSROOM\y', 'LEARNING STUDIO', 'g');
  t := regexp_replace(t, '\yClassroom\y', 'Learning Studio', 'g');
  t := regexp_replace(t, '\ylaboratories\y', 'learning labs', 'g');
  t := regexp_replace(t, '\yLABORATORIES\y', 'LEARNING LABS', 'g');
  t := regexp_replace(t, '\yLaboratories\y', 'Learning Labs', 'g');
  t := regexp_replace(t, '\ylaboratory\y', 'learning lab', 'g');
  t := regexp_replace(t, '\yLABORATORY\y', 'LEARNING LAB', 'g');
  t := regexp_replace(t, '\yLaboratory\y', 'Learning Lab', 'g');
  t := regexp_replace(t, '\ylabs\y', 'learning labs', 'g');
  t := regexp_replace(t, '\yLABS\y', 'LEARNING LABS', 'g');
  t := regexp_replace(t, '\yLabs\y', 'Learning Labs', 'g');
  t := regexp_replace(t, '\ylab\y', 'learning lab', 'g');
  t := regexp_replace(t, '\yLAB\y', 'LEARNING LAB', 'g');
  t := regexp_replace(t, '\yLab\y', 'Learning Lab', 'g');
  t := regexp_replace(t, '\ysyllabi\y', 'learning pathways', 'g');
  t := regexp_replace(t, '\ySYLLABI\y', 'LEARNING PATHWAYS', 'g');
  t := regexp_replace(t, '\ySyllabi\y', 'Learning Pathways', 'g');
  t := regexp_replace(t, '\ysyllabus\y', 'learning pathway', 'g');
  t := regexp_replace(t, '\ySYLLABUS\y', 'LEARNING PATHWAY', 'g');
  t := regexp_replace(t, '\ySyllabus\y', 'Learning Pathway', 'g');
  t := regexp_replace(t, '\ycurricula\y', 'learning frameworks', 'g');
  t := regexp_replace(t, '\yCURRICULA\y', 'LEARNING FRAMEWORKS', 'g');
  t := regexp_replace(t, '\yCurricula\y', 'Learning Frameworks', 'g');
  t := regexp_replace(t, '\ycurriculum\y', 'learning framework', 'g');
  t := regexp_replace(t, '\yCURRICULUM\y', 'LEARNING FRAMEWORK', 'g');
  t := regexp_replace(t, '\yCurriculum\y', 'Learning Framework', 'g');
  t := regexp_replace(t, '\yexaminations\y', 'learning assessments', 'g');
  t := regexp_replace(t, '\yEXAMINATIONS\y', 'LEARNING ASSESSMENTS', 'g');
  t := regexp_replace(t, '\yExaminations\y', 'Learning Assessments', 'g');
  t := regexp_replace(t, '\yexamination\y', 'learning assessment', 'g');
  t := regexp_replace(t, '\yEXAMINATION\y', 'LEARNING ASSESSMENT', 'g');
  t := regexp_replace(t, '\yExamination\y', 'Learning Assessment', 'g');
  t := regexp_replace(t, '\yexams\y', 'learning assessments', 'g');
  t := regexp_replace(t, '\yEXAMS\y', 'LEARNING ASSESSMENTS', 'g');
  t := regexp_replace(t, '\yExams\y', 'Learning Assessments', 'g');
  t := regexp_replace(t, '\yexam\y', 'learning assessment', 'g');
  t := regexp_replace(t, '\yEXAM\y', 'LEARNING ASSESSMENT', 'g');
  t := regexp_replace(t, '\yExam\y', 'Learning Assessment', 'g');
  t := regexp_replace(t, '\yhomework\y', 'independent learning activities', 'g');
  t := regexp_replace(t, '\yHOMEWORK\y', 'INDEPENDENT LEARNING ACTIVITIES', 'g');
  t := regexp_replace(t, '\yHomework\y', 'Independent Learning Activities', 'g');
  t := regexp_replace(t, '\yassignments\y', 'learning tasks', 'g');
  t := regexp_replace(t, '\yASSIGNMENTS\y', 'LEARNING TASKS', 'g');
  t := regexp_replace(t, '\yAssignments\y', 'Learning Tasks', 'g');
  t := regexp_replace(t, '\yassignment\y', 'learning task', 'g');
  t := regexp_replace(t, '\yASSIGNMENT\y', 'LEARNING TASK', 'g');
  t := regexp_replace(t, '\yAssignment\y', 'Learning Task', 'g');
  t := regexp_replace(t, '\yquizzes\y', 'quick assessments', 'g');
  t := regexp_replace(t, '\yQUIZZES\y', 'QUICK ASSESSMENTS', 'g');
  t := regexp_replace(t, '\yQuizzes\y', 'Quick Assessments', 'g');
  t := regexp_replace(t, '\yquiz\y', 'quick assessment', 'g');
  t := regexp_replace(t, '\yQUIZ\y', 'QUICK ASSESSMENT', 'g');
  t := regexp_replace(t, '\yQuiz\y', 'Quick Assessment', 'g');
  -- Restore protected proper nouns (canonical Title Case).
  t := replace(t, 'JKKNPROT0ZZ', 'Laboratory Technology');
  t := replace(t, 'JKKNPROT1ZZ', 'Laboratory Technician');
  t := replace(t, 'JKKNPROT2ZZ', 'Clinical Laboratory');
  t := replace(t, 'JKKNPROT3ZZ', 'Medical Laboratory');
  t := replace(t, 'JKKNPROT4ZZ', 'Teachers Education');
  t := replace(t, 'JKKNPROT5ZZ', 'Teacher Education');
  t := replace(t, 'JKKNPROT6ZZ', 'Lab Technology');
  t := replace(t, 'JKKNPROT7ZZ', 'Lab Technician');
  RETURN t;
END;
$func$;

-- Recursive JSONB transform: rewrites STRING VALUES only; keys preserved.
CREATE OR REPLACE FUNCTION jkkn_jsonb_fix(j jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE AS $func$
DECLARE r jsonb; k text; v jsonb; e jsonb;
BEGIN
  IF j IS NULL THEN RETURN j; END IF;
  CASE jsonb_typeof(j)
    WHEN 'object' THEN
      r := '{}'::jsonb;
      FOR k, v IN SELECT key, value FROM jsonb_each(j) LOOP
        r := r || jsonb_build_object(k, jkkn_jsonb_fix(v));
      END LOOP;
      RETURN r;
    WHEN 'array' THEN
      r := '[]'::jsonb;
      FOR e IN SELECT value FROM jsonb_array_elements(j) LOOP
        r := r || jsonb_build_array(jkkn_jsonb_fix(e));
      END LOOP;
      RETURN r;
    WHEN 'string' THEN
      RETURN to_jsonb(jkkn_term_fix(j #>> '{}'));
    ELSE
      RETURN j;
  END CASE;
END;
$func$;

-- ---- BACKUPS (reversibility) ----
-- Restore example: UPDATE cms_page_blocks t SET props = b.props
--   FROM bak_cms_page_blocks_t43 b WHERE t.id = b.id;
DROP TABLE IF EXISTS bak_cms_pages_t43;
CREATE TABLE bak_cms_pages_t43 AS SELECT id, title, description, navigation_label, metadata FROM cms_pages
  WHERE coalesce(title,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(description,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y'
     OR coalesce(navigation_label,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(metadata::text,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y';
DROP TABLE IF EXISTS bak_cms_page_blocks_t43;
CREATE TABLE bak_cms_page_blocks_t43 AS SELECT id, props FROM cms_page_blocks WHERE props::text ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y';
DROP TABLE IF EXISTS bak_cms_seo_metadata_t43;
CREATE TABLE bak_cms_seo_metadata_t43 AS SELECT * FROM cms_seo_metadata
  WHERE coalesce(meta_title,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(meta_description,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y'
     OR coalesce(og_title,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(og_description,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y'
     OR coalesce(twitter_title,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(twitter_description,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y'
     OR coalesce(array_to_string(meta_keywords,' '),'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(structured_data::text,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y';
DROP TABLE IF EXISTS bak_blog_posts_t43;
CREATE TABLE bak_blog_posts_t43 AS SELECT id, title, excerpt, seo_title, seo_description, seo_keywords, content, metadata FROM blog_posts
  WHERE coalesce(title,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(excerpt,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y'
     OR coalesce(seo_title,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(seo_description,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y'
     OR coalesce(array_to_string(seo_keywords,' '),'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(content::text,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y'
     OR coalesce(metadata::text,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y';

-- ---- UPDATES (drive off backup tables so the updated set == the snapshotted set) ----
UPDATE cms_pages SET
  title = jkkn_term_fix(title),
  description = jkkn_term_fix(description),
  navigation_label = jkkn_term_fix(navigation_label),
  metadata = jkkn_jsonb_fix(metadata)
WHERE id IN (SELECT id FROM bak_cms_pages_t43);

UPDATE cms_page_blocks SET props = jkkn_jsonb_fix(props)
WHERE id IN (SELECT id FROM bak_cms_page_blocks_t43);

UPDATE cms_seo_metadata SET
  meta_title = jkkn_term_fix(meta_title),
  meta_description = jkkn_term_fix(meta_description),
  og_title = jkkn_term_fix(og_title),
  og_description = jkkn_term_fix(og_description),
  twitter_title = jkkn_term_fix(twitter_title),
  twitter_description = jkkn_term_fix(twitter_description),
  meta_keywords = (SELECT array_agg(jkkn_term_fix(x)) FROM unnest(meta_keywords) x),
  structured_data = jkkn_jsonb_fix(structured_data)
WHERE id IN (SELECT id FROM bak_cms_seo_metadata_t43);

UPDATE blog_posts SET
  title = jkkn_term_fix(title),
  excerpt = jkkn_term_fix(excerpt),
  seo_title = jkkn_term_fix(seo_title),
  seo_description = jkkn_term_fix(seo_description),
  seo_keywords = (SELECT array_agg(jkkn_term_fix(x)) FROM unnest(seo_keywords) x),
  content = jkkn_jsonb_fix(content),
  metadata = jkkn_jsonb_fix(metadata)
WHERE id IN (SELECT id FROM bak_blog_posts_t43);

DROP FUNCTION IF EXISTS jkkn_jsonb_fix(jsonb);
DROP FUNCTION IF EXISTS jkkn_term_fix(text);

-- End of 43 — JKKN Terminology Compliance Sweep
-- ============================================
