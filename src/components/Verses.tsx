import { useStates } from '../lib/useStates'
import { Button, QRCode } from 'antd'
import { RedoOutlined, SaveOutlined } from '@ant-design/icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import html2canvas from 'html2canvas'
import { useRef, useEffect } from 'react'

export default function Verses() {

  const { verses, random, qrcodes } = useStates()

  // 以下内容用于保存图片
  const imgRef = useRef<HTMLDivElement>(null)
  const poemRef = useRef<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    poemRef.current = verses.map((verse) => verse[0].content)
  }, [verses])
  const save = () => {
    imgRef.current!.style.display = 'block'
    containerRef.current!.innerHTML = poemRef.current.map((p) => (
      `<div class='w-full text-lg text-center p-2'>${p}</div>`
    )).join('')
    html2canvas(imgRef.current!).then((canvas) => {
      imgRef.current!.style.display = 'none'
      containerRef.current!.innerHTML = ''
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = '无限的十四行诗.png'
      a.click()
    })
  }

  return (
    <div className='w-full flex flex-col items-center justify-center bg-white'>

      <div
        style={{ display: 'none' }}
        ref={imgRef}
        className='w-[20rem] flex flex-col items-center justify-center p-4 absolute -z-50 bg-yellow-50 top-0'
      >
        <div
          className='w-full flex flex-col items-center justify-center gap-2 p-4 border border-yellow-950'
        >
          <div
            ref={containerRef}
            className='w-full flex flex-col items-center justify-center gap-2'
          ></div>
          <QRCode
            value={qrcodes[0].url}
            size={80}
            className='rounded-none p-1 border border-yellow-950 mt-12'
          />
          <p className='text-base opacity-80 mb-6'>
            「无限的十四行诗」
          </p>
        </div>
      </div>

      <div
        className='w-full flex flex-row items-center justify-center gap-4 mb-6'
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
            key={Math.random()} 
            className='w-full bg-yellow-50 border border-yellow-950 transition-all'
            style={{
              // 随机时间内从透明到不透明
              animation: `fadeIn 1s ${index*0.1+0.1}s both`,
            }}
            grabCursor={true}
            onSlideChange={(swiper) => {
              poemRef.current[index] = verse[swiper.activeIndex].content
            }}
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
        className='w-full flex flex-row items-center justify-center gap-4 mt-6'
      >
        <Button
          type='default'
          onClick={save}
          className='rounded-none border border-yellow-950'
        >
          <SaveOutlined /> 保存当前诗文
        </Button>
      </div>

    </div>
  )
}