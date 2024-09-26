import { create } from 'zustand'
import { VERSES } from './allVerses'

interface State {
  verses: { content: string; author: string }[][]
  random: () => void
  qrcodes: { desc: string; url: string }[]
}

const TOTAL_PAGES: number = 14
const VERSE_PER_PAGE: number = 9
const QRCODES = [
  // 第一个 url 会出现在保存的图片中
  { desc: '体验网页', url: 'https://bnu-sonnet.pages.dev' },
]

const order = () => {
  const ALL_VERSES = VERSES.sort(() => Math.random() - 0.5)
  const verses = []
  for (let i = 0; i < TOTAL_PAGES; i++) {
    verses.push(ALL_VERSES.slice(i * VERSE_PER_PAGE, (i + 1) * VERSE_PER_PAGE))
  }
  return verses
}

export const useStates = create<State>()((set) => ({
  verses: order(),
  random: () => set({ verses: order() }),
  qrcodes: QRCODES,
}))
