/**
 * Utility to filter page-builder-specific props before passing to components
 *
 * The page builder passes internal props (isEditing, isSelected, etc.) to all components
 * in the canvas. These props should NOT reach native DOM elements as they cause React
 * warnings about invalid HTML attributes.
 *
 * This utility provides functions to:
 * 1. Filter out builder-specific props from component props
 * 2. Separate builder props from component props
 * 3. Type-safe prop filtering
 */

/**
 * List of reserved props used by the page builder
 * These props should not be passed to native DOM elements
 */
export const BUILDER_RESERVED_PROPS = [
  'isEditing',
  'isSelected',
  'blockId',
  // Note: 'id' is kept as it might be used legitimately by components
  // Note: 'children' is handled separately by React
] as const

export type BuilderReservedProp = typeof BUILDER_RESERVED_PROPS[number]

/**
 * Type for builder-specific props that get passed to components in the canvas
 */
export interface BuilderComponentProps {
  isEditing?: boolean
  isSelected?: boolean
  blockId?: string
  id?: string
  children?: React.ReactNode
  [key: string]: unknown
}

/**
 * Filters out page-builder-specific props from a props object
 *
 * @param props - The props object to filter
 * @returns A new props object without builder-specific props
 *
 * @example
 * const props = { title: "Hello", isEditing: true, isSelected: false }
 * const filtered = filterBuilderProps(props)
 * // Result: { title: "Hello" }
 */
export function filterBuilderProps<T extends Record<string, unknown>>(
  props: T
): Omit<T, BuilderReservedProp> {
  const filtered = { ...props }

  for (const prop of BUILDER_RESERVED_PROPS) {
    delete (filtered as Record<string, unknown>)[prop]
  }

  return filtered as Omit<T, BuilderReservedProp>
}

/**
 * Separates builder props from component props
 * Returns an object with both builder props and filtered component props
 *
 * @param props - The props object to separate
 * @returns Object containing builderProps and componentProps
 *
 * @example
 * const props = { title: "Hello", isEditing: true, isSelected: false }
 * const { builderProps, componentProps } = separateBuilderProps(props)
 * // builderProps: { isEditing: true, isSelected: false }
 * // componentProps: { title: "Hello" }
 */
export function separateBuilderProps<T extends Record<string, unknown>>(
  props: T
): {
  builderProps: Partial<Pick<BuilderComponentProps, BuilderReservedProp>>
  componentProps: Omit<T, BuilderReservedProp>
} {
  const builderProps: Partial<Pick<BuilderComponentProps, BuilderReservedProp>> = {}
  const componentProps = { ...props }

  for (const prop of BUILDER_RESERVED_PROPS) {
    if (prop in props) {
      builderProps[prop] = props[prop] as never
      delete (componentProps as Record<string, unknown>)[prop]
    }
  }

  return {
    builderProps,
    componentProps: componentProps as Omit<T, BuilderReservedProp>
  }
}

/**
 * Type guard to check if a component accepts builder props
 * Useful for conditional prop passing
 */
export function acceptsBuilderProps(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>
): boolean {
  // Check if component has displayName or name that indicates it accepts builder props
  const name = Component.displayName || Component.name

  // Components that need builder props typically have these patterns
  const builderAwarePatterns = [
    /Block$/i,          // e.g., HeroBlock, ContentBlock
    /Section$/i,        // e.g., HeroSection
    /Builder/i,         // e.g., BuilderComponent
    /Editable/i,        // e.g., EditableText
    /Canvas/i,          // e.g., CanvasElement
  ]

  return builderAwarePatterns.some(pattern => pattern.test(name))
}
