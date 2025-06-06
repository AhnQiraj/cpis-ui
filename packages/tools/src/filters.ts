import { format, formatRelativeTime as getRelativeTime, dateDealFmt } from './feche'

export function dateFormat(dateObj: any, dateFormat = 'yyyy-MM-dd HH:mm:ss', origFormat: any) {
  if (!dateObj) {return ''}
  try {
    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj)
    }
    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
      // 需要把字符串转换日期格式
      dateObj = dateDealFmt.dealFmt(dateObj, origFormat || dateFormat)
    }
    return format(dateObj, dateFormat)
  } catch (error) {
    console.error('转换日期格式错误：', error, dateObj, dateFormat)
    return dateObj
  }
}
/**
 * 相对时间字符串
 * @param {String|Number} time 时间格式字符串，或者时间
 * @param {String} format 格式化字符串
 * @param {String} locale 国际化语言
 * @returns {String} 相对时间字符串
 */
export function formatRelativeTime(time: any, format: any, locale: any) {
  return getRelativeTime(time, format, locale)
}
/**
 * 附件容量数字 格式化
 * @param {*} num
 * @param {*} digits
 */
export function numberFormatter(num: number, digits = 2) {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 正则去掉所有的html标记
 * @param {*} val
 */
export function removeHtmlTag(val: string | undefined) {
  if (!val) {
    return val
  }
  return val.replace(/<[^>]+>/g, '')
}
/**
 * 去第一个字符
 * @param {*} val
 */
export function firstStr(val: string | undefined) {
  if (!val) {
    return val
  }
  return val.substr(0, 1)
}
/**
 * 千分位过滤
 * @param {*} num
 */
export function toThousandslsFilter(num: number) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
/**
 * 选项过滤
 * @param {*} val  值
 * @param {*} options 选项值
 * @param {*} labelKey  选项的展示值key
 * @param {*} valueKey  选项的值key
 */
export function optionsFilter(val: string | undefined, options = [], labelKey = 'label', valueKey = 'value', defaultValue = '') {
  let opt
  if (Array.isArray(options)) {
    opt = options.find(x => x[valueKey] === val)
  }
  return opt ? opt[labelKey] : val || defaultValue
}

export default {
  optionsFilter,
  toThousandslsFilter,
  firstStr,
  removeHtmlTag,
  numberFormatter,
  dateFormat,
  formatRelativeTime
}
