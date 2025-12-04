'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Grid3X3,
  List,
  Download,
  Check,
  Loader2,
  Package,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { installFromRegistry, syncRegistry } from '@/app/actions/cms/registries'
import type { Database } from '@/lib/supabase/database.types'

type Registry = Database['public']['Tables']['cms_external_registries']['Row']

interface ComponentData {
  name: string
  displayName?: string
  description?: string
  category?: string
  type?: string
  docs?: string
}

interface ComponentBrowserProps {
  registry: Registry
  components: ComponentData[]
}

export function ComponentBrowser({ registry, components }: ComponentBrowserProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSyncing, setIsSyncing] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [installingComponent, setInstallingComponent] = useState<string | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<ComponentData | null>(null)
  const [installDialogOpen, setInstallDialogOpen] = useState(false)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>()
    components.forEach((comp) => {
      if (comp.category) cats.add(comp.category)
      if (comp.type) cats.add(comp.type)
    })
    return Array.from(cats).sort()
  }, [components])

  // Filter components
  const filteredComponents = useMemo(() => {
    return components.filter((comp) => {
      const matchesSearch =
        search === '' ||
        comp.name.toLowerCase().includes(search.toLowerCase()) ||
        comp.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        comp.description?.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === 'all' || comp.category === category || comp.type === category

      return matchesSearch && matchesCategory
    })
  }, [components, search, category])

  const handleInstall = async (component: ComponentData) => {
    setSelectedComponent(component)
    setInstallDialogOpen(true)
  }

  const confirmInstall = async () => {
    if (!selectedComponent) return

    setInstallingComponent(selectedComponent.name)
    setInstallDialogOpen(false)

    startTransition(async () => {
      const result = await installFromRegistry(registry.id, selectedComponent.name)

      if (result.success) {
        toast.success(`${selectedComponent.displayName || selectedComponent.name} installed successfully`)
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to install component')
      }

      setInstallingComponent(null)
      setSelectedComponent(null)
    })
  }

  const handleSync = async () => {
    setIsSyncing(true)
    toast.loading('Syncing registry...')

    const result = await syncRegistry(registry.id)

    toast.dismiss()

    if (result.success) {
      const componentCount = (result.data as { component_count?: number })?.component_count || 0
      toast.success(`Synced ${componentCount} components`)
      router.refresh()
    } else {
      toast.error(result.message || 'Failed to sync registry')
    }

    setIsSyncing(false)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredComponents.length} of {components.length} components
      </div>

      {/* Components Grid/List */}
      {filteredComponents.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No components found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredComponents.map((component) => (
            <div
              key={component.name}
              className="rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all"
            >
              {/* Preview placeholder */}
              <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/30" />
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-medium line-clamp-1">
                    {component.displayName || component.name}
                  </h3>
                  {component.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {component.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {(component.category || component.type) && (
                    <Badge variant="secondary" className="text-xs">
                      {component.category || component.type}
                    </Badge>
                  )}

                  <Button
                    size="sm"
                    onClick={() => handleInstall(component)}
                    disabled={installingComponent === component.name}
                  >
                    {installingComponent === component.name ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Download className="h-3 w-3 mr-1" />
                    )}
                    Install
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          {filteredComponents.map((component) => (
            <div
              key={component.name}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-muted-foreground/30" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">
                    {component.displayName || component.name}
                  </h3>
                  {(component.category || component.type) && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {component.category || component.type}
                    </Badge>
                  )}
                </div>
                {component.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                    {component.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {component.docs && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={component.docs} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => handleInstall(component)}
                  disabled={installingComponent === component.name}
                >
                  {installingComponent === component.name ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Download className="h-3 w-3 mr-1" />
                  )}
                  Install
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Install Confirmation Dialog */}
      <Dialog open={installDialogOpen} onOpenChange={setInstallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install Component</DialogTitle>
            <DialogDescription>
              Install &quot;{selectedComponent?.displayName || selectedComponent?.name}&quot; from{' '}
              {registry.name}?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <h4 className="font-medium">{selectedComponent?.displayName || selectedComponent?.name}</h4>
              {selectedComponent?.description && (
                <p className="text-sm text-muted-foreground mt-1">{selectedComponent.description}</p>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              This will:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              <li>Fetch the component code from the registry</li>
              <li>Add it to your custom components library</li>
              <li>Generate a preview image</li>
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInstallDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmInstall}>
              <Check className="h-4 w-4 mr-2" />
              Install Component
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
