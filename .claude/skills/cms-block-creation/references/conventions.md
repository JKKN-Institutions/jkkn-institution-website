# CMS Block Conventions (JKKN)

Source of truth: `lib/cms/registry-types.ts`, `lib/cms/component-registry.ts`, and existing blocks
under `components/cms-blocks/`. Read one exemplar before writing a new block:
`components/cms-blocks/content/vision-mission.tsx`.

## File + naming

- File: `components/cms-blocks/<category>/<kebab-name>.tsx` (e.g. `feature-section.tsx`).
- Component, registry object key, and `name` field are all the **same PascalCase** identifier
  (e.g. `FeatureSection`). The lazy import variable must match too.
- Categories (`ComponentCategory`): `content`, `media`, `layout`, `data`, `shadcn`, `custom`, `admissions`.

## Component file rules

- Start with `'use client'`. Blocks animate, use hooks, and read editor state, so they are client components.
- **Default export the component.** The registry uses `lazy(() => import('...'))`, which resolves the
  module's default export. A named-only export will render nothing.
- Extend `BaseBlockProps` (from `lib/cms/registry-types.ts`): `id`, `className`, `style`, `isSelected`,
  `isEditing`, `children`. Spread `className`/`style` onto the root element so editor styling works.
- Resolve icons from a string via a local `iconMap: Record<string, LucideIcon>`. Props store the icon
  **name** (string), never the component, so values survive JSON storage in the database.

## Zod schema rules

- Name it `<BlockName>PropsSchema`. Export it.
- **Every field needs `.default(...)`** — blocks must render with zero props on first drop.
- **Every field should have `.describe(...)`** — used as help text in the editor.
- Reuse shared schemas from `registry-types.ts` when they fit: `CTAButtonSchema`, `ImageSchema`,
  `AlignmentSchema`, `ButtonVariantSchema`, `ResponsiveValueSchema(...)`.
- Export the type: `export type <BlockName>Props = z.infer<typeof <BlockName>PropsSchema> & BaseBlockProps`.

## Registry entry (`ComponentRegistryEntry`) fields

| Field | Required | Notes |
|-------|----------|-------|
| `name` | yes | PascalCase, unique, == object key == component identifier |
| `displayName` | yes | Human label in the block picker |
| `category` | yes | One of the categories above |
| `description` | yes | One line shown under the block in the picker |
| `icon` | yes | Lucide icon name (string) |
| `component` | yes | The lazy-imported component |
| `propsSchema` | yes | The Zod schema, cast `as any` |
| `defaultProps` | yes | Starter values applied when the block is dropped |
| `supportsChildren` | yes | `true` only for container/layout blocks |
| `isFullWidth` | no | `true` for hero/banners that break out of the page container |
| `previewImage` | no | `/cms-previews/<Name>.png` palette thumbnail |
| `editableProps` | no (but expected) | Drives the editor form — see below |

## `editableProps` field types

`EditableProp.type` is one of: `string`, `number`, `boolean`, `enum`, `array`, `object`, `color`,
`url`, `image`, `video`, `media`, `table`, `richtext`. Useful extras: `label`, `description`,
`required`, `multiline` (string), `options` (enum), `min`/`max`/`step`/`unit` (number),
`itemType` + `itemSchema` (array of objects), `properties` (object), `inlineEditable` (canvas editing).

## Brand tokens (defaults seen across blocks)

- Primary green: `#0b6d41`
- Accent gold/yellow: `#ffde59`
- Dark text: `#171717`
- Many blocks also accept a `backgroundColor` enum:
  `'gradient-dark' | 'gradient-light' | 'white-professional' | 'solid' | 'transparent'`.

Confirm current tokens with the `jkkn-design-system` skill rather than hardcoding new hex values.

## Optional animations

`registry-types.ts` exports `BlockAnimationSchema` and `ANIMATION_EDITABLE_PROPS`. To support
entrance/scroll/hover animations, add an optional `_animation` prop (extend `AnimatableBlockProps`)
and spread `ANIMATION_EDITABLE_PROPS` into the entry's `editableProps`.

## Common mistakes

- Forgetting the default export → block renders blank.
- Forgetting the registry entry → block never appears in the picker.
- Reusing an existing `name` → silently overrides another block.
- Storing an icon component instead of its string name → breaks DB serialization.
- A Zod field without `.default()` → block crashes when dropped with no props.
