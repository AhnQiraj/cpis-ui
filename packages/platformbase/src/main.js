/* eslint-disable */
__webpack_public_path__ = window.staticResourceURLPrefix || "/"
import "@platform/assets/styles/color.scss"
import Vue from "vue"
import App from "./App.vue"
import i18n from "./i18n"
import Utils from "@platform/utils/util"
import ElementUI from './elementUI'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import messager from "@platform/utils/message"
Vue.prototype.$utils = Utils
Vue.config.productionTip = false
Vue.prototype.$message = messager // 重写message提示框  一定要放在Vue.use(ElementUI)之后
// 对message功能的补充
Vue.prototype.$message.close = function (id, userOnClose) {
  return ElementUI.Message.close(id, userOnClose)
}
Vue.prototype.$message.closeAll = function () {
  return ElementUI.Message.closeAll()
}
new Vue({
  i18n,
  render: h => h(App)
}).$mount("#app")
