import { useStates } from '../lib/useStates'
import { Button } from 'antd'
import { RedoOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

export default function Verses() {

  const { 
    selectedVerses,
    reSelectVerses,
    randomColor,
  } = useStates()

  useEffect(() => {
    reSelectVerses()
  }, [reSelectVerses])

  return (
    <div className='w-full py-4 flex flex-col items-center justify-center'>
      <Button
        type='default'
        onClick={reSelectVerses}
        className='mb-6'
      >
        <RedoOutlined /> 随机
      </Button>
      <div
        className='verses-container w-full flex flex-row items-center justify-center gap-4 flex-wrap'
      >
        {selectedVerses.map((verse) => (
          <div 
            key={Math.random()} 
            className='px-4 py-3 border rounded-lg max-w-full'
            // 随机时间内从透明到不透明
            style={{
              animation: `fadeIn 1s ${Math.random()*1.5+0.1}s both`,
              backgroundColor: randomColor(),
            }}
          >
            {verse}
          </div>
        ))}
      </div>
    </div>
  )
}