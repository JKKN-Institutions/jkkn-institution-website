-- ================================================================
-- ECE Faculty Development Program Achievements
-- ================================================================
-- Course: Electronics & Communication Engineering (BE-ECE)
-- Institution: JKKN College of Engineering and Technology
-- Category: Faculty Development
-- Total Records: 21 achievements
-- Date Range: June 2023 - October 2023
-- Faculty Involved: 9 unique faculty members
-- ================================================================

-- IMPORTANT IDs (Engineering College Supabase Project)
-- College ID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
-- Faculty Development Category ID: c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b

-- ================================================================
-- STEP 1: CREATE ECE COURSE (if not exists)
-- ================================================================

-- Insert ECE Course
INSERT INTO courses (
  id,
  college_id,
  name,
  code,
  level,
  department,
  description,
  duration_years,
  is_active
) VALUES (
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Electronics & Communication Engineering',
  'BE-ECE',
  'ug',
  'Electronics & Communication Engineering',
  'Bachelor of Engineering program in Electronics & Communication Engineering covering embedded systems, VLSI, wireless communication, and IoT technologies.',
  4,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  updated_at = NOW();

-- ================================================================
-- STEP 2: INSERT FACULTY ACHIEVEMENTS (2023)
-- ================================================================

-- 1. Mrs.N.Ponnarasi - Effective Teaching Learning using Social Media
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Effective Teaching Learning using Social Media',
  'Participated in comprehensive Faculty Development Program focused on leveraging social media platforms for effective teaching and learning. The program covered modern pedagogical approaches, digital engagement strategies, online collaboration tools, and innovative methods to enhance student learning through social media integration in engineering education.',
  'Mrs. N. Ponnarasi',
  'Assistant Professor',
  '2023-06-09',
  2023,
  1,
  true,
  true
);

-- 2. Mrs.K.Mekala - AI Compositing Exploring Creative Possibilities
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'The Artificial Intelligence Compositing: Exploring Creative Possibilities',
  'Attended Faculty Development Program on Artificial Intelligence Compositing organized by Marcello Tech. The program explored cutting-edge AI technologies, machine learning algorithms, neural networks, and creative applications of AI in electronics and communication systems including image processing, signal analysis, and intelligent system design.',
  'Mrs. K. Mekala',
  'Assistant Professor',
  '2023-06-26',
  2023,
  2,
  true,
  true
);

-- 3. Mrs.S.Tamilselvi - AI Compositing Exploring Creative Possibilities
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'The Artificial Intelligence Compositing: Exploring Creative Possibilities',
  'Attended Faculty Development Program on Artificial Intelligence Compositing organized by Marcello Tech. The program explored cutting-edge AI technologies, machine learning algorithms, neural networks, and creative applications of AI in electronics and communication systems including image processing, signal analysis, and intelligent system design.',
  'Mrs. S. Tamilselvi',
  'Assistant Professor',
  '2023-06-26',
  2023,
  3,
  false,
  true
);

-- 4. Mr.S.Rajkumar - AI Compositing Exploring Creative Possibilities
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'The Artificial Intelligence Compositing: Exploring Creative Possibilities',
  'Attended Faculty Development Program on Artificial Intelligence Compositing organized by Marcello Tech. The program explored cutting-edge AI technologies, machine learning algorithms, neural networks, and creative applications of AI in electronics and communication systems including image processing, signal analysis, and intelligent system design.',
  'Mr. S. Rajkumar',
  'Assistant Professor',
  '2023-06-26',
  2023,
  4,
  false,
  true
);

-- 5. Mrs.S.Tamilselvi - Implementation of NEP2020 for University and College Teachers
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Implementation of NEP2020 for University and College Teachers',
  'Participated in comprehensive Faculty Development Program on Implementation of National Education Policy (NEP) 2020 organized by IGNOU. The program provided insights into transformative changes in higher education framework, multidisciplinary education approach, choice-based credit system, outcome-based learning methodologies, and holistic student development strategies.',
  'Mrs. S. Tamilselvi',
  'Assistant Professor',
  '2023-06-20',
  2023,
  5,
  false,
  true
);

-- 6. Mr.S.Rajkumar - Implementation of NEP2020 for University and College Teachers
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Implementation of NEP2020 for University and College Teachers',
  'Participated in comprehensive Faculty Development Program on Implementation of National Education Policy (NEP) 2020 organized by IGNOU. The program provided insights into transformative changes in higher education framework, multidisciplinary education approach, choice-based credit system, outcome-based learning methodologies, and holistic student development strategies.',
  'Mr. S. Rajkumar',
  'Assistant Professor',
  '2023-06-20',
  2023,
  6,
  false,
  true
);

-- 7. Mrs.K.Mekala - Fundamentals of Artificial Intelligence (NPTEL)
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Fundamentals of Artificial Intelligence',
  'Successfully completed online certification course on Fundamentals of Artificial Intelligence conducted by NPTEL (National Programme on Technology Enhanced Learning). The comprehensive program covered AI concepts, machine learning algorithms, neural networks, expert systems, natural language processing, and practical applications in electronics and communication engineering.',
  'Mrs. K. Mekala',
  'Assistant Professor',
  '2023-10-25',
  2023,
  7,
  false,
  true
);

-- 8. Mr.M.Nirmal Prithivraj - Advanced Research Methodology
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Advanced Research Methodology',
  'Participated in Faculty Development Program on Advanced Research Methodology organized by SRM Institute of Technology. The program covered research design, statistical analysis techniques, experimental methodologies, data collection and analysis methods, research ethics, paper writing, and publication strategies for academic research in electronics and communication engineering.',
  'Mr. M. Nirmal Prithivraj',
  'Assistant Professor',
  '2023-07-18',
  2023,
  8,
  false,
  true
);

-- 9. Mr.M.Nirmal Prithivraj - Recent Trends In Multidisciplinary Research
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Recent Trends In Multidisciplinary Research',
  'Attended Faculty Development Program on Recent Trends in Multidisciplinary Research organized by SRM Institute of Technology. The program explored interdisciplinary research approaches, collaborative research methodologies, emerging trends in cross-domain research, and integration of electronics, communication, computer science, and IoT technologies.',
  'Mr. M. Nirmal Prithivraj',
  'Assistant Professor',
  '2023-07-18',
  2023,
  9,
  false,
  true
);

-- 10. Mr.M.Nirmal Prithivraj - VLSI & Design Chip
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'VLSI & Design Chip',
  'Participated in specialized Faculty Development Program on VLSI & Design Chip organized by PSG Institute of Technology & Applied Research. The comprehensive program covered VLSI design methodologies, chip architecture, digital and analog VLSI design, EDA tools (Cadence, Xilinx), ASIC design flow, physical design, verification techniques, and semiconductor fabrication processes.',
  'Mr. M. Nirmal Prithivraj',
  'Assistant Professor',
  '2023-07-29',
  2023,
  10,
  true,
  true
);

-- 11. Mrs.S.Tamilselvi - Fundamentals of Artificial Intelligence (NPTEL)
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Fundamentals of Artificial Intelligence',
  'Successfully completed online certification course on Fundamentals of Artificial Intelligence conducted by NPTEL (National Programme on Technology Enhanced Learning). The comprehensive program covered AI concepts, machine learning algorithms, neural networks, expert systems, natural language processing, and practical applications in electronics and communication engineering.',
  'Mrs. S. Tamilselvi',
  'Assistant Professor',
  '2023-10-25',
  2023,
  11,
  false,
  true
);

-- 12. Mr.S.Rajkumar - Digital Circuits (NPTEL)
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Digital Circuits',
  'Successfully completed online certification course on Digital Circuits conducted by NPTEL. The program covered Boolean algebra, combinational circuits, sequential circuits, logic gates, flip-flops, counters, registers, multiplexers, decoders, digital logic design, timing analysis, and practical implementation using hardware description languages.',
  'Mr. S. Rajkumar',
  'Assistant Professor',
  '2023-10-12',
  2023,
  12,
  false,
  true
);

-- 13. Mr.S.Rajkumar - VLSI to System Design: Silicon to End Application Approach (NPTEL)
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'VLSI to System Design: Silicon to End Application Approach',
  'Completed advanced online certification course on VLSI to System Design conducted by NPTEL. The comprehensive program covered complete VLSI design flow from silicon technology to end applications, system-on-chip design, embedded systems integration, hardware-software co-design, and real-world application development methodologies.',
  'Mr. S. Rajkumar',
  'Assistant Professor',
  '2023-08-04',
  2023,
  13,
  false,
  true
);

-- 14. Mr.S.Rajkumar - VLSI & Design Chip (PSG Institute)
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'VLSI & Design Chip',
  'Participated in specialized Faculty Development Program on VLSI & Design Chip organized by PSG Institute of Technology & Applied Research. The comprehensive program covered VLSI design methodologies, chip architecture, digital and analog VLSI design, EDA tools (Cadence, Xilinx), ASIC design flow, physical design, verification techniques, and semiconductor fabrication processes.',
  'Mr. S. Rajkumar',
  'Assistant Professor',
  '2023-07-29',
  2023,
  14,
  false,
  true
);

-- 15. Ms.K.Tamilazhagi - Flutter App Development with Android Studio
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Flutter App Development with Android Studio',
  'Attended Faculty Development Program on Flutter App Development with Android Studio conducted by Marcello Tech. The program covered Flutter framework fundamentals, Dart programming language, widget development, state management, API integration, Firebase integration, cross-platform mobile app development, and deployment strategies for Android and iOS applications.',
  'Ms. K. Tamilazhagi',
  'Assistant Professor',
  '2023-08-13',
  2023,
  15,
  false,
  true
);

-- 16. Mr.M.Nirmal Prithivraj - The Futuristic View of Semiconductor Devices in Healthcare Applications Using AI ML
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'The Futuristic View of Semiconductor Devices in Healthcare Applications Using AI ML',
  'Participated in ATAL-AICTE sponsored Faculty Development Program on The Futuristic View of Semiconductor Devices in Healthcare Applications Using AI ML organized by Mahendra Engineering College. The program explored cutting-edge semiconductor technologies, biomedical sensors, wearable health devices, AI-powered diagnostics, machine learning algorithms for healthcare, and integration of electronics with medical applications.',
  'Mr. M. Nirmal Prithivraj',
  'Assistant Professor',
  '2023-10-21',
  2023,
  16,
  true,
  true
);

-- 17. Mrs.N.Ponnarasi - Challenges and Opportunity in Electric Vehicle
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Challenges and Opportunity in Electric Vehicle',
  'Attended Faculty Development Program on Challenges and Opportunities in Electric Vehicle organized by K.S.R College of Engineering and Technology. The program covered EV technology fundamentals, battery management systems, power electronics for EV, charging infrastructure, motor control systems, sustainable transportation solutions, government policies, and future trends in electric mobility.',
  'Mrs. N. Ponnarasi',
  'Assistant Professor',
  '2023-10-14',
  2023,
  17,
  false,
  true
);

-- 18. Mrs.K.Mekala - Challenges and Opportunity in Electrical Vehicle
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Challenges and Opportunity in Electrical Vehicle',
  'Attended Faculty Development Program on Challenges and Opportunities in Electric Vehicle organized by K.S.R College of Engineering and Technology. The program covered EV technology fundamentals, battery management systems, power electronics for EV, charging infrastructure, motor control systems, sustainable transportation solutions, government policies, and future trends in electric mobility.',
  'Mrs. K. Mekala',
  'Assistant Professor',
  '2023-10-14',
  2023,
  18,
  false,
  true
);

-- 19. Mrs.S.Tamilselvi - Challenges and Opportunity in Electrical Vehicle
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Challenges and Opportunity in Electrical Vehicle',
  'Attended Faculty Development Program on Challenges and Opportunities in Electric Vehicle organized by K.S.R College of Engineering and Technology. The program covered EV technology fundamentals, battery management systems, power electronics for EV, charging infrastructure, motor control systems, sustainable transportation solutions, government policies, and future trends in electric mobility.',
  'Mrs. S. Tamilselvi',
  'Assistant Professor',
  '2023-10-14',
  2023,
  19,
  false,
  true
);

-- 20. Mr.K.Arun Kumar - Semiconductor Devices in Healthcare Applications Using AI ML
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'The Futuristic View of Semiconductor Devices in Healthcare Applications Using AI ML',
  'Participated in ATAL-AICTE sponsored Faculty Development Program on The Futuristic View of Semiconductor Devices in Healthcare Applications Using AI ML organized by Mahendra Engineering College. The program explored cutting-edge semiconductor technologies, biomedical sensors, wearable health devices, AI-powered diagnostics, machine learning algorithms for healthcare, and integration of electronics with medical applications.',
  'Mr. K. Arun Kumar',
  'Assistant Professor',
  '2023-10-21',
  2023,
  20,
  false,
  true
);

-- 21. Mr.S.Rajkumar - Semiconductor Devices in Healthcare Applications Using AI ML
INSERT INTO faculty_achievements (
  college_id,
  course_id,
  category_id,
  title,
  description,
  faculty_name,
  faculty_designation,
  achievement_date,
  achievement_year,
  display_order,
  is_featured,
  is_active
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'e1f2bc33-4d56-4e78-9f1a-2b3c4d5e6f7a',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'The Futuristic View of Semiconductor Devices in Healthcare Applications Using AI ML',
  'Participated in ATAL-AICTE sponsored Faculty Development Program on The Futuristic View of Semiconductor Devices in Healthcare Applications Using AI ML organized by Mahendra Engineering College. The program explored cutting-edge semiconductor technologies, biomedical sensors, wearable health devices, AI-powered diagnostics, machine learning algorithms for healthcare, and integration of electronics with medical applications.',
  'Mr. S. Rajkumar',
  'Assistant Professor',
  '2023-10-21',
  2023,
  21,
  false,
  true
);

-- ================================================================
-- END OF ECE FACULTY ACHIEVEMENTS
-- ================================================================
-- Summary:
-- - Total Achievements: 21
-- - Academic Year: 2023 (June - October)
-- - Featured Achievements: 4 (Social Media Teaching, AI Compositing (2), VLSI Chip, Healthcare AI ML)
-- - Faculty Members: 9 unique members
-- - Key Focus Areas:
--   * Artificial Intelligence & Machine Learning (5 achievements)
--   * VLSI Design & Chip Technology (5 achievements)
--   * Electric Vehicle Technology (3 achievements)
--   * Research Methodology (2 achievements)
--   * NEP 2020 Implementation (2 achievements)
--   * Healthcare Applications (3 achievements)
--   * Digital Circuits (1 achievement)
-- ================================================================
