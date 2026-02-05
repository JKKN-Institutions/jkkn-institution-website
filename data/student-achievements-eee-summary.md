# EEE Student Achievements - Summary

## Overview

This document summarizes the EEE (Electrical and Electronics Engineering) student achievements added to the Engineering College database.

## Key Statistics

- **Total Team Achievements**: 4
- **Academic Years**: 2023-24 (3), 2023 (1)
- **Date Range**: November 2023 - March 2024
- **Featured Achievements**: 2
- **Total Students Involved**: 13 unique students
- **Categories**: Competition (1), Conference (3)

## Student Achievements by Event

### 1. National Electric Bike Challenge (NEBC) ⭐ Featured

- **Event**: National Electric Bike Challenge (NEBC)
- **Location**: Kumaraguru College of Engineering and Technology, Coimbatore
- **Date**: March 16-17, 2024
- **Category**: Competition
- **Year of Study**: Second Year
- **Students**:
  1. S. Ranjani
  2. S. Kalaiselvan
  3. S. Lavanya
  4. M.S. Monika
  5. P. Ganapathy

**Description**: Team participated in a two-day national-level competition focusing on electric bike design, battery management systems, and sustainable transportation solutions.

---

### 2. Two Days Hands-on Training in Electric Vehicles ⭐ Featured

- **Event**: Hands-on Training in Electric Vehicles
- **Location**: JKKN College of Engineering and Technology, Kumarapalayam
- **Date**: March 13-14, 2024
- **Category**: Conference/Training
- **Year of Study**: Second Year
- **Resource Person**: Er. M. Praveen Kumar, Professional Trainer, Yamaha Training School
- **Students**:
  1. S. Ranjani
  2. S. Kalaiselvan
  3. S. Lavanya
  4. M.S. Monika
  5. P. Ganapathy

**Description**: Intensive two-day training covering practical EV design, assembly, testing, and maintenance with hands-on experience in electric vehicle components.

---

### 3. Seminar on Emerging Trends in Industrial Automation

- **Event**: Seminar on Emerging Trends in Industrial Automation
- **Location**: Excel Engineering College, Kumarapalayam
- **Date**: February 29, 2024
- **Category**: Conference/Seminar
- **Year of Study**: Third Year
- **Students**:
  1. N. Narmatha
  2. R. Mohan
  3. P. Sabarigirisanan

**Description**: Seminar covering Industry 4.0, IoT in manufacturing, smart sensors, PLC programming, SCADA systems, robotics, and AI-driven automation.

---

### 4. Auto EV INDIA EXPO - Bangalore

- **Event**: Auto EV INDIA EXPO - Automotive & EV Technology Exhibition
- **Location**: Bangalore
- **Date**: November 4, 2023
- **Category**: Conference/Exhibition
- **Year of Study**: Third and Final Year
- **Students**:
  1. R. Mohan
  2. P. Sabarigirisan
  3. A. Dhanasekar
  4. A. Suresh
  5. T. Gokulraj

**Description**: Premier exhibition featuring cutting-edge electric vehicles, battery technologies, charging solutions, autonomous driving systems, and sustainable mobility innovations.

---

## Student Participation Summary

### Unique Students (13 Total)

**Second Year Students (5):**
1. S. Ranjani - 2 achievements
2. S. Kalaiselvan - 2 achievements
3. S. Lavanya - 2 achievements
4. M.S. Monika - 2 achievements
5. P. Ganapathy - 2 achievements

**Third Year Students (3):**
1. N. Narmatha - 1 achievement
2. R. Mohan - 2 achievements (3rd + Final year events)
3. P. Sabarigirisanan - 2 achievements (3rd + Final year events)

**Final Year Students (5):**
1. R. Mohan - 1 achievement (Auto EV EXPO)
2. P. Sabarigirisan - 1 achievement (Auto EV EXPO)
3. A. Dhanasekar - 1 achievement
4. A. Suresh - 1 achievement
5. T. Gokulraj - 1 achievement

## Thematic Focus Areas

### 1. Electric Vehicle Technology (75%)
- National Electric Bike Challenge (Competition)
- EV Hands-on Training
- Auto EV INDIA EXPO

### 2. Industrial Automation (25%)
- Emerging Trends in Industrial Automation Seminar

## Achievement Categories

| Category | Count | Percentage |
|----------|-------|------------|
| Competition | 1 | 25% |
| Conference/Training/Seminar/Exhibition | 3 | 75% |

## Featured Achievements

Two achievements are marked as featured (will appear in "All Courses" carousel):

1. **National Electric Bike Challenge (NEBC)** - Second year team competition
2. **Two Days Hands-on Training in Electric Vehicles** - Second year training program

Both showcase the department's strong emphasis on practical electric vehicle technology and hands-on learning.

## Database Details

- **Course**: Electrical and Electronics Engineering (BE-EEE)
- **Course ID**: `114116da-76df-45e3-97fb-8f10c4f24ef0`
- **Competition Category ID**: `726900ef-5d55-4ff7-8f74-803f8cf41fdf`
- **Conference Category ID**: `057249fa-7b9e-44c8-89e4-c4727cd51aac`
- **College ID**: `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`

## Department-Organized Events (Not Included as Achievements)

The following events were organized by the Department of EEE but are NOT included in the student achievements table as specific student participation details were not provided:

1. **One-day Hands-on Training: "Synergy of E-vehicle and Automation"**
   - Date: October 19, 2023
   - Chief Guest: Mr. Parthiban, Caliber Pvt Ltd

2. **One-day Hands-on Training: "EV Design"**
   - Date: March 5, 2024
   - Chief Guest: Mr. K. Aruljothi, JKKNCET

3. **"International Day of Happiness" Celebration**
   - Date: March 20, 2024
   - Chief Guest: Mr. T. Praveen, JKKN

4. **One-day Hands-on Training: "Digital Dynamo - ICT Tools"**
   - Date: March 26, 2024
   - Chief Guest: Mr. B. Dhananjeiyan, JKKNCET

**Note**: The "Two-day Hands-on Training on Electric Vehicles (March 13-14, 2024)" matches achievement #2 where specific students participated.

If you wish to add these department events as achievements with student participation records, please provide:
- List of students who participated in each event
- Their year of study
- Any specific accomplishments or outcomes

## SQL Files

- **Main SQL**: `data/student-achievements-eee.sql`
- **Summary**: `data/student-achievements-eee-summary.md`

## Verification Queries

```sql
-- Count total EEE student achievements
SELECT COUNT(*) FROM student_achievements
WHERE course_id = '114116da-76df-45e3-97fb-8f10c4f24ef0';
-- Expected: 4

-- Breakdown by year
SELECT achievement_year, COUNT(*)
FROM student_achievements
WHERE course_id = '114116da-76df-45e3-97fb-8f10c4f24ef0'
GROUP BY achievement_year
ORDER BY achievement_year DESC;
-- Expected: 2024: 3, 2023: 1

-- Breakdown by category
SELECT c.name, COUNT(sa.id)
FROM student_achievements sa
JOIN achievement_categories c ON sa.category_id = c.id
WHERE sa.course_id = '114116da-76df-45e3-97fb-8f10c4f24ef0'
GROUP BY c.name;
-- Expected: Competition: 1, Conference: 3

-- Featured achievements
SELECT title, student_name
FROM student_achievements
WHERE course_id = '114116da-76df-45e3-97fb-8f10c4f24ef0' AND is_featured = true;
-- Expected: 2 records
```

## Frontend Display

These achievements will be visible at:
- **URL**: `/achievements?course=114116da-76df-45e3-97fb-8f10c4f24ef0`
- **Tab Name**: "Electrical and Electronics Engineering" or "BE-EEE"
- **Section**: Student Achievements (below Faculty Achievements)
- **Carousel**: Featured achievements (2) in "All Courses" tab
- **Grid View**: All 4 achievements in EEE-specific tab

## Notes

- All achievements are team achievements with multiple students listed
- Roll numbers are not provided (set to NULL)
- Achievement dates use the end date of multi-day events
- Descriptions include comprehensive context about each event's content and learning outcomes
- Strong focus on Electric Vehicle technology and practical hands-on training
- Both second-year achievements are featured, highlighting early student engagement in EV technologies
