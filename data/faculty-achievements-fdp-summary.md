# Faculty Development Program Achievements - Import Summary

## Date: February 4, 2026

## Database: Engineering College Supabase Project (kyvfkyjmdbtyimtedkie)

## Course: Computer Science and Engineering (BE-CSE)

---

## Import Details

**Total Achievements Added:** 41

**Category:** Faculty Development (ID: c2bf03e3-1d66-4b6a-97ab-e93d0ef93d7b)

**Course:** Computer Science and Engineering (ID: b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22)

**College:** JKKN College of Engineering and Technology (ID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11)

---

## Breakdown by Academic Year

### 2023-24 Academic Year (11 achievements)
- 4 achievements in AI/ML (Mr. Sathyaseelan, Mrs. Porkodi, Mrs. Santhiya, Mrs. Karthika)
- 4 achievements in Flutter & Dart (Mr. Sathyaseelan, Mrs. Porkodi, Mrs. Santhiya, Mrs. Karthika)
- 1 achievement in Digital Marketing (Mrs. Porkodi)
- 1 achievement in Oracle (Mrs. Santhiya)
- 1 achievement in Data Science (Mrs. Murgashankar)

### 2022-23 Academic Year (15 achievements)
- 5 achievements in Outcome Based Education (Mr. Sathyaseelan, Mrs. Porkodi, Mrs. Dhivya, Mrs. Karthika, Mr. Murgashankar)
- 5 achievements in AI/ML (Mr. Sathyaseelan, Mrs. Porkodi, Mrs. Dhivya, Mrs. Karthika, Mr. Murgashankar)
- 5 achievements in IPR Awareness/Training (Mr. Sathyaseelan, Mrs. Porkodi, Mrs. Dhivya, Mrs. Karthika, Mr. Murgashankar)

### 2023 Academic Year - Additional Programs (15 achievements)
- 2 achievements in Energy Literacy Training (Dr. Rajendiran K M, Dr. Latha N)
- 2 achievements in OBE Curriculum & Accreditation (Mrs. Baby M, Dr. Suganya D)
- 3 achievements in IPR & IP Management for Startups (Dr. Sasikala A D, Mrs. Ramya B, Mrs. Swathi Priya K S)
- 1 achievement in Nanoscience & Technology (Dr. Punitha R)
- 2 achievements in Biomaterials Conclave (Mrs. Narmadha S, Mrs. Panjami D)
- 1 achievement in Engineering Physics (Dr. Rajendiran K M)
- 4 achievements in Instructional Design & Delivery Systems (Dr. Rajendiran K M, Mrs. Manjula Devi D, Mrs. Janaranjana Sri S, Mrs. Bharathi Priya M)

---

## Faculty Involved

Total of 19 unique faculty members participated in various FDPs:

1. Mr. G.M. Sathyaseelan (Assistant Professor) - 5 programs
2. Mrs. G. Porkodi (Assistant Professor) - 6 programs
3. Mrs. M. Santhiya (Assistant Professor) - 4 programs
4. Mrs. R. Karthika (Assistant Professor) - 5 programs
5. Mrs. S. Murgashankar (Assistant Professor) - 4 programs
6. Mrs. J. Dhivya (Assistant Professor) - 3 programs
7. Dr. Rajendiran K M (Professor) - 4 programs
8. Dr. Latha N (Associate Professor) - 1 program
9. Mrs. Baby M (Assistant Professor) - 1 program
10. Dr. Suganya D (Assistant Professor) - 1 program
11. Dr. Sasikala A D (Associate Professor) - 1 program
12. Mrs. Ramya B (Assistant Professor) - 1 program
13. Mrs. Swathi Priya K S (Assistant Professor) - 1 program
14. Dr. Punitha R (Associate Professor) - 1 program
15. Mrs. Narmadha S (Assistant Professor) - 1 program
16. Mrs. Panjami D (Assistant Professor) - 1 program
17. Mrs. Manjula Devi D (Assistant Professor) - 1 program
18. Mrs. Janaranjana Sri S (Assistant Professor) - 1 program
19. Mrs. Bharathi Priya M (Assistant Professor) - 1 program

---

## Data Visibility

The achievements are now live and visible on:
- `/achievements` page (All Courses tab - for featured achievements)
- `/achievements?course=b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22` (Computer Science and Engineering specific tab)
- Course-specific achievements carousel

All achievements are:
- ✅ Active (`is_active = true`)
- ✅ Properly linked to Faculty Development category
- ✅ Properly linked to CSE course
- ✅ Ordered by `display_order` (1-41)
- ✅ Categorized by achievement year (2022, 2023, 2024)

---

## SQL File Location

The complete SQL import script is available at:
`data/faculty-achievements-fdp.sql`

This file can be used to:
- Re-import data if needed
- Sync to other institution databases
- Serve as documentation for the import

---

## Verification Query

To verify the import, run:

```sql
SELECT
  COUNT(*) as total_count,
  achievement_year,
  category_id
FROM faculty_achievements
WHERE course_id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'
GROUP BY achievement_year, category_id
ORDER BY achievement_year DESC;
```

Expected results:
- 2024: 18 achievements (including newly added)
- 2023: 60 achievements (including newly added)
- 2022: 10 achievements (including newly added)

---

## Next Steps

1. **Review the achievements page** at the Engineering College website
2. **Mark featured achievements** if any specific FDPs should be highlighted on the "All Courses" tab
3. **Add images/certificates** if available (future enhancement)
4. **Sync to other institutions** if these faculty teach at multiple colleges

---

## Notes

- All faculty designations were inferred as "Assistant Professor" unless specified in the original data
- Some faculty have "Dr." prefix indicating PhD qualification
- The FDP dates span from December 2022 to March 2024
- All achievements are categorized under "Faculty Development" category

