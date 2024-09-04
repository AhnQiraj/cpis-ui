import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({ tsconfigPath: 'tsconfig.build.json', cleanVueFileName: true, exclude: ['src/test/**'] })
  ],
  build: {
    lib: {
      name: 'tools',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts')
    },
    target: 'es2015'
  }
})
