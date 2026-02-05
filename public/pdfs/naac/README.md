# NAAC PDFs Storage

This folder contains all PDF documents related to NAAC accreditation for different institutions.

## Folder Structure

```
public/pdfs/naac/
├── iiqa/                    # Institutional Information for Quality Assessment
├── criterion-1/             # Curricular Aspects
├── criterion-2/             # Teaching-Learning and Evaluation
├── criterion-3/             # Research, Innovations and Extension
├── criterion-4/             # Infrastructure and Learning Resources
├── criterion-5/             # Student Support and Progression
├── criterion-6/             # Governance, Leadership and Management
├── criterion-7/             # Institutional Values and Best Practices
├── best-practices/          # Best Practices documents
├── distinctiveness/         # Institution Distinctiveness
├── feedback/                # Stakeholder Feedback documents
├── dvv/                     # DVV Clarifications
└── ssr/                     # Self Study Reports

```

## How to Add PDFs

1. **Download PDFs** from the old website or source
2. **Rename PDFs** with descriptive names (lowercase, hyphens, no spaces)
   - Example: `iiqa-april-2024.pdf`, `criterion-1-1-curricular-planning.pdf`
3. **Place in appropriate folder** based on the criterion/section
4. **Update the data file** (`lib/cms/templates/naac/`) with the local path

## URL Format

All PDFs in this folder are accessible via:
```
/pdfs/naac/{folder}/{filename}.pdf
```

Examples:
- `/pdfs/naac/iiqa/iiqa-april-2024.pdf`
- `/pdfs/naac/criterion-1/curricular-planning.pdf`
- `/pdfs/naac/ssr/ssr-cycle-1.pdf`

## Important Notes

- ✅ Always use local paths starting with `/pdfs/naac/`
- ✅ Use lowercase filenames with hyphens
- ✅ Keep original PDF names descriptive
- ❌ Do NOT use external URLs (https://engg.jkkn.ac.in/...)
- ❌ Do NOT use spaces in filenames

## Multi-Institution Support

Each institution (Main, Engineering, Dental, etc.) can have their own PDFs stored in these folders.
The folder structure is shared, but you can organize by institution if needed:

Option 1 (Shared folders):
```
/pdfs/naac/iiqa/engineering-iiqa-2024.pdf
/pdfs/naac/iiqa/dental-iiqa-2024.pdf
```

Option 2 (Institution-specific folders - if needed in future):
```
/pdfs/naac/engineering/iiqa/iiqa-2024.pdf
/pdfs/naac/dental/iiqa/iiqa-2024.pdf
```

Currently using **Option 1** (shared folders with descriptive filenames).
