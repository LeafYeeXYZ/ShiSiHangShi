import { timingSafeEqual } from 'node:crypto'

import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { HTTPException } from 'hono/http-exception'

import type { Verse } from '../src/lib/types'

const app = new Hono<{ Bindings: Env }>()
const selectVerses = 'SELECT uuid, createdAt, content, author FROM verses ORDER BY createdAt, uuid'

app.use('/api/*', async (c, next) => {
  c.header('Cache-Control', 'no-store')
  await next()
})
// Limit before reading bodies, checking passwords, or accessing D1/cache.
app.use('/api/*', async (c, next) => {
  const write = c.req.method === 'PUT' || c.req.method === 'DELETE'
  const limiter = write ? c.env.WRITE_RATE_LIMITER : c.env.READ_RATE_LIMITER
  // Only trust Cloudflare's client IP; forwarded headers are caller-controlled.
  const ip = c.req.header('CF-Connecting-IP') || 'unknown'
  const { success } = await limiter.limit({ key: `bnu-sonnet:${ip}` })
  if (!success) {
    c.header('Retry-After', '60')
    throw new HTTPException(429, { message: 'Too Many Requests' })
  }
  await next()
})
app.use('/api/*', bodyLimit({ maxSize: 64 * 1024 }))

app.get('/api/verses', async (c) => {
  // One indexed row read validates caches across all Cloudflare locations.
  // Triggers update the revision in the same transaction as every verse mutation.
  const revision = await c.env.SONNET_DB.prepare(
    'SELECT revision FROM verse_cache_revision WHERE id = 1',
  ).first<string>('revision')
  if (!revision) throw new Error('Verse cache revision is missing')
  const key = new URL('/api/verses', c.req.url)
  key.searchParams.set('revision', revision)
  const cache = caches.default
  try {
    const cached = await cache.match(key.toString())
    if (cached) {
      c.header('X-Cache', 'HIT')
      // Keep browser/CDN caching disabled; only the internal versioned cache is shared.
      return c.body(await cached.text(), 200, { 'Content-Type': 'application/json' })
    }
  } catch {
    console.warn(JSON.stringify({ event: 'verse_cache_read_failed' }))
  }
  const { results } = await c.env.SONNET_DB.prepare(selectVerses).all<Verse>()
  const body = JSON.stringify({ verses: results })
  const cached = new Response(body, {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
  })
  c.executionCtx.waitUntil(
    cache.put(key.toString(), cached).catch(() => {
      console.warn(JSON.stringify({ event: 'verse_cache_write_failed' }))
    }),
  )
  c.header('X-Cache', 'MISS')
  return c.body(body, 200, { 'Content-Type': 'application/json' })
})

app.use('/api/verses', async (c, next) => {
  if (c.req.method !== 'PUT' && c.req.method !== 'DELETE') return next()
  if (!c.env.PASSWORD) {
    throw new HTTPException(503, { message: 'Administrator password is not configured' })
  }
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    throw new HTTPException(400, { message: 'Invalid JSON' })
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new HTTPException(400, { message: 'Bad Request' })
  }
  if (!('password' in body) || typeof body.password !== 'string') {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
  const encoder = new TextEncoder()
  const [actual, expected] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(body.password)),
    crypto.subtle.digest('SHA-256', encoder.encode(c.env.PASSWORD)),
  ])
  if (!timingSafeEqual(new Uint8Array(actual), new Uint8Array(expected))) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
  await next()
})

app.put('/api/verses', async (c) => {
  const { content, author } = await c.req.json<{ content?: unknown; author?: unknown }>()
  if (
    typeof content !== 'string' ||
    !content.trim() ||
    typeof author !== 'string' ||
    !author.trim()
  ) {
    throw new HTTPException(400, { message: 'Content and author are required' })
  }
  const [, verses] = await c.env.SONNET_DB.batch<Verse>([
    c.env.SONNET_DB.prepare(
      'INSERT INTO verses (uuid, createdAt, content, author) VALUES (?, ?, ?, ?)',
    ).bind(crypto.randomUUID(), Date.now(), content, author),
    c.env.SONNET_DB.prepare(selectVerses),
  ])
  return c.json({ verses: verses.results })
})

app.delete('/api/verses', async (c) => {
  const { uuid } = await c.req.json<{ uuid?: unknown }>()
  if (typeof uuid !== 'string' || !uuid.trim()) {
    throw new HTTPException(400, { message: 'UUID is required' })
  }
  const [, verses] = await c.env.SONNET_DB.batch<Verse>([
    c.env.SONNET_DB.prepare('DELETE FROM verses WHERE uuid = ?').bind(uuid),
    c.env.SONNET_DB.prepare(selectVerses),
  ])
  return c.json({ verses: verses.results })
})

app.all('/api/*', (c) => c.json({ error: 'Not Found' }, 404))
app.all('/api', (c) => c.json({ error: 'Not Found' }, 404))
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

app.onError((error, c) => {
  if (error instanceof HTTPException) return c.json({ error: error.message }, error.status)
  console.error(
    JSON.stringify({ event: 'request_failed', path: c.req.path, message: error.message }),
  )
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
