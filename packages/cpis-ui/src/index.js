import 'virtual:uno.css'
import CpisTag from './packages/tag/index.js'
import { CpisProCascader } from './packages/cascader/index.js'
import CpisPageContainer from './packages/page-container/index.js'

const components = [
  CpisTag,
  CpisProCascader,
  CpisPageContainer
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

export { CpisTag, CpisProCascader, install, CpisPageContainer }
export default {
  version: '1.0.0',
  install,
  CpisTag,
  CpisProCascader,
  CpisPageContainer
}
