import Vue from 'vue'
import App from './App.vue'
import D2CrudX from 'd2-crud-x'
import i18n from './i18n'
import messager from '@cupu/utils/message'
Vue.use(D2CrudX, { name: 'd2-crud-x' })
import ElementUI from './elementUI'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$ELEMENT.size = 'small'
Vue.prototype.$message = messager // 重写message提示框  一定要放在Vue.use(ElementUI)之后
// 对message功能的补充
Vue.prototype.$message.close = function (id, userOnClose) {
  return Vue.prototype.$message.close(id, userOnClose)
}
Vue.prototype.$message.closeAll = function () {
  return Vue.prototype.$message.closeAll()
}
new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
