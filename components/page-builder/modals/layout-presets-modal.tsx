'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Layout,
  Layers,
  Star,
  Users,
  Image,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Phone,
  Check,
  Plus,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  LAYOUT_PRESETS,
  getPresetCategories,
  searchPresets,
  type LayoutPreset,
  type PresetCategory
} from '@/lib/cms/layout-presets'
import { toast } from 'sonner'

interface LayoutPresetsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPresetSelect: (preset: LayoutPreset) => void
}

// Category configuration with icons and labels
const categoryConfig: Record<PresetCategory, { label: string; icon: React.ReactNode; description: string }> = {
  hero: {
    label: 'Hero',
    icon: <Star className="h-4 w-4" />,
    description: 'Page headers with attention-grabbing layouts'
  },
  content: {
    label: 'Content',
    icon: <Layers className="h-4 w-4" />,
    description: 'Text and image content sections'
  },
  features: {
    label: 'Features',
    icon: <Layout className="h-4 w-4" />,
    description: 'Highlight key benefits and features'
  },
  testimonials: {
    label: 'Testimonials',
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'Customer reviews and quotes'
  },
  cta: {
    label: 'CTA',
    icon: <Plus className="h-4 w-4" />,
    description: 'Call-to-action banners'
  },
  gallery: {
    label: 'Gallery',
    icon: <Image className="h-4 w-4" />,
    description: 'Image and media displays'
  },
  data: {
    label: 'Data',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Statistics, events, and dynamic content'
  },
  contact: {
    label: 'Contact',
    icon: <Phone className="h-4 w-4" />,
    description: 'Contact information and forms'
  },
}

// Icon mapping for preset icons
const iconMap: Record<string, React.ReactNode> = {
  Star: <Star className="h-5 w-5" />,
  Layout: <Layout className="h-5 w-5" />,
  Layers: <Layers className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  HelpCircle: <HelpCircle className="h-5 w-5" />,
  Image: <Image className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Phone: <Phone className="h-5 w-5" />,
}

export function LayoutPresetsModal({
  open,
  onOpenChange,
  onPresetSelect,
}: LayoutPresetsModalProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<PresetCategory | 'all'>('all')
  const [selectedPreset, setSelectedPreset] = useState<LayoutPreset | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Get categories for tabs
  const categories = useMemo(() => getPresetCategories(), [])

  // Filter presets based on search and category
  const filteredPresets = useMemo(() => {
    let presets = search ? searchPresets(search) : LAYOUT_PRESETS

    if (category !== 'all') {
      presets = presets.filter(p => p.category === category)
    }

    return presets
  }, [search, category])

  // Group presets by category for "all" view
  const groupedPresets = useMemo(() => {
    if (category !== 'all') return null

    const groups: Partial<Record<PresetCategory, LayoutPreset[]>> = {}

    filteredPresets.forEach(preset => {
      if (!groups[preset.category]) {
        groups[preset.category] = []
      }
      groups[preset.category]!.push(preset)
    })

    return groups
  }, [filteredPresets, category])

  const handleApply = () => {
    if (!selectedPreset) return

    onPresetSelect(selectedPreset)
    toast.success(`Added "${selectedPreset.name}" preset with ${selectedPreset.blocks.length} blocks`)
    handleClose()
  }

  const handleClose = () => {
    setSelectedPreset(null)
    setSearch('')
    setCategory('all')
    setPreviewMode(false)
    onOpenChange(false)
  }

  // Get icon component for a preset
  const getPresetIcon = (iconName: string) => {
    return iconMap[iconName] || <Layers className="h-5 w-5" />
  }

  // Render block preview for a preset
  const renderBlockPreview = (preset: LayoutPreset) => {
    return (
      <div className="space-y-1.5">
        {preset.blocks.map((block, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-xs bg-muted/50 rounded px-2 py-1"
          >
            <span className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center text-[10px] text-primary font-medium">
              {idx + 1}
            </span>
            <span className="text-muted-foreground">{block.component_name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] h-[90vh] max-h-[700px] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Layout Presets
          </DialogTitle>
          <DialogDescription>
            Choose a pre-configured layout to quickly add multiple blocks to your page.
            These presets are designed for common page sections.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Search - Fixed at top */}
          <div className="relative shrink-0 mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search presets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Tabs - Fixed below search */}
          <div className="shrink-0 mb-4">
            <Tabs value={category} onValueChange={(v) => setCategory(v as PresetCategory | 'all')}>
              <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  All
                </TabsTrigger>
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="mr-1.5">{categoryConfig[cat.id].icon}</span>
                    {categoryConfig[cat.id].label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Presets Grid - Scrollable area */}
          <ScrollArea className="flex-1 min-h-0 pr-4">
            {filteredPresets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Layers className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No presets found</p>
                <p className="text-sm">Try adjusting your search or category filter</p>
              </div>
            ) : category === 'all' && groupedPresets ? (
              // Grouped view for "all" category
              <div className="space-y-6 pb-4">
                {Object.entries(groupedPresets).map(([cat, presets]) => (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-primary">{categoryConfig[cat as PresetCategory].icon}</span>
                      <h3 className="font-semibold text-sm">{categoryConfig[cat as PresetCategory].label}</h3>
                      <span className="text-xs text-muted-foreground">
                        {categoryConfig[cat as PresetCategory].description}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {presets.map((preset) => (
                        <PresetCard
                          key={preset.id}
                          preset={preset}
                          isSelected={selectedPreset?.id === preset.id}
                          onSelect={() => setSelectedPreset(preset)}
                          getIcon={getPresetIcon}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Flat grid for specific category
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
                {filteredPresets.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    isSelected={selectedPreset?.id === preset.id}
                    onSelect={() => setSelectedPreset(preset)}
                    getIcon={getPresetIcon}
                  />
                ))}
              </div>
            )}
            <ScrollBar className="bg-muted/50" />
          </ScrollArea>

          {/* Selected preset preview - Compact */}
          {selectedPreset && (
            <div className="shrink-0 rounded-lg border bg-muted/50 p-3 mt-4">
              <div className="flex items-center gap-3">
                <span className="text-primary shrink-0">{getPresetIcon(selectedPreset.icon)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{selectedPreset.name}</h4>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {selectedPreset.blocks.length} blocks
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedPreset.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-xs shrink-0"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {previewMode ? 'Hide' : 'Show'}
                </Button>
              </div>
              {/* Block preview - expandable */}
              {previewMode && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Included Blocks:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPreset.blocks.map((block, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {idx + 1}. {block.component_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!selectedPreset}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Preset Card Component
interface PresetCardProps {
  preset: LayoutPreset
  isSelected: boolean
  onSelect: () => void
  getIcon: (iconName: string) => React.ReactNode
}

function PresetCard({ preset, isSelected, onSelect, getIcon }: PresetCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'group relative flex flex-col rounded-lg border-2 overflow-hidden transition-all text-left p-3',
        isSelected
          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2 mb-2">
        <span className={cn(
          'p-1.5 rounded-md transition-colors',
          isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {getIcon(preset.icon)}
        </span>
        <span className="font-medium text-sm truncate flex-1">{preset.name}</span>

        {/* Selected indicator */}
        {isSelected && (
          <div className="bg-primary rounded-full p-0.5">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
        {preset.description}
      </p>

      {/* Block count */}
      <div className="flex items-center gap-2 mt-auto">
        <Badge variant="secondary" className="text-xs">
          {preset.blocks.length} blocks
        </Badge>
        <Badge variant="outline" className="text-xs capitalize">
          {preset.category}
        </Badge>
      </div>
    </button>
  )
}
