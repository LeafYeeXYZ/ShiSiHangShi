import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Manage } from './manage/Manage.tsx'
import './tailwind.css'

const root = document.getElementById('root')
if (!root) {
	throw new Error('Root element not found')
}

if (location.pathname === '/manage') {
	createRoot(root).render(
		<StrictMode>
			<Manage />
		</StrictMode>,
	)
} else {
	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}
