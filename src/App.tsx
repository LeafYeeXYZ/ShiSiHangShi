import { ExportOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

import Introduction from './components/Introduction'
import QRCodes from './components/QRCodes'
import Title from './components/Title'
import Verses from './components/Verses'

export default function App() {
  return (
    <main className="relative mx-auto flex w-dvw max-w-xl flex-col items-center justify-center px-4 pb-20">
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
      <p className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-500">
        GPL-3.0 License |{' '}
        <a target="_blank" href="https://github.com/LeafYeeXYZ/ShiSiHangShi" rel="noreferrer">
          Github <ExportOutlined />
        </a>
      </p>
    </main>
  )
}
