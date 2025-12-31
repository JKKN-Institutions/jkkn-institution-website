'use client'

import { Terminal, Database, RefreshCw, Server, Shield, HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function DeveloperActions() {
    const actions = [
        {
            label: 'Clear Cache',
            icon: RefreshCw,
            description: 'Purge Next.js server cache',
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            label: 'Database Logs',
            icon: Database,
            description: 'View recent SQL queries',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'System Health',
            icon: Server,
            description: 'Check API latency',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Audit Security',
            icon: Shield,
            description: 'Scan for vulnerabilities',
            color: 'text-rose-500',
            bg: 'bg-rose-500/10'
        }
    ]

    return (
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
                    <Terminal className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Dev Tools</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 flex-1">
                {actions.map((action) => (
                    <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col items-start p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all text-left group"
                    >
                        <div className={`p-2 rounded-lg ${action.bg} ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                            <action.icon className="h-5 w-5" />
                        </div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                            {action.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {action.description}
                        </span>
                    </motion.button>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">v1.2.0-beta</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    System Operational
                </span>
            </div>
        </div>
    )
}
