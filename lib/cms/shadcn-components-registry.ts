/**
 * shadcn/ui Components Registry for CMS Page Builder
 *
 * This file contains metadata for all shadcn/ui components that can be used
 * in the page builder. Components are organized by subcategory and include
 * preview images, descriptions, and default props.
 */

import { z } from 'zod'

// ==========================================
// Types
// ==========================================

export type ShadcnSubcategory = 'form' | 'display' | 'navigation' | 'feedback' | 'data' | 'layout'

export interface ShadcnComponentEntry {
  name: string
  displayName: string
  description: string
  subcategory: ShadcnSubcategory
  icon: string
  previewImage?: string
  defaultProps: Record<string, unknown>
  keywords?: string[]
  propsSchema: z.ZodSchema
}

export type ShadcnComponentRegistry = Record<string, ShadcnComponentEntry>

// ==========================================
// Prop Schemas
// ==========================================

// Form component schemas
const ButtonPropsSchema = z.object({
  text: z.string().default('Button'),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).default('default'),
  size: z.enum(['default', 'sm', 'lg', 'icon']).default('default'),
  disabled: z.boolean().default(false),
  link: z.string().optional(),
})

const InputPropsSchema = z.object({
  placeholder: z.string().default('Enter text...'),
  type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url']).default('text'),
  disabled: z.boolean().default(false),
  label: z.string().optional(),
})

const TextareaPropsSchema = z.object({
  placeholder: z.string().default('Enter text...'),
  rows: z.number().min(1).max(20).default(4),
  disabled: z.boolean().default(false),
  label: z.string().optional(),
})

const SelectPropsSchema = z.object({
  placeholder: z.string().default('Select an option'),
  options: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  disabled: z.boolean().default(false),
  label: z.string().optional(),
})

const CheckboxPropsSchema = z.object({
  label: z.string().default('Checkbox label'),
  checked: z.boolean().default(false),
  disabled: z.boolean().default(false),
})

const RadioGroupPropsSchema = z.object({
  options: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  defaultValue: z.string().optional(),
  label: z.string().optional(),
})

const SwitchPropsSchema = z.object({
  label: z.string().default('Toggle'),
  checked: z.boolean().default(false),
  disabled: z.boolean().default(false),
})

const SliderPropsSchema = z.object({
  min: z.number().default(0),
  max: z.number().default(100),
  step: z.number().default(1),
  defaultValue: z.number().default(50),
  label: z.string().optional(),
})

const TogglePropsSchema = z.object({
  text: z.string().default('Toggle'),
  variant: z.enum(['default', 'outline']).default('default'),
  pressed: z.boolean().default(false),
})

const DatePickerPropsSchema = z.object({
  label: z.string().default('Select date'),
  placeholder: z.string().default('Pick a date'),
  disabled: z.boolean().default(false),
})

// Display component schemas
const CardPropsSchema = z.object({
  title: z.string().default('Card Title'),
  description: z.string().optional(),
  content: z.string().default('Card content goes here.'),
  footer: z.string().optional(),
  showHeader: z.boolean().default(true),
  showFooter: z.boolean().default(false),
})

const BadgePropsSchema = z.object({
  text: z.string().default('Badge'),
  variant: z.enum(['default', 'secondary', 'destructive', 'outline']).default('default'),
})

const AvatarPropsSchema = z.object({
  src: z.string().optional(),
  alt: z.string().default('Avatar'),
  fallback: z.string().default('CN'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
})

const AlertPropsSchema = z.object({
  title: z.string().default('Alert'),
  description: z.string().default('This is an alert message.'),
  variant: z.enum(['default', 'destructive']).default('default'),
})

const ProgressPropsSchema = z.object({
  value: z.number().min(0).max(100).default(50),
  showLabel: z.boolean().default(false),
})

const SkeletonPropsSchema = z.object({
  width: z.string().default('100%'),
  height: z.string().default('20px'),
  variant: z.enum(['default', 'circular', 'rounded']).default('default'),
})

const SeparatorPropsSchema = z.object({
  orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
})

const AspectRatioPropsSchema = z.object({
  ratio: z.number().default(16 / 9),
  src: z.string().optional(),
  alt: z.string().default('Image'),
})

// Navigation component schemas
const TabsPropsSchema = z.object({
  tabs: z.array(z.object({
    value: z.string(),
    label: z.string(),
    content: z.string(),
  })).default([]),
  defaultValue: z.string().optional(),
})

const NavigationMenuPropsSchema = z.object({
  items: z.array(z.object({
    title: z.string(),
    href: z.string().optional(),
    children: z.array(z.object({
      title: z.string(),
      href: z.string(),
      description: z.string().optional(),
    })).optional(),
  })).default([]),
})

const BreadcrumbPropsSchema = z.object({
  items: z.array(z.object({
    label: z.string(),
    href: z.string().optional(),
  })).default([]),
  separator: z.string().default('/'),
})

const PaginationPropsSchema = z.object({
  currentPage: z.number().default(1),
  totalPages: z.number().default(10),
  showPrevNext: z.boolean().default(true),
  showFirstLast: z.boolean().default(false),
})

const ContextMenuPropsSchema = z.object({
  triggerText: z.string().default('Right-click me'),
  items: z.array(z.object({
    label: z.string(),
    shortcut: z.string().optional(),
    disabled: z.boolean().optional(),
  })).default([]),
})

const DropdownMenuPropsSchema = z.object({
  triggerText: z.string().default('Open Menu'),
  items: z.array(z.object({
    label: z.string(),
    shortcut: z.string().optional(),
    disabled: z.boolean().optional(),
  })).default([]),
})

// Feedback component schemas
const DialogPropsSchema = z.object({
  triggerText: z.string().default('Open Dialog'),
  title: z.string().default('Dialog Title'),
  description: z.string().default('Dialog description goes here.'),
  content: z.string().optional(),
  showFooter: z.boolean().default(true),
})

const SheetPropsSchema = z.object({
  triggerText: z.string().default('Open Sheet'),
  title: z.string().default('Sheet Title'),
  description: z.string().default('Sheet description goes here.'),
  side: z.enum(['top', 'right', 'bottom', 'left']).default('right'),
})

const PopoverPropsSchema = z.object({
  triggerText: z.string().default('Open Popover'),
  content: z.string().default('Popover content goes here.'),
})

const TooltipPropsSchema = z.object({
  triggerText: z.string().default('Hover me'),
  content: z.string().default('Tooltip content'),
  side: z.enum(['top', 'right', 'bottom', 'left']).default('top'),
})

const AlertDialogPropsSchema = z.object({
  triggerText: z.string().default('Delete'),
  title: z.string().default('Are you sure?'),
  description: z.string().default('This action cannot be undone.'),
  cancelText: z.string().default('Cancel'),
  confirmText: z.string().default('Continue'),
})

const HoverCardPropsSchema = z.object({
  triggerText: z.string().default('Hover me'),
  title: z.string().default('Card Title'),
  description: z.string().default('Card description goes here.'),
})

// Data component schemas
const TablePropsSchema = z.object({
  caption: z.string().optional(),
  headers: z.array(z.string()).default(['Name', 'Email', 'Role']),
  rows: z.array(z.array(z.string())).default([
    ['John Doe', 'john@example.com', 'Developer'],
    ['Jane Smith', 'jane@example.com', 'Designer'],
    ['Bob Johnson', 'bob@example.com', 'Manager'],
  ]),
  striped: z.boolean().default(true),
  bordered: z.boolean().default(true),
  hoverable: z.boolean().default(true),
  compact: z.boolean().default(false),
  responsive: z.boolean().default(true),
  headerStyle: z.enum(['default', 'dark', 'accent']).default('default'),
  columnAlignment: z.array(z.enum(['left', 'center', 'right'])).default(['left', 'left', 'left']),
  showCaption: z.boolean().default(true),
  captionPosition: z.enum(['top', 'bottom']).default('bottom'),
})

const CalendarPropsSchema = z.object({
  mode: z.enum(['single', 'multiple', 'range']).default('single'),
  showOutsideDays: z.boolean().default(true),
})

const CarouselPropsSchema = z.object({
  items: z.array(z.object({
    content: z.string(),
    image: z.string().optional(),
  })).default([]),
  orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
  autoplay: z.boolean().default(false),
})

const CollapsiblePropsSchema = z.object({
  triggerText: z.string().default('Toggle'),
  content: z.string().default('Collapsible content goes here.'),
  defaultOpen: z.boolean().default(false),
})

const AccordionPropsSchema = z.object({
  items: z.array(z.object({
    trigger: z.string(),
    content: z.string(),
  })).default([]),
  type: z.enum(['single', 'multiple']).default('single'),
  collapsible: z.boolean().default(true),
})

const CommandPropsSchema = z.object({
  placeholder: z.string().default('Type a command or search...'),
  items: z.array(z.object({
    heading: z.string().optional(),
    commands: z.array(z.object({
      label: z.string(),
      shortcut: z.string().optional(),
    })),
  })).default([]),
})

// Layout component schemas
const ScrollAreaPropsSchema = z.object({
  height: z.string().default('300px'),
  content: z.string().default('Scrollable content goes here.'),
})

const ResizablePropsSchema = z.object({
  direction: z.enum(['horizontal', 'vertical']).default('horizontal'),
  defaultSize: z.number().default(50),
})

const FormPropsSchema = z.object({
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'email', 'password', 'textarea', 'select', 'checkbox']),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
  })).default([]),
  submitText: z.string().default('Submit'),
})

const SidebarPropsSchema = z.object({
  items: z.array(z.object({
    icon: z.string().optional(),
    label: z.string(),
    href: z.string(),
  })).default([]),
  collapsible: z.boolean().default(true),
})

// ==========================================
// Component Registry
// ==========================================

export const SHADCN_COMPONENTS: ShadcnComponentRegistry = {
  // ==========================================
  // Form Components
  // ==========================================
  ShadcnButton: {
    name: 'ShadcnButton',
    displayName: 'Button',
    description: 'Interactive button with multiple variants and sizes',
    subcategory: 'form',
    icon: 'MousePointerClick',
    previewImage: '/cms-previews/shadcn/Button.png',
    defaultProps: {
      text: 'Button',
      variant: 'default',
      size: 'default',
      disabled: false,
    },
    keywords: ['button', 'click', 'action', 'submit'],
    propsSchema: ButtonPropsSchema,
  },

  ShadcnInput: {
    name: 'ShadcnInput',
    displayName: 'Input',
    description: 'Text input field with various types',
    subcategory: 'form',
    icon: 'TextCursor',
    previewImage: '/cms-previews/shadcn/Input.png',
    defaultProps: {
      placeholder: 'Enter text...',
      type: 'text',
      disabled: false,
    },
    keywords: ['input', 'text', 'field', 'form'],
    propsSchema: InputPropsSchema,
  },

  ShadcnTextarea: {
    name: 'ShadcnTextarea',
    displayName: 'Textarea',
    description: 'Multi-line text input field',
    subcategory: 'form',
    icon: 'AlignLeft',
    previewImage: '/cms-previews/shadcn/Textarea.png',
    defaultProps: {
      placeholder: 'Enter text...',
      rows: 4,
      disabled: false,
    },
    keywords: ['textarea', 'multiline', 'text', 'form'],
    propsSchema: TextareaPropsSchema,
  },

  ShadcnSelect: {
    name: 'ShadcnSelect',
    displayName: 'Select',
    description: 'Dropdown select with customizable options',
    subcategory: 'form',
    icon: 'ChevronDown',
    previewImage: '/cms-previews/shadcn/Select.png',
    defaultProps: {
      placeholder: 'Select an option',
      options: [],
      disabled: false,
    },
    keywords: ['select', 'dropdown', 'options', 'form'],
    propsSchema: SelectPropsSchema,
  },

  ShadcnCheckbox: {
    name: 'ShadcnCheckbox',
    displayName: 'Checkbox',
    description: 'Checkbox input with label',
    subcategory: 'form',
    icon: 'CheckSquare',
    previewImage: '/cms-previews/shadcn/Checkbox.png',
    defaultProps: {
      label: 'Checkbox label',
      checked: false,
      disabled: false,
    },
    keywords: ['checkbox', 'check', 'toggle', 'form'],
    propsSchema: CheckboxPropsSchema,
  },

  ShadcnRadioGroup: {
    name: 'ShadcnRadioGroup',
    displayName: 'Radio Group',
    description: 'Group of radio buttons for single selection',
    subcategory: 'form',
    icon: 'Circle',
    previewImage: '/cms-previews/shadcn/RadioGroup.png',
    defaultProps: {
      options: [],
    },
    keywords: ['radio', 'options', 'single', 'form'],
    propsSchema: RadioGroupPropsSchema,
  },

  ShadcnSwitch: {
    name: 'ShadcnSwitch',
    displayName: 'Switch',
    description: 'Toggle switch for on/off states',
    subcategory: 'form',
    icon: 'ToggleLeft',
    previewImage: '/cms-previews/shadcn/Switch.png',
    defaultProps: {
      label: 'Toggle',
      checked: false,
      disabled: false,
    },
    keywords: ['switch', 'toggle', 'on', 'off', 'form'],
    propsSchema: SwitchPropsSchema,
  },

  ShadcnSlider: {
    name: 'ShadcnSlider',
    displayName: 'Slider',
    description: 'Range slider for numeric input',
    subcategory: 'form',
    icon: 'SlidersHorizontal',
    previewImage: '/cms-previews/shadcn/Slider.png',
    defaultProps: {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
    },
    keywords: ['slider', 'range', 'number', 'form'],
    propsSchema: SliderPropsSchema,
  },

  ShadcnToggle: {
    name: 'ShadcnToggle',
    displayName: 'Toggle',
    description: 'Toggle button with pressed state',
    subcategory: 'form',
    icon: 'ToggleRight',
    previewImage: '/cms-previews/shadcn/Toggle.png',
    defaultProps: {
      text: 'Toggle',
      variant: 'default',
      pressed: false,
    },
    keywords: ['toggle', 'button', 'pressed', 'form'],
    propsSchema: TogglePropsSchema,
  },

  ShadcnDatePicker: {
    name: 'ShadcnDatePicker',
    displayName: 'Date Picker',
    description: 'Date selection with calendar popup',
    subcategory: 'form',
    icon: 'Calendar',
    previewImage: '/cms-previews/shadcn/DatePicker.png',
    defaultProps: {
      label: 'Select date',
      placeholder: 'Pick a date',
      disabled: false,
    },
    keywords: ['date', 'calendar', 'picker', 'form'],
    propsSchema: DatePickerPropsSchema,
  },

  // ==========================================
  // Display Components
  // ==========================================
  ShadcnCard: {
    name: 'ShadcnCard',
    displayName: 'Card',
    description: 'Container card with header, content, and footer',
    subcategory: 'display',
    icon: 'Square',
    previewImage: '/cms-previews/shadcn/Card.png',
    defaultProps: {
      title: 'Card Title',
      description: 'Card description',
      content: 'Card content goes here.',
      showHeader: true,
      showFooter: false,
    },
    keywords: ['card', 'container', 'box', 'panel'],
    propsSchema: CardPropsSchema,
  },

  ShadcnBadge: {
    name: 'ShadcnBadge',
    displayName: 'Badge',
    description: 'Small status indicator badge',
    subcategory: 'display',
    icon: 'Tag',
    previewImage: '/cms-previews/shadcn/Badge.png',
    defaultProps: {
      text: 'Badge',
      variant: 'default',
    },
    keywords: ['badge', 'tag', 'label', 'status'],
    propsSchema: BadgePropsSchema,
  },

  ShadcnAvatar: {
    name: 'ShadcnAvatar',
    displayName: 'Avatar',
    description: 'User avatar with image and fallback',
    subcategory: 'display',
    icon: 'User',
    previewImage: '/cms-previews/shadcn/Avatar.png',
    defaultProps: {
      fallback: 'CN',
      size: 'md',
    },
    keywords: ['avatar', 'user', 'profile', 'image'],
    propsSchema: AvatarPropsSchema,
  },

  ShadcnAlert: {
    name: 'ShadcnAlert',
    displayName: 'Alert',
    description: 'Alert message with icon and description',
    subcategory: 'display',
    icon: 'AlertCircle',
    previewImage: '/cms-previews/shadcn/Alert.png',
    defaultProps: {
      title: 'Alert',
      description: 'This is an alert message.',
      variant: 'default',
    },
    keywords: ['alert', 'message', 'notification', 'warning'],
    propsSchema: AlertPropsSchema,
  },

  ShadcnProgress: {
    name: 'ShadcnProgress',
    displayName: 'Progress',
    description: 'Progress bar indicator',
    subcategory: 'display',
    icon: 'Loader',
    previewImage: '/cms-previews/shadcn/Progress.png',
    defaultProps: {
      value: 50,
      showLabel: false,
    },
    keywords: ['progress', 'loading', 'bar', 'percentage'],
    propsSchema: ProgressPropsSchema,
  },

  ShadcnSkeleton: {
    name: 'ShadcnSkeleton',
    displayName: 'Skeleton',
    description: 'Loading placeholder skeleton',
    subcategory: 'display',
    icon: 'Loader2',
    previewImage: '/cms-previews/shadcn/Skeleton.png',
    defaultProps: {
      width: '100%',
      height: '20px',
      variant: 'default',
    },
    keywords: ['skeleton', 'loading', 'placeholder'],
    propsSchema: SkeletonPropsSchema,
  },

  ShadcnSeparator: {
    name: 'ShadcnSeparator',
    displayName: 'Separator',
    description: 'Visual separator line',
    subcategory: 'display',
    icon: 'Minus',
    previewImage: '/cms-previews/shadcn/Separator.png',
    defaultProps: {
      orientation: 'horizontal',
    },
    keywords: ['separator', 'divider', 'line', 'hr'],
    propsSchema: SeparatorPropsSchema,
  },

  ShadcnAspectRatio: {
    name: 'ShadcnAspectRatio',
    displayName: 'Aspect Ratio',
    description: 'Container with fixed aspect ratio',
    subcategory: 'display',
    icon: 'Maximize',
    previewImage: '/cms-previews/shadcn/AspectRatio.png',
    defaultProps: {
      ratio: 16 / 9,
    },
    keywords: ['aspect', 'ratio', 'container', 'image'],
    propsSchema: AspectRatioPropsSchema,
  },

  // ==========================================
  // Navigation Components
  // ==========================================
  ShadcnTabs: {
    name: 'ShadcnTabs',
    displayName: 'Tabs',
    description: 'Tabbed content navigation',
    subcategory: 'navigation',
    icon: 'LayoutList',
    previewImage: '/cms-previews/shadcn/Tabs.png',
    defaultProps: {
      tabs: [],
    },
    keywords: ['tabs', 'navigation', 'panels'],
    propsSchema: TabsPropsSchema,
  },

  ShadcnNavigationMenu: {
    name: 'ShadcnNavigationMenu',
    displayName: 'Navigation Menu',
    description: 'Horizontal navigation menu with dropdowns',
    subcategory: 'navigation',
    icon: 'Menu',
    previewImage: '/cms-previews/shadcn/NavigationMenu.png',
    defaultProps: {
      items: [],
    },
    keywords: ['navigation', 'menu', 'nav', 'header'],
    propsSchema: NavigationMenuPropsSchema,
  },

  ShadcnBreadcrumb: {
    name: 'ShadcnBreadcrumb',
    displayName: 'Breadcrumb',
    description: 'Breadcrumb navigation trail',
    subcategory: 'navigation',
    icon: 'ChevronRight',
    previewImage: '/cms-previews/shadcn/Breadcrumb.png',
    defaultProps: {
      items: [],
      separator: '/',
    },
    keywords: ['breadcrumb', 'navigation', 'path', 'trail'],
    propsSchema: BreadcrumbPropsSchema,
  },

  ShadcnPagination: {
    name: 'ShadcnPagination',
    displayName: 'Pagination',
    description: 'Page navigation controls',
    subcategory: 'navigation',
    icon: 'MoreHorizontal',
    previewImage: '/cms-previews/shadcn/Pagination.png',
    defaultProps: {
      currentPage: 1,
      totalPages: 10,
      showPrevNext: true,
      showFirstLast: false,
    },
    keywords: ['pagination', 'pages', 'navigation'],
    propsSchema: PaginationPropsSchema,
  },

  ShadcnContextMenu: {
    name: 'ShadcnContextMenu',
    displayName: 'Context Menu',
    description: 'Right-click context menu',
    subcategory: 'navigation',
    icon: 'MousePointer',
    previewImage: '/cms-previews/shadcn/ContextMenu.png',
    defaultProps: {
      triggerText: 'Right-click me',
      items: [],
    },
    keywords: ['context', 'menu', 'right-click'],
    propsSchema: ContextMenuPropsSchema,
  },

  ShadcnDropdownMenu: {
    name: 'ShadcnDropdownMenu',
    displayName: 'Dropdown Menu',
    description: 'Dropdown menu with actions',
    subcategory: 'navigation',
    icon: 'ChevronDown',
    previewImage: '/cms-previews/shadcn/DropdownMenu.png',
    defaultProps: {
      triggerText: 'Open Menu',
      items: [],
    },
    keywords: ['dropdown', 'menu', 'actions'],
    propsSchema: DropdownMenuPropsSchema,
  },

  // ==========================================
  // Feedback Components
  // ==========================================
  ShadcnDialog: {
    name: 'ShadcnDialog',
    displayName: 'Dialog',
    description: 'Modal dialog for important content',
    subcategory: 'feedback',
    icon: 'MessageSquare',
    previewImage: '/cms-previews/shadcn/Dialog.png',
    defaultProps: {
      triggerText: 'Open Dialog',
      title: 'Dialog Title',
      description: 'Dialog description goes here.',
      showFooter: true,
    },
    keywords: ['dialog', 'modal', 'popup'],
    propsSchema: DialogPropsSchema,
  },

  ShadcnSheet: {
    name: 'ShadcnSheet',
    displayName: 'Sheet',
    description: 'Slide-out panel from edge of screen',
    subcategory: 'feedback',
    icon: 'PanelRight',
    previewImage: '/cms-previews/shadcn/Sheet.png',
    defaultProps: {
      triggerText: 'Open Sheet',
      title: 'Sheet Title',
      description: 'Sheet description goes here.',
      side: 'right',
    },
    keywords: ['sheet', 'drawer', 'panel', 'slide'],
    propsSchema: SheetPropsSchema,
  },

  ShadcnPopover: {
    name: 'ShadcnPopover',
    displayName: 'Popover',
    description: 'Floating popover content',
    subcategory: 'feedback',
    icon: 'MessageCircle',
    previewImage: '/cms-previews/shadcn/Popover.png',
    defaultProps: {
      triggerText: 'Open Popover',
      content: 'Popover content goes here.',
    },
    keywords: ['popover', 'popup', 'floating'],
    propsSchema: PopoverPropsSchema,
  },

  ShadcnTooltip: {
    name: 'ShadcnTooltip',
    displayName: 'Tooltip',
    description: 'Hover tooltip for additional info',
    subcategory: 'feedback',
    icon: 'Info',
    previewImage: '/cms-previews/shadcn/Tooltip.png',
    defaultProps: {
      triggerText: 'Hover me',
      content: 'Tooltip content',
      side: 'top',
    },
    keywords: ['tooltip', 'hover', 'help', 'info'],
    propsSchema: TooltipPropsSchema,
  },

  ShadcnAlertDialog: {
    name: 'ShadcnAlertDialog',
    displayName: 'Alert Dialog',
    description: 'Confirmation dialog for critical actions',
    subcategory: 'feedback',
    icon: 'AlertTriangle',
    previewImage: '/cms-previews/shadcn/AlertDialog.png',
    defaultProps: {
      triggerText: 'Delete',
      title: 'Are you sure?',
      description: 'This action cannot be undone.',
      cancelText: 'Cancel',
      confirmText: 'Continue',
    },
    keywords: ['alert', 'dialog', 'confirm', 'warning'],
    propsSchema: AlertDialogPropsSchema,
  },

  ShadcnHoverCard: {
    name: 'ShadcnHoverCard',
    displayName: 'Hover Card',
    description: 'Card that appears on hover',
    subcategory: 'feedback',
    icon: 'CreditCard',
    previewImage: '/cms-previews/shadcn/HoverCard.png',
    defaultProps: {
      triggerText: 'Hover me',
      title: 'Card Title',
      description: 'Card description goes here.',
    },
    keywords: ['hover', 'card', 'preview'],
    propsSchema: HoverCardPropsSchema,
  },

  // ==========================================
  // Data Components
  // ==========================================
  ShadcnTable: {
    name: 'ShadcnTable',
    displayName: 'Table',
    description: 'Data table with headers and rows',
    subcategory: 'data',
    icon: 'Table',
    previewImage: '/cms-previews/shadcn/Table.png',
    defaultProps: {
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [],
    },
    keywords: ['table', 'data', 'grid', 'rows'],
    propsSchema: TablePropsSchema,
  },

  ShadcnCalendar: {
    name: 'ShadcnCalendar',
    displayName: 'Calendar',
    description: 'Interactive calendar for date selection',
    subcategory: 'data',
    icon: 'Calendar',
    previewImage: '/cms-previews/shadcn/Calendar.png',
    defaultProps: {
      mode: 'single',
      showOutsideDays: true,
    },
    keywords: ['calendar', 'date', 'picker'],
    propsSchema: CalendarPropsSchema,
  },

  ShadcnCarousel: {
    name: 'ShadcnCarousel',
    displayName: 'Carousel',
    description: 'Carousel slider for content',
    subcategory: 'data',
    icon: 'GalleryHorizontal',
    previewImage: '/cms-previews/shadcn/Carousel.png',
    defaultProps: {
      items: [],
      orientation: 'horizontal',
      autoplay: false,
    },
    keywords: ['carousel', 'slider', 'gallery'],
    propsSchema: CarouselPropsSchema,
  },

  ShadcnCollapsible: {
    name: 'ShadcnCollapsible',
    displayName: 'Collapsible',
    description: 'Expandable/collapsible content section',
    subcategory: 'data',
    icon: 'ChevronsUpDown',
    previewImage: '/cms-previews/shadcn/Collapsible.png',
    defaultProps: {
      triggerText: 'Toggle',
      content: 'Collapsible content goes here.',
      defaultOpen: false,
    },
    keywords: ['collapsible', 'expand', 'collapse', 'toggle'],
    propsSchema: CollapsiblePropsSchema,
  },

  ShadcnAccordion: {
    name: 'ShadcnAccordion',
    displayName: 'Accordion',
    description: 'Accordion for expandable sections',
    subcategory: 'data',
    icon: 'ChevronDown',
    previewImage: '/cms-previews/shadcn/Accordion.png',
    defaultProps: {
      items: [],
      type: 'single',
      collapsible: true,
    },
    keywords: ['accordion', 'faq', 'expand', 'collapse'],
    propsSchema: AccordionPropsSchema,
  },

  ShadcnCommand: {
    name: 'ShadcnCommand',
    displayName: 'Command',
    description: 'Command palette for quick actions',
    subcategory: 'data',
    icon: 'Command',
    previewImage: '/cms-previews/shadcn/Command.png',
    defaultProps: {
      placeholder: 'Type a command or search...',
      items: [],
    },
    keywords: ['command', 'search', 'palette', 'actions'],
    propsSchema: CommandPropsSchema,
  },

  // ==========================================
  // Layout Components
  // ==========================================
  ShadcnScrollArea: {
    name: 'ShadcnScrollArea',
    displayName: 'Scroll Area',
    description: 'Custom scrollable area',
    subcategory: 'layout',
    icon: 'ScrollText',
    previewImage: '/cms-previews/shadcn/ScrollArea.png',
    defaultProps: {
      height: '300px',
      content: 'Scrollable content goes here.',
    },
    keywords: ['scroll', 'area', 'overflow'],
    propsSchema: ScrollAreaPropsSchema,
  },

  ShadcnResizable: {
    name: 'ShadcnResizable',
    displayName: 'Resizable',
    description: 'Resizable panel layout',
    subcategory: 'layout',
    icon: 'PanelLeftClose',
    previewImage: '/cms-previews/shadcn/Resizable.png',
    defaultProps: {
      direction: 'horizontal',
      defaultSize: 50,
    },
    keywords: ['resizable', 'panel', 'split'],
    propsSchema: ResizablePropsSchema,
  },

  ShadcnForm: {
    name: 'ShadcnForm',
    displayName: 'Form',
    description: 'Form container with validation',
    subcategory: 'layout',
    icon: 'FileText',
    previewImage: '/cms-previews/shadcn/Form.png',
    defaultProps: {
      fields: [],
      submitText: 'Submit',
    },
    keywords: ['form', 'input', 'validation'],
    propsSchema: FormPropsSchema,
  },

  ShadcnSidebar: {
    name: 'ShadcnSidebar',
    displayName: 'Sidebar',
    description: 'Navigation sidebar layout',
    subcategory: 'layout',
    icon: 'PanelLeft',
    previewImage: '/cms-previews/shadcn/Sidebar.png',
    defaultProps: {
      items: [],
      collapsible: true,
    },
    keywords: ['sidebar', 'navigation', 'menu', 'layout'],
    propsSchema: SidebarPropsSchema,
  },
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get all shadcn components
 */
export function getAllShadcnComponents(): ShadcnComponentEntry[] {
  return Object.values(SHADCN_COMPONENTS)
}

/**
 * Get shadcn components by subcategory
 */
export function getShadcnComponentsBySubcategory(subcategory: ShadcnSubcategory): ShadcnComponentEntry[] {
  return Object.values(SHADCN_COMPONENTS).filter(
    (comp) => comp.subcategory === subcategory
  )
}

/**
 * Search shadcn components
 */
export function searchShadcnComponents(query: string): ShadcnComponentEntry[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(SHADCN_COMPONENTS).filter((comp) => {
    const matchesName = comp.name.toLowerCase().includes(lowerQuery) ||
      comp.displayName.toLowerCase().includes(lowerQuery)
    const matchesDescription = comp.description?.toLowerCase().includes(lowerQuery)
    const matchesKeywords = comp.keywords?.some((kw) => kw.toLowerCase().includes(lowerQuery))
    return matchesName || matchesDescription || matchesKeywords
  })
}

/**
 * Get shadcn component by name
 */
export function getShadcnComponent(name: string): ShadcnComponentEntry | null {
  return SHADCN_COMPONENTS[name] || null
}

/**
 * Get all subcategories
 */
export function getShadcnSubcategories(): ShadcnSubcategory[] {
  return ['form', 'display', 'navigation', 'feedback', 'data', 'layout']
}
