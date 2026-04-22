// Template: registry entry snippet for lib/cms/component-registry.ts
// Replace {PageName} / {page-name} / kebab-case slug with real values.
// Paste this entry into the COMPONENTS (or equivalent) object.

import { {PageName}, {PageName}Schema } from '@/components/cms-blocks/content/{page-name}'

// Inside the exported registry object:
{PageName}: {
  name: '{PageName}',
  component: {PageName},
  propsSchema: {PageName}Schema,
  category: 'content', // 'content' | 'layout' | 'media' | 'data'
  icon: 'Building2',   // Lucide icon name
  description: '{One-line description shown in the admin block picker}',
  defaultProps: {
    hero: {
      title: '{Page title}',
      backgroundImage: '/images/placeholder-hero.jpg',
      ctas: [],
    },
    intro: '{Short introduction paragraph}',
    features: [],
    gallery: [],
  },
},
