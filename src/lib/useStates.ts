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
  { desc: '体验网页', url: 'https://bnu-sonnet.pages.dev' },
]

export const useStates = create<State>()((set) => {
  const order = (): { content: string; author: string }[][] => {
    const verses = VERSES.sort(() => Math.random() - 0.5)
    const result = []
    for (let i = 0; i < TOTAL_PAGES; i++) {
      result.push(verses.slice(i * VERSE_PER_PAGE, (i + 1) * VERSE_PER_PAGE))
    }
    return result
  }
  return {
    verses: order(),
    random: () => set({ verses: order() }),
    qrcodes: QRCODES,
  }
})
