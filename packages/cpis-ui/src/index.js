import 'virtual:uno.css'
import CpisTag from './packages/tag/index.js'
import { CpisProCascader } from './packages/cascader/index.js'
import CpisPageContainer from './packages/page-container/index.js'
import CpisSearchInput from './packages/search-input/index.js'
const components = [
  CpisTag,
  CpisProCascader,
  CpisPageContainer,
  CpisSearchInput
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  /* istanbul ignore if */
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
  }
}

export { CpisTag, CpisProCascader, install, CpisPageContainer, CpisSearchInput }
export default {
  version: '1.0.0',
  install,
  CpisTag,
  CpisProCascader,
  CpisPageContainer,
  CpisSearchInput
}
