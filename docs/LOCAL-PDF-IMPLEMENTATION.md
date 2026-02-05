# Local PDF Implementation Guide

This guide shows how to use PDFs stored locally in your project's `public/pdfs/` directory.

## 📋 Table of Contents

1. [Setup Overview](#setup-overview)
2. [Organizing PDFs](#organizing-pdfs)
3. [Using PDF Components](#using-pdf-components)
4. [Implementation Examples](#implementation-examples)
5. [Customization Options](#customization-options)

---

## Setup Overview

### Files Created

```
lib/
├── utils/
│   └── local-pdf.ts                      # Local PDF utilities
├── data/
│   ├── local-committee-pdfs.ts           # Committee PDFs config
│   ├── local-alumni-pdfs.ts              # Alumni PDFs config
│   └── local-mandatory-disclosure-pdfs.ts # Disclosure PDFs config

components/
└── cms-blocks/
    ├── shared/
    │   └── local-pdf-link-list.tsx       # PDF list component
    └── content/
        └── local-committee-pdfs-page.tsx # Committee page template
```

---

## Organizing PDFs

### Directory Structure

Store all PDFs in the `public/pdfs/` directory:

```
public/
└── pdfs/
    ├── committees/
    │   ├── anti-ragging-committee/
    │   │   ├── members-2024-2025.pdf
    │   │   ├── policy.pdf
    │   │   └── affidavit-form.pdf
    │   ├── anti-ragging-squad/
    │   │   ├── members-2024-2025.pdf
    │   │   └── emergency-contacts.pdf
    │   ├── anti-drug-club/
    │   ├── anti-drug-committee/
    │   ├── internal-compliant-committee/
    │   ├── grievance-and-redressal/
    │   ├── sc-st-committee/
    │   ├── library-committee/
    │   └── library-advisory-committee/
    │
    ├── alumni/
    │   ├── association/
    │   │   ├── bylaws.pdf
    │   │   ├── registration-form.pdf
    │   │   └── committee-members-2024-2025.pdf
    │   ├── achievements/
    │   ├── events/
    │   ├── newsletters/
    │   ├── directories/
    │   └── feedback/
    │
    ├── mandatory-disclosure/
    │   ├── general/
    │   │   ├── institution-details.pdf
    │   │   ├── approvals-affiliations.pdf
    │   │   └── trust-details.pdf
    │   ├── governance/
    │   ├── academic/
    │   ├── infrastructure/
    │   ├── financial/
    │   ├── admissions/
    │   ├── placements/
    │   ├── results/
    │   ├── committees/
    │   ├── policies/
    │   └── accreditation/
    │
    └── others/
        ├── academic-calendar/
        ├── circulars/
        └── forms/
```

### Naming Conventions

**Best Practices:**
- Use lowercase letters
- Use hyphens instead of spaces
- Include year when relevant
- Be descriptive

**Good Examples:**
- ✅ `members-2024-2025.pdf`
- ✅ `anti-ragging-policy.pdf`
- ✅ `fee-structure-2024-2025.pdf`

**Bad Examples:**
- ❌ `Members.pdf` (no context, no year)
- ❌ `Policy Document.pdf` (spaces)
- ❌ `doc1.pdf` (not descriptive)

---

## Using PDF Components

### Basic Usage

```tsx
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'

const pdfs = [
  {
    title: 'Committee Members 2024',
    pdfPath: 'committees/anti-ragging-committee/members-2024-2025.pdf',
    description: 'List of committee members',
    category: 'Committee Information',
    year: '2024-2025',
    fileSize: '1.2 MB',
  },
]

export default function MyPage() {
  return (
    <LocalPdfLinkList
      title="Committee Documents"
      description="Access important committee documents"
      pdfs={pdfs}
      accentColor="#10b981"
      groupByCategory={true}
      columns={2}
    />
  )
}
```

### Component Props

```tsx
interface LocalPdfLinkListProps {
  title?: string              // Page/section title
  description?: string        // Description text
  pdfs: LocalPdfLinkConfig[]  // Array of PDF configurations
  accentColor?: string        // Theme color (default: #10b981)
  backgroundColor?: string    // Background color (default: #ffffff)
  groupByCategory?: boolean   // Group PDFs by category (default: false)
  showFileSize?: boolean      // Show file size badges (default: true)
  columns?: 1 | 2 | 3        // Grid columns (default: 1)
}
```

---

## Implementation Examples

### 1. Committee Pages

#### Create Committee Page

```tsx
// app/(public)/committees/anti-ragging-committee/page.tsx

import { LocalCommitteePdfsPage } from '@/components/cms-blocks/content/local-committee-pdfs-page'

export const metadata = {
  title: 'Anti Ragging Committee | JKKN College of Engineering',
  description: 'Access anti-ragging committee documents and policies',
}

export default function AntiRaggingCommitteePage() {
  return (
    <LocalCommitteePdfsPage
      committeeSlug="anti-ragging-committee"
      title="Anti Ragging Committee"
      description="Ensuring a safe and ragging-free campus environment"
      accentColor="#10b981"
      showFileSize={true}
    />
  )
}
```

#### Update Configuration (`lib/data/local-committee-pdfs.ts`)

```typescript
export const LOCAL_COMMITTEE_PDFS: Record<string, LocalPdfLinkConfig[]> = {
  'anti-ragging-committee': [
    {
      title: 'Anti Ragging Committee Members',
      pdfPath: 'committees/anti-ragging-committee/members-2024-2025.pdf',
      description: 'List of committee members',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '1.2 MB',
    },
    {
      title: 'Anti Ragging Policy',
      pdfPath: 'committees/anti-ragging-committee/policy.pdf',
      description: 'Complete anti-ragging policy',
      category: 'Policies',
      fileSize: '850 KB',
    },
  ],
}
```

### 2. Alumni Page

```tsx
// app/(public)/alumni/page.tsx

import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_ALUMNI_PDFS } from '@/lib/data/local-alumni-pdfs'

export const metadata = {
  title: 'Alumni Resources | JKKN College of Engineering',
  description: 'Access alumni documents, newsletters, and directories',
}

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-600 mb-4">
            Alumni Resources
          </h1>
          <p className="text-xl text-gray-600">
            Connect with your alma mater and access important documents
          </p>
        </div>

        {/* PDF List */}
        <LocalPdfLinkList
          pdfs={LOCAL_ALUMNI_PDFS}
          accentColor="#10b981"
          backgroundColor="transparent"
          groupByCategory={true}
          showFileSize={true}
          columns={3}
        />
      </div>
    </div>
  )
}
```

### 3. Mandatory Disclosure Page

```tsx
// app/(public)/mandatory-disclosure/page.tsx

import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_MANDATORY_DISCLOSURE_PDFS } from '@/lib/data/local-mandatory-disclosure-pdfs'

export const metadata = {
  title: 'Mandatory Disclosure | JKKN College of Engineering',
  description: 'AICTE/UGC mandatory disclosure documents',
}

export default function MandatoryDisclosurePage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Mandatory Disclosure
          </h1>
          <p className="text-lg text-gray-600">
            As per AICTE/UGC requirements
          </p>
        </div>

        <LocalPdfLinkList
          pdfs={LOCAL_MANDATORY_DISCLOSURE_PDFS}
          accentColor="#2563eb"
          backgroundColor="#f8fafc"
          groupByCategory={true}
          showFileSize={true}
          columns={2}
        />
      </div>
    </div>
  )
}
```

### 4. Others Menu (Academic Calendar)

```tsx
// app/(public)/others/academic-calendar/page.tsx

import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'

const ACADEMIC_CALENDAR_PDFS = [
  {
    title: 'Academic Calendar 2024-2025',
    pdfPath: 'others/academic-calendar/calendar-2024-2025.pdf',
    description: 'Complete academic calendar with important dates',
    year: '2024-2025',
    fileSize: '1.8 MB',
  },
  {
    title: 'Holiday List 2024-2025',
    pdfPath: 'others/academic-calendar/holidays-2024-2025.pdf',
    description: 'List of holidays for the academic year',
    year: '2024-2025',
    fileSize: '450 KB',
  },
  {
    title: 'Examination Schedule',
    pdfPath: 'others/academic-calendar/exam-schedule-2024-2025.pdf',
    description: 'Semester examination schedule',
    year: '2024-2025',
    fileSize: '680 KB',
  },
]

export default function AcademicCalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Academic Calendar
        </h1>

        <LocalPdfLinkList
          pdfs={ACADEMIC_CALENDAR_PDFS}
          accentColor="#2563eb"
          backgroundColor="white"
          showFileSize={true}
          columns={1}
        />
      </div>
    </div>
  )
}
```

---

## Customization Options

### Color Themes

```tsx
// Green Theme (Default)
<LocalPdfLinkList accentColor="#10b981" />

// Blue Theme
<LocalPdfLinkList accentColor="#2563eb" />

// Red Theme
<LocalPdfLinkList accentColor="#dc2626" />

// Purple Theme
<LocalPdfLinkList accentColor="#9333ea" />

// Custom Brand Color
<LocalPdfLinkList accentColor="#your-brand-color" />
```

### Layout Options

```tsx
// Single Column (Mobile-friendly)
<LocalPdfLinkList columns={1} />

// Two Columns (Tablets & Desktop)
<LocalPdfLinkList columns={2} />

// Three Columns (Large Screens)
<LocalPdfLinkList columns={3} />
```

### Show/Hide File Size

```tsx
// Show file sizes (default)
<LocalPdfLinkList showFileSize={true} />

// Hide file sizes
<LocalPdfLinkList showFileSize={false} />
```

---

## Creating Directory Structure

### Quick Setup Script

Create all required directories at once:

```bash
# Windows PowerShell
mkdir public\pdfs\committees\anti-ragging-committee
mkdir public\pdfs\committees\anti-ragging-squad
mkdir public\pdfs\committees\anti-drug-club
mkdir public\pdfs\committees\anti-drug-committee
mkdir public\pdfs\committees\internal-compliant-committee
mkdir public\pdfs\committees\grievance-and-redressal
mkdir public\pdfs\committees\sc-st-committee
mkdir public\pdfs\committees\library-committee
mkdir public\pdfs\committees\library-advisory-committee

mkdir public\pdfs\alumni\association
mkdir public\pdfs\alumni\achievements
mkdir public\pdfs\alumni\events
mkdir public\pdfs\alumni\newsletters
mkdir public\pdfs\alumni\directories
mkdir public\pdfs\alumni\feedback

mkdir public\pdfs\mandatory-disclosure\general
mkdir public\pdfs\mandatory-disclosure\governance
mkdir public\pdfs\mandatory-disclosure\academic
mkdir public\pdfs\mandatory-disclosure\infrastructure
mkdir public\pdfs\mandatory-disclosure\financial
mkdir public\pdfs\mandatory-disclosure\admissions
mkdir public\pdfs\mandatory-disclosure\placements
mkdir public\pdfs\mandatory-disclosure\results
mkdir public\pdfs\mandatory-disclosure\committees
mkdir public\pdfs\mandatory-disclosure\policies
mkdir public\pdfs\mandatory-disclosure\accreditation

mkdir public\pdfs\others\academic-calendar
mkdir public\pdfs\others\circulars
mkdir public\pdfs\others\forms
```

```bash
# Linux/Mac
mkdir -p public/pdfs/committees/{anti-ragging-committee,anti-ragging-squad,anti-drug-club,anti-drug-committee,internal-compliant-committee,grievance-and-redressal,sc-st-committee,library-committee,library-advisory-committee}
mkdir -p public/pdfs/alumni/{association,achievements,events,newsletters,directories,feedback}
mkdir -p public/pdfs/mandatory-disclosure/{general,governance,academic,infrastructure,financial,admissions,placements,results,committees,policies,accreditation}
mkdir -p public/pdfs/others/{academic-calendar,circulars,forms}
```

---

## Adding PDFs

### Step 1: Upload PDFs

1. Copy your PDF files to the appropriate directories
2. Follow the naming conventions (lowercase, hyphens, include year)

### Step 2: Update Configuration

Update the configuration file for the category:

**For Committee PDFs:**
```typescript
// lib/data/local-committee-pdfs.ts

'anti-ragging-committee': [
  {
    title: 'Your PDF Title',
    pdfPath: 'committees/anti-ragging-committee/your-file.pdf',
    description: 'Brief description',
    category: 'Category Name',
    year: '2024-2025',
    fileSize: '1.2 MB',
  },
],
```

**For Alumni PDFs:**
```typescript
// lib/data/local-alumni-pdfs.ts

{
  title: 'Your PDF Title',
  pdfPath: 'alumni/subfolder/your-file.pdf',
  description: 'Brief description',
  category: 'Category Name',
  year: '2024',
  fileSize: '850 KB',
},
```

### Step 3: Test

1. Start development server: `npm run dev`
2. Navigate to the page: `http://localhost:3000/your-page-route`
3. Click "View" and "Download" buttons to verify

---

## Best Practices

### File Organization

1. **Keep Related Files Together**
   - Store all committee files in their respective folders
   - Group by category (policies, forms, reports, etc.)

2. **Use Consistent Naming**
   - `category-name-year.pdf`
   - Example: `members-2024-2025.pdf`

3. **Optimize File Sizes**
   - Compress PDFs before uploading
   - Target: < 5 MB per file
   - Use tools like Adobe Acrobat or online compressors

### Configuration Management

1. **Keep Configurations Updated**
   - Update file sizes when replacing PDFs
   - Update years annually
   - Remove outdated entries

2. **Use Descriptive Titles**
   - Clear, concise titles
   - Include year when relevant
   - Example: "Committee Members 2024-2025" (not "Members")

3. **Add Helpful Descriptions**
   - Brief 1-2 sentence description
   - Explain what the document contains
   - Help users know what they're downloading

---

## Troubleshooting

### PDF Not Found (404 Error)

**Check:**
1. File exists in the correct directory
2. File path in configuration matches actual path
3. Path uses forward slashes (`/`) not backslashes (`\`)
4. File name matches exactly (case-sensitive on Linux)

### PDF Won't Open

**Check:**
1. PDF is not corrupted
2. PDF is not password-protected
3. PDF is a valid PDF file (not renamed from another format)

### File Size Incorrect

**Update the configuration:**
```typescript
{
  fileSize: '1.2 MB', // Update this value
}
```

---

## Migration Guide

### From Google Drive to Local

If you previously used Google Drive PDFs:

1. **Download all PDFs from Google Drive**
2. **Organize into local directory structure**
3. **Update imports in your pages:**

```tsx
// Before (Google Drive)
import { PdfLinkList } from '@/components/cms-blocks/shared/pdf-link-list'
import { COMMITTEE_PDFS } from '@/lib/data/committee-pdfs'

// After (Local)
import { LocalPdfLinkList } from '@/components/cms-blocks/shared/local-pdf-link-list'
import { LOCAL_COMMITTEE_PDFS } from '@/lib/data/local-committee-pdfs'
```

4. **Update component usage:**

```tsx
// Before
<PdfLinkList pdfs={COMMITTEE_PDFS['slug']} />

// After
<LocalPdfLinkList pdfs={LOCAL_COMMITTEE_PDFS['slug']} />
```

---

## Next Steps

1. ✅ Create directory structure
2. ✅ Upload PDFs to appropriate folders
3. ✅ Update configuration files with actual PDF paths
4. ✅ Create pages using the templates
5. ✅ Test all PDF links
6. ✅ Customize colors to match your brand
7. ✅ Deploy to production

---

**✨ Your PDFs are now stored locally and fully integrated into your website!**
