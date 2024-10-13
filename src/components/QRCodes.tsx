import { QRCode } from 'antd'
import { QRCODES } from '../lib/useStates'

export default function QRCodes() {
  
  return (
    <div
      className='w-full flex flex-row items-center justify-center flex-wrap gap-8'
    >
      <p className='text-yellow-900 text-center text-balance mb-6'>
        「我们于秋日播种，覆冬雪，迎春阳，等待夏日一场共同的盛放」
      </p>
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
      <p className='text-yellow-900 text-center text-balance mt-4'>
        「白鸽衔梦，草木贲华」我们共同期待着一场无拘无束、尽致淋漓的成长
      </p>
    </div>
  )
}