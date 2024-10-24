import { create } from 'zustand'

/** 所有诗句 */
export const VERSES: { content: string; author: string }[] = [
  {
    content: "变成他，体会他眼里的世界",
    author: "马小冉 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "假如没有你，世间将何从漫长",
    author: "殷霞 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "做自由的主旋律",
    author: "温家磊 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "吹过蒲公英，带他们遨游世界",
    author: "王雪灏 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "藤的记忆会有很多茎",
    author: "韦俊慧 从江县第二民族中学 云海支教队",
  },
  {
    content: "想象爬上故乡的山头",
    author: "梁丽 从江县第二民族中学 云海支教队",
  },
  {
    content: "我想变成一朵花，别在你的耳梢上",
    author: "刘骞姝 从江县第二民族中学 云海支教队",
  },
  {
    content: "真希望万物能停歇下来",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "柳树青青，夏至未至，秋将来果",
    author: "潘蓉程 从江县第二民族中学 云海支教队",
  },
  {
    content: "伴随大自然的轻音乐且睡去",
    author: "张晗雨 从江县第二民族中学 云海支教队",
  },
  {
    content: "是谁惊动了那熟睡的小鸟？",
    author: "孟佳佳 从江县第二民族中学 云海支教队",
  },
  {
    content: "我的青春貌似找到了自己的归宿",
    author: "滚腾越 从江县第二民族中学 云海支教队",
  },
  {
    content: "白鸽会引你走向那片天地",
    author: "佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "弯曲的小路是它唯一的途径",
    author: "佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "蔚蓝的海是我心脏的声音",
    author: "朱雨欣 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "夜晚正为我轰鸣",
    author: "朱雨欣 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "这是我年久失修的亲昵",
    author: "王雨瑶 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "她在人民的阳光中逆流而上",
    author: "百色市田阳区南山实验小学 同风行",
  },
  {
    content: "阴影总统一朝阳光倾覆，为大地披上一件风衣",
    author: " 佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "人们的每一次呼吸，都是在与世界诉说密语",
    author: "佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "自由的使者，穿云破雾，展翅高翔",
    author: "罗慧玲 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "它的身影，是比肩红日的诗画",
    author: "罗慧玲 重庆市万州区三峡初级中学 秉烛行",
  },
  { 
    content: "自由是什么？", 
    author: "李莎莎 四川省广元市曾家初级中学 不辞行" 
  },
  {
    content: "自由在山的另一边",
    author: "张恩豪 四川省广元市曾家初级中学 不辞行",
  },
  {
    content: "是一只不求回报的蜜蜂，一朵沉默的黄花，一抹最美的朝霞",
    author: "百色市田阳区南山实验小学 同风行",
  },
  {
    content: "红而亮的霞光闪烁着滚动着",
    author: "孟俐俐 河北省邢台市广宗县第二中学 缘溪行",
  },
  {
    content: "我的心里，有说不出的愉快和兴奋",
    author: "秦国敬 河北省邢台市广宗县第二中学 缘溪行",
  },
  {
    content: "沿着海边，慢慢地向前走去",
    author: "孟俐俐 河北省邢台市广宗县第二中学 缘溪行",
  },
  {
    content: "飘到房子上，下一场雨",
    author: "云南省昆明市富民县款庄中心小学四年级(集体) 云影行",
  },
  {
    content: "拉出生命之苦的泥潭",
    author: "云南省昆明市富民县款庄中心小学五年级(集体) 云影行",
  },
  {
    content: "下一场温柔的雨，然后看着青绿的菜芽吸收雨水",
    author: "云南省昆明市富民县款庄中心小学五年级(集体) 云影行",
  },
  {
    content: "我会把他们脸上的汗轻轻吹走",
    author: "张维 云南省昆明市富民县款庄中心小学 云影行",
  },
  {
    content: "用风抚摸她的脸颊",
    author: "张维 云南省昆明市富民县款庄中心小学 云影行",
  },
  {
    content: "可为何不现身影",
    author: " 刘烁玥 从江县第二民族中学 云海支教队",
  },
  {
    content: "梦里的音乐总是伴在夏天",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "就在夏天的风的雨的夜晚",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "我们轻轻地听着音乐的交挽",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "梦里的音乐无时不在变甜",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "当我梦见那夏天的音乐",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "真期待这儿有你的到来",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "真希望万物能停歇下来",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "我们就能静静地听着旋律",
    author: "邓晓雪 从江县第二民族中学 云海支教队",
  },
  {
    content: "空灵鸟的惊声未在夏天里",
    author: "罗新怡 从江县第二民族中学 云海支教队",
  },
  {
    content: "眼望行山匆匆每片叶都绿",
    author: "罗新怡 从江县第二民族中学 云海支教队",
  },
  {
    content: "没忘夜里孤蝉的鸣叫迷离",
    author: "罗新怡 从江县第二民族中学 云海支教队",
  },
  {
    content: "时光如烟雨轻轻淡淡流过",
    author: "潘蓉程 从江县第二民族中学 云海支教队",
  },
  {
    content: "曾叹过时光慢如蜗牛之下",
    author: "潘蓉程 从江县第二民族中学 云海支教队",
  },
  {
    content: "在我的小世界里乱糟糟！",
    author: "邓梓琳 从江县第二民族中学 云海支教队",
  },
  { 
    content: "再抬头看看林木", 
    author: "陆瑜静 从江县第二民族中学 云海支教队" 
  },
  {
    content: "当我看见那生与希望的春风",
    author: "粟思程 从江县第二民族中学 云海支教队",
  },
  {
    content: "记忆便如潮汐般涌来，让我不知所措",
    author: "佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "酒，水与粮相邻之物也！使人醉，解人愁",
    author: "孙岩 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "请让微笑带走我的烦恼，我喜欢甜甜的微笑",
    author: "王素俊 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "想变成史铁生，体会他笔下的相思",
    author: "马小冉 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "喜欢弯弯的月亮，为夜晚的人指引方向",
    author: "马文静 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "成为麻雀，在天上自由飞翔",
    author: "贺轩云 河北省张家口市尚义县新兴街小学 乐泽支教队",
  },
  {
    content: "相遇于难忘的蝉季",
    author: "韦俊慧 从江县第二民族中学 云海支教队",
  },
  {
    content: "美好的记忆会刻在脑海里",
    author: "韦俊慧 从江县第二民族中学 云海支教队",
  },
  {
    content: "在离别时会流露出忧伤7",
    author: "韦俊慧 从江县第二民族中学 云海支教队",
  },
  {
    content: "夏天的万物带来生机与笑",
    author: "刘晟涵 从江县第二民族中学 云海支教队",
  },
  {
    content: "投进了阳光的怀抱",
    author: "刘晟涵 从江县第二民族中学 云海支教队",
  },
  {
    content: "忘不了家乡稻田里的麦香",
    author: "刘晟涵 从江县第二民族中学 云海支教队",
  },
  {
    content: "阳光准时越跳在它的心弦，也发出悦耳的声音",
    author: "佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "我有一个未曾到达的远方，曾为此多次惆怅",
    author: "佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "在那里，灵魂不用自我封闭",
    author: "佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "黑暗仅是黎明，是戏剧结束的幕布",
    author: "佘诗琪 重庆市万州区三峡初级中学 秉烛行",
  },
  {
    content: "你是心中的泪从天空中落下",
    author: "柏小岚 重庆市万州区三峡初级中学 秉烛行",
  },
]
/** 成诗的句数 */
export const TOTAL_PAGES: number = 14
/** 每句的候选数 */
export const VERSE_PER_PAGE: number = +parseInt(
  (VERSES.length / TOTAL_PAGES) + "",
)
/**
 * 显示在页面底部的二维码
 */
export const QRCODES: { desc: string; url: string; icon?: string }[] = [
  { desc: "无限的十四行诗", url: "https://sonnet.leafyee.xyz" },
  {
    desc: "北师大白鸽青协",
    url: "http://weixin.qq.com/r/Q3WGg4PEgkv_KMfgbyDH",
    icon: "/baige.jpeg",
  },
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
