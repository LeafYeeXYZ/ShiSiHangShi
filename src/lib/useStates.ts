import { create } from 'zustand'

import type { Verse } from './types'
import { TOTAL_PAGES, VERSES } from './utils'

/**
 * 将所有诗句按照设置的句数和每句的候选数打乱
 * @returns 乱序的诗句
 */
function order(allVerses: Verse[], totalPages: number): Verse[][] {
  const randomVerses = JSON.parse(JSON.stringify(allVerses)) as Verse[]
  randomVerses.sort(() => Math.random() - 0.5)
  const verses: Verse[][] = []
  for (let i = 0; i < totalPages; i++) {
    verses.push(
      randomVerses.slice(
        Math.floor((i * allVerses.length) / totalPages),
        Math.floor(((i + 1) * allVerses.length) / totalPages),
      ),
    )
  }
  return verses
}

type States = {
  disabled: boolean
  setDisabled: (disabled: boolean) => void

  verses: Verse[][]
  random: () => void

  versesCount: number
  allVerses: Verse[]

  updateVerses: () => Promise<void>
  lastUpdate: number | null
}

/** 全局状态管理 */
export const useStates = create<States>()((set, get) => ({
  disabled: false,
  setDisabled: (disabled) => set({ disabled }),

  verses: order(VERSES, TOTAL_PAGES),
  random: () => set({ verses: order(get().allVerses, TOTAL_PAGES) }),

  allVerses: VERSES,
  versesCount: VERSES.length,

  updateVerses: async () => {
    const res = await fetch(`/api/verses`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { verses } = await res.json()
    if (
      !Array.isArray(verses) ||
      !verses.every(
        (v) =>
          typeof v === 'object' &&
          v !== null &&
          typeof v.uuid === 'string' &&
          typeof v.createdAt === 'number' &&
          typeof v.content === 'string' &&
          typeof v.author === 'string',
      )
    ) {
      throw new Error('获取诗文列表失败')
    }
    const serverUUIDs = new Set(verses.map((verse: Verse) => verse.uuid))
    const newVerses = [...verses, ...VERSES.filter((verse) => !serverUUIDs.has(verse.uuid))]
    set({
      allVerses: newVerses,
      verses: order(newVerses, TOTAL_PAGES),
      versesCount: newVerses.length,
      lastUpdate: Date.now(),
    })
  },
  lastUpdate: null,
}))
