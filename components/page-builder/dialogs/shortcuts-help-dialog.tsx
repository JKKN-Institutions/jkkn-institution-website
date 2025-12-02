'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Keyboard } from 'lucide-react'

interface ShortcutItem {
  key: string
  description: string
}

interface ShortcutCategory {
  name: string
  shortcuts: ShortcutItem[]
}

const SHORTCUTS: ShortcutCategory[] = [
  {
    name: 'General',
    shortcuts: [
      { key: 'Ctrl+S', description: 'Save changes' },
      { key: 'Ctrl+Z', description: 'Undo' },
      { key: 'Ctrl+Y', description: 'Redo' },
      { key: 'Ctrl+Shift+Z', description: 'Redo (alternative)' },
      { key: 'Esc', description: 'Deselect block' },
    ],
  },
  {
    name: 'Block Operations',
    shortcuts: [
      { key: 'Ctrl+C', description: 'Copy selected block' },
      { key: 'Ctrl+X', description: 'Cut selected block' },
      { key: 'Ctrl+V', description: 'Paste block' },
      { key: 'Ctrl+D', description: 'Duplicate selected block' },
      { key: 'Del/Backspace', description: 'Delete selected block' },
    ],
  },
  {
    name: 'View',
    shortcuts: [
      { key: 'Ctrl+Shift+P', description: 'Toggle preview mode' },
      { key: 'Ctrl+L', description: 'Toggle navigator panel' },
    ],
  },
]

interface ShortcutsHelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsHelpDialog({
  open,
  onOpenChange,
}: ShortcutsHelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Quick keyboard shortcuts to speed up your workflow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {SHORTCUTS.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            On Mac, use ⌘ (Command) instead of Ctrl
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
