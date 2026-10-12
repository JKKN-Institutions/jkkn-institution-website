// lib/utils/sliding-window-limit.ts
//
// In-memory sliding-window counter. On serverless every instance keeps its
// own count, so this is a soft limit; for resume auto-fill the Anthropic
// workspace spend limit is the hard cap (spec 2026-10-12 §1).

const PRUNE_ABOVE_KEYS = 10_000

export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>()

  return function allow(key: string, now: number = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return false
    }
    recent.push(now)
    hits.set(key, recent)
    if (hits.size > PRUNE_ABOVE_KEYS) {
      for (const [k, times] of hits) if (times.every(t => now - t >= windowMs)) hits.delete(k)
    }
    return true
  }
}
