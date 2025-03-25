import Utils from "@/utils/util"
import permission from "@/directives/permission"
import * as filters from '@/filters'
export default {
  async install(Vue, options) {
    Vue.prototype.$utils = Utils
    Vue.directive("permission", permission)
    // 注册全局过滤器
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
  }
}
