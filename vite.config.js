import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Replaces type="module" with defer and removes crossorigin so app works via file://
// type="module" is deferred by spec; plain <script> in <head> is not — must add defer explicitly
function fileProtocolCompat() {
  return {
    name: 'file-protocol-compat',
    transformIndexHtml(html) {
      return html
        .replace(/type="module"\s+(crossorigin\s+)?/g, 'defer ')
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
