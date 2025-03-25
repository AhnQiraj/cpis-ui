import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const locale = document.documentElement.lang || 'zh-CN'
export const i18n = new VueI18n({
  locale,
  messages: { [locale]: window.i18nMessage } || {}
})
export default i18n
