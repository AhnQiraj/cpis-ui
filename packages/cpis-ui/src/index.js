import 'virtual:uno.css'
import CpisTag from './packages/tag/index.js'
import { CpisProCascader } from './packages/cascader/index.js'
import CpisPageContainer from './packages/page-container/index.js'
import CpisContainerHeader from './packages/container-header/index.js'
import CpisSearchInput from './packages/search-input/index.js'
import CpisTable from './packages/table/index.js'
import CpisButton from './packages/button/index.js'
import CpisInput from './packages/input/index.js'
import CpisForm, {
  CpisFormItem,
  CpisFormSection
} from './packages/form/index.js'
import CpisDrawer from './packages/drawer/index.js'
import CpisSearchBar from './packages/search-bar/index.js'
import CpisTree from './packages/tree/index.js'
import CpisTreeContainer from './packages/tree-container/index.js'
import CpisDatePicker from './packages/date-picker/index.js'
import CpisSelect from './packages/select/index.js'
import CpisMenu from './packages/menu/index.js'
import CpisMenuItem from './packages/menu-item/index.js'
import CpisSubmenu from './packages/submenu/index.js'
import CpisTabs from './packages/tabs/index.js'
import CpisTabPane from './packages/tab-pane/index.js'
import CpisDialog from './packages/dialog/index.js'

const components = [
  CpisTag,
  CpisProCascader,
  CpisPageContainer,
  CpisSearchInput,
  CpisTable,
  CpisButton,
  CpisInput,
  CpisContainerHeader,
  CpisForm,
  CpisFormItem,
  CpisFormSection,
  CpisDrawer,
  CpisSearchBar,
  CpisTree,
  CpisTreeContainer,
  CpisDatePicker,
  CpisSelect,
  CpisMenu,
  CpisMenuItem,
  CpisSubmenu,
  CpisTabs,
  CpisTabPane,
  CpisDialog
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
  CpisPageContainer,
  CpisSearchInput,
  CpisTable,
  CpisButton,
  CpisInput,
  CpisContainerHeader,
  CpisForm,
  CpisDrawer,
  CpisSearchBar,
  CpisTreeContainer,
  CpisTree,
  CpisFormItem,
  CpisFormSection,
  CpisDatePicker,
  CpisSelect,
  CpisMenu,
  CpisMenuItem,
  CpisSubmenu,
  CpisTabs,
  CpisTabPane,
  CpisDialog
}
export default {
  version: '1.0.0',
  install
}
