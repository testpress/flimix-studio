import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../flimix/app/static/studio', // Output directory for build
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
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
      '@pageSchemas': '/src/pageSchemas',
      '@hooks': '/src/hooks',
      '@blocks': '/src/blocks',
      '@blocks/ui': '/src/blocks/ui',
      '@blocks/settings': '/src/blocks/settings',
      '@blocks/shared': '/src/blocks/shared',
      '@blocks/hero': '/src/blocks/hero',
      '@blocks/text': '/src/blocks/text',
      '@blocks/section': '/src/blocks/section',
      '@services': '/src/services'
    }
  }
})
