import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'dayjs',
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-dev-runtime',
      'react-i18next',
      'i18next',
    ],
    exclude: ['dayjs/locale/az', 'dayjs/locale/ru', 'dayjs/locale/tr'],
  },
})

