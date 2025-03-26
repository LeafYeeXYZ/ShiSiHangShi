import { Button, Form, Input, message } from 'antd'
import { useState } from 'react'
import { flushSync } from 'react-dom'
import type { Verse } from '../lib/types'
import { getTime } from '../lib/utils'

const server = import.meta.env.VITE_SERVER_URL || ''

export function Manage() {
	const [password, setPassword] = useState<string>('')
	const [verses, setVerses] = useState<Verse[]>([])
	const [syncTime, setSyncTime] = useState<number>(0)
	const [disabled, setDisabled] = useState<boolean>(false)
	const [messageApi, contextHolder] = message.useMessage()
	const [form] = Form.useForm<{
		content: string
		author: string
	}>()
	return (
		<div className='w-dvw relative flex flex-col items-center justify-center max-w-xl mx-auto px-4 pb-20'>
			{contextHolder}
			<img src='/banner.JPG' alt='banner' className='h-20 mb-8 mt-10' />
			<p className='text-3xl mb-8 mt-2'>无限的十四行诗 - 管理系统</p>
			<p className='mb-3'>上次同步时间: {getTime(new Date(syncTime))}</p>
      <p className='mb-8 text-xs'>
        常见错误: 401 (密码错误), 400/50X (其他错误, 请联系开发者)
      </p>
			<div className='w-full'>
				<Input
					addonBefore='管理人员密码'
					placeholder='请输入密码'
					type='password'
					value={password}
					disabled={disabled}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<div className='w-full mt-4'>
				<Button
					block
					disabled={disabled}
					onClick={async () => {
						try {
							flushSync(() => setDisabled(true))
							const res = await fetch(`${server}/api/verses`, {
								method: 'GET',
							})
							if (res.status === 200) {
								const { verses } = await res.json()
								setVerses(verses)
								setSyncTime(Date.now())
							} else {
								throw new Error(`HTTP ${res.status}`)
							}
							messageApi.success('同步成功')
						} catch (e) {
							messageApi.error(
								`同步失败: ${e instanceof Error ? e.message : String(e)}`,
							)
						} finally {
							setDisabled(false)
						}
					}}
				>
					立即同步
				</Button>
			</div>
			<div className='w-full mt-8 text-2xl'>添加诗文</div>
			<Form
			 	form={form}
				className='w-full mt-8'
				layout='vertical'
				onFinish={async (values) => {
					try {
						flushSync(() => setDisabled(true))
						const res = await fetch(`${server}/api/verses`, {
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								password,
								...values,
							}),
						})
						if (res.status === 200) {
							const { verses } = await res.json()
							setVerses(verses)
							setSyncTime(Date.now())
						} else {
							throw new Error(`HTTP ${res.status}`)
						}
						form.resetFields()
						messageApi.success('添加成功')
					} catch (e) {
						messageApi.error(
							`添加失败: ${e instanceof Error ? e.message : String(e)}`,
						)
					} finally {
						setDisabled(false)
					}
				}}
			>
				<Form.Item
					label='诗文内容'
					name='content'
					rules={[{ required: true, message: '请输入诗文内容' }]}
				>
					<Input.TextArea placeholder='请输入诗文内容' disabled={disabled} />
				</Form.Item>
				<Form.Item
					label='诗文作者'
					name='author'
					rules={[{ required: true, message: '请输入诗文作者' }]}
				>
					<Input placeholder='请输入诗文作者' disabled={disabled} />
				</Form.Item>
				<Form.Item>
					<Button block htmlType='submit' disabled={disabled}>
						添加
					</Button>
				</Form.Item>
			</Form>
			<div className='w-full mt-8 text-2xl'>查看/删除诗文</div>
			<div className='w-full flex flex-col items-center justify-center gap-4 mt-8'>
				{verses
					.sort((a, b) => b.createdAt - a.createdAt) // 最后添加的在最前面
					.map((verse) => (
						<div
							key={verse.uuid}
							className='w-full bg-yellow-50 border border-yellow-950 transition-all px-4 py-3'
						>
							<p className='text-balance'>{verse.content}</p>
							<p className='text-xs mt-[0.3rem] opacity-70'>
								来自: {verse.author}
							</p>
							<div className='mt-2'>
								<Button
									type='default'
									disabled={disabled}
									block
									onClick={async () => {
										try {
											flushSync(() => setDisabled(true))
											const res = await fetch(`${server}/api/verses`, {
												method: 'DELETE',
												headers: {
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													password,
													uuid: verse.uuid,
												}),
											})
											if (res.status === 200) {
												const { verses } = await res.json()
												setVerses(verses)
												setSyncTime(Date.now())
											} else {
												throw new Error(`HTTP ${res.status}`)
											}
											messageApi.success('删除成功')
										} catch (e) {
											messageApi.error(
												`删除失败: ${e instanceof Error ? e.message : String(e)}`,
											)
										} finally {
											setDisabled(false)
										}
									}}
								>
									删除
								</Button>
							</div>
						</div>
					))}
			</div>
		</div>
	)
}
