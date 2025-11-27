'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
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

const STATUS_CONFIG = {
  healthy: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    label: 'Healthy',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    label: 'Warning',
  },
  error: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: 'Error',
  },
}

export function SystemHealthWidget({ config }: WidgetProps) {
  const { refreshInterval = 30000 } = config as SystemHealthConfig
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  const checkHealth = async () => {
    // Simulate health checks - in production, these would be real API calls
    setHealth({
      database: 'healthy',
      auth: 'healthy',
      storage: 'healthy',
      api: 'healthy',
    })
    setLastChecked(new Date())
    setLoading(false)
  }

  useEffect(() => {
    checkHealth()

    const interval = setInterval(checkHealth, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Activity className="h-6 w-6 animate-pulse text-muted-foreground" />
      </div>
    )
  }

  const services = [
    { key: 'database', label: 'Database', status: health?.database || 'healthy' },
    { key: 'auth', label: 'Authentication', status: health?.auth || 'healthy' },
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
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h3 className="font-semibold text-sm sm:text-base text-foreground">System Health</h3>
        </div>
        <div className={cn('flex items-center gap-1', STATUS_CONFIG[overallHealth].color)}>
          <OverallIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs font-medium hidden sm:inline">{STATUS_CONFIG[overallHealth].label}</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {services.map((service) => {
            const config = STATUS_CONFIG[service.status]
            const Icon = config.icon

            return (
              <div
                key={service.key}
                className={cn(
                  'flex items-center gap-2 p-2 sm:p-2.5 rounded-lg',
                  config.bgColor
                )}
              >
                <Icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0', config.color)} />
                <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {service.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Last Checked */}
      <div className="mt-2 pt-2 border-t border-border/50 flex-shrink-0">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
          <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
          <button
            onClick={checkHealth}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  )
}
