/// <reference types="histoire" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue()],
  server: {
    fs: {
      allow: [
        // 允许访问项目根目录
        './',
        // 显式允许访问 `node_modules` 的路径
        '/Users/ahnqiraj/Desktop/apps/cupu_v2/CPIS-Front-Lib/node_modules'
      ]
    }
  },
  histoire: {
    // Histoire config can also go here
  },
})
