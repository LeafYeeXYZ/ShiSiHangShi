import { cloudflare } from '@cloudflare/vite-plugin'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

const isDev = process.env.NODE_ENV !== 'production' && !process.env.VITEST

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    isDev && cloudflare(),
  ].filter(Boolean),
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    ignorePatterns: ['worker/worker-configuration.d.ts'],
    singleQuote: true,
    semi: false,
    sortImports: true,
    sortTailwindcss: true,
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ['worker/**/*.test.ts', 'src/**/*.test.ts'],
    testTimeout: 15000,
    hookTimeout: 30000,
  },
})
