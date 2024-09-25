import { useStates } from '../lib/useStates'
import { Button } from 'antd'
import { RedoOutlined, DownloadOutlined } from '@ant-design/icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useRef } from 'react'

export default function Verses() {

  const { verses, random } = useStates()

  const swiperRef = useRef(null)
  const save = () => window.print()

  return (
    <div className='w-full flex flex-col items-center justify-center'>

      <div
        className='w-full flex flex-row items-center justify-center gap-4 mb-6 print:hidden'
      >
        <Button
          type='default'
          onClick={random}
          className='rounded-none border border-yellow-950'
        >
          <RedoOutlined /> 重新随机
        </Button>
      </div>

      <div
        className='w-full flex flex-col items-center justify-center gap-4'
      >
        {verses.map((verse, index) => (
          <Swiper
            ref={swiperRef}
            key={Math.random()} 
            className='w-full bg-yellow-50 border border-yellow-950 transition-all'
            style={{
              // 随机时间内从透明到不透明
              animation: `fadeIn 1s ${index*0.1+0.1}s both`,
            }}
            grabCursor={true}
          >
            {verse.map((v) => (
              <SwiperSlide
                key={Math.random()} 
                className='w-full px-4 py-3'
              >
                <p className='text-lg'>
                  {v.content}
                </p>
                <p className='text-xs mt-[0.15rem] pl-[0.1rem] opacity-70'>
                  来自: {v.author}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        ))}
      </div>

      <div
        className='w-full flex flex-row items-center justify-center gap-4 mt-6 print:hidden'
      >
        <Button
          type='default'
          onClick={save}
          className='rounded-none border border-yellow-950'
        >
          <DownloadOutlined /> 保存文档
        </Button>
      </div>

    </div>
  )
}