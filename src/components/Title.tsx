export default function Title() {

  // 记得为一些组件添加 print:hidden 类名

  return (
    <div className='w-full flex flex-col items-center justify-center gap-4 mb-16 mt-24'>
      <p className='text-3xl'>
        无限的十四行诗
      </p>
      <p className='print:hidden'>
        诗句可以左右滑动
      </p>
    </div>
  )
}