-- ============================================================================
-- Faculty Development Program Achievements for Engineering College (CSE)
-- ============================================================================
-- Purpose: Insert faculty achievements for FDP participation
-- Created: 2024-02-04
-- Course: Computer Science and Engineering (BE-CSE)
-- Category: Faculty Development
-- ============================================================================

-- IDs for reference:
-- College ID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
-- Course ID: b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22 (CSE)
-- Category ID: c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b (Faculty Development)

-- ============================================================================
-- Faculty Development Program 2023-24
-- ============================================================================

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
) VALUES
-- 1. Mr.G.M.Sathyaseelan - AI/ML
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning, covering modern AI/ML concepts, algorithms, and practical applications.',
  'Mr. G.M. Sathyaseelan',
  'Assistant Professor',
  '2024-01-08',
  2024,
  1,
  false,
  true
),
-- 2. Mr.G.M.Sathyaseelan - Flutter
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Mobile App Development with Flutter and Dart',
  'Completed Faculty Development Program on Mobile App Development using Flutter framework and Dart programming language.',
  'Mr. G.M. Sathyaseelan',
  'Assistant Professor',
  '2023-10-23',
  2023,
  2,
  false,
  true
),
-- 3. Mrs.G.Porkodi - AI/ML
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning, covering modern AI/ML concepts, algorithms, and practical applications.',
  'Mrs. G. Porkodi',
  'Assistant Professor',
  '2024-01-08',
  2024,
  3,
  false,
  true
),
-- 4. Mrs.G.Porkodi - Flutter
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Mobile App Development with Flutter and Dart',
  'Completed Faculty Development Program on Mobile App Development using Flutter framework and Dart programming language.',
  'Mrs. G. Porkodi',
  'Assistant Professor',
  '2023-10-23',
  2023,
  4,
  false,
  true
),
-- 5. Mrs.G.Porkodi - Digital Marketing
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Digital Marketing',
  'Participated in Faculty Development Program on Digital Marketing strategies, tools, and best practices.',
  'Mrs. G. Porkodi',
  'Assistant Professor',
  '2023-02-13',
  2023,
  5,
  false,
  true
),
-- 6. Mrs.M.Santhiya - AI/ML
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning, covering modern AI/ML concepts, algorithms, and practical applications.',
  'Mrs. M. Santhiya',
  'Assistant Professor',
  '2024-01-08',
  2024,
  6,
  false,
  true
),
-- 7. Mrs.M.Santhiya - Flutter
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Mobile App Development with Flutter and Dart',
  'Completed Faculty Development Program on Mobile App Development using Flutter framework and Dart programming language.',
  'Mrs. M. Santhiya',
  'Assistant Professor',
  '2023-10-23',
  2023,
  7,
  false,
  true
),
-- 8. Mrs.M.Santhiya - Oracle
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Oracle Database Management',
  'Participated in Faculty Development Program on Oracle database management, SQL, and database administration.',
  'Mrs. M. Santhiya',
  'Assistant Professor',
  '2024-03-11',
  2024,
  8,
  false,
  true
),
-- 9. Mrs.R.Karthika - AI/ML
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning, covering modern AI/ML concepts, algorithms, and practical applications.',
  'Mrs. R. Karthika',
  'Assistant Professor',
  '2024-01-08',
  2024,
  9,
  false,
  true
),
-- 10. Mrs.R.Karthika - Flutter
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Mobile App Development with Flutter and Dart',
  'Completed Faculty Development Program on Mobile App Development using Flutter framework and Dart programming language.',
  'Mrs. R. Karthika',
  'Assistant Professor',
  '2023-10-23',
  2023,
  10,
  false,
  true
),
-- 11. Mrs.S.Murgashankar - Data Science
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Data Science',
  'Participated in Faculty Development Program on Data Science, covering data analytics, visualization, and machine learning techniques.',
  'Mrs. S. Murgashankar',
  'Assistant Professor',
  '2024-02-22',
  2024,
  11,
  false,
  true
),

-- ============================================================================
-- Faculty Development Program 2022-23
-- ============================================================================

-- 12. Mr.G.M.Sathyaseelan - OBE
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Outcome Based Education',
  'Participated in Faculty Development Program on Outcome Based Education methodology and implementation.',
  'Mr. G.M. Sathyaseelan',
  'Assistant Professor',
  '2023-02-01',
  2023,
  12,
  false,
  true
),
-- 13. Mr.G.M.Sathyaseelan - AI/ML (2022-23)
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning concepts and applications.',
  'Mr. G.M. Sathyaseelan',
  'Assistant Professor',
  '2023-02-20',
  2023,
  13,
  false,
  true
),
-- 14. Mr.G.M.Sathyaseelan - IPR
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'IPR Awareness/Training Program',
  'Attended IPR (Intellectual Property Rights) Awareness and Training Program.',
  'Mr. G.M. Sathyaseelan',
  'Assistant Professor',
  '2022-12-09',
  2022,
  14,
  false,
  true
),
-- 15. Mrs.G.Porkodi - OBE
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Outcome Based Education',
  'Participated in Faculty Development Program on Outcome Based Education methodology and implementation.',
  'Mrs. G. Porkodi',
  'Assistant Professor',
  '2023-02-01',
  2023,
  15,
  false,
  true
),
-- 16. Mrs.G.Porkodi - AI/ML (2022-23)
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning concepts and applications.',
  'Mrs. G. Porkodi',
  'Assistant Professor',
  '2023-02-20',
  2023,
  16,
  false,
  true
),
-- 17. Mrs.G.Porkodi - IPR
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'IPR Awareness/Training Program',
  'Attended IPR (Intellectual Property Rights) Awareness and Training Program.',
  'Mrs. G. Porkodi',
  'Assistant Professor',
  '2022-12-09',
  2022,
  17,
  false,
  true
),
-- 18. Mrs.J.Dhivya - OBE
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Outcome Based Education',
  'Participated in Faculty Development Program on Outcome Based Education methodology and implementation.',
  'Mrs. J. Dhivya',
  'Assistant Professor',
  '2023-02-01',
  2023,
  18,
  false,
  true
),
-- 19. Mrs.J.Dhivya - AI/ML (2022-23)
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning concepts and applications.',
  'Mrs. J. Dhivya',
  'Assistant Professor',
  '2023-02-20',
  2023,
  19,
  false,
  true
),
-- 20. Mrs.J.Dhivya - IPR
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'IPR Awareness/Training Program',
  'Attended IPR (Intellectual Property Rights) Awareness and Training Program.',
  'Mrs. J. Dhivya',
  'Assistant Professor',
  '2022-12-09',
  2022,
  20,
  false,
  true
),
-- 21. Mrs.R.Karthika - OBE
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Outcome Based Education',
  'Participated in Faculty Development Program on Outcome Based Education methodology and implementation.',
  'Mrs. R. Karthika',
  'Assistant Professor',
  '2023-02-01',
  2023,
  21,
  false,
  true
),
-- 22. Mrs.R.Karthika - AI/ML (2022-23)
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning concepts and applications.',
  'Mrs. R. Karthika',
  'Assistant Professor',
  '2023-02-20',
  2023,
  22,
  false,
  true
),
-- 23. Mrs.R.Karthika - IPR
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'IPR Awareness/Training Program',
  'Attended IPR (Intellectual Property Rights) Awareness and Training Program.',
  'Mrs. R. Karthika',
  'Assistant Professor',
  '2022-12-09',
  2022,
  23,
  false,
  true
),
-- 24. Mr.S.Murgashankar - OBE
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Outcome Based Education',
  'Participated in Faculty Development Program on Outcome Based Education methodology and implementation.',
  'Mr. S. Murgashankar',
  'Assistant Professor',
  '2023-02-01',
  2023,
  24,
  false,
  true
),
-- 25. Mr.S.Murgashankar - AI/ML (2022-23)
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Artificial Intelligence and Machine Learning',
  'Participated in a comprehensive Faculty Development Program on Artificial Intelligence and Machine Learning concepts and applications.',
  'Mr. S. Murgashankar',
  'Assistant Professor',
  '2023-02-20',
  2023,
  25,
  false,
  true
),
-- 26. Mr.S.Murgashankar - IPR
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'IPR Awareness/Training Program',
  'Attended IPR (Intellectual Property Rights) Awareness and Training Program.',
  'Mr. S. Murgashankar',
  'Assistant Professor',
  '2022-12-09',
  2022,
  26,
  false,
  true
),

-- ============================================================================
-- Faculty Development Program 2018-19 (Actually contains 2023 dates)
-- ============================================================================

-- 27. Dr. Rajendiran K M - Energy Literacy
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Energy Literacy Training',
  'Participated in Energy Literacy Training program focusing on sustainable energy practices and awareness.',
  'Dr. Rajendiran K M',
  'Professor',
  '2023-05-30',
  2023,
  27,
  false,
  true
),
-- 28. Dr. Latha N - Energy Literacy
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Energy Literacy Training',
  'Participated in Energy Literacy Training program focusing on sustainable energy practices and awareness.',
  'Dr. Latha N',
  'Associate Professor',
  '2023-05-30',
  2023,
  28,
  false,
  true
),
-- 29. Mrs. Baby M - OBE Curriculum
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'OBE Based Curriculum and Accreditation Course',
  'Completed comprehensive course on Outcome Based Education curriculum design and accreditation processes.',
  'Mrs. Baby M',
  'Assistant Professor',
  '2023-07-03',
  2023,
  29,
  false,
  true
),
-- 30. Dr. Suganya D - OBE Curriculum
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'OBE Based Curriculum and Accreditation',
  'Completed comprehensive course on Outcome Based Education curriculum design and accreditation processes.',
  'Dr. Suganya D',
  'Assistant Professor',
  '2023-07-03',
  2023,
  30,
  false,
  true
),
-- 31. Dr. Sasikala A D - IPR Startups
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'IPR and IP Management for Startups',
  'Attended program on Intellectual Property Rights and IP Management specifically for startup ecosystems.',
  'Dr. Sasikala A D',
  'Associate Professor',
  '2023-09-07',
  2023,
  31,
  false,
  true
),
-- 32. Mrs. Ramya B - IPR Startups
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'IPR and IP Management for Startups',
  'Attended program on Intellectual Property Rights and IP Management specifically for startup ecosystems.',
  'Mrs. Ramya B',
  'Assistant Professor',
  '2023-09-07',
  2023,
  32,
  false,
  true
),
-- 33. Mrs. Swathi Priya K S - IPR Startups
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'IPR and IP Management for Startups',
  'Attended program on Intellectual Property Rights and IP Management specifically for startup ecosystems.',
  'Mrs. Swathi Priya K S',
  'Assistant Professor',
  '2023-09-07',
  2023,
  33,
  false,
  true
),
-- 34. Dr. Punitha R - Nanoscience
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Current Innovations & Future Perspectives in Nanoscience and Technology',
  'Participated in FDP covering cutting-edge innovations and future research directions in nanoscience and nanotechnology.',
  'Dr. Punitha R',
  'Associate Professor',
  '2023-10-05',
  2023,
  34,
  false,
  true
),
-- 35. Mrs. Narmadha S - Biomaterials
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Biomaterials Online Conclave 2023',
  'Attended online conclave on biomaterials research, applications, and future trends.',
  'Mrs. Narmadha S',
  'Assistant Professor',
  '2023-11-07',
  2023,
  35,
  false,
  true
),
-- 36. Mrs. Panjami D - Biomaterials
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Biomaterials Online Conclave 2023',
  'Attended online conclave on biomaterials research, applications, and future trends.',
  'Mrs. Panjami D',
  'Assistant Professor',
  '2023-11-07',
  2023,
  36,
  false,
  true
),
-- 37. Dr. Rajendiran K M - Engineering Physics
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'PH3151 Engineering Physics - Six Days Online FDP',
  'Completed six-day online Faculty Development Program on Engineering Physics (PH3151) curriculum and pedagogy.',
  'Dr. Rajendiran K M',
  'Professor',
  '2023-12-11',
  2023,
  37,
  false,
  true
),
-- 38. Dr. Rajendiran K M - Instructional Design
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Instructional Design and Delivery Systems (NITTTR)',
  'Participated in program on Instructional Design and Delivery Systems in association with NITTTR.',
  'Dr. Rajendiran K M',
  'Professor',
  '2023-12-26',
  2023,
  38,
  false,
  true
),
-- 39. Mrs. Manjula Devi D - Instructional Design
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Instructional Design and Delivery Systems (NITTTR)',
  'Participated in program on Instructional Design and Delivery Systems in association with NITTTR.',
  'Mrs. Manjula Devi D',
  'Assistant Professor',
  '2023-12-26',
  2023,
  39,
  false,
  true
),
-- 40. Mrs. Janaranjana Sri S - Instructional Design
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Instructional Design and Delivery Systems (NITTTR)',
  'Participated in program on Instructional Design and Delivery Systems in association with NITTTR.',
  'Mrs. Janaranjana Sri S',
  'Assistant Professor',
  '2023-12-26',
  2023,
  40,
  false,
  true
),
-- 41. Mrs. Bharathi Priya M - Instructional Design
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b',
  'Instructional Design and Delivery Systems (NITTTR)',
  'Participated in program on Instructional Design and Delivery Systems in association with NITTTR.',
  'Mrs. Bharathi Priya M',
  'Assistant Professor',
  '2023-12-26',
  2023,
  41,
  false,
  true
);

-- ============================================================================
-- End of Faculty Development Program Achievements
-- ============================================================================
