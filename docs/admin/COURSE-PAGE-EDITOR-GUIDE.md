# Course Page Editor Guide

## Overview

The Course Page Editor is a specialized admin interface for editing comprehensive course pages (like BE Mechanical Engineering). It provides a user-friendly, tabbed interface to edit all sections of a course page without dealing with complex JSON structures.

## Features

✅ **14 Organized Tabs** - All sections grouped logically
✅ **Visual Form Builders** - Add/remove/reorder items easily
✅ **Real-time Validation** - Zod schema validation prevents errors
✅ **Color Picker** - Visual color selection for branding
✅ **Auto-save Feedback** - Success/error messages
✅ **Responsive Design** - Works on all screen sizes

## Accessing the Editor

### Method 1: Direct URL (Recommended)

Navigate to `/admin/content/course-pages` to see all course pages, then click "Edit Content" on any course page.

### Method 2: From Pages List

1. Go to **Admin → Content → Pages**
2. Find a page that uses `BEMechanicalCoursePage` component
3. Note the block ID from the URL or database
4. Navigate to `/admin/content/course-pages/[blockId]/edit`

## Editor Sections

### 1. Hero Section 🏆
- **Hero Title** - Main course title
- **Hero Subtitle** - Tagline/description
- **Affiliated To** - Affiliation text (Anna University, AICTE, etc.)
- **Hero Stats** - Quick stats (placement rate, years, seats, labs)
  - Icon (emoji)
  - Label (e.g., "Placement Rate")
  - Value (e.g., "95%")
- **Hero CTAs** - Call-to-action buttons
  - Label
  - Link
  - Variant (Primary/Secondary)

**Example:**
```
Title: "BE Mechanical Engineering"
Subtitle: "Engineering excellence in mechanical systems..."
Affiliated To: "Affiliated to Anna University | Approved by AICTE | NBA Accredited"

Stats:
  🏆 Placement Rate: 95%
  🎓 Years of Excellence: 60+
  📚 Total Seats: 180

CTAs:
  [Apply Now →] (Primary)
  [Download Brochure] (Secondary)
```

### 2. Course Overview 📖
- **Overview Title** - Section heading
- **Overview Cards** - 4 info cards (Duration, Eligibility, Mode, Medium)
  - Icon
  - Title
  - Value
  - Description

**Example:**
```
Cards:
  ⏱️ Duration: 4 Years (8 Semesters)
  📖 Eligibility: 10+2 PCM (50% Aggregate)
  🏛️ Mode: Full-time (On-campus)
  🌐 Medium: English (All courses)
```

### 3. Why Choose This Program ⭐
- **Why Choose Title** - Section heading
- **Benefits** - 6+ benefit cards
  - Icon
  - Title
  - Description

**Example:**
```
Benefits:
  📚 Industry-Aligned Curriculum
     Updated syllabus designed in consultation with industry experts...

  👨‍🏫 Expert Faculty
     Learn from experienced professors with industry background...

  🔬 State-of-the-Art Labs
     Access to modern equipment and facilities...
```

### 4. Curriculum 📚
**Note:** Curriculum editing is complex and handled separately. This tab shows a summary of configured years/semesters.

For detailed curriculum editing:
- Use the advanced JSON editor
- Contact admin for bulk updates
- Use dedicated curriculum management module

### 5. Specializations 🔧
- **Specializations Title** - Section heading
- **Specialization Tracks** - 6+ specialization areas
  - Icon
  - Title
  - Description

**Example:**
```
Specializations:
  🔥 Thermal Engineering
     Focus on heat transfer, refrigeration and air conditioning...

  🎨 Design Engineering
     CAD/CAM, product design, and manufacturing processes...

  🏭 Manufacturing Engineering
     CNC machining, automation, and production systems...
```

### 6. Career Opportunities 💼
- **Career Title** - Section heading
- **Career Paths** - 8+ job roles
  - Icon
  - Title
  - Description
  - Average Salary

**Example:**
```
Career Paths:
  💼 Mechanical Design Engineer
     Design and develop mechanical systems...
     Avg Salary: 4-8 LPA

  🏭 Production Engineer
     Manage manufacturing processes...
     Avg Salary: 3.5-7 LPA
```

### 7. Top Recruiters 🏢
- **Recruiters Title** - Section heading
- **Company Names** - List of recruiting companies (20+)

**Example:**
```
Recruiters:
  Tata Motors
  Ashok Leyland
  TVS Motors
  Mahindra & Mahindra
  L&T
  ...
```

### 8. Facilities & Labs 🔬
- **Facilities Title** - Section heading
- **Facilities** - 6+ laboratory facilities
  - Name
  - Description
  - Image URL

**Example:**
```
Facilities:
  CAD/CAM Laboratory
  State-of-the-art computer-aided design and manufacturing lab...
  Image: https://example.com/cad-lab.jpg
```

### 9. Faculty Members 👨‍🏫
- **Faculty Title** - Section heading
- **Faculty** - 8+ faculty members
  - Name
  - Designation
  - Qualification
  - Specialization
  - Image URL

**Example:**
```
Faculty:
  Dr. Rajesh Kumar
  Professor & Head
  Ph.D. in Mechanical Engineering
  Specialization: Thermal Engineering
  Image: https://example.com/dr-rajesh.jpg
```

### 10. Admission Process 📝
- **Admission Title** - Section heading
- **Admission Steps** - 5 sequential steps
  - Step Number
  - Title
  - Description
  - Icon

**Example:**
```
Steps:
  1️⃣ Check Eligibility
     10+2 with PCM (50% aggregate)

  2️⃣ Apply Online
     Fill the application form on our website...

  3️⃣ Entrance Exam
     Appear for TNEA or management quota...
```

### 11. Fee Structure 💰
- **Fee Title** - Section heading
- **Fee Components** - Year-wise breakdown
  - Component (Tuition Fee, Exam Fee, etc.)
  - Amount
  - Is Total Row (checkbox)

**Example:**
```
Fee Breakdown:
  Tuition Fee:        ₹75,000
  Exam Fee:          ₹5,000
  Other Fees:        ₹10,000
  ----------------------
  Total Annual Fee:  ₹90,000  (✓ Is Total Row)
```

### 12. FAQs ❓
- **FAQ Title** - Section heading
- **FAQs** - 10+ questions
  - Question
  - Answer

**Example:**
```
FAQs:
  Q: What is the eligibility criteria for B.E. Mechanical Engineering?
  A: Candidates must have passed 10+2 with Physics, Chemistry, and Mathematics...

  Q: Is the program NBA accredited?
  A: Yes, our B.E. Mechanical Engineering program is NBA accredited...
```

### 13. Placement Statistics 📊
- **Placement Stats Title** - Section heading
- **Placement Stats** - 4 key statistics
  - Icon
  - Label
  - Value
  - Description

**Example:**
```
Placement Stats:
  📊 Placement Rate: 95.2%
     Students placed in 2023-24

  💰 Highest Package: ₹18 LPA
     Top package offered

  🏢 Companies Visited: 120+
     Leading recruiters
```

### 14. Colors & Styling 🎨
- **Primary Color** - Main brand color (hex code)
  - Visual color picker
  - Text input
  - Used for: headings, buttons, accents
- **Accent Color** - Highlight color (hex code)
  - Visual color picker
  - Text input
  - Used for: CTAs, highlights

**Recommended Colors:**
- Primary: `#0b6d41` (JKKN Brand Green)
- Accent: `#ff6b35` (Complementary Orange)

## How to Use the Editor

### Step 1: Access the Editor
```
Navigate to: /admin/content/course-pages
Click: "Edit Content" on any course page
```

### Step 2: Navigate Tabs
- Click any tab in the left sidebar to edit that section
- Tabs are color-coded when active
- All sections are independent

### Step 3: Edit Content
- Fill in text fields
- Use "Add" buttons to create new items (stats, benefits, FAQs, etc.)
- Use trash icon to delete items
- Drag handles (where available) to reorder

### Step 4: Save Changes
- Click the green "Save Changes" button at the top
- Wait for success/error message
- Page will automatically refresh with new data

### Step 5: Preview Changes
- Open the public page in a new tab
- Refresh to see your changes
- Verify all sections look correct

## Best Practices

### Content Guidelines

1. **Hero Section**
   - Keep title concise (under 60 characters)
   - Subtitle should be 1-2 sentences
   - Use 4 stats maximum for visual balance
   - Primary CTA should be "Apply Now" or similar

2. **Benefits**
   - Focus on unique selling points
   - Keep descriptions under 150 words
   - Use relevant emojis for visual appeal
   - Aim for 6 benefits (2 rows of 3)

3. **Career Paths**
   - Be specific with job titles
   - Include realistic salary ranges
   - Update annually based on market data
   - Highlight both core and emerging roles

4. **Facilities**
   - Use high-quality images (minimum 600x400px)
   - Describe specific equipment/technology
   - Emphasize modern/state-of-the-art aspects
   - Include capacity or operating hours if relevant

5. **Faculty**
   - Use professional photos (300x300px)
   - Include complete qualifications
   - Mention research interests
   - Keep updated when faculty changes

6. **FAQs**
   - Address common student/parent questions
   - Include specific numbers and dates
   - Cover: eligibility, admission, fees, placements
   - Keep answers concise but comprehensive

7. **Placement Stats**
   - Use latest academic year data
   - Include highest, average, median packages
   - Mention number of companies
   - Be transparent and accurate

### SEO & Accessibility

1. **Alt Text** - Always provide image URLs with descriptive alt text
2. **Color Contrast** - Ensure WCAG AA compliance (use recommended colors)
3. **Keywords** - Include program name, university, location naturally
4. **Headings** - Use clear, descriptive section titles

### Performance

1. **Image Optimization**
   - Use WebP format when possible
   - Compress images before uploading
   - Recommended: 600x400px for facilities, 300x300px for faculty
   - Use CDN URLs for faster loading

2. **Content Length**
   - Keep descriptions concise
   - Break long text into bullet points
   - Use accordions/tabs for detailed content

## Troubleshooting

### "Failed to save changes"
**Cause:** Validation error or network issue
**Solution:**
1. Check for required fields (marked with *)
2. Verify all fields have valid data
3. Check browser console for specific errors
4. Try saving again after fixing errors

### "Component not found"
**Cause:** Invalid block ID or wrong component type
**Solution:**
1. Verify you're editing a BEMechanicalCoursePage component
2. Check the URL has correct block ID
3. Navigate from /admin/content/course-pages instead

### Changes not visible on public page
**Cause:** Cache not cleared
**Solution:**
1. Hard refresh the public page (Ctrl+Shift+R)
2. Clear browser cache
3. Wait 1-2 minutes for revalidation
4. Verify "Save Changes" showed success message

### Curriculum not editable
**Expected Behavior:** Curriculum uses complex nested structure
**Solution:**
1. Use JSON editor for detailed curriculum changes
2. Contact admin for bulk curriculum updates
3. Use dedicated curriculum management module

## Technical Details

### File Structure
```
components/
  admin/
    course-page-editor.tsx          # Main editor component (14 tabs)

app/
  (admin)/
    admin/
      content/
        course-pages/
          page.tsx                   # List of course pages
          [blockId]/
            edit/
              page.tsx               # Edit page (server component)
              course-page-editor-wrapper.tsx  # Client wrapper

  actions/
    cms/
      course-pages.ts                # Server actions (save, fetch)
```

### Database Schema
```sql
-- Course page data stored in cms_page_blocks table
cms_page_blocks:
  id: UUID (block ID used in URL)
  page_id: UUID (references cms_pages)
  component_name: 'BEMechanicalCoursePage'
  props: JSONB (all course page data)
  updated_at: timestamp
```

### Data Validation
All data is validated against the Zod schema defined in:
```typescript
components/cms-blocks/content/be-mechanical-course-page.tsx
  BEMechanicalCoursePagePropsSchema
```

### Permissions Required
- View: `cms:pages:view`
- Edit: `cms:pages:edit`

## Future Enhancements

### Planned Features
- [ ] Drag-and-drop reordering for all list sections
- [ ] Image upload directly in the editor
- [ ] Rich text editor for descriptions
- [ ] Curriculum visual editor (tree view)
- [ ] Bulk import/export (CSV, JSON)
- [ ] Version history and rollback
- [ ] Preview mode before saving
- [ ] Auto-save drafts
- [ ] Multi-language support
- [ ] Analytics integration (track popular sections)

### Requested Features
Submit feature requests to the web team or create an issue in the GitHub repository.

## Support

For help or questions:
1. Check this guide first
2. Contact the web development team
3. Create an issue in the repository
4. Email: webteam@jkkn.ac.in

---

**Last Updated:** 2026-01-28
**Version:** 1.0.0
**Maintained By:** JKKN Engineering College Web Team
