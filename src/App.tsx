import Title from './components/Title'
import Verses from './components/Verses'
import Introduction from './components/Introduction'
import QRCodes from './components/QRCodes'
import { ConfigProvider } from 'antd'

export default function App() {

  return (
    <main
      className='w-dvw flex flex-col items-center justify-center max-w-3xl mx-auto px-4'
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#b55e0b',
            colorText: '#4c0519'
          }
        }}
      >
        <Title />
        <Verses />
        <Introduction />
        <QRCodes />
      </ConfigProvider>
    </main>
  )
}
