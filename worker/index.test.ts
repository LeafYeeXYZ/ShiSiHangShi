import { readFile } from 'node:fs/promises'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vite-plus/test'
import { getPlatformProxy, type PlatformProxy } from 'wrangler'

import type { Verse } from '../src/lib/types'
import app from './index'

let platform: PlatformProxy<Env>
let env: Env
const password = 'local-test-password'

async function request(method = 'GET', body?: unknown, bindings = env) {
  return app.request(
    '/api/verses',
    {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    bindings,
  )
}

async function verses(response: Response): Promise<Verse[]> {
  expect(response.status).toBe(200)
  return ((await response.json()) as { verses: Verse[] }).verses
}

beforeAll(async () => {
  platform = await getPlatformProxy<Env>({ persist: false, remoteBindings: false })
  env = { ...platform.env, PASSWORD: password }
  const schema = await readFile('worker/migrations/0001_create_verses.sql', 'utf8')
  await env.SONNET_DB.exec(schema.replaceAll('\n', ' '))
})

beforeEach(async () => {
  await env.SONNET_DB.prepare('DELETE FROM verses').run()
})

afterAll(async () => {
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
