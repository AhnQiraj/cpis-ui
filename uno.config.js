import { defineConfig } from 'unocss'
import presetUno from '@cpis/uno-preset'
import { presetScrollbarHide } from 'unocss-preset-scrollbar-hide'

export default defineConfig({
  presets: [
    presetUno(),
    presetScrollbarHide()
  ]
})
