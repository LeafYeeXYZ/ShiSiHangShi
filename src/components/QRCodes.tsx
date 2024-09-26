import { QRCode } from 'antd'
import { useStates } from '../lib/useStates'

export default function QRCodes() {

  const { qrcodes } = useStates()
  
  return (
    <div
      className='w-full flex flex-row items-center justify-center flex-wrap gap-6 mt-20 mb-24'
    >
      {qrcodes.map((qrcode, index) => (
        <div
          key={index}
          className='w-fit flex flex-col items-center justify-center gap-2'
        >
          <QRCode
            value={qrcode.url}
            size={100}
            className='rounded-none p-2 border border-yellow-950'
          />
          <p className='text-lg opacity-80'>
            {qrcode.desc}
          </p>
        </div>
      ))}
    </div>
  )
}