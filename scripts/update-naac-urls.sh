#!/bin/bash

# Script to convert all external NAAC URLs to local paths
FILE="lib/cms/templates/naac/engineering-naac-overview.ts"

echo "🔄 Converting external URLs to local paths in $FILE..."

# IIQA
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/04/IIQA-18\.04\.2024\.pdf|/pdfs/naac/iiqa/iiqa-april-2024.pdf|g' "$FILE"

# Criterion 1
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria1\.1\.1curricularplanning-implementation\.pdf|/pdfs/naac/criterion-1/1-1-1-curricular-planning.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria1\.2academic-flexibility\.pdf|/pdfs/naac/criterion-1/1-2-academic-flexibility.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria1\.3\.pdf|/pdfs/naac/criterion-1/1-3-curriculum-enrichment.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria1\.4\.pdf|/pdfs/naac/criterion-1/1-4-feedback-system.pdf|g' "$FILE"

# Criterion 2
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria-2\.1\.pdf|/pdfs/naac/criterion-2/2-1-student-enrollment.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria-2\.2\.pdf|/pdfs/naac/criterion-2/2-2-catering-diversity.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria2\.3\.pdf|/pdfs/naac/criterion-2/2-3-teaching-learning.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria2\.4\.pdf|/pdfs/naac/criterion-2/2-4-teacher-profile.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria2\.5\.pdf|/pdfs/naac/criterion-2/2-5-evaluation-process.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria-2\.6\.pdf|/pdfs/naac/criterion-2/2-6-student-performance.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria2\.7\.pdf|/pdfs/naac/criterion-2/2-7-student-satisfaction.pdf|g' "$FILE"

# Criterion 3
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria3\.1\.pdf|/pdfs/naac/criterion-3/3-1-promotion-research.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria3\.2\.pdf|/pdfs/naac/criterion-3/3-2-resource-mobilization.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria3\.3\.pdf|/pdfs/naac/criterion-3/3-3-innovation-ecosystem.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria3\.4\.pdf|/pdfs/naac/criterion-3/3-4-research-publications.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria3\.5\.pdf|/pdfs/naac/criterion-3/3-5-consultancy.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria3\.6\.pdf|/pdfs/naac/criterion-3/3-6-extension-activities.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria3\.7\.pdf|/pdfs/naac/criterion-3/3-7-collaboration.pdf|g' "$FILE"

# Criterion 4
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria4\.1\.pdf|/pdfs/naac/criterion-4/4-1-physical-facilities.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria4\.2\.pdf|/pdfs/naac/criterion-4/4-2-library-services.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria4\.3\.pdf|/pdfs/naac/criterion-4/4-3-it-infrastructure.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria4\.4\.pdf|/pdfs/naac/criterion-4/4-4-infrastructure-maintenance.pdf|g' "$FILE"

# Criterion 5
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria5\.1\.pdf|/pdfs/naac/criterion-5/5-1-student-support.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria5\.2\.pdf|/pdfs/naac/criterion-5/5-2-student-progression.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria5\.3\.pdf|/pdfs/naac/criterion-5/5-3-student-participation.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria5\.4\.pdf|/pdfs/naac/criterion-5/5-4-alumni-engagement.pdf|g' "$FILE"

# Criterion 6
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria6\.1\.pdf|/pdfs/naac/criterion-6/6-1-institutional-vision.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria6\.2\.pdf|/pdfs/naac/criterion-6/6-2-strategy-development.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria6\.3\.pdf|/pdfs/naac/criterion-6/6-3-faculty-empowerment.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria6\.4\.pdf|/pdfs/naac/criterion-6/6-4-financial-management.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria6\.5\.pdf|/pdfs/naac/criterion-6/6-5-internal-quality.pdf|g' "$FILE"

# Criterion 7
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria7\.1\.pdf|/pdfs/naac/criterion-7/7-1-institutional-values.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria7\.2\.pdf|/pdfs/naac/criterion-7/7-2-best-practices.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/2024/06/criteria7\.3\.pdf|/pdfs/naac/criterion-7/7-3-institutional-distinctiveness.pdf|g' "$FILE"

# Best Practices
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/[^"]*best[^"]*\.pdf|/pdfs/naac/best-practices/best-practices.pdf|g' "$FILE"

# DVV
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/[^"]*dvv[^"]*\.pdf|/pdfs/naac/dvv/dvv-clarifications.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/[^"]*DVV[^"]*\.pdf|/pdfs/naac/dvv/dvv-clarifications.pdf|g' "$FILE"

# SSR
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/[^"]*ssr[^"]*\.pdf|/pdfs/naac/ssr/ssr-cycle-1.pdf|g' "$FILE"
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/[^"]*SSR[^"]*\.pdf|/pdfs/naac/ssr/ssr-cycle-1.pdf|g' "$FILE"

# Feedback
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/[^"]*feedback[^"]*\.pdf|/pdfs/naac/feedback/stakeholder-feedback.pdf|g' "$FILE"

# Generic fallback for any remaining URLs
sed -i 's|https://engg\.jkkn\.ac\.in/wp-content/uploads/|/pdfs/naac/|g' "$FILE"

echo "✅ URL conversion complete!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Download all PDFs from the external URLs"
echo "2. Rename them according to the new naming convention"
echo "3. Place them in public/pdfs/naac/{folder}/ directories"
echo "4. Test all links on the website"
echo ""
echo "📁 PDF folders created at: public/pdfs/naac/"
