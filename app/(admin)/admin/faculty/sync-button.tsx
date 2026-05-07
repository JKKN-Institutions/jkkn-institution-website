'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw, Cloud, CheckCircle2, AlertCircle } from 'lucide-react'

export function SyncFromMyJKKNButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  async function trigger() {
    setLoading(true)
    setMsg(null)
    try {
      const r = await fetch('/admin/api/trigger-sync', { method: 'POST' })
      const j = await r.json()
      if (r.ok && j.ok) {
        setMsg({
          kind: 'ok',
          text: `Synced ${j.upserted ?? 0} (${j.published ?? 0} published, ${j.drafts ?? 0} drafts${j.errors?.length ? `, ${j.errors.length} errors` : ''})`,
        })
        router.refresh()
      } else {
        setMsg({ kind: 'err', text: j.error || `HTTP ${r.status}` })
      }
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button onClick={trigger} disabled={loading} className="gap-2">
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Cloud className="w-4 h-4" />
        )}
        {loading ? 'Syncing…' : 'Sync from MyJKKN'}
      </Button>
      {msg && (
        <span
          className={`text-xs flex items-center gap-1 ${
            msg.kind === 'ok' ? 'text-emerald-700' : 'text-destructive'
          }`}
        >
          {msg.kind === 'ok' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          {msg.text}
        </span>
      )}
    </div>
  )
}
