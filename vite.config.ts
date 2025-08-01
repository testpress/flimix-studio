import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@blocks': '/src/blocks',
      '@blocks/ui': '/src/blocks/ui',
      '@blocks/settings': '/src/blocks/settings',
      '@schema': '/src/schema',
      '@utils': '/src/utils',
      '@context': '/src/context',
      '@types': '/src/types'
    }
  }
})
