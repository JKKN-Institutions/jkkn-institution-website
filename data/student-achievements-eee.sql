-- ================================================================
-- EEE Student Achievements
-- ================================================================
-- Course: Electrical and Electronics Engineering (BE-EEE)
-- Institution: JKKN College of Engineering and Technology
-- Categories: Competition, Conference
-- Total Records: 4 student team achievements
-- Date Range: Nov 2023 - Mar 2024
-- ================================================================

-- IMPORTANT IDs (Engineering College Supabase Project)
-- College ID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
-- EEE Course ID: 114116da-76df-45e3-97fb-8f10c4f24ef0
-- Competition Category ID: 726900ef-5d55-4ff7-8f74-803f8cf41fdf
-- Conference Category ID: 057249fa-7b9e-44c8-89e4-c4727cd51aac

-- ================================================================
-- EXTERNAL EVENT PARTICIPATIONS (2023-24)
-- ================================================================

-- 1. National Electric Bike Challenge (NEBC) - Competition (Mar 2024)
INSERT INTO student_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  student_name,
  student_roll_number,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '114116da-76df-45e3-97fb-8f10c4f24ef0',
  '726900ef-5d55-4ff7-8f74-803f8cf41fdf',
  'National Electric Bike Challenge (NEBC) at Kumaraguru College, Coimbatore',
  'Second year EEE students participated in the prestigious National Electric Bike Challenge (NEBC) held at Kumaraguru College of Engineering and Technology, Coimbatore. The two-day competition focused on designing, building, and testing electric bikes with emphasis on energy efficiency, performance optimization, and sustainable transportation solutions. The team showcased their technical skills in electric vehicle design, battery management systems, and motor control technologies.

**Team Members:** S. Ranjani, S. Kalaiselvan, S. Lavanya, M.S. Monika, P. Ganapathy

**Event Duration:** March 16-17, 2024
**Year of Study:** Second Year',
  'S. Ranjani, S. Kalaiselvan, S. Lavanya, M.S. Monika, P. Ganapathy',
  NULL,
  '2024-03-17',
  2024,
  1,
  true,
  true
);

-- 2. Two Days Hands-on Training in "Electric Vehicles" at JKKN (Mar 2024)
INSERT INTO student_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  student_name,
  student_roll_number,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '114116da-76df-45e3-97fb-8f10c4f24ef0',
  '057249fa-7b9e-44c8-89e4-c4727cd51aac',
  'Two Days Hands-on Training in Electric Vehicles at JKKN College',
  'Second year EEE students participated in an intensive two-day hands-on training program on Electric Vehicles organized by the Department of EEE & Mechanical Engineering at JKKN College of Engineering and Technology, Kumarapalayam. The training program was conducted by Er. M. Praveen Kumar, Professional Trainer from Yamaha Training School, covering practical aspects of EV design, assembly, testing, and maintenance. Students gained valuable hands-on experience in working with electric vehicle components, battery systems, motor drives, and charging infrastructure.

**Team Members:** S. Ranjani, S. Kalaiselvan, S. Lavanya, M.S. Monika, P. Ganapathy

**Resource Person:** Er. M. Praveen Kumar, Professional Trainer, Yamaha Training School
**Event Duration:** March 13-14, 2024
**Year of Study:** Second Year',
  'S. Ranjani, S. Kalaiselvan, S. Lavanya, M.S. Monika, P. Ganapathy',
  NULL,
  '2024-03-14',
  2024,
  2,
  true,
  true
);

-- 3. Seminar on Emerging Trends in Industrial Automation (Feb 2024)
INSERT INTO student_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  student_name,
  student_roll_number,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '114116da-76df-45e3-97fb-8f10c4f24ef0',
  '057249fa-7b9e-44c8-89e4-c4727cd51aac',
  'Seminar on Emerging Trends in Industrial Automation at Excel Engineering College',
  'Third year EEE students participated in a seminar on Emerging Trends in Industrial Automation held at Excel Engineering College, Kumarapalayam. The seminar covered cutting-edge topics in Industry 4.0, including IoT in manufacturing, smart sensors, PLC programming, SCADA systems, robotics integration, and AI-driven automation solutions. Students gained insights into the latest technological advancements transforming modern industrial processes and manufacturing systems.

**Team Members:** N. Narmatha, R. Mohan, P. Sabarigirisanan

**Event Date:** February 29, 2024
**Year of Study:** Third Year',
  'N. Narmatha, R. Mohan, P. Sabarigirisanan',
  NULL,
  '2024-02-29',
  2024,
  3,
  false,
  true
);

-- 4. Auto EV INDIA EXPO - Automotive & EV Technology Exhibition, Bangalore (Nov 2023)
INSERT INTO student_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  student_name,
  student_roll_number,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '114116da-76df-45e3-97fb-8f10c4f24ef0',
  '057249fa-7b9e-44c8-89e4-c4727cd51aac',
  'Auto EV INDIA EXPO - Automotive & EV Technology Exhibition, Bangalore',
  'Third and Final year EEE students participated in the Auto EV INDIA EXPO, a premier exhibition showcasing the latest innovations in Automotive and Electric Vehicle Technology held in Bangalore. The expo featured cutting-edge electric vehicles, battery technologies, charging solutions, autonomous driving systems, and sustainable mobility innovations from leading manufacturers and startups. Students gained exposure to industry trends, networking opportunities with EV professionals, and hands-on experience with next-generation automotive technologies.

**Team Members:** R. Mohan, P. Sabarigirisan, A. Dhanasekar, A. Suresh, T. Gokulraj

**Event Date:** November 4, 2023
**Year of Study:** Third and Final Year',
  'R. Mohan, P. Sabarigirisan, A. Dhanasekar, A. Suresh, T. Gokulraj',
  NULL,
  '2023-11-04',
  2023,
  4,
  false,
  true
);

-- ================================================================
-- END OF EEE STUDENT ACHIEVEMENTS
-- ================================================================
-- Summary:
-- - Total Achievements: 4 team participations
-- - 2024: 3 achievements (2 featured)
-- - 2023: 1 achievement
-- - Categories: Competition (1), Conference (3)
-- - Total Students Involved: 13 unique students
-- - Focus Areas: Electric Vehicles, Industrial Automation,
--                EV Technology Expo, Competitions
-- ================================================================

-- ================================================================
-- DEPARTMENT-ORGANIZED EVENTS (For Reference)
-- ================================================================
-- The following events were organized by the Department of EEE.
-- These are listed here for reference but are NOT included in the
-- student achievements table as specific student participation
-- details were not provided.
--
-- 1. One-day Hands-on Training: "Synergy of E-vehicle and Automation"
--    Date: October 19, 2023
--    Chief Guest: Mr. Parthiban, Caliber Pvt Ltd
--
-- 2. Two-day Hands-on Training: "Electric Vehicles"
--    Date: March 13-14, 2024
--    Chief Guest: Er. M. Praveen Kumar, Professional Trainer, Yamaha Training School
--    (NOTE: This matches achievement #2 above where students participated)
--
-- 3. One-day Hands-on Training: "EV Design"
--    Date: March 5, 2024
--    Chief Guest: Mr. K. Aruljothi, JKKNCET
--
-- 4. "International Day of Happiness" Celebration
--    Date: March 20, 2024
--    Chief Guest: Mr. T. Praveen, JKKN
--
-- 5. One-day Hands-on Training: "Digital Dynamo - ICT Tools"
--    Date: March 26, 2024
--    Chief Guest: Mr. B. Dhananjeiyan, JKKNCET
--
-- If you want to add these department events as achievements with
-- general student participation, please provide the list of students
-- who participated in each event.
-- ================================================================
