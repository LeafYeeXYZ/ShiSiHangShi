import { Hono } from 'npm:hono@4.7.5'
import { cors } from 'npm:hono@4.7.5/cors'
import { v4 as uuid } from 'npm:uuid@11.1.0'

type Verse = {
	uuid: string
	createdAt: number
	content: string
	author: string
}

const app = new Hono()
const kv = await Deno.openKv()
const pw = Deno.env.get('PASSWORD')

if (typeof pw !== 'string') {
  throw new Error('PASSWORD is required')
}

app.use(cors())

app.get('/api/verses', async (c) => {
  const verses = await kv.get<Verse[]>(['verses'])
  return c.json({
    verses: verses.value || []
  })
})

app.put('/api/verses', async (c) => {
  const { password, content, author } = await c.req.json()
  if (password !== pw) {
    return new Response('Unauthorized', { status: 401 })
  }
  if (typeof content !== 'string' || typeof author !== 'string') {
    return new Response('Bad Request', { status: 400 })
  }
  const oldVerses = (await kv.get<Verse[]>(['verses'])).value || []
  const newVerses = [...oldVerses, {
    uuid: uuid(),
    createdAt: Date.now(),
    content,
    author
  }]
  await kv.set(['verses'], newVerses)
  return c.json({
    verses: newVerses
  })
})

app.delete('/api/verses', async (c) => {
  const { password, uuid } = await c.req.json()
  if (password !== pw) {
    return new Response('Unauthorized', { status: 401 })
  }
  if (typeof uuid !== 'string') {
    return new Response('Bad Request', { status: 400 })
  }
  const oldVerses = (await kv.get<Verse[]>(['verses'])).value || []
  const newVerses = oldVerses.filter((v) => v.uuid !== uuid)
  await kv.set(['verses'], newVerses)
  return c.json({
    verses: newVerses
  })
})

Deno.serve(app.fetch)
