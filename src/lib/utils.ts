import ORIGINAL_VERSES from '../../scripts/original.json'
import type { Verse } from './types'

export function getTime(date: Date): string {
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return `${month}月${day}日 ${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`
}

export function uuid(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

/**
 * 显示在页面底部的二维码
 */
export const QRCODES: { desc: string; url: string; icon?: string }[] = [
	{ desc: '无限的十四行诗', url: 'https://sonnet.leafyee.xyz' },
	{
		desc: '北师大白鸽青协',
		url: 'http://weixin.qq.com/r/Q3WGg4PEgkv_KMfgbyDH',
		icon: '/baige.jpeg',
	},
]
/** 成诗的句数 */
export const TOTAL_PAGES = 14
/** 所有初始诗句 */
export const VERSES: Verse[] = ORIGINAL_VERSES.map((verse, index) => ({
	...verse,
	uuid: uuid(),
	createdAt: Date.now() + index * 10,
}))
