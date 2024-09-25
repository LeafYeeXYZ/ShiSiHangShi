import { useStates } from '../lib/useStates'
import { Button } from 'antd'
import { 
  RedoOutlined,
} from '@ant-design/icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function Verses() {

  const { 
    verses,
    random,
  } = useStates()

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <Button
        type='default'
        onClick={random}
        className='mb-6'
      >
        <RedoOutlined /> 重新随机
      </Button>
      <div
        className='w-full flex flex-col items-center justify-center gap-4'
      >
        {verses.map((verse) => (
          <Swiper
            key={Math.random()} 
            className='w-full bg-yellow-50 border-2 border-yellow-100'
            style={{
              // 随机时间内从透明到不透明
              animation: `fadeIn 1s ${Math.random()*0.5+0.1}s both`,
            }}
            grabCursor={true}
          >
            {verse.map((v) => (
              <SwiperSlide
                key={Math.random()} 
                className='w-full px-4 py-3'
              >
                <p>{v.content}</p>
                <p>{v.author}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        ))}
      </div>
    </div>
  )
}