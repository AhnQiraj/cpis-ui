/// <reference types="histoire" />

import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import path from 'path'
import vue from '@vitejs/plugin-vue2'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 添加 scss 导入路径
        includePaths: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
        // 添加全局变量
        additionalData: `
          $namespace: 'el';
        `
      }
    }
  },
  resolve: {
    alias: [
      {
        find: /^~element-ui/,
        replacement: path.resolve(__dirname, 'node_modules/element-ui')
      }
    ]
  },
  plugins: [vue(), UnoCSS(), vueJsx()]
})
