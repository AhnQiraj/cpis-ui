// uno.config.js
import { defineConfig } from 'unocss'
import { presetUno } from '@unocss/preset-uno'

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      "cpis-orange": {
        1: '#fff7e5',
        2: '#fee8c7',
        3: '#fdd99f',
        4: '#fcc97c',
        5: '#fbb95a',
        6: '#f9a938',
        7: '#e99833',
        8: '#d1872e',
        9: '#b57528',
        10: '#996322',
        11: '#E6A23C',
        12: '#7a4d1c',
      }

    }
  }
})
