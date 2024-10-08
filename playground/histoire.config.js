import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue2'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: '/src/histoire.setup.js',
  theme: {
    title: 'cpis-UI',
    logo: {
      square: '/src/img/faviconD.ico',
      light: '/src/img/faviconD.ico',
      dark: '/src/img/faviconD.ico',
    },
  }
})
