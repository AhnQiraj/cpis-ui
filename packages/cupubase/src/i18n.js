import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
function loadLocaleMessages() {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  for (const key of locales.keys()) {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      const localeElementUI = require(`element-ui/lib/locale/lang/${locales(key)._element}`)
      messages[locale] = {
        ...locales(key),
        ...(localeElementUI ? localeElementUI['default'] : {})
      }
    }
  }
  return messages
}
const messages = loadLocaleMessages()
Vue.prototype.$languages = Object.keys(messages).map(langlage => ({
  label: messages[langlage]._name,
  value: langlage
}))
// const i18n = new VueI18n({
//   locale: window.parent.__IBPS_CONFIG__ ? window.parent.__IBPS_CONFIG__.I18N_LOCALE : 'zh-CN',
//   fallbackLocale: window.parent.__IBPS_CONFIG__ ? window.parent.__IBPS_CONFIG__.I18N_FALLBACK_LOCALE : 'zh-CN',
//   messages
// })
const i18n = new VueI18n({
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages
})
export default i18n
