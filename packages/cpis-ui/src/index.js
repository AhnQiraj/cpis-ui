import CpisTag from './packages/tag/index.js'
import { CpisProCascader } from './packages/cascader/index.js'

const components = [CpisTag, CpisProCascader]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  /* istanbul ignore if */
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
  }
}

export { CpisTag, CpisProCascader, install }
export default {
  version: '1.0.0',
  install,
  CpisTag,
  CpisProCascader
}
