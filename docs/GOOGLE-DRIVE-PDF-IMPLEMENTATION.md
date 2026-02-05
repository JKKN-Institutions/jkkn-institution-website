# Google Drive PDF Implementation Guide

This guide shows how to use Google Drive PDFs in Committee, Alumni, and Mandatory Disclosure pages.

## 📋 Table of Contents

1. [Setup Overview](#setup-overview)
2. [Getting Google Drive PDF Links](#getting-google-drive-pdf-links)
3. [Using PDF Components](#using-pdf-components)
4. [Implementation Examples](#implementation-examples)
5. [Customization Options](#customization-options)

---

## Setup Overview

### Files Created

```
lib/
├── utils/
│   └── google-drive-pdf.ts          # PDF utilities
├── data/
│   ├── committee-pdfs.ts            # Committee PDFs configuration
│   ├── alumni-pdfs.ts               # Alumni PDFs configuration
│   └── mandatory-disclosure-pdfs.ts # Mandatory disclosure PDFs

components/
└── cms-blocks/
    ├── shared/
    │   └── pdf-link-list.tsx        # Reusable PDF list component
    └── content/
        └── committee-pdfs-page.tsx  # Example committee page
```

---

## Getting Google Drive PDF Links

### Step-by-Step Process

1. **Upload PDF to Google Drive**
   - Go to [drive.google.com](https://drive.google.com)
   - Upload your PDF file

2. **Share the File**
   - Right-click the file → Click "Share"
   - Click "Change to anyone with the link"
   - Set permission to **"Viewer"**
   - Click "Copy link"

3. **Use the Link**
   - Paste the link in your configuration file
   - Example link format:
     ```
     https://drive.google.com/file/d/1ABC123xyz_FILE_ID/view?usp=sharing
     ```

### Supported Link Formats

The system automatically handles these formats:
- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- `https://drive.google.com/open?id=FILE_ID`
- Just the `FILE_ID` itself

---

## Using PDF Components

### Basic Usage: PDF Link List

```tsx
import { PdfLinkList } from '@/components/cms-blocks/shared/pdf-link-list'

const pdfs = [
  {
    title: 'Committee Members 2024',
    driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
    description: 'List of committee members and their roles',
    category: 'Committee Information',
    year: '2024-2025',
  },
]

export default function MyPage() {
  return (
    <PdfLinkList
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
interface PdfLinkListProps {
  title?: string              // Page/section title
  description?: string        // Description text
  pdfs: PdfLinkConfig[]      // Array of PDF configurations
  accentColor?: string       // Theme color (default: #10b981)
  backgroundColor?: string   // Background color (default: #ffffff)
  groupByCategory?: boolean  // Group PDFs by category (default: false)
  showThumbnails?: boolean   // Show PDF thumbnails (default: false)
  columns?: 1 | 2 | 3       // Grid columns (default: 1)
}
```

---

## Implementation Examples

### 1. Committee Pages

#### Update Configuration (`lib/data/committee-pdfs.ts`)

```typescript
export const COMMITTEE_PDFS: Record<string, PdfLinkConfig[]> = {
  'anti-ragging-committee': [
    {
      title: 'Anti Ragging Committee Members',
      driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
      description: 'List of committee members',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'Anti Ragging Policy',
      driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
      description: 'Complete policy document',
      category: 'Policies',
    },
  ],
}
```

#### Create Page (`app/(public)/committees/anti-ragging-committee/page.tsx`)

```tsx
import { CommitteePdfsPage } from '@/components/cms-blocks/content/committee-pdfs-page'

export default function AntiRaggingCommitteePage() {
  return (
    <CommitteePdfsPage
      committeeSlug="anti-ragging-committee"
      title="Anti Ragging Committee"
      description="Access all anti-ragging related documents"
      accentColor="#10b981"
      showThumbnails={false}
    />
  )
}
```

### 2. Alumni Page

#### Update Configuration (`lib/data/alumni-pdfs.ts`)

```typescript
export const ALUMNI_PDFS: PdfLinkConfig[] = [
  {
    title: 'Alumni Association Bylaws',
    driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
    description: 'Official bylaws of the alumni association',
    category: 'Association Documents',
    year: '2024',
  },
  {
    title: 'Alumni Registration Form',
    driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
    description: 'Form for alumni registration',
    category: 'Forms',
  },
]
```

#### Create Page (`app/(public)/alumni/page.tsx`)

```tsx
import { PdfLinkList } from '@/components/cms-blocks/shared/pdf-link-list'
import { ALUMNI_PDFS } from '@/lib/data/alumni-pdfs'

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
        <PdfLinkList
          pdfs={ALUMNI_PDFS}
          accentColor="#10b981"
          backgroundColor="transparent"
          groupByCategory={true}
          columns={3}
        />
      </div>
    </div>
  )
}
```

### 3. Mandatory Disclosure Page

#### Update Configuration (`lib/data/mandatory-disclosure-pdfs.ts`)

```typescript
export const MANDATORY_DISCLOSURE_PDFS: PdfLinkConfig[] = [
  {
    title: 'Institution Details',
    driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
    description: 'Name, address, and contact information',
    category: 'General Information',
  },
  {
    title: 'AICTE Approval Letter',
    driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
    description: 'Latest AICTE approval',
    category: 'Approvals',
    year: '2024-2025',
  },
]
```

#### Create Page (`app/(public)/mandatory-disclosure/page.tsx`)

```tsx
import { PdfLinkList } from '@/components/cms-blocks/shared/pdf-link-list'
import { MANDATORY_DISCLOSURE_PDFS } from '@/lib/data/mandatory-disclosure-pdfs'

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

        <PdfLinkList
          pdfs={MANDATORY_DISCLOSURE_PDFS}
          accentColor="#2563eb"
          backgroundColor="#f8fafc"
          groupByCategory={true}
          showThumbnails={false}
          columns={2}
        />
      </div>
    </div>
  )
}
```

### 4. Others Menu (Academic Calendar Example)

#### Create Page (`app/(public)/others/academic-calendar/page.tsx`)

```tsx
import { PdfLinkList } from '@/components/cms-blocks/shared/pdf-link-list'

const ACADEMIC_CALENDAR_PDFS = [
  {
    title: 'Academic Calendar 2024-2025',
    driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
    description: 'Complete academic calendar with important dates',
    year: '2024-2025',
  },
  {
    title: 'Holiday List 2024-2025',
    driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
    description: 'List of holidays for the academic year',
    year: '2024-2025',
  },
  {
    title: 'Examination Schedule',
    driveUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
    description: 'Semester examination schedule',
    year: '2024-2025',
  },
]

export default function AcademicCalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Academic Calendar
        </h1>

        <PdfLinkList
          pdfs={ACADEMIC_CALENDAR_PDFS}
          accentColor="#2563eb"
          backgroundColor="white"
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
accentColor="#10b981"

// Blue Theme
accentColor="#2563eb"

// Red Theme
accentColor="#dc2626"

// Purple Theme
accentColor="#9333ea"

// Custom Brand Color
accentColor="#your-brand-color"
```

### Layout Options

```tsx
// Single Column (Mobile-friendly)
<PdfLinkList columns={1} />

// Two Columns (Tablets & Desktop)
<PdfLinkList columns={2} />

// Three Columns (Large Screens)
<PdfLinkList columns={3} />
```

### Grouping Options

```tsx
// Group by Category
<PdfLinkList groupByCategory={true} />

// Flat List
<PdfLinkList groupByCategory={false} />
```

### Show Thumbnails

```tsx
// With PDF Thumbnails
<PdfLinkList showThumbnails={true} />

// Without Thumbnails (Faster)
<PdfLinkList showThumbnails={false} />
```

---

## Advanced Usage

### Custom PDF Card Styling

For custom styling, you can create your own component using the utilities:

```tsx
import { processPdfLink } from '@/lib/utils/google-drive-pdf'

const MyCustomPdfCard = ({ pdfConfig }) => {
  const pdf = processPdfLink(pdfConfig)

  return (
    <div className="custom-card">
      <h3>{pdf.title}</h3>
      <p>{pdf.description}</p>
      <a href={pdf.viewUrl} target="_blank">View PDF</a>
      <a href={pdf.downloadUrl} target="_blank">Download</a>
    </div>
  )
}
```

### Utility Functions

```typescript
import {
  convertToGoogleDrivePdfUrl,     // Get viewer URL
  getGoogleDrivePdfDownloadUrl,   // Get download URL
  getGoogleDrivePdfEmbedUrl,      // Get embed URL (iframe)
  getGoogleDrivePdfThumbnail,     // Get thumbnail image
  processPdfLink,                 // Process complete config
} from '@/lib/utils/google-drive-pdf'
```

---

## Next Steps

1. **Upload your PDFs to Google Drive**
2. **Update the configuration files** with actual Google Drive links
3. **Create pages** using the examples above
4. **Customize colors and layout** to match your brand
5. **Test all PDF links** to ensure they're publicly accessible

---

## Troubleshooting

### PDF Not Loading

1. Check if the file is shared with "Anyone with the link"
2. Verify the permission is set to "Viewer"
3. Try opening the generated viewUrl in a new tab

### Thumbnail Not Showing

1. Google Drive thumbnails may not work for all PDFs
2. Set `showThumbnails={false}` to disable thumbnails

### Styling Issues

1. Ensure Tailwind CSS classes are properly configured
2. Check if custom colors are valid hex codes
3. Verify dark mode support if using dark backgrounds

---

## Support

For issues or questions:
1. Check the utility functions in `lib/utils/google-drive-pdf.ts`
2. Review the component code in `components/cms-blocks/shared/pdf-link-list.tsx`
3. Test with a sample PDF first before implementing all pages
