import {
  CloseOutlined,
  CloudDownloadOutlined,
  Loading3QuartersOutlined,
  RedoOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { Button, message } from 'antd'
import html2canvas from 'html2canvas-pro'
import { useEffect, useRef } from 'react'
import 'swiper/css'
import { flushSync } from 'react-dom'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useStates } from '../lib/useStates'
import QRCodes from './QRCodes'

export default function Verses() {
  const verses = useStates((state) => state.verses)
  const random = useStates((state) => state.random)
  const disabled = useStates((state) => state.disabled)
  const setDisabled = useStates((state) => state.setDisabled)
  const updateVerses = useStates((state) => state.updateVerses)

  const [messageApi, contextHolder] = message.useMessage()

  // 以下内容用于保存图片 (用 Ref 是为了避免重复渲染导致当前诗文被覆盖)
  const imgRef = useRef<HTMLDivElement>(null)
  const poemRef = useRef<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    poemRef.current = verses.map((verse) => verse[0].content)
  }, [verses])
  const save = async () => {
    const image = imgRef.current
    const container = containerRef.current
    const modal = modalRef.current
    if (!image || !container || !modal) return

    try {
      flushSync(() => setDisabled(true))
      image.style.display = 'block'
      container.replaceChildren(
        ...poemRef.current.map((content) => {
          const line = document.createElement('div')
          line.className = 'w-full text-lg text-center px-2'
          line.textContent = content
          return line
        }),
      )
      await document.fonts.load('18px "Noto Serif SC"', poemRef.current.join(''))
      await document.fonts.ready
      const canvas = await html2canvas(image)
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'sonnet.png'
      a.click()
      modal.style.display = 'flex'
      modal.firstElementChild?.setAttribute('href', url)
      setTimeout(() => {
        modal.style.display = 'none'
      }, 5000)
    } catch (e) {
      messageApi.error(`保存失败: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      image.style.display = 'none'
      container.replaceChildren()
      setDisabled(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white">
      <div
        style={{ display: 'none' }}
        ref={imgRef}
        className="absolute top-0 -z-50 flex w-md flex-col items-center justify-center bg-yellow-50 p-4"
      >
        <div className="flex w-full flex-col items-center justify-center gap-2 border border-yellow-950 p-4 pb-12">
          <div
            ref={containerRef}
            className="mt-5 mb-12 flex w-full flex-col items-center justify-center gap-2"
          />
          <QRCodes />
        </div>
      </div>

      <div className="mb-6 flex w-full flex-row items-center justify-center gap-4">
        <Button
          type="default"
          onClick={random}
          className="rounded-none! border! border-yellow-950!"
          disabled={disabled}
        >
          <RedoOutlined /> 重新随机
        </Button>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-4">
        {verses.map((verse, index) => (
          <Swiper
            key={verse.map((v) => v.uuid).join(',')}
            className="w-full border border-yellow-950 bg-yellow-50 transition-all"
            style={
              !disabled
                ? {
                    // 随机时间内从透明到不透明
                    animation: `fadeIn 1s ${index * 0.1 + 0.1}s both`,
                  }
                : {}
            }
            grabCursor={true}
            onSlideChange={(swiper) => {
              poemRef.current[index] = verse[swiper.activeIndex].content
            }}
            autoHeight={true}
          >
            {verse.map((v) => (
              <SwiperSlide key={v.uuid} className="w-full px-4 pt-[0.7rem] pb-3">
                <p className="text-lg leading-tight text-balance">{v.content}</p>
                <p className="mt-[0.3rem] pl-[0.1rem] text-xs opacity-70">来自: {v.author}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        ))}
      </div>

      <div className="mt-6 flex w-full flex-row items-center justify-center gap-4">
        <Button
          type="default"
          icon={disabled ? <Loading3QuartersOutlined spin /> : <CloudDownloadOutlined />}
          onClick={async () => {
            try {
              flushSync(() => setDisabled(true))
              await updateVerses()
              messageApi.success('更新成功')
            } catch (e) {
              messageApi.error(`更新失败: ${e instanceof Error ? e.message : String(e)}`)
            } finally {
              setDisabled(false)
            }
          }}
          className="rounded-none! border! border-yellow-950!"
          disabled={disabled}
        >
          更新诗文列表
        </Button>
        <Button
          type="default"
          icon={<SaveOutlined />}
          onClick={save}
          className="rounded-none! border! border-yellow-950!"
          disabled={disabled}
        >
          保存当前诗文
        </Button>
      </div>

      {contextHolder}

      <div
        style={{ display: 'none' }}
        className="fixed bottom-0 z-50 flex h-10 w-full items-center justify-center bg-yellow-950 text-[0.8rem] text-white"
        ref={modalRef}
      >
        如果浏览器没有自动下载, 请
        <a href="/" download="sonnet.png" className="text-yellow-400">
          点击这里下载
        </a>
        <button
          type="button"
          className="absolute top-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-yellow-950"
          onClick={() => {
            if (!modalRef.current) {
              console.error('Ref not found')
              return
            }
            modalRef.current.style.display = 'none'
          }}
        >
          <CloseOutlined />
        </button>
      </div>
    </div>
  )
}
