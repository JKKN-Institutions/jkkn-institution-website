# Curriculum Page Update - Science & Humanities Department

## Summary of Changes

Updated the Science & Humanities department page (`/courses-offered/ug/sh`) to display course-specific curriculum PDFs with Regulation 2025 documentation.

## What Was Changed

### 1. Component Updates (`components/cms-blocks/content/sh-course-page.tsx`)

#### Added New Schema
- **CourseTabSchema**: New schema for course tab data structure
  ```typescript
  const CourseTabSchema = z.object({
    code: z.string(),        // Course code (EEE, MECH, etc.)
    name: z.string(),        // Full course name
    pdfUrl: z.string(),      // PDF URL
  })
  ```

#### Updated Main Props Schema
- Added `courseTabs` field (optional) to support course-based curriculum display

#### Enhanced CurriculumSection Component
- **New Props**: Added `courseTabs` parameter
- **State Management**: Added `selectedCourse` state for course tab selection
- **Dual Mode Display**:
  - **Course Tabs Mode**: Shows when `courseTabs` is provided
    - Horizontal tabs for each course (EEE, MECH, ECE, IT, CSE)
    - PDF viewer embedded in page (800px height)
    - "REGULATION 2025 CURRICULUM - [Course Name]" heading
    - Download button for each PDF
  - **Year Tabs Mode**: Shows when `courseTabs` is not provided (fallback)
    - Original year-based display (Year 1, Year 2)
    - Semester-wise subject listing

### 2. Data Updates (`lib/cms/templates/engineering/sh-data.ts`)

#### Removed Year 2
- Deleted Year 2 curriculum data (Semesters 3 & 4)
- Kept only Year 1 data (Semesters 1 & 2) as fallback

#### Added Course Tabs Configuration
```typescript
courseTabs: [
  {
    code: 'EEE',
    name: 'Electrical and Electronics Engineering',
    pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/EEE/B.E.%20EEE.pdf',
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering',
    pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/Mech/B.E.%20Mechanical%20Engineering.pdf',
  },
  {
    code: 'ECE',
    name: 'Electronics and Communication Engineering',
    pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/ECE/B.E%20ECE.pdf',
  },
  {
    code: 'IT',
    name: 'Information Technology',
    pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/CSIE/B.Tech.%20IT%20.pdf',
  },
  {
    code: 'CSE',
    name: 'Computer Science and Engineering',
    pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/CSIE/BE%20CSE.pdf',
  },
]
```

### 3. Directory Structure Created

```
public/pdfs/curriculum/
├── README.md (Upload instructions)
└── (PDFs - using online URLs instead)
```

## How It Works

### User Experience

1. **Page Load**: Science & Humanities page loads with course tabs visible
2. **Default View**: First course (EEE) is selected by default
3. **Tab Selection**: User clicks any course tab (EEE, MECH, ECE, IT, CSE)
4. **PDF Display**:
   - Large heading: "REGULATION 2025 CURRICULUM - [Course Name]"
   - Embedded PDF viewer (800px height)
   - Download button below the viewer
5. **Smooth Transitions**: Tab changes with smooth color transitions using JKKN green theme

### Technical Flow

```
SHCoursePage Component
  ↓
Receives courseTabs prop from SH_SAMPLE_DATA
  ↓
Passes to CurriculumSection Component
  ↓
Renders Course Tabs (instead of Year Tabs)
  ↓
Displays Selected Course PDF in iframe
```

### Styling

- **Primary Color**: `#0b6d41` (JKKN Green)
- **Background**: `#fbfbee` (Cream)
- **Active Tab**: Green background with white text
- **Inactive Tab**: Gray background with dark text
- **PDF Container**: White background with shadow

## PDF URLs Used

All PDFs are hosted on Anna University's official website:

1. **EEE**: `https://cac.annauniv.edu/aidetails/afug_2025_fu/EEE/B.E.%20EEE.pdf`
2. **MECH**: `https://cac.annauniv.edu/aidetails/afug_2025_fu/Mech/B.E.%20Mechanical%20Engineering.pdf`
3. **ECE**: `https://cac.annauniv.edu/aidetails/afug_2025_fu/ECE/B.E%20ECE.pdf`
4. **IT**: `https://cac.annauniv.edu/aidetails/afug_2025_fu/CSIE/B.Tech.%20IT%20.pdf`
5. **CSE**: `https://cac.annauniv.edu/aidetails/afug_2025_fu/CSIE/BE%20CSE.pdf`

## Testing

To test the changes:

```bash
# Start development server
npm run dev

# Navigate to:
http://localhost:3000/courses-offered/ug/sh

# Scroll to Curriculum section
# Click each course tab to verify PDF display
```

## Backwards Compatibility

The component is fully backwards compatible:
- If `courseTabs` is not provided, it falls back to the original year-based display
- Year 1 data is retained for fallback scenarios
- Other pages using `SHCoursePage` component are not affected

## Files Modified

1. `components/cms-blocks/content/sh-course-page.tsx`
   - Added CourseTabSchema
   - Updated CurriculumSection component
   - Added course tabs UI
   - Added PDF iframe display

2. `lib/cms/templates/engineering/sh-data.ts`
   - Removed Year 2 data
   - Added courseTabs configuration
   - Linked Anna University PDF URLs

3. `public/pdfs/curriculum/README.md`
   - Created upload instructions (for reference)

## Future Enhancements

Potential improvements for future versions:

1. **PDF Loading State**: Add loading spinner while PDF loads
2. **Error Handling**: Show error message if PDF fails to load
3. **Mobile Optimization**: Better PDF viewing experience on mobile devices
4. **Download Statistics**: Track PDF downloads per course
5. **Print Button**: Add direct print option for PDFs
6. **Full Screen Mode**: Option to view PDF in full screen

## Notes

- PDFs are embedded using `<iframe>` for better user experience
- External Anna University URLs are used (no local storage needed)
- PDF files are official Regulation 2025 curriculum documents
- Course tabs follow JKKN brand color scheme
- Responsive design maintained for mobile and tablet views

---

**Date**: 2026-02-05
**Updated By**: Claude Code
**Status**: ✅ Complete and Ready for Testing
