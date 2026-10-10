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
app.use('/api/*', bodyLimit({ maxSize: 64 * 1024 }))

app.get('/api/verses', async (c) => {
  const { results } = await c.env.SONNET_DB.prepare(selectVerses).all<Verse>()
  return c.json({ verses: results })
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
