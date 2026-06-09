// Two edits in lib/cms/component-registry.ts. Replace "FeatureSection".

// --- EDIT 1: add near the other lazy() imports (~line 520) ---
const FeatureSection = lazy(() => import('@/components/cms-blocks/content/feature-section'))

// --- EDIT 2: add inside `export const COMPONENT_REGISTRY: ComponentRegistry = { ... }`
//            (~line 703), under the matching category comment block ---
FeatureSection: {
  name: 'FeatureSection',                 // MUST equal the object key + imported identifier (PascalCase)
  displayName: 'Feature Section',         // shown in the admin block picker
  category: 'content',                    // 'content' | 'media' | 'layout' | 'data' | 'admissions'
  description: 'Grid of feature cards with icon, title, and description',
  icon: 'LayoutGrid',                     // any Lucide icon name (string)
  // previewImage: '/cms-previews/FeatureSection.png', // optional palette thumbnail
  component: FeatureSection,
  propsSchema: FeatureSectionPropsSchema as any, // import the schema, or re-declare inline (existing entries do both)
  defaultProps: {
    title: 'Why Choose JKKN',
    subtitle: 'What sets us apart',
  },
  supportsChildren: false,                // true only for container blocks
  // isFullWidth: true,                    // uncomment for full-bleed hero/banner sections
  editableProps: [
    { name: 'title', type: 'string', label: 'Title', required: true },
    { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
    { name: 'items', type: 'array', label: 'Items', itemType: 'object' },
    { name: 'backgroundColor', type: 'color', label: 'Background Color' },
    { name: 'titleColor', type: 'color', label: 'Title Color' },
    { name: 'accentColor', type: 'color', label: 'Accent Color' },
  ],
},
