import { ExportOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import { preload } from 'react-dom'
import Introduction from './components/Introduction'
import QRCodes from './components/QRCodes'
import Title from './components/Title'
import Verses from './components/Verses'

export default function App() {
	// 预加载字体
	preload('/NotoSerifSC-Regular.ttf', { as: 'font', type: 'font/ttf' })

	return (
		<main className='w-dvw relative flex flex-col items-center justify-center max-w-xl mx-auto px-4 pb-20'>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: '#b55e0b',
						colorText: '#4c0519',
					},
				}}
			>
				<Title />
				<Verses />
				<Introduction />
				<QRCodes />
			</ConfigProvider>
			<p className='w-full text-center text-xs absolute bottom-4 left-0 text-gray-500'>
				GPL-3.0 License |{' '}
				<a
					target='_blank'
					href='https://github.com/LeafYeeXYZ/ShiSiHangShi'
					rel='noreferrer'
				>
					Github <ExportOutlined />
				</a>
			</p>
		</main>
	)
}
