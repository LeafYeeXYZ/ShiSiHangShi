import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					antd: ['antd', '@ant-design/icons'],
					swiper: ['swiper'],
					utils: ['html2canvas'],
				},
			},
		},
	},
})
