import { create } from 'zustand'

/** 所有诗句 */
export const VERSES: { content: string; author: string }[] = [
  { content: '可为何不现身影', author: '刘烁玥' },
  { content: '梦里的音乐总是伴在夏天', author: '邓晓雪' },
  { content: '就在夏天的风的雨的夜晚', author: '邓晓雪' },
  { content: '我们轻轻地听着音乐的交挽', author: '邓晓雪' },
  { content: '梦里的音乐无时不在变甜', author: '邓晓雪' },
  { content: '当我梦见那夏天的音乐', author: '邓晓雪' },
  { content: '真期待这儿有你的到来', author: '邓晓雪' },
  { content: '真希望万物能停歇下来', author: '邓晓雪' },
  { content: '我们就能静静地听着旋律', author: '邓晓雪' },
  { content: '空灵鸟的惊声未在夏天里', author: '罗新怡' },
  { content: '眼望行山匆匆每片叶都绿', author: '罗新怡' },
  { content: '没忘夜里孤蝉的鸣叫迷离', author: '罗新怡' },
  { content: '时光如烟雨轻轻淡淡流过', author: '潘蓉程' },
  { content: '曾叹过时光慢如蜗牛之下', author: '潘蓉程' },
  { content: '在我的小世界里乱糟糟！', author: '邓梓琳' },
  { content: '再抬头看看林木', author: '陆瑜静' },
  { content: '当我看见那生与希望的春风', author: '粟思程' },
  { content: '记忆便如潮汐般涌来，让我不知所措', author: '佘诗琪' },
  { content: '酒，水与粮相邻之物也！使人醉，解人愁', author: '孙岩' },
  { content: '请让微笑带走我的烦恼，我喜欢甜甜的微笑', author: '王素俊' },
  { content: '想变成史铁生，体会他笔下的相思', author: '马小冉' },
  { content: '喜欢弯弯的月亮，为夜晚的人指引方向', author: '马文静' },
  { content: '成为麻雀，在天上自由飞翔', author: '贺轩云' },
  { content: '相遇于难忘的蝉季', author: '韦俊慧' },
  { content: '美好的记忆会刻在脑海里', author: '韦俊慧' },
  { content: '在离别时会流露出忧伤', author: '韦俊慧' },
  { content: '夏天的万物带来生机与笑', author: '刘晟涵' },
  { content: '投进了阳光的怀抱', author: '刘晟涵' },
  { content: '忘不了家乡稻田里的麦香', author: '刘晟涵' },
  { content: '阳光准时越跳在它的心弦，也发出悦耳的声音', author: '佘诗琪' },
  { content: '我有一个未曾到达的远方，曾为此多次惆怅', author: '佘诗琪' },
  { content: '在那里，灵魂不用自我封闭', author: '佘诗琪' },
  { content: '黑暗仅是黎明，是戏剧结束的幕布', author: '佘诗琪' },
  { content: '你是心中的泪从天空中落下', author: '柏小岚' },
]
/** 成诗的句数 */
export const TOTAL_PAGES: number = 14
/** 每句的候选数 */
export const VERSE_PER_PAGE: number = 2
/**
 * 显示在页面底部的二维码  
 * @info 第一个 url 会出现在保存的图片中
 */
export const QRCODES: { desc: string; url: string }[] = [
  // 第一个 url 会出现在保存的图片中
  { desc: '无限的十四行诗', url: 'https://bnu-sonnet.pages.dev' },
]
/**
 * 将所有诗句按照设置的句数和每句的候选数打乱
 * @returns 乱序的诗句
 */
const order = () => {
  const ALL_VERSES = VERSES.sort(() => Math.random() - 0.5)
  const verses = []
  for (let i = 0; i < TOTAL_PAGES; i++) {
    verses.push(ALL_VERSES.slice(i * VERSE_PER_PAGE, (i + 1) * VERSE_PER_PAGE))
  }
  return verses
}
/** 全局状态管理 */
export const useStates = create<{
  verses: { content: string; author: string }[][]
  random: () => void
}>()((set) => ({
  verses: order(),
  random: () => set({ verses: order() }),
}))
