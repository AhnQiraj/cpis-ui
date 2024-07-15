import esLocale from './es'
import jaLocale from './ja'
import zhCNLocale from './zh-cn'
import zhTWLocale from './zh-tw'
const localeMap = {
  'en': 'es',
  'ja': 'ja',
  'zh-CN': 'zh-cn',
  'zh-TW': 'zh-tw'
}
export default {
  locales: [esLocale, jaLocale, zhCNLocale, zhTWLocale],
  localeMap: localeMap
}
