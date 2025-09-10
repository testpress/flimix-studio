import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      entryRoot: 'src',
    }),
  ],
  base: './', // Use relative paths
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@layout': path.resolve(__dirname, 'src/layout'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@pageSchemas': path.resolve(__dirname, 'src/pageSchemas'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@blocks': path.resolve(__dirname, 'src/blocks'),
      '@blocks/ui': path.resolve(__dirname, 'src/blocks/ui'),
      '@blocks/settings': path.resolve(__dirname, 'src/blocks/settings'),
      '@blocks/shared': path.resolve(__dirname, 'src/blocks/shared'),
      '@blocks/hero': path.resolve(__dirname, 'src/blocks/hero'),
      '@blocks/text': path.resolve(__dirname, 'src/blocks/text'),
      '@blocks/section': path.resolve(__dirname, 'src/blocks/section'),
      '@services': path.resolve(__dirname, 'src/services')
    }
  },
  define: {
    'process.env': { ...loadEnv(mode, process.cwd()) },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/studioEntry.tsx'),
      name: 'FlimixStudio',
      formats: ['umd'], // UMD ensures the library works both with <script> tags in browsers and in module-based systems. For Django we need the global (window.FlimixStudio).
      fileName: () => 'js/flimix-studio.js', // Always output flimix-studio.js under dist/js/
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (asset) => {
          if (asset.name && asset.name.endsWith('.css')) {
            return 'css/style.css' // CSS goes to css/ folder for better organization
          }
          return 'assets/[name].[ext]' // For non-CSS assets (like images, fonts) → keep original file names instead of hashed ones, making them predictable for Django static references
        },
      },
    },
  },
}))
