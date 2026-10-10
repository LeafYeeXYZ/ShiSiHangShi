import { QRCode } from 'antd'

import { QRCODES } from '../lib/utils'

export default function QRCodes() {
  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-center gap-8">
      <p className="mb-6 text-center text-balance text-yellow-900">
        「我们于秋日播种，覆冬雪，迎春阳，等待夏日一场共同的盛放」
      </p>
      {QRCODES.map((qrcode) => (
        <div key={qrcode.url} className="flex w-fit flex-col items-center justify-center gap-2">
          <QRCode
            value={qrcode.url}
            size={100}
            className="rounded-none! border! border-yellow-950! p-2!"
            icon={qrcode.icon}
            iconSize={25}
          />
          <p className="text-base opacity-80">{qrcode.desc}</p>
        </div>
      ))}
      <p className="mt-4 text-center text-balance text-yellow-900">
        「白鸽衔梦，草木贲华」我们共同期待着一场无拘无束、尽致淋漓的成长
      </p>
    </div>
  )
}
