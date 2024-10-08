import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), UnoCSS()],

  build: {
    rollupOptions: {
      external: ['vue', 'element-ui'],
    },
    lib: {

      name: 'cpis-ui',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.js')
    },
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
