import { readFile, readdir } from 'node:fs/promises'

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { getPlatformProxy, type PlatformProxy } from 'wrangler'

import type { Verse } from '../src/lib/types'
import app from './index'

let platform: PlatformProxy<Env>
let env: Env
const password = 'local-test-password'

async function request(method = 'GET', body?: unknown, bindings = env) {
  const pending: Promise<unknown>[] = []
  const response = await app.request(
    '/api/verses',
    {
      method,
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' },
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    bindings,
    {
      props: {},
      passThroughOnException() {},
      waitUntil: (promise) => {
        pending.push(promise)
      },
    },
  )
  await Promise.all(pending)
  return response
}

async function verses(response: Response): Promise<Verse[]> {
  expect(response.status).toBe(200)
  return ((await response.json()) as { verses: Verse[] }).verses
}

beforeAll(async () => {
  platform = await getPlatformProxy<Env>({ persist: false, remoteBindings: false })
  env = { ...platform.env, PASSWORD: password }
  for (const file of (await readdir('worker/migrations')).sort()) {
    const schema = await readFile(`worker/migrations/${file}`, 'utf8')
    await env.SONNET_DB.exec(schema.replaceAll('\n', ' '))
  }
})

// Wrangler's platform proxy exposes a no-op Cache API. Model storage here;
// D1 migrations/triggers and the quota integration test use real local bindings.
function resetCache() {
  const entries = new Map<string, Response>()
  vi.stubGlobal('caches', {
    default: {
      match: vi.fn(async (key: string) => entries.get(key)?.clone()),
      put: vi.fn(async (key: string, response: Response) => {
        entries.set(key, response.clone())
      }),
    },
  })
}

beforeEach(async () => {
  resetCache()
  env.READ_RATE_LIMITER = { limit: vi.fn().mockResolvedValue({ success: true }) }
  env.WRITE_RATE_LIMITER = { limit: vi.fn().mockResolvedValue({ success: true }) }
  await env.SONNET_DB.prepare('DELETE FROM verses').run()
})

afterAll(async () => {
  vi.unstubAllGlobals()
  await platform?.dispose()
})

describe('verse API with local D1', () => {
  it('lists only uploaded verses, adds and deletes without changing the response shape', async () => {
    expect(await verses(await request())).toEqual([])
    const content = "月色里的 ' 引号; DROP TABLE verses; --"
    const added = await verses(await request('PUT', { password, content, author: '测试作者' }))
    expect(added).toHaveLength(1)
    expect(added[0]).toMatchObject({ content, author: '测试作者', createdAt: expect.any(Number) })
    expect(added[0].uuid).toMatch(/^[\da-f-]{36}$/)
    expect(await verses(await request())).toEqual(added)
    expect(await verses(await request('DELETE', { password, uuid: 'missing-id' }))).toEqual(added)
    expect(await verses(await request('DELETE', { password, uuid: added[0].uuid }))).toEqual([])
  })

  it('preserves concurrent additions', async () => {
    const responses = await Promise.all(
      Array.from({ length: 8 }, (_, index) =>
        request('PUT', { password, content: `诗句 ${index}`, author: '作者' }),
      ),
    )
    expect(responses.every((response) => response.status === 200)).toBe(true)
    expect(await verses(await request())).toHaveLength(8)
  })

  it('rejects unauthorized writes and leaves existing rows intact', async () => {
    const added = await verses(await request('PUT', { password, content: '诗句', author: '作者' }))
    for (const invalidPassword of [undefined, '', 'wrong', 123]) {
      expect(
        (await request('PUT', { password: invalidPassword, content: '诗句', author: '作者' }))
          .status,
      ).toBe(401)
      expect(
        (await request('DELETE', { password: invalidPassword, uuid: added[0].uuid })).status,
      ).toBe(401)
    }
    expect(await verses(await request())).toEqual(added)
  })

  it('keeps public reads available but disables writes when the password is missing', async () => {
    const unconfigured = { ...env, PASSWORD: '' }
    expect((await request('GET', undefined, unconfigured)).status).toBe(200)
    expect(
      (await request('PUT', { password, content: '诗句', author: '作者' }, unconfigured)).status,
    ).toBe(503)
  })

  it('returns 400 for malformed JSON and invalid fields', async () => {
    for (const body of [
      null,
      [],
      'string',
      { password },
      { password, content: 1, author: '作者' },
      { password, content: ' ', author: '作者' },
    ]) {
      expect((await request('PUT', body)).status).toBe(400)
    }
    expect((await request('DELETE', { password, uuid: 123 })).status).toBe(400)
    const response = await app.request('/api/verses', { method: 'PUT', body: '{' }, env)
    expect(response.status).toBe(400)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('rejects oversized request bodies', async () => {
    expect(
      (await request('PUT', { password, content: 'x'.repeat(65536), author: '作者' })).status,
    ).toBe(413)
  })

  it('returns JSON 404 for unknown API paths', async () => {
    const response = await app.request('/api/missing', undefined, env)
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Not Found' })
  })
})

describe('rate limiting and versioned cache', () => {
  it('serves cached lists and stops using them after insert, update and delete', async () => {
    // Force a fresh revision even when the table is already empty.
    await env.SONNET_DB.prepare(
      'UPDATE verse_cache_revision SET revision = lower(hex(randomblob(16)))',
    ).run()
    const cold = await request()
    expect(cold.headers.get('X-Cache')).toBe('MISS')
    expect(cold.headers.get('Cache-Control')).toBe('no-store')
    const warm = await request()
    expect(warm.headers.get('X-Cache')).toBe('HIT')
    expect(await verses(warm)).toEqual([])
    const added = await verses(await request('PUT', { password, content: '新诗', author: '作者' }))
    const afterInsert = await request()
    expect(afterInsert.headers.get('X-Cache')).toBe('MISS')
    expect(await verses(afterInsert)).toEqual(added)
    await env.SONNET_DB.prepare('UPDATE verses SET content = ? WHERE uuid = ?')
      .bind('更新', added[0].uuid)
      .run()
    expect((await verses(await request()))[0].content).toBe('更新')
    await request('DELETE', { password, uuid: added[0].uuid })
    expect(await verses(await request())).toEqual([])
  })

  it('limits writes before authentication and keeps reads on a separate quota', async () => {
    const blocked = {
      ...env,
      WRITE_RATE_LIMITER: { limit: vi.fn().mockResolvedValue({ success: false }) },
    }
    const response = await request('PUT', { password: 'wrong' }, blocked)
    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBe('60')
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({ error: 'Too Many Requests' })
    expect((await request('DELETE', { password, uuid: 'missing' }, blocked)).status).toBe(429)
    expect((await request('GET', undefined, blocked)).status).toBe(200)
    expect(blocked.WRITE_RATE_LIMITER.limit).toHaveBeenCalledWith({ key: 'bnu-sonnet:192.0.2.1' })
  })

  it('limits cache hits too and ignores spoofed forwarded IPs', async () => {
    await request()
    const blocked = {
      ...env,
      READ_RATE_LIMITER: { limit: vi.fn().mockResolvedValue({ success: false }) },
    }
    expect((await request('GET', undefined, blocked)).status).toBe(429)
    await app.request('/api/verses', { headers: { 'X-Forwarded-For': 'fake' } }, blocked)
    expect(blocked.READ_RATE_LIMITER.limit).toHaveBeenLastCalledWith({ key: 'bnu-sonnet:unknown' })
  })

  it('enforces the configured write quota with the local platform binding', async () => {
    const bindings = { ...env, WRITE_RATE_LIMITER: platform.env.WRITE_RATE_LIMITER }
    for (let i = 0; i < 20; i++) {
      expect((await request('PUT', { password: 'wrong' }, bindings)).status).toBe(401)
    }
    expect((await request('PUT', { password: 'wrong' }, bindings)).status).toBe(429)
  })

  it('falls back to D1 if cache reads or writes fail', async () => {
    vi.stubGlobal('caches', {
      default: {
        match: vi.fn().mockRejectedValue(new Error('unavailable')),
        put: vi.fn().mockRejectedValue(new Error('unavailable')),
      },
    })
    try {
      expect(await verses(await request())).toEqual([])
    } finally {
      resetCache()
    }
  })
})
