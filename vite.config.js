import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Removes type="module" and crossorigin from output HTML so app works via file://
function fileProtocolCompat() {
  return {
    name: 'file-protocol-compat',
    transformIndexHtml(html) {
      return html
        .replace(/type="module"\s*/g, '')
        .replace(/\s+crossorigin/g, '')
    }
  }
}

export default defineConfig({
  plugins: [vue(), fileProtocolCompat()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        format: 'iife',
        name: 'Bio6App',
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@data': resolve(__dirname, 'static/bio6')
    }
  }
})
