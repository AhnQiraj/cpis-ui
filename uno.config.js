import { defineConfig } from 'unocss'
import presetUno from '@cpis/uno-preset'
import { presetScrollbarHide } from 'unocss-preset-scrollbar-hide'

export default defineConfig({
  presets: [presetUno(), presetScrollbarHide()],
  shortcuts: {
    'title-right': 'ml-auto text-sm font-normal text-gray-6'
  }
})
