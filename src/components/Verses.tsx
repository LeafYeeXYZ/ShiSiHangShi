import { useStates } from '../lib/useStates'
import { Button } from 'antd'
import { RedoOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import html2canvas from 'html2canvas'
import { useRef, useEffect } from 'react'
import QRCodes from './QRCodes'

export default function Verses() {

  const { verses, random } = useStates()

  // 以下内容用于保存图片 (用 Ref 是为了避免重复渲染导致当前诗文被覆盖)
  const imgRef = useRef<HTMLDivElement>(null)
  const poemRef = useRef<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    poemRef.current = verses.map((verse) => verse[0].content)
  }, [verses])
  const save = () => {
    imgRef.current!.style.display = 'block'
    containerRef.current!.innerHTML = poemRef.current.map((p) => (
      `<div class='w-full text-lg text-center px-2'>${p}</div>`
    )).join('')
    html2canvas(imgRef.current!).then((canvas) => {
      imgRef.current!.style.display = 'none'
      containerRef.current!.innerHTML = ''
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'sonnet.png'
      a.click()
      modalRef.current!.style.display = 'flex'
      modalRef.current!.firstElementChild!.setAttribute('href', url)
      setTimeout(() => modalRef.current!.style.display = 'none', 5000)
    })
  }

  return (
    <div className='w-full flex flex-col items-center justify-center bg-white'>

      <div
        style={{ display: 'none' }}
        ref={imgRef}
        className='w-[28rem] flex flex-col items-center justify-center p-4 absolute -z-50 bg-yellow-50 top-0'
      >
        <div
          className='w-full flex flex-col items-center justify-center gap-2 p-4 border border-yellow-950 pb-12'
        >
          <div
            ref={containerRef}
            className='w-full flex flex-col items-center justify-center gap-2 mb-12 mt-5'
          ></div>
          <QRCodes />
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
            autoHeight={true}
          >
            {verse.map((v) => (
              <SwiperSlide
                key={Math.random()} 
                className='w-full px-4 pb-3 pt-[0.7rem]'
              >
                <p className='text-lg leading-[1.25] text-balance'>
                  {v.content}
                </p>
                <p className='text-xs mt-[0.3rem] pl-[0.1rem] opacity-70'>
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

      <div
        style={{ display: 'none' }}
        className='w-full h-10 fixed bottom-0 z-50 flex items-center justify-center bg-yellow-950 text-white text-[0.8rem]'
        ref={modalRef}
      >
        如果浏览器没有自动下载, 请<a href='' download='sonnet.png' className='text-yellow-400'>点击这里下载</a>
        <div
          className='w-10 h-10 absolute right-0 top-0 cursor-pointer flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-yellow-950'
          onClick={() => modalRef.current!.style.display = 'none'}
        >
          <CloseOutlined />
        </div>
      </div>

    </div>
  )
}
