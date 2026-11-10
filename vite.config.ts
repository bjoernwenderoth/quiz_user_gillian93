import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/quiz_user_gillian93/',
  plugins: [react(), tailwindcss()],
  test: { include: ['src/**/*.test.ts'] },
})
