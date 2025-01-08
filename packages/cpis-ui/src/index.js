import 'virtual:uno.css'
import CpisTag from './packages/tag/index.js'
import { CpisProCascader } from './packages/cascader/index.js'
import CpisPageContainer from './packages/page-container/index.js'
import CpisContainerHeader from './packages/container-header/index.js'
import CpisSearchInput from './packages/search-input/index.js'
import CpisTable from './packages/table/index.js'
import CpisButton from './packages/button/index.js'
import CpisForm, {
  CpisFormItem,
  CpisFormSection
} from './packages/form/index.js'
import CpisDrawer from './packages/drawer/index.js'
import CpisSearchBar from './packages/search-bar/index.js'
import CpisTree from './packages/tree/index.js'
import CpisTreeContainer from './packages/tree-container/index.js'
import CpisDatePicker from './packages/date-picker/index.js'
const components = [
  CpisTag,
  CpisProCascader,
  CpisPageContainer,
  CpisSearchInput,
  CpisTable,
  CpisButton,
  CpisContainerHeader,
  CpisForm,
  CpisFormItem,
  CpisFormSection,
  CpisDrawer,
  CpisSearchBar,
  CpisTree,
  CpisTreeContainer,
  CpisDatePicker
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

export {
  CpisTag,
  CpisProCascader,
  install,
  CpisPageContainer,
  CpisSearchInput,
  CpisTable,
  CpisButton,
  CpisContainerHeader,
  CpisForm,
  CpisDrawer,
  CpisSearchBar,
  CpisTreeContainer,
  CpisTree,
  CpisFormItem,
  CpisFormSection,
  CpisDatePicker
}
export default {
  version: '1.0.0',
  install,
  CpisTag,
  CpisProCascader,
  CpisPageContainer,
  CpisSearchInput,
  CpisTable,
  CpisButton,
  CpisContainerHeader,
  CpisForm,
  CpisDrawer,
  CpisSearchBar,
  CpisTreeContainer,
  CpisTree,
  CpisFormItem,
  CpisFormSection,
  CpisDatePicker
}
