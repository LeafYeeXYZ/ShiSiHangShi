import { useStates } from '../lib/useStates'

function getTime(date: Date): string {
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return `${month}月${day}日 ${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`
}

export default function Introduction() {
	const versesCount = useStates((state) => state.versesCount)
	const lastUpdate = useStates((state) => state.lastUpdate)
	return (
		<div className='w-full max-w-xl text-balance text-center flex flex-col items-center justify-center gap-2 mt-5 mb-16 px-2'>
			<p className='text-yellow-800'>
				「当前诗句数量: {versesCount} · 上次更新时间:{' '}
				{lastUpdate ? getTime(new Date(lastUpdate)) : '暂无'}」
			</p>
			<p className='text-lg mt-14'>
				北京师范大学白鸽青协“夏日启行”项目组负责筹备、组织并管理白鸽青协暑期支教团。通过学校招募与调研、支教工作考评、课程设计与培训、统筹管理与宣传为各支教队提供前期保障与发展规划，致力于为远方的孩子带去一个更加充实的夏天
			</p>
		</div>
	)
}
