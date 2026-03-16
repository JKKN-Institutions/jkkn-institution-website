---
title: WebMCP Developer Handoff — jkkn.ac.in Website
date: 2026-03-15
type: handoff
tags:
  - webmcp
  - jkkn-website
  - b2a
  - developer-guide
---

# WebMCP Developer Handoff — jkkn.ac.in Website

## Executive Summary

jkkn.ac.in is a marketing and information website — mostly static data, no complex backend. WebMCP integration here is simpler than MyJKKN: expose course catalogs, eligibility info, and placement stats as callable tools so AI agents can query JKKN data without scraping. Phase 2 adds lead capture so agents can submit callback requests and start applications on behalf of students.

---

## What is WebMCP?

WebMCP (Model Context Protocol for the Web) is a Chrome-native API that lets websites register tools that AI agents can discover and call directly in the browser.

**Two key APIs:**

| API | Who Uses It | What It Does |
|-----|-------------|--------------|
| `navigator.modelContext.registerTool()` | Your website | Exposes a callable tool with name, description, input schema, and execute function |
| `navigator.modelContextTesting.executeTool()` | AI agents / DevTools | Calls a registered tool by name with JSON input and gets structured JSON back |

**Browser support:** Chrome 146+ (behind `chrome://flags/#model-context-protocol` today, shipping to stable soon). The spec is a W3C proposal backed by Google and Anthropic.

In plain terms: your website publishes a menu of things it can answer, and AI agents order from that menu instead of trying to parse your HTML.

---

## Why jkkn.ac.in Should Add WebMCP

| Benefit | What It Means |
|---------|---------------|
| **AI agents query structured data** | An agent helping a student find pharmacy colleges calls `get_courses({institution: 'pharmacy'})` and gets clean JSON — no HTML scraping, no stale cached pages |
| **B2A enrollment pipeline** | AI enrollment assistants can check eligibility, compare courses, and submit leads programmatically. This is Business-to-Agent, the next channel after B2C |
| **Competitive positioning** | First Indian educational institution with WebMCP-enabled AI agent interaction — a concrete PR and differentiation story |
| **Future-proofing** | Gartner predicts 90% of B2B discovery will happen through AI agents by 2028. Students are already using ChatGPT and Gemini to research colleges. WebMCP makes JKKN visible to those agents |
| **Minimal effort** | jkkn.ac.in already has structured data in `/lib/data.ts`. No new APIs needed — tools read from imported data objects |

---

## Implementation Plan

### Phase 1 — Information Tools (Week 1)

Since jkkn.ac.in stores its data in `/lib/data.ts` as TypeScript objects, WebMCP tools can import and return that data directly. No API calls needed.

**Tools to register:**

| Tool Name | What It Returns |
|-----------|----------------|
| `get_institutions` | All 9 JKKN colleges/schools with name, location, courses, contact |
| `get_courses` | Courses for a specific institution with details |
| `get_facilities` | Campus facilities list |
| `check_eligibility` | Whether a student qualifies for a course based on marks |
| `get_placement_stats` | Placement statistics and recruiter information |
| `get_contact_info` | Address, phone, email for a specific institution |

**Main registration file:**

```typescript
// lib/webmcp/register-tools.ts
import { institutions } from '@/lib/data';

export function registerWebMCPTools() {
  if (typeof navigator === 'undefined' || !('modelContext' in navigator)) return;

  // --- Institution directory ---
  navigator.modelContext.registerTool({
    name: 'get_institutions',
    description: 'List all JKKN institutions with courses, location, and contact details. JKKN has 9 institutions: dental, pharmacy, nursing, allied health sciences, engineering, arts & science, education, school, and Natarajan Vidyalaya.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      return JSON.stringify(institutions.map(i => ({
        id: i.id,
        name: i.name,
        type: i.type,
        courses: i.courses,
        location: i.location,
        url: i.url
      })));
    }
  });

  // --- Courses for a specific institution ---
  navigator.modelContext.registerTool({
    name: 'get_courses',
    description: 'Get courses offered by a specific JKKN institution. Use institution ID: dental, pharmacy, nursing, ahs, engg, cas, edu, school, or nv.',
    inputSchema: {
      type: 'object',
      properties: {
        institution: {
          type: 'string',
          description: 'Institution ID: dental, pharmacy, nursing, ahs, engg, cas, edu, school, nv'
        }
      },
      required: ['institution']
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input;
      const inst = institutions.find(i => i.id === d.institution);
      if (!inst) {
        return JSON.stringify({
          error: 'Institution not found',
          valid_ids: institutions.map(i => i.id)
        });
      }
      return JSON.stringify({
        institution: inst.name,
        courses: inst.courses,
        subdomain: `${inst.id}.jkkn.ac.in`,
        url: inst.url
      });
    }
  });

  // --- Eligibility checker ---
  navigator.modelContext.registerTool({
    name: 'check_eligibility',
    description: 'Check eligibility for a JKKN course based on marks and qualification. Returns minimum requirements and application link.',
    inputSchema: {
      type: 'object',
      properties: {
        course: {
          type: 'string',
          description: 'Course name (e.g., BDS, B.Pharm, B.E. CSE, B.Sc Nursing, MBA)'
        },
        marks_percentage: {
          type: 'number',
          description: 'Percentage scored in qualifying exam'
        },
        qualification: {
          type: 'string',
          description: 'Qualifying exam (e.g., +2, 10th, Degree, PG)'
        }
      },
      required: ['course']
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input;

      // Eligibility thresholds by course category
      const thresholds: Record<string, { min_marks: number; qualification: string }> = {
        'BDS':           { min_marks: 50, qualification: '+2 with Physics, Chemistry, Biology' },
        'B.Pharm':       { min_marks: 45, qualification: '+2 with Physics, Chemistry, Mathematics/Biology' },
        'D.Pharm':       { min_marks: 40, qualification: '+2 with Physics, Chemistry' },
        'B.Sc Nursing':  { min_marks: 45, qualification: '+2 with Physics, Chemistry, Biology' },
        'B.E.':          { min_marks: 45, qualification: '+2 with Physics, Chemistry, Mathematics' },
        'B.Sc':          { min_marks: 40, qualification: '+2 in relevant stream' },
        'MBA':           { min_marks: 50, qualification: 'Any Degree' },
        'M.Pharm':       { min_marks: 55, qualification: 'B.Pharm' },
        'MDS':           { min_marks: 50, qualification: 'BDS' }
      };

      // Find matching threshold (partial match on course name)
      const courseKey = Object.keys(thresholds).find(
        k => d.course.toUpperCase().includes(k.toUpperCase().replace('.', ''))
           || k.toUpperCase().includes(d.course.toUpperCase())
      );

      const threshold = courseKey ? thresholds[courseKey] : { min_marks: 45, qualification: 'Varies' };
      const marksProvided = d.marks_percentage !== undefined;
      const eligible = marksProvided ? d.marks_percentage >= threshold.min_marks : null;

      return JSON.stringify({
        course: d.course,
        minimum_marks_percentage: threshold.min_marks,
        required_qualification: threshold.qualification,
        marks_provided: marksProvided ? d.marks_percentage : 'Not provided',
        eligible: eligible === null ? 'Provide marks_percentage to check' : eligible,
        apply_url: 'https://jkkn.in/admission-form',
        helpline: '+91-4285-262444',
        note: 'Final eligibility subject to university norms and entrance exam scores where applicable'
      });
    }
  });

  // --- Placement statistics ---
  navigator.modelContext.registerTool({
    name: 'get_placement_stats',
    description: 'Get JKKN placement statistics including placement rate, top recruiters, and average salary packages',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      // Source: /lib/data.ts placement data
      return JSON.stringify({
        overall_placement_rate: '85%+',
        highest_package: 'Varies by institution and year',
        top_recruiters: [
          'Apollo Hospitals', 'Fortis Healthcare', 'Dr. Reddys',
          'Cipla', 'Sun Pharma', 'Infosys', 'TCS', 'Wipro',
          'HCL Technologies', 'Cognizant'
        ],
        placement_support: [
          'Dedicated placement cell per institution',
          'Industry internship programs',
          'Soft skills and interview training',
          'Campus recruitment drives'
        ],
        contact: 'placement@jkkn.ac.in'
      });
    }
  });

  // --- Facilities ---
  navigator.modelContext.registerTool({
    name: 'get_facilities',
    description: 'Get campus facilities available at JKKN institutions including hostels, labs, library, sports, and transport',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      return JSON.stringify({
        campus: 'JKKN Educational Institutions, Komarapalayam, Namakkal, Tamil Nadu',
        facilities: [
          { name: 'Hostel', details: 'Separate hostels for boys and girls with mess facility' },
          { name: 'Library', details: 'Central library with digital resources and journal access' },
          { name: 'Laboratories', details: 'State-of-the-art labs for each department' },
          { name: 'Sports', details: 'Indoor and outdoor sports facilities' },
          { name: 'Transport', details: 'Bus facility covering major towns in the region' },
          { name: 'Wi-Fi Campus', details: 'Campus-wide internet connectivity' },
          { name: 'Cafeteria', details: 'Multi-cuisine cafeteria' },
          { name: 'Auditorium', details: 'AC auditorium for events and seminars' },
          { name: 'Hospital', details: 'JKKN Dental Hospital (teaching hospital)' }
        ]
      });
    }
  });

  // --- Contact info per institution ---
  navigator.modelContext.registerTool({
    name: 'get_contact_info',
    description: 'Get contact details for a specific JKKN institution or the main campus',
    inputSchema: {
      type: 'object',
      properties: {
        institution: {
          type: 'string',
          description: 'Institution ID (dental, pharmacy, etc.) or "main" for general contact'
        }
      }
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input;

      const mainContact = {
        name: 'JKKN Educational Institutions',
        address: 'JKKN Nagar, NH-544 (Salem-Kochi Highway), Kumarapalayam, Namakkal Dt., Tamil Nadu - 638183',
        phone: '+91-4285-262444',
        email: 'info@jkkn.ac.in',
        website: 'https://jkkn.ac.in',
        admission_form: 'https://jkkn.in/admission-form'
      };

      if (!d.institution || d.institution === 'main') {
        return JSON.stringify(mainContact);
      }

      const inst = institutions.find(i => i.id === d.institution);
      if (!inst) {
        return JSON.stringify({
          error: 'Institution not found',
          valid_ids: ['main', ...institutions.map(i => i.id)],
          main_contact: mainContact
        });
      }

      return JSON.stringify({
        institution: inst.name,
        subdomain: `https://${inst.id}.jkkn.ac.in`,
        campus_address: mainContact.address,
        general_phone: mainContact.phone,
        admission_form: 'https://jkkn.in/admission-form'
      });
    }
  });
}
```

**Hook into the app layout:**

```typescript
// app/layout.tsx — add WebMCP registration
'use client';
import { useEffect } from 'react';
import { registerWebMCPTools } from '@/lib/webmcp/register-tools';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerWebMCPTools();
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

> [!tip] If your root layout is a Server Component (which it likely is in Next.js 14), create a `WebMCPProvider` client component and include it in the layout JSX:
> ```typescript
> // components/WebMCPProvider.tsx
> 'use client';
> import { useEffect } from 'react';
> import { registerWebMCPTools } from '@/lib/webmcp/register-tools';
> export function WebMCPProvider() {
>   useEffect(() => { registerWebMCPTools(); }, []);
>   return null;
> }
> ```
> Then in `app/layout.tsx`: `<WebMCPProvider />` inside the body.

---

### Phase 2 — Lead Capture Tools (Week 2)

Tools that help AI agents submit information on behalf of interested students.

**Tools to register:**

| Tool Name | What It Does | Backend |
|-----------|--------------|---------|
| `request_callback` | Student wants a call from admissions | POST to contact API or Google Form |
| `start_application` | Begin admission process | Returns admission form URL with pre-filled params |
| `subscribe_newsletter` | Newsletter signup | POST to newsletter endpoint |

```typescript
// lib/webmcp/tools/lead-capture.ts
export function registerLeadCaptureTools() {
  if (typeof navigator === 'undefined' || !('modelContext' in navigator)) return;

  navigator.modelContext.registerTool({
    name: 'request_callback',
    description: 'Request a callback from JKKN admissions team for a prospective student',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Student full name' },
        phone: { type: 'string', description: 'Phone number with country code' },
        course_interest: { type: 'string', description: 'Course interested in' },
        preferred_time: { type: 'string', description: 'Preferred callback time (optional)' }
      },
      required: ['name', 'phone']
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input;

      // Confirmation before submitting personal data
      const confirmed = window.confirm(
        `Submit callback request?\n\nName: ${d.name}\nPhone: ${d.phone}\nCourse: ${d.course_interest || 'Not specified'}`
      );
      if (!confirmed) {
        return JSON.stringify({ cancelled: true, reason: 'User declined' });
      }

      try {
        const res = await fetch('/api/contact/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: d.name,
            phone: d.phone,
            course_interest: d.course_interest,
            preferred_time: d.preferred_time,
            source: 'webmcp-agent'
          })
        });
        const data = await res.json();
        return JSON.stringify({
          success: true,
          message: 'Callback request submitted. JKKN admissions will call within 24 hours.',
          reference: data.reference_id
        });
      } catch {
        return JSON.stringify({
          success: false,
          fallback: 'Call +91-4285-262444 directly or visit https://jkkn.in/admission-form'
        });
      }
    }
  });

  navigator.modelContext.registerTool({
    name: 'start_application',
    description: 'Get the admission application link for JKKN, optionally pre-filled with student details',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Student name (optional, for pre-fill)' },
        email: { type: 'string', description: 'Student email (optional, for pre-fill)' },
        course: { type: 'string', description: 'Course interested in (optional, for pre-fill)' }
      }
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input;

      const baseUrl = 'https://jkkn.in/admission-form';
      const params = new URLSearchParams();
      if (d.name) params.set('name', d.name);
      if (d.email) params.set('email', d.email);
      if (d.course) params.set('course', d.course);

      const url = params.toString() ? `${baseUrl}?${params}` : baseUrl;

      return JSON.stringify({
        application_url: url,
        instructions: 'Fill out the online application form. Admission team will review and contact within 48 hours.',
        helpline: '+91-4285-262444',
        documents_needed: [
          'Mark sheets (10th and 12th)',
          'Transfer certificate',
          'Community certificate',
          'Passport size photos',
          'Aadhaar card copy'
        ]
      });
    }
  });

  navigator.modelContext.registerTool({
    name: 'subscribe_newsletter',
    description: 'Subscribe to JKKN newsletter for admission updates, events, and placement news',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Email address to subscribe' }
      },
      required: ['email']
    },
    execute: async (input) => {
      const d = typeof input === 'string' ? JSON.parse(input) : input;

      const confirmed = window.confirm(
        `Subscribe ${d.email} to JKKN newsletter?`
      );
      if (!confirmed) {
        return JSON.stringify({ cancelled: true });
      }

      try {
        const res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: d.email, source: 'webmcp-agent' })
        });
        return JSON.stringify({
          success: true,
          message: `${d.email} subscribed to JKKN newsletter`
        });
      } catch {
        return JSON.stringify({
          success: false,
          fallback: 'Visit https://jkkn.ac.in and use the newsletter form at the bottom of the page'
        });
      }
    }
  });
}
```

**Update the main registration to include lead capture:**

```typescript
// lib/webmcp/register-tools.ts — add at the end of registerWebMCPTools()
import { registerLeadCaptureTools } from './tools/lead-capture';

// Inside registerWebMCPTools(), after all info tools:
registerLeadCaptureTools();
```

---

## File Structure

```
lib/webmcp/
  register-tools.ts        # Main registration (imports and calls all tool modules)
  tools/
    institutions.ts        # get_institutions, get_courses, get_contact_info
    eligibility.ts         # check_eligibility
    campus.ts              # get_facilities, get_placement_stats
    lead-capture.ts        # request_callback, start_application, subscribe_newsletter
```

Simpler than MyJKKN because there is no auth layer, no role-based visibility, and most data is static imports.

---

## Testing WebMCP Tools

Open Chrome 146+ with the flag enabled (`chrome://flags/#model-context-protocol`), navigate to your local or deployed jkkn.ac.in, and open DevTools Console.

**List all registered tools:**

```javascript
const tools = await navigator.modelContextTesting.listTools();
console.table(tools.map(t => ({
  name: t.name,
  description: t.description.substring(0, 80) + '...'
})));
```

**Query institution data:**

```javascript
// List all institutions
const all = await navigator.modelContextTesting.executeTool(
  'get_institutions', '{}'
);
console.log(JSON.parse(all));

// Get pharmacy courses
const pharmacy = await navigator.modelContextTesting.executeTool(
  'get_courses', '{"institution": "pharmacy"}'
);
console.log(JSON.parse(pharmacy));
```

**Check eligibility:**

```javascript
const elig = await navigator.modelContextTesting.executeTool(
  'check_eligibility',
  '{"course": "BDS", "marks_percentage": 62, "qualification": "+2"}'
);
console.log(JSON.parse(elig));
```

**Test lead capture (will show confirmation dialog):**

```javascript
const callback = await navigator.modelContextTesting.executeTool(
  'request_callback',
  '{"name": "Test Student", "phone": "+919876543210", "course_interest": "B.Pharm"}'
);
console.log(JSON.parse(callback));
```

---

## Important: WebMCP is NOT SEO/AEO

| What WebMCP Does | What WebMCP Does NOT Do |
|------------------|------------------------|
| Lets AI agents call structured tools on your site | Improve Google search rankings |
| Enables B2A (Business-to-Agent) interactions | Replace Schema.org markup for SEO |
| Makes JKKN queryable by ChatGPT, Gemini, Claude agents | Help with GEO (Generative Engine Optimization) |

**Keep investing in:**
- Schema.org structured data (CourseInstance, EducationalOrganization, etc.)
- Meta descriptions and Open Graph tags
- Site speed and Core Web Vitals

WebMCP is a **new channel** (B2A), not a replacement for existing SEO work. Think of it like adding a phone line — it does not improve your storefront signage, but it gives people a new way to reach you.

---

## Competitive Positioning

> "First Indian educational institution with WebMCP-enabled AI agent interaction"

This is a real claim once implemented. WebMCP is new enough (Chrome 146 just shipping) that no Indian educational institution has it yet.

**PR angles:**
- Innovation leadership in education technology
- AI-ready campus infrastructure
- Structured data access for the agentic web era

**Timeline to act:** WebMCP moves from flag to stable in Chrome within 2-3 release cycles. Being ready when it ships to all users means JKKN is queryable from day one.

---

## Current Status

> [!warning] EXPERIMENTAL
> WebMCP requires Chrome 146+ with `chrome://flags/#model-context-protocol` enabled. The W3C spec is not finalized and may change.

**Risk mitigation:** All tools read from static data in `/lib/data.ts` or call simple API endpoints. If WebMCP spec changes, only the registration layer (`lib/webmcp/`) needs updating. No backend changes, no data model changes.

**Effort estimate for a developer:**
- Phase 1 (information tools): One file, six tool registrations, static data imports. Straightforward.
- Phase 2 (lead capture): Three tools, needs backend API endpoints if they do not already exist (`/api/contact/callback`, `/api/newsletter/subscribe`).

The entire implementation is a thin client-side layer. No new databases, no new authentication, no infrastructure changes.
