import {
	CloseOutlined,
	CloudDownloadOutlined,
	Loading3QuartersOutlined,
	RedoOutlined,
	SaveOutlined,
} from '@ant-design/icons'
import { Button, message } from 'antd'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useStates } from '../lib/useStates'
import 'swiper/css'
import html2canvas from 'html2canvas'
import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
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
	const save = () => {
		if (!imgRef.current || !containerRef.current) {
			console.error('Ref not found')
			return
		}
		imgRef.current.style.display = 'block'
		containerRef.current.innerHTML = poemRef.current
			.map((p) => `<div class='w-full text-lg text-center px-2'>${p}</div>`)
			.join('')
		html2canvas(imgRef.current).then((canvas) => {
			if (!imgRef.current || !containerRef.current || !modalRef.current) {
				console.error('Ref not found')
				return
			}
			imgRef.current.style.display = 'none'
			containerRef.current.innerHTML = ''
			const url = canvas.toDataURL('image/png')
			const a = document.createElement('a')
			a.href = url
			a.download = 'sonnet.png'
			a.click()
			modalRef.current.style.display = 'flex'
			modalRef.current.firstElementChild?.setAttribute('href', url)
			setTimeout(() => {
				if (!modalRef.current) {
					console.error('Ref not found')
					return
				}
				modalRef.current.style.display = 'none'
			}, 5000)
		})
	}

	return (
		<div className='w-full flex flex-col items-center justify-center bg-white'>
			<div
				style={{ display: 'none' }}
				ref={imgRef}
				className='w-[28rem] flex flex-col items-center justify-center p-4 absolute -z-50 bg-yellow-50 top-0'
			>
				<div className='w-full flex flex-col items-center justify-center gap-2 p-4 border border-yellow-950 pb-12'>
					<div
						ref={containerRef}
						className='w-full flex flex-col items-center justify-center gap-2 mb-12 mt-5'
					/>
					<QRCodes />
				</div>
			</div>

			<div className='w-full flex flex-row items-center justify-center gap-4 mb-6'>
				<Button
					type='default'
					onClick={random}
					className='rounded-none border border-yellow-950'
					disabled={disabled}
				>
					<RedoOutlined /> 重新随机
				</Button>
			</div>

			<div className='w-full flex flex-col items-center justify-center gap-4'>
				{verses.map((verse, index) => (
					<Swiper
						key={Math.random()}
						className='w-full bg-yellow-50 border border-yellow-950 transition-all'
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

			<div className='w-full flex flex-row items-center justify-center gap-4 mt-6'>
				<Button
					type='default'
					icon={
						disabled ? (
							<Loading3QuartersOutlined spin />
						) : (
							<CloudDownloadOutlined />
						)
					}
					onClick={async () => {
						try {
							flushSync(() => setDisabled(true))
							await updateVerses()
							messageApi.success('更新成功')
						} catch (e) {
							messageApi.error(
								`更新失败: ${e instanceof Error ? e.message : String(e)}`,
							)
						} finally {
							setDisabled(false)
						}
					}}
					className='rounded-none border border-yellow-950'
					disabled={disabled}
				>
					更新诗文列表
				</Button>
				<Button
					type='default'
					icon={<SaveOutlined />}
					onClick={save}
					className='rounded-none border border-yellow-950'
					disabled={disabled}
				>
					保存当前诗文
				</Button>
			</div>

			{contextHolder}

			<div
				style={{ display: 'none' }}
				className='w-full h-10 fixed bottom-0 z-50 flex items-center justify-center bg-yellow-950 text-white text-[0.8rem]'
				ref={modalRef}
			>
				如果浏览器没有自动下载, 请
				<a href='/' download='sonnet.png' className='text-yellow-400'>
					点击这里下载
				</a>
				<button
					type='button'
					className='w-10 h-10 absolute right-0 top-0 cursor-pointer flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-yellow-950'
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
