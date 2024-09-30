import { QRCode } from 'antd'
import { QRCODES } from '../lib/useStates'

export default function QRCodes() {
  
  return (
    <div
      className='w-full flex flex-row items-center justify-center flex-wrap gap-8'
    >
      {QRCODES.map((qrcode, index) => (
        <div
          key={index}
          className='w-fit flex flex-col items-center justify-center gap-2'
        >
          <QRCode
            value={qrcode.url}
            size={100}
            className='rounded-none p-2 border border-yellow-950'
            icon={qrcode.icon}
            iconSize={25}
          />
          <p className='text-base opacity-80'>
            {qrcode.desc}
          </p>
        </div>
      ))}
    </div>
  )
}