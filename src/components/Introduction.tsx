import { useStates } from '../lib/useStates'
import { getTime } from '../lib/utils'

export default function Introduction() {
  const versesCount = useStates((state) => state.versesCount)
  const lastUpdate = useStates((state) => state.lastUpdate)
  return (
    <div className="mt-5 mb-16 flex w-full max-w-xl flex-col items-center justify-center gap-2 px-2 text-center text-balance">
      <p className="text-yellow-800">
        「当前诗句数量: {versesCount} · 上次更新时间:{' '}
        {lastUpdate ? getTime(new Date(lastUpdate)) : '暂无'}」
      </p>
      <p className="mt-14 text-lg">
        北京师范大学白鸽青协“夏日启行”项目组负责筹备、组织并管理白鸽青协暑期支教团。通过学校招募与调研、支教工作考评、课程设计与培训、统筹管理与宣传为各支教队提供前期保障与发展规划，致力于为远方的孩子带去一个更加充实的夏天
      </p>
    </div>
  )
}
