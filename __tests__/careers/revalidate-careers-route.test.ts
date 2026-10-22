import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const revalidateTag = vi.fn()
vi.mock('next/cache', () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }))

import { POST } from '@/app/api/revalidate/careers/route'
import { CAREERS_CACHE_TAG } from '@/lib/services/public-careers-api'

const call = (auth?: string) =>
  POST(new NextRequest('https://jkkn.ac.in/api/revalidate/careers', {
    method: 'POST',
    headers: auth ? { authorization: auth } : {},
  }))

describe('POST /api/revalidate/careers', () => {
  beforeEach(() => { revalidateTag.mockClear() })
  afterEach(() => { vi.unstubAllEnvs() })

  it('expires the careers tag immediately with the right secret', async () => {
    vi.stubEnv('CAREERS_REVALIDATE_SECRET', 's3cret')
    const res = await call('Bearer s3cret')
    expect(res.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith(CAREERS_CACHE_TAG, { expire: 0 })
  })

  it('rejects a wrong or missing secret', async () => {
    vi.stubEnv('CAREERS_REVALIDATE_SECRET', 's3cret')
    expect((await call('Bearer nope')).status).toBe(401)
    expect((await call()).status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('fails closed when the secret env var is unset', async () => {
    vi.stubEnv('CAREERS_REVALIDATE_SECRET', '')
    expect((await call('Bearer ')).status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
