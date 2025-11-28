'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface SystemHealthConfig {
  refreshInterval?: number
}

interface HealthStatus {
  database: 'healthy' | 'warning' | 'error'
  auth: 'healthy' | 'warning' | 'error'
  storage: 'healthy' | 'warning' | 'error'
  api: 'healthy' | 'warning' | 'error'
}

// Brand colors - primary (green) for healthy
const STATUS_CONFIG = {
  healthy: {
    icon: CheckCircle,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    glowColor: 'shadow-primary/20',
    label: 'Healthy',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    glowColor: 'shadow-amber-500/20',
    label: 'Warning',
  },
  error: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    glowColor: 'shadow-destructive/20',
    label: 'Error',
  },
}

export function SystemHealthWidget({ config }: WidgetProps) {
  const { refreshInterval = 30000 } = config as SystemHealthConfig
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  const checkHealth = async () => {
    // Only show loading on initial load, not on refresh
    const isInitialLoad = health === null

    // Real health checks - test actual connectivity
    const supabase = (await import('@/lib/supabase/client')).createClient()

    let dbStatus: 'healthy' | 'warning' | 'error' = 'healthy'
    let authStatus: 'healthy' | 'warning' | 'error' = 'healthy'
    let storageStatus: 'healthy' | 'warning' | 'error' = 'healthy'
    let apiStatus: 'healthy' | 'warning' | 'error' = 'healthy'

    try {
      // Test database connection
      const { error: dbError } = await supabase.from('profiles').select('id').limit(1)
      if (dbError) dbStatus = 'error'
    } catch {
      dbStatus = 'error'
    }

    try {
      // Test auth service - use getUser() instead of getSession() for security
      const { error: authError } = await supabase.auth.getUser()
      if (authError) authStatus = 'warning'
    } catch {
      authStatus = 'error'
    }

    try {
      // Test storage service
      const { error: storageError } = await supabase.storage.listBuckets()
      if (storageError) storageStatus = 'warning'
    } catch {
      storageStatus = 'warning'
    }

    // API is healthy if we got this far
    apiStatus = dbStatus === 'healthy' && authStatus === 'healthy' ? 'healthy' : 'warning'

    setHealth({
      database: dbStatus,
      auth: authStatus,
      storage: storageStatus,
      api: apiStatus,
    })
    setLastChecked(new Date())
    if (isInitialLoad) setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    checkHealth()

    const interval = setInterval(checkHealth, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  const handleRefresh = () => {
    setRefreshing(true)
    checkHealth()
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
          <Activity className="relative h-6 w-6 animate-pulse text-primary" />
        </div>
      </div>
    )
  }

  const services = [
    { key: 'database', label: 'Database', status: health?.database || 'healthy' },
    { key: 'auth', label: 'Auth', status: health?.auth || 'healthy' },
    { key: 'storage', label: 'Storage', status: health?.storage || 'healthy' },
    { key: 'api', label: 'API', status: health?.api || 'healthy' },
  ]

  const overallHealth = services.every((s) => s.status === 'healthy')
    ? 'healthy'
    : services.some((s) => s.status === 'error')
    ? 'error'
    : 'warning'

  const OverallIcon = STATUS_CONFIG[overallHealth].icon

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header with Glass Effect */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Wifi className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">System Health</h3>
            <p className="text-[10px] text-muted-foreground">Service status</p>
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm border',
          STATUS_CONFIG[overallHealth].bgColor,
          STATUS_CONFIG[overallHealth].borderColor
        )}>
          <OverallIcon className={cn('h-3.5 w-3.5', STATUS_CONFIG[overallHealth].color)} />
          <span className={cn('text-[10px] font-semibold', STATUS_CONFIG[overallHealth].color)}>
            {STATUS_CONFIG[overallHealth].label}
          </span>
        </div>
      </div>

      {/* Services Grid - Glassmorphism Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {services.map((service) => {
            const config = STATUS_CONFIG[service.status]
            const Icon = config.icon

            return (
              <div
                key={service.key}
                className={cn(
                  'group relative flex items-center gap-2.5 p-3 rounded-xl transition-all duration-300',
                  'bg-gradient-to-br from-white/50 to-white/20 dark:from-white/10 dark:to-white/5',
                  'backdrop-blur-sm border',
                  config.borderColor,
                  'hover:shadow-md',
                  config.glowColor
                )}
              >
                {/* Status Icon with glow */}
                <div className="relative">
                  <div className={cn(
                    'absolute inset-0 rounded-lg blur-md opacity-50',
                    config.bgColor
                  )} />
                  <div className={cn(
                    'relative p-1.5 rounded-lg',
                    config.bgColor
                  )}>
                    <Icon className={cn('h-3.5 w-3.5', config.color)} />
                  </div>
                </div>

                {/* Service Label */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {service.label}
                  </p>
                  <p className={cn('text-[10px] font-medium', config.color)}>
                    {config.label}
                  </p>
                </div>

                {/* Pulse indicator for healthy */}
                {service.status === 'healthy' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer with Glass Effect */}
      <div className="mt-3 pt-3 border-t border-primary/10 flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span suppressHydrationWarning>Last checked: {lastChecked.toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200',
              'bg-primary/5 hover:bg-primary/10 backdrop-blur-sm',
              'border border-transparent hover:border-primary/20',
              'text-primary font-medium'
            )}
          >
            <RefreshCw className={cn('h-3 w-3', refreshing && 'animate-spin')} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  )
}
