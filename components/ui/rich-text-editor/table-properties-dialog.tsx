'use client'

import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ColorPicker } from '@/components/admin/settings/color-picker'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Merge,
  Split,
} from 'lucide-react'

interface TablePropertiesDialogProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
}

interface TableProperties {
  // General
  width: string
  widthUnit: '%' | 'px' | 'auto'
  alignment: 'left' | 'center' | 'right'
  caption: string

  // Cells
  cellBackgroundColor: string
  cellTextAlign: 'left' | 'center' | 'right' | 'justify'
  cellVerticalAlign: 'top' | 'middle' | 'bottom'
  cellPaddingTop: string
  cellPaddingRight: string
  cellPaddingBottom: string
  cellPaddingLeft: string

  // Borders & Spacing
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'none'
  borderWidth: string
  borderColor: string
  borderCollapse: boolean
  cellSpacing: string

  // Style
  zebraStriping: boolean
  zebraColor: string
  hoverEffect: boolean
  headerBold: boolean
  headerBackgroundColor: string
  headerTextColor: string
  responsive: boolean
}

export function TablePropertiesDialog({
  editor,
  isOpen,
  onClose,
}: TablePropertiesDialogProps) {
  const [properties, setProperties] = useState<TableProperties>({
    // General
    width: '100',
    widthUnit: '%',
    alignment: 'left',
    caption: '',

    // Cells
    cellBackgroundColor: '#ffffff',
    cellTextAlign: 'left',
    cellVerticalAlign: 'middle',
    cellPaddingTop: '8',
    cellPaddingRight: '12',
    cellPaddingBottom: '8',
    cellPaddingLeft: '12',

    // Borders & Spacing
    borderStyle: 'solid',
    borderWidth: '1',
    borderColor: '#cbd5e1',
    borderCollapse: true,
    cellSpacing: '0',

    // Style
    zebraStriping: false,
    zebraColor: '#f9fafb',
    hoverEffect: false,
    headerBold: true,
    headerBackgroundColor: '#f1f5f9',
    headerTextColor: '#1e293b',
    responsive: true,
  })

  // Load current table properties when dialog opens
  useEffect(() => {
    if (isOpen && editor.isActive('table')) {
      // Here you would extract current table properties from the editor
      // This is a placeholder - actual implementation depends on how properties are stored
    }
  }, [isOpen, editor])

  const handleApply = () => {
    if (!editor.isActive('table')) return

    try {
      // Apply table-level properties
      const tableClasses = []

      if (properties.zebraStriping) tableClasses.push('table-striped')
      if (properties.hoverEffect) tableClasses.push('table-hover')
      if (properties.borderStyle === 'none') tableClasses.push('border-none')
      if (properties.borderStyle === 'dashed') tableClasses.push('border-dashed')
      if (properties.borderStyle === 'dotted') tableClasses.push('border-dotted')
      if (properties.responsive) tableClasses.push('table-responsive')

      // Apply padding class
      const paddingValue = parseInt(properties.cellPaddingTop)
      if (paddingValue <= 4) tableClasses.push('padding-compact')
      else if (paddingValue <= 8) tableClasses.push('padding-normal')
      else tableClasses.push('padding-relaxed')

      // Update table attributes
      editor
        .chain()
        .focus()
        .updateAttributes('table', {
          class: tableClasses.join(' '),
          style: `width: ${properties.widthUnit === 'auto' ? 'auto' : `${properties.width}${properties.widthUnit}`}; margin: ${properties.alignment === 'center' ? '0 auto' : properties.alignment === 'right' ? '0 0 0 auto' : '0'}; border-width: ${properties.borderWidth}px; border-color: ${properties.borderColor}; border-collapse: ${properties.borderCollapse ? 'collapse' : 'separate'}; ${properties.cellSpacing && !properties.borderCollapse ? `border-spacing: ${properties.cellSpacing}px;` : ''}`,
        })
        .run()

      // Apply cell properties to all cells in table
      // Note: This applies to ALL cells. For selected cells only, you'd need different logic
      editor
        .chain()
        .focus()
        .setCellAttribute('backgroundColor', properties.cellBackgroundColor)
        .setCellAttribute('textAlign', properties.cellTextAlign)
        .setCellAttribute('verticalAlign', properties.cellVerticalAlign)
        .run()

      onClose()
    } catch (error) {
      console.error('Error applying table properties:', error)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const canMergeCells = () => {
    // Check if cells can be merged
    // This would need to check if multiple cells are selected
    return false // Placeholder
  }

  const canSplitCell = () => {
    // Check if current cell is merged
    // This would check for colspan or rowspan > 1
    return false // Placeholder
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            Table Properties
          </DialogTitle>
          <DialogDescription>
            Customize table appearance, layout, and behavior
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="cells">Cells</TabsTrigger>
            <TabsTrigger value="borders">Borders</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label>Table Width</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={properties.width}
                  onChange={(e) =>
                    setProperties({ ...properties, width: e.target.value })
                  }
                  className="flex-1"
                  disabled={properties.widthUnit === 'auto'}
                  min="1"
                  max={properties.widthUnit === '%' ? '100' : '2000'}
                />
                <Select
                  value={properties.widthUnit}
                  onValueChange={(value: '%' | 'px' | 'auto') =>
                    setProperties({ ...properties, widthUnit: value })
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">%</SelectItem>
                    <SelectItem value="px">px</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Table Alignment</Label>
              <div className="flex gap-2">
                <Button
                  variant={properties.alignment === 'left' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProperties({ ...properties, alignment: 'left' })}
                  className="flex-1"
                >
                  <AlignLeft className="h-4 w-4 mr-2" />
                  Left
                </Button>
                <Button
                  variant={properties.alignment === 'center' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProperties({ ...properties, alignment: 'center' })}
                  className="flex-1"
                >
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Center
                </Button>
                <Button
                  variant={properties.alignment === 'right' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProperties({ ...properties, alignment: 'right' })}
                  className="flex-1"
                >
                  <AlignRight className="h-4 w-4 mr-2" />
                  Right
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="caption">Table Caption (Optional)</Label>
              <Input
                id="caption"
                value={properties.caption}
                onChange={(e) =>
                  setProperties({ ...properties, caption: e.target.value })
                }
                placeholder="Enter table caption..."
              />
              <p className="text-sm text-muted-foreground">
                Captions help describe the table content for accessibility
              </p>
            </div>
          </TabsContent>

          {/* Cells Tab */}
          <TabsContent value="cells" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label>Cell Operations</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // editor.chain().focus().mergeCells().run()
                  }}
                  disabled={!canMergeCells()}
                  className="flex-1"
                >
                  <Merge className="h-4 w-4 mr-2" />
                  Merge Cells
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // editor.chain().focus().splitCell().run()
                  }}
                  disabled={!canSplitCell()}
                  className="flex-1"
                >
                  <Split className="h-4 w-4 mr-2" />
                  Split Cell
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Select multiple cells to merge, or a merged cell to split
              </p>
            </div>

            <Separator />

            <ColorPicker
              label="Cell Background Color"
              description="Background color for selected cells"
              value={properties.cellBackgroundColor}
              onChange={(value) =>
                setProperties({ ...properties, cellBackgroundColor: value })
              }
            />

            <div className="space-y-3">
              <Label>Text Alignment</Label>
              <Select
                value={properties.cellTextAlign}
                onValueChange={(value: 'left' | 'center' | 'right' | 'justify') =>
                  setProperties({ ...properties, cellTextAlign: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Vertical Alignment</Label>
              <Select
                value={properties.cellVerticalAlign}
                onValueChange={(value: 'top' | 'middle' | 'bottom') =>
                  setProperties({ ...properties, cellVerticalAlign: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Cell Padding (px)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="padding-top" className="text-xs">
                    Top
                  </Label>
                  <Input
                    id="padding-top"
                    type="number"
                    value={properties.cellPaddingTop}
                    onChange={(e) =>
                      setProperties({ ...properties, cellPaddingTop: e.target.value })
                    }
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="padding-right" className="text-xs">
                    Right
                  </Label>
                  <Input
                    id="padding-right"
                    type="number"
                    value={properties.cellPaddingRight}
                    onChange={(e) =>
                      setProperties({ ...properties, cellPaddingRight: e.target.value })
                    }
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="padding-bottom" className="text-xs">
                    Bottom
                  </Label>
                  <Input
                    id="padding-bottom"
                    type="number"
                    value={properties.cellPaddingBottom}
                    onChange={(e) =>
                      setProperties({
                        ...properties,
                        cellPaddingBottom: e.target.value,
                      })
                    }
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <Label htmlFor="padding-left" className="text-xs">
                    Left
                  </Label>
                  <Input
                    id="padding-left"
                    type="number"
                    value={properties.cellPaddingLeft}
                    onChange={(e) =>
                      setProperties({ ...properties, cellPaddingLeft: e.target.value })
                    }
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Borders & Spacing Tab */}
          <TabsContent value="borders" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label>Border Style</Label>
              <Select
                value={properties.borderStyle}
                onValueChange={(value: 'solid' | 'dashed' | 'dotted' | 'none') =>
                  setProperties({ ...properties, borderStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="border-width">Border Width (px)</Label>
              <Input
                id="border-width"
                type="number"
                value={properties.borderWidth}
                onChange={(e) =>
                  setProperties({ ...properties, borderWidth: e.target.value })
                }
                min="0"
                max="10"
                disabled={properties.borderStyle === 'none'}
              />
            </div>

            <ColorPicker
              label="Border Color"
              value={properties.borderColor}
              onChange={(value) =>
                setProperties({ ...properties, borderColor: value })
              }
            />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Border Collapse</Label>
                <p className="text-sm text-muted-foreground">
                  Collapse borders between cells
                </p>
              </div>
              <Switch
                checked={properties.borderCollapse}
                onCheckedChange={(checked) =>
                  setProperties({ ...properties, borderCollapse: checked })
                }
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="cell-spacing">Cell Spacing (px)</Label>
              <Input
                id="cell-spacing"
                type="number"
                value={properties.cellSpacing}
                onChange={(e) =>
                  setProperties({ ...properties, cellSpacing: e.target.value })
                }
                min="0"
                max="20"
                disabled={properties.borderCollapse}
              />
              <p className="text-sm text-muted-foreground">
                Only applies when border collapse is off
              </p>
            </div>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Zebra Striping</Label>
                <p className="text-sm text-muted-foreground">
                  Alternate row background colors
                </p>
              </div>
              <Switch
                checked={properties.zebraStriping}
                onCheckedChange={(checked) =>
                  setProperties({ ...properties, zebraStriping: checked })
                }
              />
            </div>

            {properties.zebraStriping && (
              <ColorPicker
                label="Stripe Color"
                description="Background color for even rows"
                value={properties.zebraColor}
                onChange={(value) =>
                  setProperties({ ...properties, zebraColor: value })
                }
              />
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Hover Effect</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight row on mouse hover
                </p>
              </div>
              <Switch
                checked={properties.hoverEffect}
                onCheckedChange={(checked) =>
                  setProperties({ ...properties, hoverEffect: checked })
                }
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Header Style</Label>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">Bold Text</Label>
                <Switch
                  checked={properties.headerBold}
                  onCheckedChange={(checked) =>
                    setProperties({ ...properties, headerBold: checked })
                  }
                />
              </div>
            </div>

            <ColorPicker
              label="Header Background Color"
              value={properties.headerBackgroundColor}
              onChange={(value) =>
                setProperties({ ...properties, headerBackgroundColor: value })
              }
            />

            <ColorPicker
              label="Header Text Color"
              value={properties.headerTextColor}
              onChange={(value) =>
                setProperties({ ...properties, headerTextColor: value })
              }
            />

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Responsive</Label>
                <p className="text-sm text-muted-foreground">
                  Enable horizontal scroll on mobile
                </p>
              </div>
              <Switch
                checked={properties.responsive}
                onCheckedChange={(checked) =>
                  setProperties({ ...properties, responsive: checked })
                }
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
