import { defineConfig, presetMini, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetMini(),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
  extendTheme: (theme) => {
    return {
      ...theme,
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        blue: {
          1: '#F0F9FF',
          2: '#D9F0FF',
          3: '#B0DDFF',
          4: '#87C7FF',
          5: '#5EAFFF',
          6: '#3491FA',
          7: '#226FD4',
          8: '#1351AD',
          9: '#083787',
          10: '#031531',
          text: '#3491FA'
        },
        green: {
          1: '#f6ffed',
          2: '#d9f7be',
          3: '#b7eb8f',
          4: '#95de64',
          5: '#73d13d',
          6: '#52c41a',
          7: '#389e0d',
          8: '#237804',
          9: '#135200',
          10: '#092b00'
        },
        red: {
          1: '#FFEBE8',
          2: '#FEC8C3',
          3: '#FEA39F',
          4: '#FD7C7A',
          5: '#FD5659',
          6: '#FC323D',
          7: '#D01F2E',
          8: '#A41022',
          9: '#780617',
          10: '#2A0007'
        },
        gray: {
          1: '#FAFAFA',
          2: '#F5F5F5',
          3: '#D9D9D9',
          4: '#BFBFBF',
          5: '#8C8C8C',
          6: '#595959',
          7: '#434343',
          8: '#262626',
          9: '#1F1F1F',
          10: '#000000'
        },
        grey: {
          1: '#FAFAFA',
          2: '#F5F5F5',
          3: '#D9D9D9',
          4: '#BFBFBF',
          5: '#8C8C8C',
          6: '#595959',
          7: '#434343',
          8: '#262626',
          9: '#1F1F1F',
          10: '#000000'
        },
        orange: {
          1: '#FFF7E6',
          2: '#FFE7BA',
          3: '#FFD591',
          4: '#FFC069',
          5: '#FFA940',
          6: '#FA8C16',
          7: '#D46B08',
          8: '#AD4E00',
          9: '#873800',
          10: '#301200'
        }
      }
    }
  }
})
