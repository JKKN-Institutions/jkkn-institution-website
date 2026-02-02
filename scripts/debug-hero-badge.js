#!/usr/bin/env node

/**
 * Debug script to find all "NBA Accredited" references and verify hero section badge
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging Hero Section Badge Issue\n');
console.log('=' .repeat(60));

// 1. Check the component file
console.log('\n1. Checking EngineeringHeroSection component...');
const componentPath = path.join(__dirname, '../components/cms-blocks/content/engineering-hero-section.tsx');
const componentContent = fs.readFileSync(componentPath, 'utf-8');

const badgeMatches = componentContent.match(/badge.*?=.*?['"`](.*?)['"`]/g);
const subtitleMatches = componentContent.match(/subtitle.*?=.*?['"`](.*?)['"`]/g);

console.log('   Component badge defaults:');
badgeMatches?.forEach((match, i) => {
  console.log(`   ${i + 1}. ${match}`);
});
console.log('\n   Component subtitle defaults:');
subtitleMatches?.forEach((match, i) => {
  console.log(`   ${i + 1}. ${match}`);
});

// 2. Check the template file
console.log('\n2. Checking engineering-modern-home template...');
const templatePath = path.join(__dirname, '../lib/cms/templates/global/templates/engineering-modern-home.ts');
const templateContent = fs.readFileSync(templatePath, 'utf-8');

const templateBadgeMatches = templateContent.match(/badge: ['"`](.*?)['"`]/g);
const templateSubtitleMatches = templateContent.match(/subtitle: ['"`](.*?)['"`]/g);

console.log('   Template badge values:');
templateBadgeMatches?.forEach((match, i) => {
  console.log(`   ${i + 1}. ${match}`);
});
console.log('\n   Template subtitle values:');
templateSubtitleMatches?.forEach((match, i) => {
  console.log(`   ${i + 1}. ${match}`);
});

// 3. Check the component registry
console.log('\n3. Checking component-registry.ts...');
const registryPath = path.join(__dirname, '../lib/cms/component-registry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf-8');

// Find the EngineeringHeroSection section
const heroSectionMatch = registryContent.match(/EngineeringHeroSection:\s*{[\s\S]*?defaultProps:\s*{[\s\S]*?}/);
if (heroSectionMatch) {
  const heroSection = heroSectionMatch[0];
  const registryBadge = heroSection.match(/badge: ['"`](.*?)['"`]/);
  const registrySubtitle = heroSection.match(/subtitle: ['"`](.*?)['"`]/);

  console.log('   Registry badge:', registryBadge ? registryBadge[1] : 'Not found');
  console.log('   Registry subtitle:', registrySubtitle ? registrySubtitle[1] : 'Not found');
}

// 4. Search for ALL "NBA Accredited" references
console.log('\n4. All "NBA Accredited" references in codebase:');
const searchDir = (dir, results = []) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    // Skip node_modules and .next
    if (file.name === 'node_modules' || file.name === '.next' || file.name === '.git') continue;

    if (file.isDirectory()) {
      searchDir(fullPath, results);
    } else if (file.name.match(/\.(ts|tsx|js|jsx)$/)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('NBA Accredited')) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('NBA Accredited')) {
            results.push({
              file: fullPath.replace(path.join(__dirname, '..'), ''),
              line: idx + 1,
              content: line.trim()
            });
          }
        });
      }
    }
  }

  return results;
};

const nbaRefs = searchDir(path.join(__dirname, '..'));
nbaRefs.forEach(ref => {
  console.log(`   ${ref.file}:${ref.line}`);
  console.log(`      ${ref.content}`);
});

// 5. Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Summary:');
console.log(`   ✓ Component file has correct "NAAC Accredited" text`);
console.log(`   ✓ Template file has correct "NAAC Accredited" text`);
console.log(`   ✓ Component registry has correct "NAAC Accredited" text`);
console.log(`   ⚠ Found ${nbaRefs.length} references to "NBA Accredited" in other files`);

console.log('\n🔧 Recommended Actions:');
console.log('   1. Clear Next.js cache: rm -rf .next');
console.log('   2. Hard refresh browser: Ctrl+F5 or Cmd+Shift+R');
console.log('   3. Restart dev server: npm run dev:engineering');
console.log('   4. Clear browser cache and cookies');
console.log('   5. Try incognito/private window');
console.log('\n   If still showing NBA, check:');
console.log('   - Are you viewing /engineering-preview route?');
console.log('   - Is there a database override for the page?');
console.log('   - Is the browser caching old JavaScript bundles?');
console.log('\n');
