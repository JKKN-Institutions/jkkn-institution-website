-- ============================================
-- 44 — JKKN Terminology Sweep (Main: footer + remaining content tables)
-- ============================================
-- Purpose: Apply learner-centered terminology to content tables not covered earlier.
-- Created: 2026-06-30
-- Method: reuse jkkn_term_fix / jkkn_jsonb_fix (value-only JSONB, case-preserving,
--   proper-noun protected, URL/slug guarded). Object keys, URLs, designations and
--   structured title fields preserved. Helper functions dropped at end.
-- faculty: only bio prose (professional_summary, mentoring_description, faqs) — designation,
--   awards, memberships, degree lists deliberately preserved.
-- site_settings: footer_* keys only (never config/role settings).
-- ============================================

CREATE OR REPLACE FUNCTION jkkn_term_fix(t text) RETURNS text LANGUAGE plpgsql IMMUTABLE AS $func$
BEGIN
  IF t IS NULL THEN RETURN NULL; END IF;
  IF t ~ '^(https?://|mailto:|tel:|/|\./|#)' THEN RETURN t; END IF;
  IF t !~ '\s' AND t ~ '[/_:.@-]' THEN RETURN t; END IF;
  t := regexp_replace(t, '\ymatriculation board curriculum\y', 'JKKNPROT0ZZ', 'gi');
  t := regexp_replace(t, '\ycontroller of examinations\y', 'JKKNPROT1ZZ', 'gi');
  t := regexp_replace(t, '\yanna university curriculum\y', 'JKKNPROT2ZZ', 'gi');
  t := regexp_replace(t, '\ycontroller of examination\y', 'JKKNPROT3ZZ', 'gi');
  t := regexp_replace(t, '\ymatriculation curriculum\y', 'JKKNPROT4ZZ', 'gi');
  t := regexp_replace(t, '\ymatriculation curricula\y', 'JKKNPROT5ZZ', 'gi');
  t := regexp_replace(t, '\ystate board curriculum\y', 'JKKNPROT6ZZ', 'gi');
  t := regexp_replace(t, '\ylaboratory technology\y', 'JKKNPROT7ZZ', 'gi');
  t := regexp_replace(t, '\ylaboratory technician\y', 'JKKNPROT8ZZ', 'gi');
  t := regexp_replace(t, '\yclinical laboratory\y', 'JKKNPROT9ZZ', 'gi');
  t := regexp_replace(t, '\yteachers education\y', 'JKKNPROT10ZZ', 'gi');
  t := regexp_replace(t, '\ymedical laboratory\y', 'JKKNPROT11ZZ', 'gi');
  t := regexp_replace(t, '\yteacher education\y', 'JKKNPROT12ZZ', 'gi');
  t := regexp_replace(t, '\yteacher training\y', 'JKKNPROT13ZZ', 'gi');
  t := regexp_replace(t, '\ycbse curriculum\y', 'JKKNPROT14ZZ', 'gi');
  t := regexp_replace(t, '\ylab technology\y', 'JKKNPROT15ZZ', 'gi');
  t := regexp_replace(t, '\ylab technician\y', 'JKKNPROT16ZZ', 'gi');
  t := regexp_replace(t, '\ycbse curricula\y', 'JKKNPROT17ZZ', 'gi');
  t := regexp_replace(t, '\yparent-teacher\y', 'JKKNPROT18ZZ', 'gi');
  t := regexp_replace(t, '\yparent teacher\y', 'JKKNPROT19ZZ', 'gi');
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
  t := replace(t, 'JKKNPROT0ZZ', 'Matriculation Board Curriculum');
  t := replace(t, 'JKKNPROT1ZZ', 'Controller Of Examinations');
  t := replace(t, 'JKKNPROT2ZZ', 'Anna University Curriculum');
  t := replace(t, 'JKKNPROT3ZZ', 'Controller Of Examination');
  t := replace(t, 'JKKNPROT4ZZ', 'Matriculation Curriculum');
  t := replace(t, 'JKKNPROT5ZZ', 'Matriculation Curricula');
  t := replace(t, 'JKKNPROT6ZZ', 'State Board Curriculum');
  t := replace(t, 'JKKNPROT7ZZ', 'Laboratory Technology');
  t := replace(t, 'JKKNPROT8ZZ', 'Laboratory Technician');
  t := replace(t, 'JKKNPROT9ZZ', 'Clinical Laboratory');
  t := replace(t, 'JKKNPROT10ZZ', 'Teachers Education');
  t := replace(t, 'JKKNPROT11ZZ', 'Medical Laboratory');
  t := replace(t, 'JKKNPROT12ZZ', 'Teacher Education');
  t := replace(t, 'JKKNPROT13ZZ', 'Teacher Training');
  t := replace(t, 'JKKNPROT14ZZ', 'Cbse Curriculum');
  t := replace(t, 'JKKNPROT15ZZ', 'Lab Technology');
  t := replace(t, 'JKKNPROT16ZZ', 'Lab Technician');
  t := replace(t, 'JKKNPROT17ZZ', 'Cbse Curricula');
  t := replace(t, 'JKKNPROT18ZZ', 'Parent-Teacher');
  t := replace(t, 'JKKNPROT19ZZ', 'Parent Teacher');
  RETURN t;
END;
$func$;
CREATE OR REPLACE FUNCTION jkkn_jsonb_fix(j jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE AS $func$
DECLARE r jsonb; k text; v jsonb; e jsonb;
BEGIN
  IF j IS NULL THEN RETURN j; END IF;
  CASE jsonb_typeof(j)
    WHEN 'object' THEN r := '{}'::jsonb;
      FOR k, v IN SELECT key, value FROM jsonb_each(j) LOOP r := r || jsonb_build_object(k, jkkn_jsonb_fix(v)); END LOOP;
      RETURN r;
    WHEN 'array' THEN r := '[]'::jsonb;
      FOR e IN SELECT value FROM jsonb_array_elements(j) LOOP r := r || jsonb_build_array(jkkn_jsonb_fix(e)); END LOOP;
      RETURN r;
    WHEN 'string' THEN RETURN to_jsonb(jkkn_term_fix(j #>> '{}'));
    ELSE RETURN j;
  END CASE;
END;
$func$;

-- site_settings  (filter: setting_key LIKE 'footer%')
DROP TABLE IF EXISTS bak_site_settings_t44;
CREATE TABLE bak_site_settings_t44 AS SELECT id, setting_value FROM site_settings WHERE ((coalesce(setting_value::text,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y')) AND (setting_key LIKE 'footer%');
UPDATE site_settings SET
  setting_value = jkkn_jsonb_fix(setting_value)
WHERE id IN (SELECT id FROM bak_site_settings_t44);

-- blog_categories
DROP TABLE IF EXISTS bak_blog_categories_t44;
CREATE TABLE bak_blog_categories_t44 AS SELECT id, name, description FROM blog_categories WHERE (coalesce(name,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(description,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y');
UPDATE blog_categories SET
  name = jkkn_term_fix(name),
  description = jkkn_term_fix(description)
WHERE id IN (SELECT id FROM bak_blog_categories_t44);

-- education_videos
DROP TABLE IF EXISTS bak_education_videos_t44;
CREATE TABLE bak_education_videos_t44 AS SELECT id, title, description FROM education_videos WHERE (coalesce(title,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(description,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y');
UPDATE education_videos SET
  title = jkkn_term_fix(title),
  description = jkkn_term_fix(description)
WHERE id IN (SELECT id FROM bak_education_videos_t44);

-- colleges
DROP TABLE IF EXISTS bak_colleges_t44;
CREATE TABLE bak_colleges_t44 AS SELECT id, name, description FROM colleges WHERE (coalesce(name,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y' OR coalesce(description,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y');
UPDATE colleges SET
  name = jkkn_term_fix(name),
  description = jkkn_term_fix(description)
WHERE id IN (SELECT id FROM bak_colleges_t44);

-- courses
DROP TABLE IF EXISTS bak_courses_t44;
CREATE TABLE bak_courses_t44 AS SELECT id, name FROM courses WHERE (coalesce(name,'') ~* '\y(student|students|pupils?|trainees?|faculty|teachers?|professors?|instructors?|tutors?|educators?|staff|employees?|workers?|classrooms?|laborator|labs?|syllab|curricul|examination|exams?|homework|assignments?|quiz|quizzes|lecture hall|study (hall|room))\y');
UPDATE courses SET
  name = jkkn_term_fix(name)
WHERE id IN (SELECT id FROM bak_courses_t44);

DROP FUNCTION IF EXISTS jkkn_jsonb_fix(jsonb);
DROP FUNCTION IF EXISTS jkkn_term_fix(text);
