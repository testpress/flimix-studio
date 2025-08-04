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
      '@layout': '/src/layout',
      '@renderer': '/src/renderer',
      '@context': '/src/context',
      '@utils': '/src/utils',
      '@domain': '/src/domain',
      '@types': '/src/types',
      '@blocks': '/src/blocks',
      '@blocks/ui': '/src/blocks/ui',
      '@blocks/settings': '/src/blocks/settings',
      '@blocks/shared': '/src/blocks/shared',
      '@blocks/hero': '/src/blocks/hero',
      '@blocks/text': '/src/blocks/text',
      '@blocks/section': '/src/blocks/section'
    }
  }
})
