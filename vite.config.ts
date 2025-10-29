// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname support for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    plugins: [react(/* { fastRefresh: false } // <- uncomment temporarily if HMR acts up */)],
    // "/" in dev, "/mysite/" when building for GitHub Pages
    base: isBuild ? '/mysite/' : '/',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@jsr/supabase__supabase-js', replacement: '@supabase/supabase-js' },
      ],
    },
    server: {
      port: 3000,
      open: true,
      // overlay: false, // <- uncomment if you want to hide Vite error overlay
    },
    build: {
      outDir: 'dist',
      target: 'esnext',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'motion-vendor': ['motion'],
            'ui-vendor': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-tabs',
              '@radix-ui/react-tooltip',
            ],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'motion'],
      force: true, // ensure a fresh optimize after recent import fixes
    },
  }
})
