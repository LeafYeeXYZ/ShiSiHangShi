import { create } from 'zustand'

interface State {
  selectedVerses: string[]
  reSelectVerses: () => void
  VERSES_PER_SECTION: number
  ALL_VERSES: string[]
  randomColor: () => string
}

export const useStates = create<State>()((set) => ({
  selectedVerses: [],
  reSelectVerses: () => {
    set((state) => ({
      selectedVerses: state.ALL_VERSES.sort(() => Math.random() - 0.5).slice(0, state.VERSES_PER_SECTION),
    }))
  },
  randomColor: () => {
    const LOWEST: number = 238 // 颜色的最低值
    const HIGHEST: number = 250 // 颜色的最高值
    const MAX_TOTAL: number = 760 // 三个颜色的最大总和
    const MIN_DIFF: number = 2 // 两个颜色的最小差值
    const random = () => Math.floor(Math.random() * (HIGHEST - LOWEST + 1) + LOWEST)
    const color = () => {
      let red = random()
      let green = random()
      let blue = random()
      while (red + green + blue > MAX_TOTAL || Math.abs(red - green) < MIN_DIFF || Math.abs(red - blue) < MIN_DIFF || Math.abs(green - blue) < MIN_DIFF) {
        red = random()
        green = random()
        blue = random()
      }
      return `rgb(${red}, ${green}, ${blue})`
    }
    return color()
  },
  VERSES_PER_SECTION: 14,
  ALL_VERSES: [
    'Shall I compare thee to a summer’s day?',
    'Thou art more lovely and more temperate:',
    'Rough winds do shake the darling buds of May,',
    'And summer’s lease hath all too short a date:',
    'Sometime too hot the eye of heaven shines,',
    'And often is his gold complexion dimmed;',
    'And every fair from fair sometime declines,',
    'By chance or nature’s changing course untrimmed;',
    'But thy eternal summer shall not fade',
    'Nor lose possession of that fair thou owest;',
    'Nor shall Death brag thou wanderest in his shade,',
    'When in eternal lines to time thou growest:',
    'So long s lives this, and this gives life to thee.',
    'Shall I compare thee to a summer’s day?',
    'Thou art more lovely and more temperate:',
    'Rough winds do shake the darling buds of May,',
    'And summer’s lease hath all too short a date:',
    'Sometime too hot the eye of heaven shines,',
  ],
}))
