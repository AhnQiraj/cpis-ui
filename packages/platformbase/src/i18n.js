import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getLang } from '@platform/utils/auth'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context(
    './locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  for (const key of locales.keys()) {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      const localeElementUI = require(
        `element-ui/lib/locale/lang/${locales(key)._element}`
      )
      messages[locale] = {
        ...locales(key),
        ...(localeElementUI ? localeElementUI['default'] : {})
      }
    }
  }
  return messages
}

export const messages = loadLocaleMessages()
Vue.prototype.$languages = Object.keys(messages).map(langlage => ({
  label: messages[langlage]._name,
  value: langlage
}))

function getLocale() {
  let locale = 'zn-CN'
  let fallbackLocale = 'zn-CN'
  if (getLang()) {
    locale = getLang()
  }
  if (window.config) {
    locale = window.parent.__IBPS_CONFIG__.I18N_LOCALE
    fallbackLocale = window.parent.__IBPS_CONFIG__.I18N_FALLBACK_LOCALE
  }
  return [locale, fallbackLocale]
}

const i18n = new VueI18n({
  locale:
    window?.parent?.__IBPS_CONFIG__?.I18N_LOCALE ||
    document.querySelector('html')?.getAttribute?.('lang') ||
    'zh-CN',
  fallbackLocale: 'zh-CN',
  messages
})
export default i18n
