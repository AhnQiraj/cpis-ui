import Vue from 'vue'

import 'virtual:uno.css'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import CpisUI from '../../packages/cpis-ui/src/index'
import '../assets/icon.css'

Vue.use(ElementUI, { size: 'small' })
Vue.use(CpisUI)
/** @type { import('@storybook/vue').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export const decorators = [
  Story => {
    document.body.classList.add('theme-cpis-blue')
    document.body.classList.add('bg-gray-2')
    // 直接修改 body 样式
    return Story()
  }
]

export default preview
