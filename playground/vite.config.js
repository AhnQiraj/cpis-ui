/// <reference types="histoire" />

import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue2-jsx'

import vue from '@vitejs/plugin-vue2'
import UnoCSS from 'unocss/vite'


export default defineConfig({
  plugins: [vue(), UnoCSS(), vueJsx()],
})