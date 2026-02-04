# 6 Top Recruiters - Engineering Project Update

**Date:** 2026-02-04
**Task:** Updated all engineering pages with 6 top recruiter logos

## 🎯 The 6 Top Recruiters

| # | Company | Logo File | Size | Status |
|---|---------|-----------|------|--------|
| 1 | **LGB** | `/images/recruiters/lgb.png` | 4.3 KB | ✅ |
| 2 | **Foxconn** | `/images/recruiters/foxconn.png` | 3.1 KB | ✅ |
| 3 | **TVS Group** | `/images/recruiters/tvs-group.jpg` | 13 KB | ✅ |
| 4 | **Sourcesys** | `/images/recruiters/sourcesys.png` | 4.1 KB | ✅ |
| 5 | **Infinix** | `/images/recruiters/infinix.png` | 250 KB | ✅ |
| 6 | **Pronoia Insurance** | `/images/recruiters/pronoia-insurance.jpg` | 23 KB | ✅ |

## 📋 Files Updated

### 1. Engineering Homepage Template
**File:** `lib/cms/templates/global/templates/engineering-modern-home.ts`

**Changes:**
- Updated `companies` array with all 6 logos and paths
- Changed stats from "4 Top Recruiters" → "6 Top Recruiters"

```typescript
companies: [
  { name: 'LGB', logo: '/images/recruiters/lgb.png', category: 'all' },
  { name: 'Foxconn', logo: '/images/recruiters/foxconn.png', category: 'all' },
  { name: 'TVS Group', logo: '/images/recruiters/tvs-group.jpg', category: 'all' },
  { name: 'Sourcesys', logo: '/images/recruiters/sourcesys.png', category: 'all' },
  { name: 'Infinix', logo: '/images/recruiters/infinix.png', category: 'all' },
  { name: 'Pronoia Insurance', logo: '/images/recruiters/pronoia-insurance.jpg', category: 'all' },
],
```

### 2. All Engineering Course Pages

All course data files updated with the 6 recruiters:

| Course | File | Status |
|--------|------|--------|
| BE Computer Science & Engineering | `be-cse-data.ts` | ✅ Updated (6 recruiters + stat count) |
| BE Electronics & Communication | `be-ece-data.ts` | ✅ Updated (6 recruiters) |
| BE Electrical & Electronics | `be-eee-data.ts` | ✅ Updated (6 recruiters) |
| B.Tech Information Technology | `be-it-data.ts` | ✅ Updated (6 recruiters) |
| BE Mechanical Engineering | `be-mechanical-data.ts` | ✅ Updated (6 recruiters) |
| ME Computer Science | `me-cse-data.ts` | ✅ Updated (6 recruiters with logos) |

## 🖼️ Logo Details

### 1. LGB
- **Source:** `images (5).png` from Downloads
- **Type:** Manufacturing/Industrial company
- **Logo:** Red oval with bold "LGB" text

### 2. Foxconn
- **Source:** `download.png` from Downloads
- **Type:** Electronics manufacturing
- **Logo:** Blue bold text "FOXCONN"

### 3. TVS Group (NEW)
- **Source:** `0b77a61ba7f8810d715dedde29875272.jpg` from Downloads
- **Type:** Indian multinational conglomerate
- **Logo:** Blue "TVS" text with red leaping horse
- **Website:** [TVS Group](https://www.tvsholdings.com/)

### 4. Sourcesys (NEW)
- **Source:** `Screenshot 2026-01-24 152623.png` from Downloads
- **Type:** Software & Technology Solutions
- **Logo:** Purple "SOURCESYS" text
- **Website:** [Sourcesys](https://www.sourcesys.co/)

### 5. Infinix
- **Source:** `Logo_of_Infinix.png` from Downloads
- **Type:** Mobile technology company
- **Logo:** Black "Infinix" text with green tagline "The Future is Now!"

### 6. Pronoia Insurance
- **Source:** `1756715910852.jpg` from Downloads
- **Type:** Insurance services
- **Logo:** Company logo with tagline "Place Of Mind Starts With Us"

## 📊 Impact Summary

| Metric | Previous | Updated |
|--------|----------|---------|
| Total recruiters | 4 | **6** |
| Logo files | 4 | **6** |
| Files updated | 7 | **7** |
| New companies added | - | TVS Group, Sourcesys |

## 🔍 Where These Logos Appear

### 1. Engineering Homepage (`/engineering-preview`)
- **EngineeringPlacementsSection** component
- Displays logos in marquee/carousel with drag-scroll
- Shows stats: "6 Top Recruiters"

### 2. Individual Course Pages
All engineering course pages display recruiter names/logos:
- BE CSE: `/courses/be-cse`
- BE ECE: `/courses/be-ece`
- BE EEE: `/courses/be-eee`
- B.Tech IT: `/courses/be-it`
- BE Mechanical: `/courses/be-mechanical`
- ME CSE: `/courses/me-cse`

## 🎨 Logo Display Features

The **EngineeringPlacementsSection** component includes:
- ✅ Infinite marquee/carousel animation
- ✅ Drag and scroll interaction
- ✅ Pause on hover
- ✅ Grayscale effect with color on hover
- ✅ Responsive grid layout
- ✅ Adjustable speed settings

## ✅ Verification

All 6 logos are properly configured:

```bash
✅ Logo files copied (6/6)
✅ Engineering homepage updated
✅ All course data files updated (6/6)
✅ Stats updated (6 Top Recruiters)
✅ Paths verified
```

## 🚀 Testing Instructions

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **View logos on:**
   - Engineering homepage: `http://localhost:3000/engineering-preview`
   - Course pages: `http://localhost:3000/courses/be-cse` (and others)

3. **Expected behavior:**
   - All 6 logos appear in marquee
   - Hover to pause animation
   - Drag to scroll
   - Logos show grayscale, color on hover

## 📝 File Structure

```
public/images/recruiters/
├── lgb.png (4.3 KB) - LGB logo
├── foxconn.png (3.1 KB) - Foxconn logo
├── tvs-group.jpg (13 KB) - TVS Group logo
├── sourcesys.png (4.1 KB) - Sourcesys logo
├── infinix.png (250 KB) - Infinix logo
└── pronoia-insurance.jpg (23 KB) - Pronoia Insurance logo
```

## 🔄 Comparison: Before vs After

### Before (4 Companies)
1. LGB
2. Foxconn
3. Infinix
4. Pronoia Insurance

### After (6 Companies)
1. LGB
2. Foxconn
3. **TVS Group** ⭐ NEW
4. **Sourcesys** ⭐ NEW
5. Infinix
6. Pronoia Insurance

---

**Status:** ✅ **Complete - All 6 Recruiters Updated Across Engineering Project**

**Sources:**
- [TVS Group Official](https://www.tvsholdings.com/)
- [Sourcesys Official](https://www.sourcesys.co/)
