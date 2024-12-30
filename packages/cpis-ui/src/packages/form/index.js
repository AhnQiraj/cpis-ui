import Form from './src/form.vue'
import FormItem from './src/form-item.vue'
import FormSection from './src/form-section.vue'

Form.install = function (Vue) {
  Vue.component(Form.name, Form)
  Vue.component(FormItem.name, FormItem)
  Vue.component(FormSection.name, FormSection)
}

export default Form
