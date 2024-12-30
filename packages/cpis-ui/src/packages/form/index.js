import CpisForm from './src/form.vue'
import CpisFormItem from './src/form-item.vue'
import CpisFormSection from './src/form-section.vue'

CpisForm.install = function (Vue) {
  Vue.component(CpisForm.name, CpisForm)
}
CpisFormSection.install = function (Vue) {
  Vue.component(CpisFormSection.name, CpisFormSection)
}
CpisFormItem.install = function (Vue) {
  Vue.component(CpisFormItem.name, CpisFormItem)
}

export default CpisForm
export { CpisFormSection, CpisFormItem }
