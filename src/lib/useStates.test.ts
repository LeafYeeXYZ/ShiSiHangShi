import { afterEach, expect, it, vi } from 'vite-plus/test'

import MIGRATED_VERSES from '../../data/migrate.json'
import { useStates } from './useStates'
import { TOTAL_PAGES, VERSES } from './utils'

const initial = useStates.getState()

afterEach(() => {
  useStates.setState(initial, true)
  vi.unstubAllGlobals()
})

it('includes every static verse when the total is not divisible by fourteen', () => {
  const pages = useStates.getState().verses
  expect(pages).toHaveLength(TOTAL_PAGES)
  expect(pages.flat()).toHaveLength(VERSES.length)
  expect(new Set(pages.flat().map((verse) => verse.uuid)).size).toBe(VERSES.length)
})

it('merges uploaded verses without duplicating migrated UUIDs', async () => {
  const uploaded = { uuid: 'new-upload', createdAt: 1, content: 'new verse', author: 'author' }
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(Response.json({ verses: [MIGRATED_VERSES[0], uploaded] })),
  )
  await useStates.getState().updateVerses()
  const state = useStates.getState()
  expect(state.versesCount).toBe(VERSES.length + 1)
  expect(state.allVerses.filter((verse) => verse.uuid === MIGRATED_VERSES[0].uuid)).toHaveLength(1)
  expect(state.verses.flat()).toHaveLength(state.allVerses.length)
})

it('keeps the current verses when the server returns invalid data', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ verses: [null] })))
  await expect(useStates.getState().updateVerses()).rejects.toThrow('获取诗文列表失败')
  expect(useStates.getState().allVerses).toBe(initial.allVerses)
})
