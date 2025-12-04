'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Settings,
  FolderPlus,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { CollectionTreeNode } from '@/app/actions/cms/collections'
import * as LucideIcons from 'lucide-react'

interface CollectionSidebarProps {
  collections: CollectionTreeNode[]
  selectedCollection: string
  uncategorizedCount: number
  selectMode?: boolean
  returnTo?: string
}

export function CollectionSidebar({
  collections,
  selectedCollection,
  uncategorizedCount,
  selectMode,
  returnTo,
}: CollectionSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCollectionClick = (collectionId: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (collectionId) {
      params.set('collection', collectionId)
    } else {
      params.delete('collection')
    }
    params.delete('page') // Reset to first page

    if (selectMode) {
      params.set('mode', 'select')
      if (returnTo) {
        params.set('returnTo', returnTo)
      }
    }

    router.push(`/admin/content/components?${params.toString()}`)
  }

  const totalComponents = collections.reduce(
    (acc, c) => acc + (c.component_count || 0),
    uncategorizedCount
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Collections</h3>
        {!selectMode && (
          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
            <Link href="/admin/content/components/collections">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <nav className="space-y-1">
        {/* All Components */}
        <button
          onClick={() => handleCollectionClick(null)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
            'hover:bg-accent/50',
            !selectedCollection
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground'
          )}
        >
          <Folder className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left truncate">All Components</span>
          <span className="text-xs text-muted-foreground">{totalComponents}</span>
        </button>

        {/* Collection Tree */}
        {collections.map((collection) => (
          <CollectionTreeItem
            key={collection.id}
            collection={collection}
            selectedCollection={selectedCollection}
            onSelect={handleCollectionClick}
            depth={0}
            selectMode={selectMode}
          />
        ))}

        {/* Uncategorized */}
        {uncategorizedCount > 0 && (
          <button
            onClick={() => handleCollectionClick('uncategorized')}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              'hover:bg-accent/50',
              selectedCollection === 'uncategorized'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground'
            )}
          >
            <Inbox className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left truncate">Uncategorized</span>
            <span className="text-xs text-muted-foreground">{uncategorizedCount}</span>
          </button>
        )}
      </nav>

      {/* Quick Add - Only when not in select mode */}
      {!selectMode && (
        <div className="pt-4 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/admin/content/components/collections/new">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Collection
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

interface CollectionTreeItemProps {
  collection: CollectionTreeNode
  selectedCollection: string
  onSelect: (id: string | null) => void
  depth: number
  selectMode?: boolean
}

function CollectionTreeItem({
  collection,
  selectedCollection,
  onSelect,
  depth,
  selectMode,
}: CollectionTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(
    // Auto-expand if selected collection is this or a child
    selectedCollection === collection.id ||
    hasChildSelected(collection, selectedCollection)
  )

  const hasChildren = collection.children && collection.children.length > 0
  const isSelected = selectedCollection === collection.id

  // Get icon component
  const IconComponent = collection.icon
    ? (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[collection.icon] || Folder
    : Folder

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 rounded-lg text-sm transition-colors',
          'hover:bg-accent/50',
          isSelected
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* Expand/Collapse Toggle */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-accent rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}

        {/* Collection Button */}
        <button
          onClick={() => onSelect(collection.id)}
          className="flex-1 flex items-center gap-2 py-2 pr-2 text-left"
        >
          <IconComponent
            className="h-4 w-4 flex-shrink-0"
            style={{ color: collection.color || undefined }}
          />
          <span className="flex-1 truncate">{collection.name}</span>
          {collection.component_count !== undefined && collection.component_count > 0 && (
            <span className="text-xs text-muted-foreground">
              {collection.component_count}
            </span>
          )}
        </button>

        {/* Actions Menu - Only when not in select mode */}
        {!selectMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/content/components/collections/${collection.id}/edit`}>
                  Edit Collection
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/content/components/new?collection=${collection.id}`}>
                  Add Component Here
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {collection.children.map((child) => (
            <CollectionTreeItem
              key={child.id}
              collection={child}
              selectedCollection={selectedCollection}
              onSelect={onSelect}
              depth={depth + 1}
              selectMode={selectMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Check if any child collection is selected
 */
function hasChildSelected(collection: CollectionTreeNode, selectedId: string): boolean {
  if (collection.children) {
    for (const child of collection.children) {
      if (child.id === selectedId || hasChildSelected(child, selectedId)) {
        return true
      }
    }
  }
  return false
}
