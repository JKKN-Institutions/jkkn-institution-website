import dynamic from 'next/dynamic'

// Panel loading fallback component
const PanelLoadingFallback = () => (
  <div className="p-6 animate-pulse space-y-4">
    <div className="h-8 bg-muted/20 rounded w-3/4" />
    <div className="space-y-3">
      <div className="h-4 bg-muted/20 rounded" />
      <div className="h-4 bg-muted/20 rounded w-5/6" />
      <div className="h-4 bg-muted/20 rounded w-4/6" />
    </div>
    <div className="pt-4">
      <div className="h-10 bg-muted/20 rounded w-1/2" />
    </div>
  </div>
)

// Dynamically import panels - loads only when user clicks their tab
export const SeoPanel = dynamic(
  () => import('./panels/seo-panel').then((mod) => ({ default: mod.SeoPanel })),
  {
    loading: PanelLoadingFallback,
    ssr: false, // SEO panel is editor-only, no need for SSR
  }
)

export const FabPanel = dynamic(
  () => import('./panels/fab-panel').then((mod) => ({ default: mod.FabPanel })),
  {
    loading: PanelLoadingFallback,
    ssr: false, // FAB panel is editor-only
  }
)

export const FooterPanel = dynamic(
  () => import('./panels/footer-panel').then((mod) => ({ default: mod.FooterPanel })),
  {
    loading: PanelLoadingFallback,
    ssr: false, // Footer panel is editor-only
  }
)

export const PageTypographyPanel = dynamic(
  () => import('./panels/page-typography-panel').then((mod) => ({ default: mod.PageTypographyPanel })),
  {
    loading: PanelLoadingFallback,
    ssr: false, // Typography panel is editor-only
  }
)

// Re-export types that might be needed
export type { FabConfig } from './panels/fab-panel'
